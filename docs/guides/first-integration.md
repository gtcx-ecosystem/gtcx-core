# Tutorial: Your First GTCX Integration

**Time to complete:** 30 minutes  
**Prerequisites:** Node.js 20+, basic TypeScript knowledge  
**What you'll build:** A simple app that verifies a TradePass credential

---

## Overview

This tutorial walks you through integrating with GTCX Protocol. By the end, you'll have a working application that can:

1. Connect to the GTCX network
2. Verify a TradePass credential
3. Check a GCI compliance score
4. Query custody status

---

## Step 1: Set Up Your Project

```bash
# Create new project
mkdir gtcx-demo && cd gtcx-demo

# Initialize with TypeScript
pnpm init
pnpm add typescript tsx @types/node -D
pnpm add @gtcx/sdk zod

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}
EOF

# Create source directory
mkdir src
```

---

## Step 2: Configure GTCX Client

Create `src/config.ts`:

```typescript
import { GTCXClient, NetworkConfig } from '@gtcx/sdk';

// Network configurations
const NETWORKS: Record<string, NetworkConfig> = {
  // Testnet for development
  testnet: {
    apiUrl: 'https://api.testnet.gtcx.io',
    networkId: 'gtcx:testnet',
    chainId: 'gtcx-testnet-1',
  },
  // Ghana pilot network
  ghana: {
    apiUrl: 'https://api.ghana.gtcx.io',
    networkId: 'gtcx:ghana',
    chainId: 'gtcx-ghana-1',
  },
  // Production (when available)
  mainnet: {
    apiUrl: 'https://api.gtcx.io',
    networkId: 'gtcx:mainnet',
    chainId: 'gtcx-mainnet-1',
  },
};

// Initialize client
export function createClient(network: keyof typeof NETWORKS = 'testnet') {
  const config = NETWORKS[network];

  return new GTCXClient({
    ...config,
    // API key from environment
    apiKey: process.env.GTCX_API_KEY,
    // Optional: custom timeout
    timeout: 30000,
  });
}
```

---

## Step 3: Verify a TradePass Credential

Create `src/verify-tradepass.ts`:

```typescript
import { createClient } from './config';
import { TradePassCredential, VerificationResult } from '@gtcx/sdk';

async function verifyTradePass(did: string): Promise<VerificationResult> {
  const client = createClient('testnet');

  console.log(`\n🔍 Verifying TradePass: ${did}\n`);

  try {
    // Fetch the credential
    const credential = await client.tradepass.resolve(did);

    if (!credential) {
      return {
        valid: false,
        error: 'Credential not found',
      };
    }

    console.log('📋 Credential found:');
    console.log(`   Name: ${credential.subject.name}`);
    console.log(`   Role: ${credential.subject.role}`);
    console.log(`   Issued: ${credential.issuanceDate}`);
    console.log(`   Expires: ${credential.expirationDate}`);

    // Verify the credential
    const verification = await client.tradepass.verify(credential);

    console.log('\n✅ Verification result:');
    console.log(`   Valid: ${verification.valid}`);
    console.log(`   Issuer trusted: ${verification.issuerTrusted}`);
    console.log(`   Not expired: ${verification.notExpired}`);
    console.log(`   Not revoked: ${verification.notRevoked}`);

    return verification;
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run if called directly
const testDid = process.argv[2] || 'did:gtcx:tp_test_producer_001';
verifyTradePass(testDid);
```

Run it:

```bash
GTCX_API_KEY=your_key pnpm tsx src/verify-tradepass.ts
```

Expected output:

```
🔍 Verifying TradePass: did:gtcx:tp_test_producer_001

📋 Credential found:
   Name: Kwame Asante
   Role: producer
   Issued: 2026-01-15T00:00:00Z
   Expires: 2027-01-15T00:00:00Z

✅ Verification result:
   Valid: true
   Issuer trusted: true
   Not expired: true
   Not revoked: true
```

---

## Step 4: Check GCI Compliance Score

Create `src/check-gci.ts`:

