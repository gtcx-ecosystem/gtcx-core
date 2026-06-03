---
title: 'Integration guide — advanced flows'
status: current
date: 2026-06-05
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['documentation', 'specs', 'integration']
review_cycle: on-change
---

# Integration guide — advanced flows

> **Prerequisites:** [integration-guide.md](./integration-guide.md) (Steps 1–4).

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
