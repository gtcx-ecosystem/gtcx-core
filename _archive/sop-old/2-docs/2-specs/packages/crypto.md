# @gtcx/crypto

Platform-agnostic cryptographic primitives for GTCX. Built on audited `@noble` curves with optional native acceleration via `@gtcx/crypto-native`.

## Scope

- Key management — Ed25519, Secp256k1
- Signing and verification
- Hashing and commitments
- Merkle tree construction and proof generation
- ZKP placeholder engine (hash commitment) for dev/test
- Traced operation variants for observability

## Key Exports (`packages/crypto/src/index.ts`)

| Category | Exports                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| Keys     | `generateKeyPair`, `derivePublicKey`, `isValidPublicKey`, `isValidPrivateKey`, `generateKeyId`, `compressPublicKey` |
| Signing  | `sign`, `verify`, `signHash`, `verifyHash`, `createSignedMessage`, `verifySignedMessage`, `batchVerify`             |
| Hashing  | `hash256`, `hash512`, `hashObject`, `doubleHash256`, `createCommitment`, `verifyCommitment`                         |
| Merkle   | `buildMerkleTree`, `generateMerkleProof`, `verifyMerkleProof`                                                       |
| ZKP      | `HashCommitmentZkpEngine`, `createHashCommitmentZkpEngine`                                                          |
| Backend  | `getBackend` — returns `native` or `js`                                                                             |

## Runtime Behavior

- Uses `@noble/ed25519` and `@noble/secp256k1` by default.
- When `@gtcx/crypto-native` has loaded a valid `gtcx_node.node` artifact, operations are delegated to Rust.
- `GTCX_REQUIRE_NATIVE=1` throws at startup if native bindings cannot be loaded — use in production.

## Notes

- The ZKP engine in this package is a placeholder. Real ZKP proofs live in `rust/gtcx-zkp`.
- Algorithm identifiers: `Ed25519` and `Secp256k1`.

## References

- `../../../engineering/security/security-framework.md`
- `../../../architecture/cryptographic-verification.md`
- `crypto-native.md`
- `packages/crypto/src/index.ts`
