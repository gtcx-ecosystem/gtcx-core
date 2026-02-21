# @gtcx/crypto

Cryptographic primitives for the GTCX ecosystem — key generation, signing, hashing, Merkle trees, and commitments.

## Installation

```bash
pnpm add @gtcx/crypto
```

## Quick Start

```typescript
import { generateKeyPair, sign, verify, hash256 } from '@gtcx/crypto';

const kp = generateKeyPair();
const sig = sign('hello', kp.privateKey);
console.log(verify('hello', sig, kp.publicKey)); // true
console.log(hash256('data')); // hex string
```

## API

| Export                                      | Description               |
| ------------------------------------------- | ------------------------- |
| `generateKeyPair()`                         | Generate Ed25519 key pair |
| `sign(message, privateKey)`                 | Sign a message            |
| `verify(message, signature, publicKey)`     | Verify a signature        |
| `hash256(data)`                             | SHA-256 hash (hex)        |
| `hash512(data)`                             | SHA-512 hash (hex)        |
| `hashObject(obj)`                           | Deterministic object hash |
| `createCommitment(value, salt)`             | Cryptographic commitment  |
| `verifyCommitment(value, salt, commitment)` | Verify commitment         |
| `generateSalt()`                            | Random salt               |
| `buildMerkleTree(leaves)`                   | Build Merkle tree         |
| `verifyMerkleProof(proof)`                  | Verify Merkle inclusion   |
| `ZKProofSchema`                             | ZK proof schema (Zod)     |
| `HashCommitmentZkpEngine`                   | Placeholder ZK engine     |

## ZKP (Placeholder)

```typescript
import { HashCommitmentZkpEngine } from '@gtcx/crypto';

const engine = new HashCommitmentZkpEngine();
const proof = await engine.generate({
  system: 'bulletproofs',
  proofType: 'gci_threshold',
  publicInputs: ['threshold:50'],
  witness: 'score:75',
  verificationKeyId: 'bulletproofs-gci-v1',
});

const ok = await engine.verify(proof);
```

## Related

- [ADR-001: Rust for Cryptography](../../docs/adr/001-rust-for-cryptography.md)
- [ADR-005: Ed25519 over secp256k1](../../docs/adr/005-ed25519-signing.md)

## License

MIT
