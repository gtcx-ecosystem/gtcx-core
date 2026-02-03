# @gtcx/crypto

Military-grade cryptographic primitives for the GTCX Protocol ecosystem.

## Overview

This package provides **universal, platform-agnostic** cryptographic operations using the audited [@noble](https://github.com/paulmillr/noble-curves) libraries.

```
┌─────────────────────────────────────────────────────────────────┐
│                     CRYPTO ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @gtcx/crypto (this package)                                    │
│  ├── keys.ts      → Key generation, derivation, validation      │
│  ├── signing.ts   → Ed25519 signatures, batch verification      │
│  ├── hashing.ts   → SHA-256/512, commitments                    │
│  ├── proofs.ts    → Cryptographic proof structures              │
│  │                                                              │
│  └── Traced variants (AI-native observability)                  │
│      ├── traced.ts         → Traced signing operations          │
│      ├── traced-hashing.ts → Traced hashing operations          │
│      └── traced-keys.ts    → Traced key operations              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
pnpm add @gtcx/crypto
```

## Quick Start

```typescript
import {
  generateKeyPair,
  sign,
  verify,
  hash256,
} from '@gtcx/crypto';

// Generate Ed25519 key pair
const { publicKey, privateKey } = generateKeyPair();

// Sign a message
const message = 'Hello, GTCX!';
const messageBytes = new TextEncoder().encode(message);
const signature = sign(messageBytes, privateKey);

// Verify the signature
const isValid = verify(signature, messageBytes, publicKey);
console.log('Signature valid:', isValid); // true

// Hash data
const dataHash = hash256(messageBytes);
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

// Generate new key pair
const { publicKey, privateKey, algorithm } = generateKeyPair('ed25519');

// Derive public key from private key
const pubKey = derivePublicKey(privateKey);

// Validate keys
if (isValidPublicKey(someKey)) {
  console.log('Valid public key');
}

if (isValidPrivateKey(someKey)) {
  console.log('Valid private key');
}

// Generate key identifier (fingerprint)
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

// Verify signed message
const verification = verifySignedMessage(signedMessage);
if (verification.isValid) {
  console.log('Message authentic');
}

// Batch verify multiple signatures (faster than individual verification)
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

// SHA-256 hash
const hash = hash256(data);

// SHA-512 hash
const longHash = hash512(data);

// Hash JavaScript object (deterministic)
const objHash = hashObject({ name: 'Alice', amount: 100 });

// Double hash (Bitcoin-style)
const doubleHash = doubleHash256(data);

// Combine multiple hashes (Merkle tree style)
const combined = combineHashes([hash1, hash2, hash3]);

// Commitment scheme
const salt = generateSalt();
const commitment = createCommitment(secretData, salt);

// Later: verify the commitment
const isValid = verifyCommitment(commitment, secretData, salt);
```

### Cryptographic Proofs

```typescript
import {
  createCryptographicProof,
  verifyCryptographicProof,
  createProofBundle,
} from '@gtcx/crypto';

// Create proof
const proof = createCryptographicProof({
  data: myData,
  privateKey,
  publicKey,
  algorithm: 'ed25519',
});

// Verify proof
const verification = verifyCryptographicProof(proof);
if (verification.valid) {
  console.log('Proof verified');
}
```

## Traced Operations (AI-Native)

All operations have traced variants for observability and AI analysis:

```typescript
import {
  tracedSign,
  tracedVerify,
  tracedHash256,
  tracedGenerateKeyPair,
} from '@gtcx/crypto';
import { registerLogHandler } from '@gtcx/ai';

// Register handler to receive operation logs
registerLogHandler(async (log) => {
  console.log(`[${log.category}] ${log.type}: ${log.durationMs}ms`);
  await analyticsService.track(log);
});

// Use traced functions (same API, automatic logging)
const { publicKey, privateKey } = tracedGenerateKeyPair();
const signature = tracedSign(data, privateKey);
const isValid = tracedVerify(signature, data, publicKey);
const hash = tracedHash256(data);

// Logs will show:
// [crypto] crypto.generateKeyPair: 2ms
// [crypto] crypto.sign: 1ms
// [crypto] crypto.verify: 1ms
// [crypto] crypto.hash256: 0ms
```

### Security Features

- **No private key logging**: Traced operations never log private keys
- **Timing redaction**: Option to hide timing information
- **Batch logging**: Efficient logging for high-volume operations

```typescript
import { logKeyEvent } from '@gtcx/crypto';

// Log key lifecycle events (without exposing the key)
logKeyEvent('generated', publicKey, { purpose: 'signing' });
logKeyEvent('rotated', publicKey, { reason: 'scheduled' });
logKeyEvent('revoked', publicKey, { reason: 'compromised' });
```

## Security Considerations

### Key Storage

This package does **NOT** handle key storage. Use appropriate secure storage for your platform:

```typescript
// Mobile (React Native)
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('private_key', bytesToHex(privateKey));

// Web (limited security)
// Consider WebCrypto with non-extractable keys

// Server
// Use HSM or KMS (AWS KMS, HashiCorp Vault)
```

### Algorithm Selection

| Algorithm | Use Case | Security Level |
|-----------|----------|----------------|
| Ed25519 | Primary signatures | 128-bit |
| Secp256k1 | Blockchain interop | 128-bit |
| SHA-256 | General hashing | 128-bit |
| SHA-512 | Extended hashing | 256-bit |

### Post-Quantum Notice

Current algorithms are **not** quantum-resistant. Monitor NIST post-quantum standardization for future migration.

## Performance

Benchmarks on Apple M1:

| Operation | Time |
|-----------|------|
| Key generation | 0.3ms |
| Sign | 0.4ms |
| Verify | 0.8ms |
| Batch verify (100) | 45ms |
| SHA-256 (1KB) | 0.02ms |
| SHA-256 (1MB) | 2.1ms |

## Dependencies

- `@noble/curves` - Elliptic curve cryptography
- `@noble/hashes` - Hash functions
- `@gtcx/ai` - Operation tracing (peer dependency)

## License

Proprietary - GTCX Protocol

## References

- [ADR-005: Cryptographic Primitives Selection](../../docs/architecture/decisions/ADR-005-cryptographic-primitives.md)
- [Ed25519 Specification](https://ed25519.cr.yp.to/)
- [@noble/curves Documentation](https://github.com/paulmillr/noble-curves)
