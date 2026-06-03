---
title: 'Security Framework — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'security']
review_cycle: 'on-change'
---

---

title: 'Security Framework'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'

---

# Security Framework — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Cryptographic Security Engineer

The security posture of `gtcx-core`. Covers cryptographic primitives, storage security, ZKP capabilities, network controls, and operational safeguards.

---

## Scope

- Cryptographic primitives: `@gtcx/crypto`, `@gtcx/crypto-native`, `rust/gtcx-crypto`
- Secure storage and offline security: `@gtcx/security`
- Zero-knowledge proofs: `rust/gtcx-zkp` + TypeScript placeholder engine
- Network controls: rate limiting and topic allowlists in `@gtcx/network`

---

## Cryptographic Standards

| Primitive          | Algorithm                        | Package                            |
| ------------------ | -------------------------------- | ---------------------------------- |
| Digital signatures | Ed25519 (primary), Secp256k1     | `@gtcx/crypto`, `rust/gtcx-crypto` |
| Hashing            | SHA-256, SHA-512, Blake3         | `@gtcx/crypto`, `rust/gtcx-crypto` |
| Commitments        | Hash-commitment scheme           | `@gtcx/crypto`                     |
| Merkle proofs      | Build and verify                 | `@gtcx/crypto`                     |
| Secure storage     | AES-256-GCM (pluggable provider) | `@gtcx/security`                   |

**Rule:** All cryptographic implementations must use established, audited libraries. No custom primitives — ever. See ADR-001 and ADR-005.

---

## Key Management

- Keys are generated and stored as hex strings (Ed25519 or Secp256k1).
- Key IDs are deterministic fingerprints using `did:gtcx:<prefix>` format.
- Optional native backend via `@gtcx/crypto-native` — `GTCX_REQUIRE_NATIVE=true` must be set in production. Hard-fails if native module is unavailable.
- No key escrow or server-side key storage — keys are generated and held client-side.

---

## Zero-Knowledge Proofs

| Layer                         | Implementation            | Description                                                                                       |
| ----------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- |
| Rust (production proofs)      | `rust/gtcx-zkp`           | Groth16 (threshold/ownership/location), Bulletproofs (amount range), Schnorr (identity attribute) |
| TypeScript (development only) | `HashCommitmentZkpEngine` | Compatible API surface for dev/test until native bindings are wired                               |

The TypeScript ZKP engine must never be used in production. Any circuit change in `rust/gtcx-zkp` requires Cryptographic Security Engineer review.

---

## Secure Storage & Observability

`@gtcx/security` provides:

- Encrypted local storage with pluggable key derivation.
- Mandatory **Secret Sanitization**: All data entering tracing or logging paths must be processed via `sanitizeSecrets` to prevent cryptographic leakage.
- Managed **Revocation Registry**: Real-time revocation status checks for all signed credentials.

---

## Approved Cryptographic Libraries

| Library          | Use                 | Crate/Package      |
| ---------------- | ------------------- | ------------------ |
| ed25519-dalek    | Ed25519 signing     | `rust/gtcx-crypto` |
| sha2             | SHA-256/512         | `rust/gtcx-crypto` |
| blake3           | Blake3 hashing      | `rust/gtcx-crypto` |
| ark-groth16      | Groth16 ZKP         | `rust/gtcx-zkp`    |
| bulletproofs     | Bulletproofs        | `rust/gtcx-zkp`    |
| secp256k1 (k256) | Schnorr / Secp256k1 | `rust/gtcx-zkp`    |

Introducing a new cryptographic library requires: Cryptographic Security Engineer approval + ADR + human sign-off.

---

## Threat Model

| Threat         | Mitigation                                                         |
| -------------- | ------------------------------------------------------------------ |
| Key compromise | Least-privilege key use, strong algorithms, client-side generation |
| Replay attacks | TTL and timestamp in network envelope                              |
| Data at rest   | Encrypted secure storage via `@gtcx/security`                      |
| Proof forgery  | Groth16/Bulletproofs/Schnorr verification in production            |
| Supply chain   | Audited libraries only, `cargo audit`, dependency review gate      |

---

## Known Gaps (Roadmap)

- Full native binding coverage across all app runtimes
- Hardware-backed key storage (HSM/secure enclave) integration
- Formal key rotation policy

---

## Reference

- [`docs/decisions/001-rust-for-cryptography.md`](../decisions/001-rust-for-cryptography.md) — why Rust for crypto
- [`docs/decisions/005-ed25519-signing.md`](../decisions/005-ed25519-signing.md) — Ed25519 selection rationale
- [`docs/specs/packages/`](../specs/packages/) — crypto and security package specs
- [`docs/agents/roles/crypto-security-engineer.md`](../agents/roles/crypto-security-engineer.md) — gatekeeper role
- [`docs/agents/workflows/safety-rules.md`](../agents/workflows/safety-rules.md) — what requires human approval