```typescript
import { createClient } from './config';
import { GCIScore, GCITier } from '@gtcx/sdk';

// GCI tier thresholds
const TIERS: Record<GCITier, { min: number; label: string; emoji: string }> = {
  premium: { min: 85, label: 'Premium', emoji: '🥇' },
  verified: { min: 75, label: 'Verified', emoji: '🥈' },
  standard: { min: 65, label: 'Standard', emoji: '🥉' },
  provisional: { min: 50, label: 'Provisional', emoji: '⚠️' },
  unverified: { min: 0, label: 'Unverified', emoji: '❌' },
};

function getTier(score: number): GCITier {
  if (score >= 85) return 'premium';
  if (score >= 75) return 'verified';
  if (score >= 65) return 'standard';
  if (score >= 50) return 'provisional';
  return 'unverified';
}

async function checkGCI(entityId: string): Promise<GCIScore> {
  const client = createClient('testnet');

  console.log(`\n📊 Checking GCI for: ${entityId}\n`);

  try {
    // Fetch current GCI score
    const gci = await client.gci.getScore(entityId);

    const tier = getTier(gci.score);
    const tierInfo = TIERS[tier];

    console.log(`${tierInfo.emoji} GCI Score: ${gci.score}/100 (${tierInfo.label})`);
    console.log(`\n📈 Factor Breakdown:`);

    // Display each factor
    for (const factor of gci.factors) {
      const bar =
        '█'.repeat(Math.floor(factor.score / 10)) + '░'.repeat(10 - Math.floor(factor.score / 10));
      console.log(`   ${factor.name.padEnd(20)} ${bar} ${factor.score}%`);
    }

    console.log(`\n📅 Last updated: ${gci.timestamp}`);
    console.log(`🔗 Audit trail: ${gci.auditUrl}`);

    // Show improvement suggestions if not premium
    if (tier !== 'premium') {
      console.log('\n💡 Suggestions to improve:');
      const suggestions = await client.gci.getSuggestions(entityId);
      for (const suggestion of suggestions.slice(0, 3)) {
        console.log(`   • ${suggestion.action} (+${suggestion.potentialPoints} pts)`);
      }
    }

    return gci;
  } catch (error) {
    console.error('❌ GCI check failed:', error);
    throw error;
  }
}

// Run if called directly
const testEntity = process.argv[2] || 'entity_test_producer_001';
checkGCI(testEntity);
```

Run it:

```bash
GTCX_API_KEY=your_key pnpm tsx src/check-gci.ts
```

Expected output:

```
📊 Checking GCI for: entity_test_producer_001

🥈 GCI Score: 78/100 (Verified)

📈 Factor Breakdown:
   Documentation        ████████░░ 80%
   Location Verified    █████████░ 90%
   Labor Compliance     ███████░░░ 70%
   Environmental        ███████░░░ 72%
   Community Engagement ████████░░ 78%

📅 Last updated: 2026-01-23T14:30:00Z
🔗 Audit trail: https://explorer.gtcx.io/gci/entity_test_producer_001

💡 Suggestions to improve:
   • Complete VIA training module on safety (+5 pts)
   • Upload updated mining license (+3 pts)
   • Add community development agreement (+4 pts)
```

---

## Step 5: Query Custody Status

Create `src/check-custody.ts`:

```typescript
import { createClient } from './config';
import { CustodyRecord, CustodyEvent } from '@gtcx/sdk';

async function checkCustody(lotId: string): Promise<CustodyRecord> {
  const client = createClient('testnet');

  console.log(`\n📦 Checking custody for lot: ${lotId}\n`);

  try {
    // Get current custody status
    const custody = await client.vaultmark.getCustody(lotId);

    console.log('📋 Lot Details:');
    console.log(`   Asset: ${custody.asset.type}`);
    console.log(`   Weight: ${custody.asset.weight.value} ${custody.asset.weight.unit}`);
    console.log(`   Purity: ${custody.asset.purity}%`);

    console.log(`\n👤 Current Custodian:`);
    console.log(`   Name: ${custody.custodian.name}`);
    console.log(`   DID: ${custody.custodian.did}`);
    console.log(`   Location: ${custody.custodian.location}`);

    console.log(`\n🔐 Custody Status:`);
    console.log(`   Status: ${custody.status}`);
    console.log(`   Since: ${custody.timestamp}`);
    console.log(`   Verified: ${custody.verified ? '✅' : '❌'}`);

    // Get custody history
    const history = await client.vaultmark.getHistory(lotId);

    console.log(`\n📜 Custody History (${history.length} transfers):`);
    for (const event of history.slice(-5)) {
      const icon = event.type === 'transfer' ? '→' : event.type === 'verification' ? '✓' : '•';
      console.log(`   ${event.timestamp.slice(0, 10)} ${icon} ${event.description}`);
    }

    return custody;
  } catch (error) {
    console.error('❌ Custody check failed:', error);
    throw error;
  }
}

// Run if called directly
const testLot = process.argv[2] || 'lot:gh-ash-20260120-001';
checkCustody(testLot);
```

