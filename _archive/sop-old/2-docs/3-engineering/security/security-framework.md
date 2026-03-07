# Security Framework (gtcx-core)

The security posture of `gtcx-core`. Covers cryptographic primitives, storage security, ZKP capabilities, and operational safeguards.

## Scope

- Cryptographic primitives: `@gtcx/crypto`, `@gtcx/crypto-native`, `rust/gtcx-crypto`
- Secure storage and offline security: `@gtcx/security`
- Zero-knowledge proofs: `rust/gtcx-zkp` + TypeScript placeholder engine
- Network controls: rate limiting + topic allowlists in `@gtcx/network`

## Cryptographic Standards (Implemented)

| Primitive          | Algorithm                        | Package          |
| ------------------ | -------------------------------- | ---------------- |
| Digital signatures | Ed25519, Secp256k1               | `@gtcx/crypto`   |
| Hashing            | SHA-256, SHA-512, Blake3         | `@gtcx/crypto`   |
| Commitments        | Hash-commitment scheme           | `@gtcx/crypto`   |
| Merkle proofs      | Build and verify                 | `@gtcx/crypto`   |
| Secure storage     | AES-256-GCM (pluggable provider) | `@gtcx/security` |

> Note: AES-256-GCM is implemented via a configurable encryption provider; the repo does not ship a platform-specific AES provider by default.

## Key Management

- Keys are generated and stored as hex strings (Ed25519 or Secp256k1).
- Key IDs are deterministic fingerprints (`did:gtcx:<prefix>` style).
- Optional native backend via `@gtcx/crypto-native` with `GTCX_REQUIRE_NATIVE=1` enforcement for production.

## Zero-Knowledge Proofs

| Layer                    | Implementation            | Description                                                                                                          |
| ------------------------ | ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Rust (real proofs)       | `rust/gtcx-zkp`           | Groth16 (GCI threshold, asset ownership, location region), Bulletproofs (amount range), Schnorr (identity attribute) |
| TypeScript (placeholder) | `HashCommitmentZkpEngine` | Compatible API surface for dev/test until native bindings are wired                                                  |

## Secure Storage (Offline)

`@gtcx/security` provides encrypted local storage with:

- Key derivation hooks (pluggable)
- Lock/unlock flow
- Encrypted persistence for credentials and offline queues

## Observability

- Crypto operations have traced variants for AI-native logging.
- Network layer emits telemetry events for publish/receive/peer errors.

## Threat Model (Current Coverage)

| Threat         | Mitigation                                    |
| -------------- | --------------------------------------------- |
| Key compromise | Least-privilege key use and strong algorithms |
| Replay attacks | TTL and timestamp in network envelope         |
| Data at rest   | Encrypted secure storage interfaces           |
| Proof forgery  | Groth16/Bulletproofs/Schnorr verification     |

## Roadmap (Known Gaps)

- Full native binding coverage in app runtimes
- Hardware-backed key storage (HSM/secure enclave) integration
- Formalized key rotation policy and revocation registry

## References

- `SOP/2-docs/1-architecture/cryptographic-verification.md`
- `SOP/2-docs/1-architecture/zkp-circuit-plan.md`
- `SOP/2-docs/3-engineering/security/threat-control-matrix.md`
- `SOP/2-docs/2-specs/packages/crypto.md`
- `SOP/2-docs/2-specs/packages/security.md`
- `SOP/2-docs/1-architecture/decisions/001-rust-for-cryptography.md`
- `SOP/2-docs/1-architecture/decisions/005-ed25519-signing.md`
