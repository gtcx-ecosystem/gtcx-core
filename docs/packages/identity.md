# @gtcx/identity

Identity management package for GTCX Protocol. Provides DID creation, credential management, key lifecycle operations, and identity resolution.

## Installation

```bash
pnpm add @gtcx/identity
```

## Features

- **Identity Creation**: Standard, enhanced (multi-sig), and military-grade identity generation
- **DID Support**: W3C DID-compatible identifier creation and resolution (`did:gtcx:tp_{hash}`)
- **Key Management**: Ed25519 and Secp256k1 key pair support with rotation
- **Verification Levels**: Progressive verification from L0 (unverified) to L4 (government)
- **Offline Support**: Cached credentials with configurable TTL (default 72 hours)

## Usage

### Create a Standard Identity

```typescript
import { createIdentity, createDID } from '@gtcx/identity';

const { identity, privateKey } = await createIdentity({
  securityLevel: 'standard',
  metadata: {
    userRole: 'miner',
    deviceId: 'device-123',
  },
});

// Store privateKey securely (platform-specific)
await secureStorage.set(identity.privateKeyRef, privateKey);

// Get DID
const did = createDID(identity);
// -> "did:gtcx:tp_a1b2c3d4e5f67890"
```

### Create an Enhanced Identity (Multi-Sig)

```typescript
import { createEnhancedIdentity } from '@gtcx/identity';

const { identity, privateKeys } = await createEnhancedIdentity({
  securityLevel: 'military',
  metadata: {
    userRole: 'inspector',
    deviceId: 'device-456',
  },
});

// Store both private keys
await secureStorage.set(identity.multiKeyPairs.ed25519.privateKeyRef, privateKeys.ed25519);
await secureStorage.set(identity.multiKeyPairs.secp256k1.privateKeyRef, privateKeys.secp256k1);
```

### Resolve a DID

```typescript
import { resolveDID, parseDID } from '@gtcx/identity';

// Parse DID string
const parsed = parseDID('did:gtcx:tp_a1b2c3d4');
// { method: 'gtcx', type: 'tp', identifier: 'a1b2c3d4' }

// Resolve to full DID Document (W3C compliant)
const document = await resolveDID('did:gtcx:tp_a1b2c3d4');
// Returns TradePassDIDDocumentSchema-validated document
// Including verification methods, service endpoints, and GTCX extensions
```

### Key Rotation

```typescript
import { rotateKeys, getKeyHistory } from '@gtcx/identity';

// Rotate to new key pair (old key retained for transition period)
const {
  identity: updated,
  newPrivateKey,
  previousKey,
} = await rotateKeys(identity, { reason: 'scheduled_rotation' });

// Previous key remains valid for verification of historical signatures
// but cannot create new signatures after rotation timestamp
const history = getKeyHistory(updated);
// [{ id: 'key-2', algorithm: 'ED25519', active: true },
//  { id: 'key-1', algorithm: 'ED25519', active: false, revokedAt: '...' }]
```

### Validate Identity

```typescript
import { validateIdentity, isIdentityExpired } from '@gtcx/identity';

const { valid, errors } = validateIdentity(identity);
if (!valid) {
  console.error('Invalid identity:', errors);
}

if (isIdentityExpired(identity)) {
  console.warn('Identity has expired — re-authentication required');
}
```

### Create DID Document

```typescript
import { createDIDDocument } from '@gtcx/identity';

const document = createDIDDocument(identity);
// {
//   "@context": ["https://www.w3.org/ns/did/v1", "https://gtcx.org/contexts/tradepass/v3"],
//   "id": "did:gtcx:tp_a1b2c3d4e5f67890",
//   "verificationMethod": [{ ... }],
//   "authentication": ["did:gtcx:tp_a1b2c3d4e5f67890#key-1"],
//   "assertionMethod": ["did:gtcx:tp_a1b2c3d4e5f67890#key-1"],
//   "gtcx": { "version": "3.0", "role": "producer", ... }
// }
```

## Verification Levels

| Level | Name           | Requirements               | Capabilities                                    |
| ----- | -------------- | -------------------------- | ----------------------------------------------- |
| `L0`  | Unverified     | Phone or email only        | View-only access                                |
| `L1`  | Basic          | Government ID uploaded     | Hold T3 credentials                             |
| `L2`  | Verified       | ID + liveness check        | Hold T2 credentials, standard transactions      |
| `L3`  | Fully Verified | ID + biometric + in-person | Hold T1 credentials, high-value transactions    |
| `L4`  | Government     | Government enrollment      | Issue credentials, override automated decisions |

## Security Levels

| Level      | Keys                               | Algorithm                   | Use Case                                   |
| ---------- | ---------------------------------- | --------------------------- | ------------------------------------------ |
| `standard` | Single Ed25519                     | Ed25519                     | General users, daily operations            |
| `enhanced` | Ed25519 + Secp256k1                | Dual-curve                  | High-value transactions, vault operators   |
| `military` | Multi-sig + quantum-resistant hash | Ed25519 + Secp256k1 + SHA-3 | Government inspectors, critical operations |

## Architecture

```
@gtcx/identity
├── src/
│   ├── identity.ts    # Identity creation and lifecycle
│   ├── did.ts         # DID creation, resolution, document generation
│   ├── keys.ts        # Key pair generation, rotation, history
│   ├── validation.ts  # Identity validation and expiry checks
│   └── index.ts       # Public exports
│
Dependencies:
├── @gtcx/crypto       # Ed25519/Secp256k1 key generation and signing
└── zod                # Runtime validation
```

## Platform Usage

### React Native (Mobile)

```typescript
import { mobileIdentity } from '@gtcx/mobile-shared';

const identity = await mobileIdentity.getOrCreateIdentity({
  metadata: { userRole: 'miner' },
});
// Private key stored in device SecureStore
// Identity cached for offline use (72h)
```

### Node.js (Backend)

```typescript
import { createIdentity } from '@gtcx/identity';
import { SecretManager } from './your-secret-manager';

const { identity, privateKey } = await createIdentity();
await SecretManager.store(identity.privateKeyRef, privateKey);
```

## Principle Alignment

| Principle            | Implementation                                          |
| -------------------- | ------------------------------------------------------- |
| P1 Package Structure | Single-responsibility modules, no circular deps         |
| P2 Type Safety       | Zod validation on all identity inputs and DID parsing   |
| P3 Modularity        | Identity, DID, keys, validation are independent modules |
| P4 Composability     | Works with any secure storage backend via injection     |
| P6 Asset Abstraction | Zero commodity-specific code — identity is universal    |
| P8 Offline-First     | Cached credentials with configurable TTL                |
| P9 Security          | Key rotation, multi-sig, verification levels            |

## Related

- [Identity Core Specification](../specs/identity-core.md) — Full TradePass identity spec with API endpoints, data models, and business logic
- [Security Framework](../specs/security-framework.md) — Key hierarchy and key management specification
- [@gtcx/crypto](./crypto.md) — Underlying cryptographic primitives
- [@gtcx/security](./security.md) — Authentication, sessions, and offline credential caching
