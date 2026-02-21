# @gtcx/crypto

Platform‑agnostic cryptographic primitives for GTCX. Built on audited `@noble` curves with optional native acceleration via `@gtcx/crypto-native`.

## Scope

- Key management (Ed25519, Secp256k1)
- Signing + verification
- Hashing + commitments
- Merkle proofs
- ZKP placeholder engine (hash commitment)
- Traced operations for observability

## Key Exports

From `packages/crypto/src/index.ts`:

- **Keys**: `generateKeyPair`, `derivePublicKey`, `isValidPublicKey`, `isValidPrivateKey`, `generateKeyId`, `compressPublicKey`
- **Signing**: `sign`, `verify`, `signHash`, `verifyHash`, `createSignedMessage`, `verifySignedMessage`, `batchVerify`
- **Hashing**: `hash256`, `hash512`, `hashObject`, `doubleHash256`, `createCommitment`, `verifyCommitment`
- **Proofs**: `buildMerkleTree`, `generateMerkleProof`, `verifyMerkleProof` and helpers
- **ZKP**: `HashCommitmentZkpEngine`, `createHashCommitmentZkpEngine`
- **Backend**: `getBackend` (native/JS selection)

## Notes

- Algorithm identifiers are `Ed25519` and `Secp256k1`.
- The ZKP engine here is a placeholder; real proofs live in `rust/gtcx-zkp`.
- For production, enable native crypto with `GTCX_REQUIRE_NATIVE=1`.

## References

- `docs/specs/security-framework.md`
- `docs/architecture/cryptographic-verification.md`
