# @gtcx/crypto

Platform-agnostic cryptographic primitives for the GTCX Protocol ecosystem. Built on the audited [@noble](https://github.com/paulmillr/noble-curves) libraries with AI-native observability.

## Architecture

```
@gtcx/crypto
├── keys.ts      → Key generation, derivation, validation (Ed25519, Secp256k1)
├── signing.ts   → Digital signatures, batch verification
├── hashing.ts   → SHA-256/512, deterministic object hashing, commitments
├── proofs.ts    → Cryptographic proof structures
│
└── Traced variants (AI-native observability, P5)
    ├── traced.ts         → Traced signing operations
    ├── traced-hashing.ts → Traced hashing operations
    └── traced-keys.ts    → Traced key operations
```

This package provides **primitives only**. It does not handle key storage, network communication, or platform-specific secure enclaves. See [@gtcx/security](./security.md) for authentication, sessions, and secure storage abstractions.

## Installation

```bash
pnpm add @gtcx/crypto
```

## Quick Start

```typescript
import { generateKeyPair, sign, verify, hash256 } from '@gtcx/crypto';

// Generate Ed25519 key pair
const { publicKey, privateKey } = generateKeyPair();

// Sign a message
const message = new TextEncoder().encode('Hello, GTCX!');
const signature = sign(message, privateKey);

// Verify the signature
const isValid = verify(signature, message, publicKey);
// true

// Hash data
const dataHash = hash256(message);
```

## API Reference

### Key Management

```typescript
import {
  generateKeyPair,
  derivePublicKey,
  isValidPublicKey,
  isValidPrivateKey,
  generateKeyId,
} from '@gtcx/crypto';

// Generate new key pair (default: Ed25519)
const { publicKey, privateKey, algorithm } = generateKeyPair('ed25519');

// Derive public key from private key
const pubKey = derivePublicKey(privateKey);

// Validate keys
isValidPublicKey(someKey); // boolean
isValidPrivateKey(someKey); // boolean

// Generate key identifier (fingerprint for logs and references)
const keyId = generateKeyId(publicKey);
```

### Digital Signatures

```typescript
import {
  sign,
  signHash,
  verify,
  verifyHash,
  createSignedMessage,
  verifySignedMessage,
  batchVerify,
} from '@gtcx/crypto';

// Sign raw data
const signature = sign(data, privateKey);

// Sign a pre-computed hash
const hashSignature = signHash(dataHash, privateKey);

// Verify signature
const isValid = verify(signature, data, publicKey);

// Create self-contained signed message
const signedMessage = createSignedMessage(data, privateKey);
// { data, signature, publicKey, timestamp }

// Verify signed message (includes signature + structure check)
const verification = verifySignedMessage(signedMessage);
// { isValid: boolean }

// Batch verify — faster than individual verification for large sets
const results = batchVerify([
  { signature: sig1, message: msg1, publicKey: pk1 },
  { signature: sig2, message: msg2, publicKey: pk2 },
]);
```

### Hashing

```typescript
import {
  hash256,
  hash512,
  hashObject,
  doubleHash256,
  combineHashes,
  createCommitment,
  verifyCommitment,
  generateSalt,
} from '@gtcx/crypto';

// SHA-256
const hash = hash256(data);

// SHA-512
const longHash = hash512(data);

// Deterministic object hashing (canonical JSON serialization)
const objHash = hashObject({ name: 'Alice', amount: 100 });

// Double hash (hash-of-hash, used in audit chains)
const doubleHash = doubleHash256(data);

// Combine multiple hashes (Merkle-style)
const combined = combineHashes([hash1, hash2, hash3]);

// Commitment scheme (hide-then-reveal)
const salt = generateSalt();
const commitment = createCommitment(secretData, salt);
const valid = verifyCommitment(commitment, secretData, salt);
```

### Cryptographic Proofs

```typescript
import { createCryptographicProof, verifyCryptographicProof } from '@gtcx/crypto';

// Create proof (signs data and packages with metadata)
const proof = createCryptographicProof({
  data: myData,
  privateKey,
  publicKey,
  algorithm: 'ed25519',
});

// Verify proof
const verification = verifyCryptographicProof(proof);
// { valid: boolean }
```

## Traced Operations (P5 AI-Native)

All operations have traced variants that emit structured logs for AI analysis and observability. The API is identical to the standard functions.

```typescript
import { tracedSign, tracedVerify, tracedHash256, tracedGenerateKeyPair } from '@gtcx/crypto';
import { registerLogHandler } from '@gtcx/ai';

// Register handler to receive operation logs
registerLogHandler(async (log) => {
  // log: { category: 'crypto', type: 'crypto.sign', durationMs: 1, ... }
  await analyticsService.track(log);
});

// Use traced functions (same API, automatic logging)
const { publicKey, privateKey } = tracedGenerateKeyPair();
const signature = tracedSign(data, privateKey);
const isValid = tracedVerify(signature, data, publicKey);
```

### Security Guarantees for Traced Operations

- Private keys are **never** included in trace logs
- Timing information can be redacted via configuration
- Key lifecycle events are logged with fingerprint only (no key material)

```typescript
import { logKeyEvent } from '@gtcx/crypto';

// Log key lifecycle events (fingerprint only, no key material)
logKeyEvent('generated', publicKey, { purpose: 'signing' });
logKeyEvent('rotated', publicKey, { reason: 'scheduled' });
logKeyEvent('revoked', publicKey, { reason: 'compromised' });
```

## Algorithm Selection

| Algorithm | Use Case                    | Security Level | Notes                                |
| --------- | --------------------------- | -------------- | ------------------------------------ |
| Ed25519   | Primary signatures          | 128-bit        | Default for all GTCX signing         |
| Secp256k1 | Blockchain interoperability | 128-bit        | Used in enhanced/military identities |
| SHA-256   | General hashing             | 128-bit        | Default for content hashing          |
| SHA-512   | Extended hashing            | 256-bit        | Used for key derivation inputs       |

### Post-Quantum Notice

Current algorithms are not quantum-resistant. The package is designed for algorithm agility — post-quantum signature schemes (CRYSTALS-Dilithium, SPHINCS+) can be added without protocol changes. See [Security Framework](../specs/security-framework.md) Section 8.2 for the key rotation and algorithm migration plan.

## Key Storage

This package does **not** handle key storage. Use the appropriate secure storage for your platform:

| Platform     | Storage                               | Package               |
| ------------ | ------------------------------------- | --------------------- |
| React Native | `expo-secure-store`                   | `@gtcx/mobile-shared` |
| Web          | WebCrypto (non-extractable keys)      | Application-specific  |
| Server       | HSM or KMS (AWS KMS, HashiCorp Vault) | Application-specific  |

## Performance

Benchmarks on Apple M1:

| Operation          | Time   | Notes                        |
| ------------------ | ------ | ---------------------------- |
| Key generation     | 0.3ms  | Ed25519                      |
| Sign               | 0.4ms  | Ed25519                      |
| Verify             | 0.8ms  | Ed25519                      |
| Batch verify (100) | 45ms   | ~2.2x faster than individual |
| SHA-256 (1KB)      | 0.02ms |                              |
| SHA-256 (1MB)      | 2.1ms  |                              |

## Dependencies

- `@noble/curves` — Elliptic curve cryptography (Ed25519, Secp256k1)
- `@noble/hashes` — Hash functions (SHA-256, SHA-512, SHA-3)
- `@gtcx/ai` — Operation tracing (peer dependency, optional)

## Principle Alignment

| Principle            | Implementation                                                            |
| -------------------- | ------------------------------------------------------------------------- |
| P1 Package Structure | Single entry point; keys, signing, hashing, proofs as independent modules |
| P2 Type Safety       | Typed key pairs, signatures, and hashes; Uint8Array throughout            |
| P3 Modularity        | Each module (keys, signing, hashing) is independently importable          |
| P5 AI-Native         | Traced variants of all operations for ML analysis                         |
| P8 Offline-First     | All operations are local — no network required                            |
| P9 Security          | No private key logging; audited noble libraries; algorithm agility        |

## Related

- [@gtcx/identity](./identity.md) — Uses crypto for key generation, DID creation, and credential signing
- [@gtcx/verification](./verification.md) — Uses crypto for certificate and proof bundle creation
- [@gtcx/security](./security.md) — Uses crypto for tamper detection and integrity checks
- [Security Framework](../specs/security-framework.md) — Key hierarchy, algorithm standards, and threat model
- [Cryptographic Verification](../architecture/cryptographic-verification.md) — Why GTCX uses cryptographic infrastructure instead of blockchain
