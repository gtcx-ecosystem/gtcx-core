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

- [ADR-001: Rust for Cryptography](../../docs/decisions/001-rust-for-cryptography.md)
- [ADR-005: Ed25519 over secp256k1](../../docs/decisions/005-ed25519-signing.md)

## Supply Chain Verification

`@gtcx/crypto` publishes with **SLSA Build Level 3 provenance** attestations. Verify the supply-chain integrity of any installed version:

```bash
# Verify provenance attestation via npm
npm audit signatures @gtcx/crypto

# Or inspect the attestation directly
npm view @gtcx/crypto --json | jq '.dist.attestations'
```

Expected output includes `predicateType: https://slsa.dev/provenance/v1` with a Sigstore-signed attestation describing the exact Git commit, build environment, and dependency versions used to produce the package.

For enterprise procurement and regulator review, see the [SLSA Provenance Consumer Guide](../../docs/gtm/15-slsa-provenance-guide.md).

## License

MIT
