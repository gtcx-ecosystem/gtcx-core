---
title: 'External Integration Guide'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# External Integration Guide — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

How to install and use `@gtcx/*` packages from npm in your own project.

For internal workspace contributors, see [integration-guide.md](./integration-guide.md).

---

## Install

```bash
pnpm add @gtcx/crypto @gtcx/identity @gtcx/verification
```

Optional packages depending on your needs:

```bash
pnpm add @gtcx/security      # Auth, validation, audit logging
pnpm add @gtcx/domain         # Domain services, offline queue, event bus
pnpm add @gtcx/api-client     # HTTP client with retry, signing, offline awareness
pnpm add @gtcx/connectivity   # Network detection for offline-first apps
pnpm add @gtcx/sync           # Sync engine with conflict resolution
```

**Requirements:** Node.js >= 20, TypeScript >= 5.0

---

## Quick Start: Verification Pipeline

The core flow in gtcx-core is: **key generation → identity → certificate → proof bundle → verify**.

```typescript
import { sign, verify, hash256, generateKeyPair } from '@gtcx/crypto';
import { createIdentity, createDID, validateIdentity } from '@gtcx/identity';
import {
  createStandardCertificateData,
  validateCertificateInput,
  createCryptographicProofRef,
  createLocationProof,
  createProofBundle,
  verifyProofBundleStructure,
  hashProofBundle,
  createLocationQRData,
  serializeQRData,
} from '@gtcx/verification';
```

### 1. Create an identity

```typescript
const { identity, privateKey } = await createIdentity({
  metadata: { userId: 'inspector-001', userRole: 'inspector' },
});

const did = createDID(identity);
// did === 'did:gtcx:<prefix>'
```

### 2. Create and sign a certificate

```typescript
const certInput = {
  templateId: 'location' as const,
  location: {
    latitude: 6.2,
    longitude: -1.6,
    accuracy: 5,
    timestamp: Date.now(),
  },
  userRole: 'inspector',
  deviceId: 'device-001',
};

const certData = createStandardCertificateData(certInput);
const certSignature = sign(certData.dataToSign, privateKey);

const certificate = {
  ...certData,
  verificationData: {
    ...certData.verificationData,
    publicKey: identity.publicKey,
    signature: certSignature,
  },
};
```

### 3. Create a proof bundle

```typescript
const dataHash = hash256(certData.dataToSign);

const cryptoProof = createCryptographicProofRef(dataHash, certSignature, identity.publicKey);

const locationProof = createLocationProof({
  coordinates: {
    latitude: 6.2,
    longitude: -1.6,
    accuracy: 5,
    timestamp: Date.now(),
  },
  signature: certSignature,
  publicKey: identity.publicKey,
});

const bundle = createProofBundle({
  type: 'location',
  cryptographicProof: cryptoProof,
  locationProof,
});

const check = verifyProofBundleStructure(bundle);
// check.valid === true
```

### 4. Generate a QR code payload

```typescript
const proofHash = hashProofBundle(bundle);

const qrData = createLocationQRData(
  certificate.certificateId ?? 'cert-001',
  { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  proofHash
);

const serialized = serializeQRData(qrData);
// Pass `serialized` to your QR code library (e.g., qrcode, react-qr-code)
```

### 5. Verify a signature

```typescript
const isValid = verify(certData.dataToSign, certSignature, identity.publicKey);
// isValid === true
```

---

## Offline-First Operations

Use `@gtcx/api-client` with `@gtcx/connectivity` and `@gtcx/domain` for offline-aware HTTP and operation queueing.

```typescript
import { createApiClient } from '@gtcx/api-client';
import { ConnectivityDetector } from '@gtcx/connectivity';
import { OfflineQueue, InMemoryQueueStorage } from '@gtcx/domain/offline';

const detector = new ConnectivityDetector();
const queue = new OfflineQueue({ storage: new InMemoryQueueStorage() });
await queue.initialize();

const client = createApiClient({
  baseUrl: 'https://api.example.com',
  offline: {
    isOnline: () => detector.getState().online,
    enqueue: async (entry) => {
      return queue.enqueue('sync', entry);
    },
  },
});

// When online: normal HTTP request
// When offline: enqueued and returns { queued: true, operationId: '...' }
const response = await client.post('/lots', { commodityType: 'gold', weight: 15.5 });
```

---

## Native Crypto (Production)

For production deployments, install the native bindings for Rust-backed cryptographic operations:

```bash
pnpm add @gtcx/crypto-native
```

Set the environment variable to enforce native module usage:

```bash
GTCX_REQUIRE_NATIVE=true
```

When `GTCX_REQUIRE_NATIVE=true`, the library will throw an error if the native module is unavailable rather than falling back to the pure-JavaScript implementation. This is required for production because the JavaScript ZKP engine (`HashCommitmentZkpEngine`) is a development placeholder — it is not zero-knowledge.

---

## Package Stability

| Stability              | Packages                                                                             | Contract                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Stable (1.x)**       | `crypto`, `types`, `schemas`, `domain`, `identity`, `security`, `verification`       | No breaking changes without major version bump. Deprecations get 2 minor releases or 3 months notice. |
| **Experimental (0.x)** | `services`, `api-client`, `sync`, `connectivity`, `events`, `logging`, `utils`, `ai` | May break between minor versions. Use with pinned versions.                                           |
| **Early (0.1.x)**      | `crypto-native`, `network`, `workproof`                                              | API is not stable. Expect changes.                                                                    |

---

## API Reference

Generated API documentation is available via TypeDoc:

```bash
# Generate locally
git clone https://github.com/gtcx-ecosystem/gtcx-core.git
cd gtcx-core
pnpm install && pnpm docs
# Output in docs/ as markdown
```

Per-package READMEs with API details are in each package directory.

---

## Subpath Imports

Some packages expose subpath imports for tree-shaking:

```typescript
// @gtcx/security subpaths
import { sanitize } from '@gtcx/security/validation';
import { createToken, verifyToken } from '@gtcx/security/auth';
import { SecureOfflineStorage } from '@gtcx/security/offline';
import { AuditLogger } from '@gtcx/security/audit';

// @gtcx/domain subpaths
import { OfflineQueue } from '@gtcx/domain/offline';
import { DomainEventFactory } from '@gtcx/domain/events';

// @gtcx/services subpaths
import { AssetLotRegistrationService } from '@gtcx/services/registration';
import { TradingService } from '@gtcx/services/trading';
import { UnifiedComplianceService } from '@gtcx/services/compliance';
```

---

## Support

- Issues: [github.com/gtcx-ecosystem/gtcx-core/issues](https://github.com/gtcx-ecosystem/gtcx-core/issues)
- Security: security@gtcx.io. See [SECURITY.md](../../SECURITY.md).