Run it:

```bash
GTCX_API_KEY=your_key pnpm tsx src/check-custody.ts
```

Expected output:

```
📦 Checking custody for lot: lot:gh-ash-20260120-001

📋 Lot Details:
   Asset: gold
   Weight: 2.5 kg
   Purity: 92.5%

👤 Current Custodian:
   Name: Ashanti Gold Vault
   DID: did:gtcx:tp_vault_ashanti_001
   Location: Kumasi, Ghana

🔐 Custody Status:
   Status: in_vault
   Since: 2026-01-22T09:15:00Z
   Verified: ✅

📜 Custody History (3 transfers):
   2026-01-20 → Extracted at Obuasi Mine Site 7
   2026-01-21 → Transported to processing facility
   2026-01-22 → Deposited at Ashanti Gold Vault
```

---

## Step 6: Put It All Together

Create `src/full-verification.ts`:

```typescript
import { createClient } from './config';

interface VerificationReport {
  tradepass: { valid: boolean; role: string };
  gci: { score: number; tier: string };
  custody: { status: string; verified: boolean };
  timestamp: string;
  overallValid: boolean;
}

async function fullVerification(producerDid: string, lotId: string): Promise<VerificationReport> {
  const client = createClient('testnet');

  console.log('═══════════════════════════════════════════════════════');
  console.log('           GTCX FULL VERIFICATION REPORT               ');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Verify TradePass
  console.log('Step 1/3: Verifying TradePass...');
  const credential = await client.tradepass.resolve(producerDid);
  const tpVerification = await client.tradepass.verify(credential!);
  console.log(`   ✅ TradePass valid: ${tpVerification.valid}\n`);

  // 2. Check GCI
  console.log('Step 2/3: Checking GCI score...');
  const gci = await client.gci.getScore(credential!.subject.entityId);
  const tier =
    gci.score >= 85
      ? 'premium'
      : gci.score >= 75
        ? 'verified'
        : gci.score >= 65
          ? 'standard'
          : gci.score >= 50
            ? 'provisional'
            : 'unverified';
  console.log(`   ✅ GCI Score: ${gci.score}/100 (${tier})\n`);

  // 3. Check Custody
  console.log('Step 3/3: Verifying custody...');
  const custody = await client.vaultmark.getCustody(lotId);
  console.log(`   ✅ Custody status: ${custody.status}\n`);

  // Build report
  const report: VerificationReport = {
    tradepass: { valid: tpVerification.valid, role: credential!.subject.role },
    gci: { score: gci.score, tier },
    custody: { status: custody.status, verified: custody.verified },
    timestamp: new Date().toISOString(),
    overallValid: tpVerification.valid && gci.score >= 65 && custody.verified,
  };

  console.log('═══════════════════════════════════════════════════════');
  console.log('                    SUMMARY                            ');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`   Producer: ${credential!.subject.name}`);
  console.log(`   Role: ${report.tradepass.role}`);
  console.log(`   GCI: ${report.gci.score}/100 (${report.gci.tier})`);
  console.log(`   Custody: ${report.custody.status}`);
  console.log(`   ─────────────────────────────────────────────────────`);
  console.log(`   OVERALL: ${report.overallValid ? '✅ VERIFIED' : '❌ NOT VERIFIED'}`);
  console.log('═══════════════════════════════════════════════════════\n');

  return report;
}

// Run
const producerDid = process.argv[2] || 'did:gtcx:tp_test_producer_001';
const lotId = process.argv[3] || 'lot:gh-ash-20260120-001';
fullVerification(producerDid, lotId);
```

---

## Next Steps

### Learn More

- [Identity Core Specification](../specs/identity-core.md) — TradePass identity model
- [Data Models](../specs/data-models.md) — Schema definitions for assets and compliance
- [Security Framework](../specs/security-framework.md) — Cryptographic standards
- [@gtcx/api-client](../packages/api-client.md) — Full API client documentation

### Build More

- [Validator Deployment](./validator-deployment.md) — Deploy your own validator node

## Troubleshooting

### "API key invalid"

```
Error: Invalid API key
```

**Solution:** Get a testnet API key at https://developers.gtcx.io

### "Credential not found"

```
Error: Credential not found for DID
```

**Solution:** Use a valid testnet DID. Test DIDs start with `did:gtcx:tp_test_`

### "Network timeout"

```
Error: Request timeout after 30000ms
```

**Solution:** Check your internet connection and try again. The testnet may be under maintenance.
