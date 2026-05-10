# Integration Guide — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

How to use the core packages together to build a complete verification pipeline.

This guide walks through the primary flow: key generation, identity creation, certificate issuance, proof bundling, and QR code generation. It mirrors the integration test at `tests/integration/full-pipeline.test.ts`.

---

## Prerequisites

All packages are consumed via the `@gtcx/*` scope within the pnpm workspace:

```typescript
import { sign, verify, hash256 } from '@gtcx/crypto';
import { createIdentity, createDID, validateIdentity } from '@gtcx/identity';
import {
  createStandardCertificateData,
  validateCertificateInput,
  verifyCertificateStructure,
  createLocationProof,
  createCryptographicProofRef,
  createProofBundle,
  verifyProofBundleStructure,
  hashProofBundle,
  createLocationQRData,
  serializeQRData,
  parseQRData,
} from '@gtcx/verification';
import {
  safeValidateRegistrationData,
  OfflineQueue,
  InMemoryQueueStorage,
  InMemoryEventEmitter,
  DomainEventFactory,
} from '@gtcx/domain';
```

---

## Step 1: Create an Identity

`@gtcx/identity` generates an Ed25519 keypair and wraps it in a GTCX identity:

```typescript
const { identity, privateKey } = await createIdentity({
  metadata: { userId: 'inspector-001', userRole: 'inspector' },
});

// Validate the identity structure
const validation = validateIdentity(identity);
// validation.valid === true
// identity.id matches /^GTCX_/
// identity.publicKey is 64 hex chars (32 bytes Ed25519)
```

Create a DID for the identity:

```typescript
const did = createDID(identity);
// did === 'did:gtcx:<prefix>'
```

For multi-party workflows (inspector + regulator), create separate identities:

```typescript
const inspector = await createIdentity({ metadata: { userRole: 'inspector' } });
const regulator = await createIdentity({ metadata: { userRole: 'regulator' } });
```

---

## Step 2: Create and Sign a Certificate

`@gtcx/verification` creates structured certificate data. You sign it with `@gtcx/crypto`:

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

// Validate input before creating certificate
const inputCheck = validateCertificateInput(certInput);
// inputCheck.valid === true

// Generate the certificate data structure
const certData = createStandardCertificateData(certInput);

// Sign the certificate's data payload
const certSignature = sign(certData.dataToSign, privateKey);

// Attach the verification data
const certificate = {
  ...certData,
  verificationData: {
    ...certData.verificationData,
    publicKey: identity.publicKey,
    signature: certSignature,
  },
};

// Verify the signature independently
verify(certData.dataToSign, certSignature, identity.publicKey); // true
```

---

## Step 3: Create a Proof Bundle

A proof bundle combines cryptographic proof and location proof into a single verifiable artifact:

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

// Verify the bundle structure
const bundleCheck = verifyProofBundleStructure(bundle);
// bundleCheck.valid === true
```

---

## Step 4: Generate a QR Code

Serialize the proof bundle into a QR-scannable format:

```typescript
const proofHash = hashProofBundle(bundle);

const qrData = createLocationQRData(
  certificate.certificateId ?? 'cert-001',
  { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  proofHash
);

const serialized = serializeQRData(qrData);
// serialized is a string suitable for QR code encoding

const parsed = parseQRData(serialized);
// parsed !== null — round-trip verified
```

---

## Step 5: Domain Validation and Events

Validate structured data through domain schemas and emit events:

```typescript
// Validate registration data
const registrationData = {
  commodityType: 'gold',
  origin: { country: 'GH', region: 'Ashanti', site: 'Obuasi Mine' },
  quantity: { value: 1000, unit: 'grams' },
  quality: { purity: 0.995, grade: 'A' },
};

const result = safeValidateRegistrationData(registrationData);
// result.success === true | false (structured result, never throws)

// Emit domain events
const emitter = new InMemoryEventEmitter();
const factory = new DomainEventFactory('my-service');

emitter.emit(
  factory.registration('registration.started', {
    publicKey: identity.publicKey,
    did,
  })
);
```

---

## Step 6: Offline Queue

Queue signed operations for offline-first workflows:

```typescript
const storage = new InMemoryQueueStorage();
const queue = new OfflineQueue({ storage });

// Queue a signed operation
const message = 'operation-data';
const signature = sign(message, privateKey);

await queue.enqueue('registration' as never, {
  message,
  signature,
  publicKey: identity.publicKey,
});

// Later, replay pending operations
const pending = await queue.getPending();
for (const op of pending) {
  const payload = op.payload as { message: string; signature: string; publicKey: string };
  const isValid = verify(payload.message, payload.signature, payload.publicKey);
  // Process if valid
}
```

---

## Multi-Party Verification

Inspector signs, regulator counter-signs:

```typescript
const inspector = await createIdentity({ metadata: { userRole: 'inspector' } });
const regulator = await createIdentity({ metadata: { userRole: 'regulator' } });

// Inspector signs the verification
const message = 'asset-lot-verified-clean';
const inspectorSig = sign(message, inspector.privateKey);

// Regulator adds their attestation
const regulatorAttestation = sign(`approved:${hash256(message)}`, regulator.privateKey);

// Both signatures are independently verifiable
verify(message, inspectorSig, inspector.identity.publicKey); // true
verify(`approved:${hash256(message)}`, regulatorAttestation, regulator.identity.publicKey); // true
```

---

## Tamper-Evident Hash Chains

Build auditable chains of signed verification events:

```typescript
let prevHash = hash256('genesis');
const chain = [];

for (const data of events) {
  const dataHash = hash256(data);
  const chainedHash = hash256(prevHash + dataHash);
  const signature = sign(chainedHash, privateKey);
  chain.push({ data, dataHash, chainedHash, signature, prevHash });
  prevHash = chainedHash;
}

// Verify chain integrity: any tampering breaks the hash link
```

---

## Package Dependency Flow

```
@gtcx/crypto              (keys, signing, hashing — no internal deps)
      |
@gtcx/identity            (DID, credentials — uses crypto for key gen)
      |
@gtcx/verification        (certificates, proofs, QR — uses crypto for signing)
      |
@gtcx/domain              (schemas, events, offline queues)
      |
@gtcx/services            (business logic — registration, trading, compliance)
```

Cross-cutting: `@gtcx/schemas` (Zod validation), `@gtcx/events` (event bus), `@gtcx/sync` (offline sync), `@gtcx/connectivity` (network detection).

---

## Reference

- [`tests/integration/full-pipeline.test.ts`](../../tests/integration/full-pipeline.test.ts) — integration test this guide is based on
- [`tests/integration/crypto-identity.test.ts`](../../tests/integration/crypto-identity.test.ts) — crypto + identity integration
- [`docs/architecture/overview.md`](../architecture/overview.md) — architecture overview
- [`docs/architecture/api-stability.md`](../architecture/api-stability.md) — API stability matrix
