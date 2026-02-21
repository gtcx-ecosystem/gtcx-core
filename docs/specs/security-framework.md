# Security Framework (gtcx-core)

**Status**: Active (2026-02-21)

This document describes the security posture implemented in `gtcx-core` today. It focuses on cryptographic primitives, storage security, ZKP capabilities, and operational safeguards that exist in this repo.

## Scope

- Cryptographic primitives: `@gtcx/crypto`, `@gtcx/crypto-native`, `rust/gtcx-crypto`.
- Secure storage and offline security: `@gtcx/security`.
- Zero‑knowledge proofs: `rust/gtcx-zkp` + TS placeholder engine.
- Network controls: rate limiting + topic allowlists in `@gtcx/network`.

## Cryptographic Standards (Implemented)

- **Digital signatures**: Ed25519, Secp256k1 (`@gtcx/crypto`).
- **Hashing**: SHA‑256, SHA‑512, Blake3 (`@gtcx/crypto`).
- **Commitments**: hash‑commitment scheme (`@gtcx/crypto`).
- **Merkle proofs**: build/verify in `@gtcx/crypto`.
- **Secure storage**: AES‑256‑GCM (pluggable provider, `@gtcx/security`).

> Note: AES‑256‑GCM is implemented via a configurable encryption provider; the repo does not ship a platform‑specific AES provider by default.

## Key Management

- Keys are generated and stored as hex strings (Ed25519 or Secp256k1).
- Key IDs are deterministic fingerprints (`did:gtcx:<prefix>` style).
- Optional native backend via `@gtcx/crypto-native` with `GTCX_REQUIRE_NATIVE=1` enforcement for production.

## Zero‑Knowledge Proofs

**Rust (real proofs)**: `rust/gtcx-zkp`

- Groth16: GCI threshold, asset ownership, location region.
- Bulletproofs: amount range.
- Schnorr: identity attribute possession.

**TypeScript (placeholder)**: `HashCommitmentZkpEngine` provides a compatible API surface for dev/test until native bindings are wired.

## Secure Storage (Offline)

`@gtcx/security` provides encrypted local storage with:

- Key derivation hooks (pluggable)
- Lock/unlock flow
- Encrypted persistence for credentials and offline queues

## Observability

- Crypto operations have traced variants for AI‑native logging.
- Network layer emits telemetry events for publish/receive/peer errors.

## Threat Model (Current Coverage)

- **Key compromise**: mitigated with least‑privilege key use and strong algorithms.
- **Replay**: mitigated via TTL and timestamp in network envelope.
- **Data at rest**: mitigated by encrypted secure storage interfaces.
- **Proof forgery**: mitigated by Groth16/Bulletproofs/Schnorr verification.

## Roadmap (Known Gaps)

- Full native binding coverage in app runtimes.
- Hardware‑backed key storage (HSM/secure enclave) integration.
- Formalized key rotation policy and revocation registry.

## References

- `docs/architecture/cryptographic-verification.md`
- `docs/architecture/zkp-circuit-plan.md`
- `docs/packages/crypto.md`
- `docs/packages/security.md`
