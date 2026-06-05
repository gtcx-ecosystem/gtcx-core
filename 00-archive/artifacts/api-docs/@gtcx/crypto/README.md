[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/crypto

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

## Native Backend (Optional)

`@gtcx/crypto` will attempt to load native bindings from `@gtcx/crypto-native` at runtime.
If unavailable, it falls back to pure TypeScript implementations (ADR-009).

```typescript
import { getBackend } from '@gtcx/crypto';

console.log(getBackend()); // 'native' | 'js'
```

To enforce native bindings in production, set:

```
GTCX_REQUIRE_NATIVE=1
```

## API

| Export                                      | Description                             |
| ------------------------------------------- | --------------------------------------- |
| `generateKeyPair()`                         | Generate Ed25519 key pair               |
| `sign(message, privateKey)`                 | Sign a message                          |
| `verify(message, signature, publicKey)`     | Verify a signature                      |
| `hash256(data)`                             | SHA-256 hash (hex)                      |
| `hash512(data)`                             | SHA-512 hash (hex)                      |
| `hashObject(obj)`                           | Deterministic object hash               |
| `createCommitment(value, salt)`             | Cryptographic commitment                |
| `verifyCommitment(value, salt, commitment)` | Verify commitment                       |
| `generateSalt()`                            | Random salt                             |
| `buildMerkleTree(leaves)`                   | Build Merkle tree                       |
| `verifyMerkleProof(proof)`                  | Verify Merkle inclusion                 |
| `ZKProofSchema`                             | ZK proof schema (Zod)                   |
| `HashCommitmentZkpEngine`                   | Hash-commitment engine (see note below) |
| `isFipsMode()`                              | Check if FIPS mode is active            |
| `getBackend()`                              | Active crypto backend                   |

## Hash-Commitment Proofs (Not Zero-Knowledge)

The TypeScript `HashCommitmentZkpEngine` provides **commitment-based verification**, not zero-knowledge proofs. It proves that a prover knew a witness at commitment time (binding property) but does not provide the zero-knowledge property — the verifier does not learn the witness, but the scheme is not formally ZK.

For production zero-knowledge proofs (Groth16, Bulletproofs, Schnorr), use the Rust `gtcx-zkp` crate via `@gtcx/crypto-native` NAPI bindings.

**Do not claim "ZK-verified" or "zero-knowledge compliance" based on this engine.** Use "commitment-verified" or "cryptographically attested" instead.

```typescript
import { HashCommitmentZkpEngine } from '@gtcx/crypto';

// Commitment-based verification — NOT zero-knowledge
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

- [ADR-001: Rust for Cryptography](../../_media/001-rust-for-cryptography.md)
- [ADR-005: Ed25519 over secp256k1](../../_media/005-ed25519-signing.md)

## License

MIT

## Classes

- [HashCommitmentZkpEngine](classes/HashCommitmentZkpEngine.md)
- [NativeZkpEngine](classes/NativeZkpEngine.md)

## Interfaces

- [DerivedKey](interfaces/DerivedKey.md)
- [KeyPairResult](interfaces/KeyPairResult.md)
- [MerkleProof](interfaces/MerkleProof.md)
- [MerkleTree](interfaces/MerkleTree.md)
- [Pbkdf2Params](interfaces/Pbkdf2Params.md)
- [SignatureResult](interfaces/SignatureResult.md)
- [VerificationResult](interfaces/VerificationResult.md)
- [ZkFullVerifier](interfaces/ZkFullVerifier.md)
- [ZkProofInput](interfaces/ZkProofInput.md)
- [ZkProver](interfaces/ZkProver.md)
- [ZkVerifier](interfaces/ZkVerifier.md)

## Type Aliases

- [Backend](type-aliases/Backend.md)
- [HashAlgorithm](type-aliases/HashAlgorithm.md)
- [KeyAlgorithm](type-aliases/KeyAlgorithm.md)
- [ZKProof](type-aliases/ZKProof.md)
- [ZKProofSystem](type-aliases/ZKProofSystem.md)

## Variables

- [keyFormats](variables/keyFormats.md)
- [tracedBatchVerify](variables/tracedBatchVerify.md)
- [tracedCombineHashes](variables/tracedCombineHashes.md)
- [tracedCompressPublicKey](variables/tracedCompressPublicKey.md)
- [tracedCreateCommitment](variables/tracedCreateCommitment.md)
- [tracedCreateSignedMessage](variables/tracedCreateSignedMessage.md)
- [tracedDerivePublicKey](variables/tracedDerivePublicKey.md)
- [tracedDoubleHash256](variables/tracedDoubleHash256.md)
- [tracedGenerateKeyId](variables/tracedGenerateKeyId.md)
- [tracedGenerateKeyPair](variables/tracedGenerateKeyPair.md)
- [tracedGenerateSalt](variables/tracedGenerateSalt.md)
- [tracedHash](variables/tracedHash.md)
- [tracedHash256](variables/tracedHash256.md)
- [tracedHash512](variables/tracedHash512.md)
- [tracedHashObject](variables/tracedHashObject.md)
- [tracedIsValidPrivateKey](variables/tracedIsValidPrivateKey.md)
- [tracedIsValidPublicKey](variables/tracedIsValidPublicKey.md)
- [tracedSign](variables/tracedSign.md)
- [tracedSignHash](variables/tracedSignHash.md)
- [tracedVerify](variables/tracedVerify.md)
- [tracedVerifyCommitment](variables/tracedVerifyCommitment.md)
- [tracedVerifyHash](variables/tracedVerifyHash.md)
- [tracedVerifyHashValue](variables/tracedVerifyHashValue.md)
- [tracedVerifySignedMessage](variables/tracedVerifySignedMessage.md)
- [ZKProofSchema](variables/ZKProofSchema.md)
- [ZKProofSystemSchema](variables/ZKProofSystemSchema.md)

## Functions

- [batchVerify](functions/batchVerify.md)
- [batchVerifyProofs](functions/batchVerifyProofs.md)
- [buildMerkleTree](functions/buildMerkleTree.md)
- [combineHashes](functions/combineHashes.md)
- [compressPublicKey](functions/compressPublicKey.md)
- [computeRootFromProof](functions/computeRootFromProof.md)
- [constantTimeEqual](functions/constantTimeEqual.md)
- [createCommitment](functions/createCommitment.md)
- [createHashCommitmentZkpEngine](functions/createHashCommitmentZkpEngine.md)
- [createInclusionProof](functions/createInclusionProof.md)
- [createSignedMessage](functions/createSignedMessage.md)
- [createZkpEngine](functions/createZkpEngine.md)
- [deriveKeyPbkdf2](functions/deriveKeyPbkdf2.md)
- [derivePublicKey](functions/derivePublicKey.md)
- [doubleHash256](functions/doubleHash256.md)
- [generateKeyId](functions/generateKeyId.md)
- [generateKeyPair](functions/generateKeyPair.md)
- [generateMerkleProof](functions/generateMerkleProof.md)
- [generateSalt](functions/generateSalt.md)
- [getBackend](functions/getBackend.md)
- [getPublicKeyLength](functions/getPublicKeyLength.md)
- [hash](functions/hash.md)
- [hash256](functions/hash256.md)
- [hash512](functions/hash512.md)
- [hashObject](functions/hashObject.md)
- [isFipsMode](functions/isFipsMode.md)
- [isValidPrivateKey](functions/isValidPrivateKey.md)
- [isValidPublicKey](functions/isValidPublicKey.md)
- [logKeyEvent](functions/logKeyEvent.md)
- [logSigningOperation](functions/logSigningOperation.md)
- [sanitizeBatchVerifyOutput](functions/sanitizeBatchVerifyOutput.md)
- [sanitizeCombineHashesOutput](functions/sanitizeCombineHashesOutput.md)
- [sanitizeDerivePublicKeyOutput](functions/sanitizeDerivePublicKeyOutput.md)
- [sanitizeGenerateKeyIdOutput](functions/sanitizeGenerateKeyIdOutput.md)
- [sanitizeGenerateKeyPairOutput](functions/sanitizeGenerateKeyPairOutput.md)
- [secureWipe](functions/secureWipe.md)
- [sign](functions/sign.md)
- [signHash](functions/signHash.md)
- [verify](functions/verify.md)
- [verifyCommitment](functions/verifyCommitment.md)
- [verifyHash](functions/verifyHash.md)
- [verifyHashValue](functions/verifyHashValue.md)
- [verifyInclusion](functions/verifyInclusion.md)
- [verifyMerkleProof](functions/verifyMerkleProof.md)
- [verifySignedMessage](functions/verifySignedMessage.md)
