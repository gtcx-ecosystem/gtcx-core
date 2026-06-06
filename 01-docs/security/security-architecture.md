---
title: 'Security Architecture — gtcx-core'
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

title: 'Security Architecture'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'

---

# Security Architecture — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Cryptographic Security Engineer

**Security level:** Critical
**Compliance requirements:** Internal GTCX security framework (P1 Proof, P2 Private, P4 Immutable, P11 Secure)
**Risk tolerance:** Zero for cryptographic correctness; Low for operational controls
**Last security review:** 2026-03-08

---

## Scope

This document covers the security architecture of `gtcx-core` as a library. It does not cover network perimeter, WAF, or infrastructure-level controls — those belong to the consuming service's security posture. What it covers:

- Cryptographic correctness and algorithm selection
- Key management design
- Zero-knowledge proof security properties
- Secure offline storage
- Supply chain controls
- Library consumer security obligations

---

## Security Architecture

`gtcx-core` is a cryptographic library, not a service. Its threat model is fundamentally different from a deployed application. The security boundary is: **correct cryptographic operations delivered to consumers with no introduction of vulnerabilities through the library itself**.

```
┌─────────────────────────────────────────────────────────┐
│   Consumer Application Security (consumer's concern)    │
│   Auth, transport security, secrets management          │
├─────────────────────────────────────────────────────────┤
│   API Surface Integrity (gtcx-core's concern)           │
│   No breaking changes, API surface tracked + reviewed   │
├─────────────────────────────────────────────────────────┤
│   Cryptographic Correctness (gtcx-core's concern)       │
│   Audited libraries only, no custom primitives          │
├─────────────────────────────────────────────────────────┤
│   Key Management Design (gtcx-core's concern)           │
│   Client-side generation, no escrow, deterministic IDs  │
├─────────────────────────────────────────────────────────┤
│   Zero-Knowledge Proof Integrity (gtcx-core's concern)  │
│   Rust production proofs; TypeScript dev-only fallback  │
├─────────────────────────────────────────────────────────┤
│   Supply Chain (shared concern)                         │
│   Audited libraries, cargo audit, dependency gates      │
└─────────────────────────────────────────────────────────┘
```

---

## Cryptographic Standards

All cryptographic operations use established, audited libraries. No custom primitives — ever. This is an absolute rule enforced by ADR and requires Cryptographic Security Engineer approval to change.

| Primitive          | Algorithm                    | Implementation                        |
| ------------------ | ---------------------------- | ------------------------------------- |
| Digital signatures | Ed25519 (primary)            | `ed25519-dalek` in `rust/gtcx-crypto` |
| Digital signatures | Secp256k1 (secondary)        | `k256` in `rust/gtcx-zkp`             |
| Hashing            | SHA-256, SHA-512             | `sha2` in `rust/gtcx-crypto`          |
| Hashing            | Blake3                       | `blake3` in `rust/gtcx-crypto`        |
| Commitments        | Hash-commitment scheme       | `@gtcx/crypto`                        |
| Merkle proofs      | Build and verify             | `@gtcx/crypto`                        |
| ZKP — Groth16      | Threshold/ownership/location | `bellman` in `rust/gtcx-zkp`          |
| ZKP — Bulletproofs | Amount range proofs          | `bulletproofs` in `rust/gtcx-zkp`     |
| ZKP — Schnorr      | Identity attribute proofs    | `k256/schnorr` in `rust/gtcx-zkp`     |
| Secure storage     | AES-256-GCM                  | `@gtcx/security` (pluggable provider) |

---

## Key Management Design

### Principles

- Keys are generated and stored entirely client-side. No server-side key storage.
- No key escrow — there is no recovery mechanism through gtcx-core.
- Key IDs are deterministic fingerprints in `did:gtcx:<prefix>` format.
- Ed25519 and Secp256k1 keys are stored as hex strings.

### Native vs. fallback

```
Production:  GTCX_REQUIRE_NATIVE=true
             → @gtcx/crypto-native loads Rust module (gtcx-node → gtcx-crypto)
             → Hard fails if native module unavailable

Development: GTCX_REQUIRE_NATIVE unset
             → Falls back to TypeScript crypto engine
             → Acceptable for dev/test; never acceptable in production
```

### Key lifecycle (consumer responsibility)

gtcx-core provides the primitives. Consumers are responsible for:

- Secure storage of private key material (use `@gtcx/security` encrypted storage)
- Key rotation scheduling
- Revocation logic (roadmap item — no revocation registry yet; see Known Gaps)

---

## Zero-Knowledge Proof Security

### Production proofs (Rust)

| Circuit type    | Proof system | Use case                                               |
| --------------- | ------------ | ------------------------------------------------------ |
| Threshold proof | Groth16      | Prove quantity above threshold without revealing value |
| Ownership proof | Groth16      | Prove ownership of a key without exposing it           |
| Location proof  | Groth16      | Prove geographic attestation with privacy              |
| Range proof     | Bulletproofs | Prove a value is within a numeric range                |
| Attribute proof | Schnorr      | Prove identity attribute without full disclosure       |

Any circuit change in `rust/gtcx-zkp` requires:

1. Cryptographic Security Engineer review
2. Human sign-off before merge
3. ADR update if the change affects proof compatibility

### Development fallback (TypeScript)

`HashCommitmentZkpEngine` provides a compatible API surface for local development and unit testing. It does not provide zero-knowledge guarantees. It must never be used in production. This is enforced by the `GTCX_REQUIRE_NATIVE=true` gate.

---

## Secure Offline Storage

`@gtcx/security` provides:

- AES-256-GCM encryption (pluggable provider interface)
- Key derivation hooks (consumer implements the KDF)
- Lock/unlock flow for credential stores
- Encrypted persistence for offline queues and credentials

Security obligations for consumers using `@gtcx/security`:

- Derive encryption keys from user-controlled secrets
- Never store the derived encryption key alongside the encrypted data
- Implement lock behavior on session timeout or device sleep

---

## Approved Cryptographic Libraries

Introducing a new cryptographic library requires: Cryptographic Security Engineer approval + ADR + human sign-off.

| Library       | Use                 | Location           |
| ------------- | ------------------- | ------------------ |
| ed25519-dalek | Ed25519 signing     | `rust/gtcx-crypto` |
| sha2          | SHA-256 / SHA-512   | `rust/gtcx-crypto` |
| blake3        | Blake3 hashing      | `rust/gtcx-crypto` |
| bellman       | Groth16 ZKP         | `rust/gtcx-zkp`    |
| bulletproofs  | Range proofs        | `rust/gtcx-zkp`    |
| k256          | Schnorr / Secp256k1 | `rust/gtcx-zkp`    |

---

## Threat Model

| Threat                  | Mitigation                                                                        |
| ----------------------- | --------------------------------------------------------------------------------- |
| Key compromise          | Client-side generation only; no server key storage; strong algorithms             |
| Replay attacks          | TTL and timestamp in network envelope (`@gtcx/network`)                           |
| Proof forgery           | Groth16/Bulletproofs/Schnorr in production; TypeScript engine blocked by env flag |
| Algorithm downgrade     | No custom primitives; audited libraries only; ADR gates any change                |
| Data at rest            | AES-256-GCM via `@gtcx/security`; consumer controls KDF                           |
| Supply chain compromise | Audited libraries only; `cargo audit` in CI weekly; dependency review gate        |
| API surface regression  | `quality/api-surface-baseline.json` tracked; `pnpm api:check` CI gate             |
| Boundary violation      | `pnpm architecture:check` CI gate; no circular deps; strict layer ordering        |

---

## Supply Chain Controls

| Gate                    | Command                                                       | Schedule   |
| ----------------------- | ------------------------------------------------------------- | ---------- |
| Rust dependency audit   | `cargo audit`                                                 | Weekly CI  |
| npm dependency audit    | `npm audit` via pnpm                                          | Weekly CI  |
| Security threat matrix  | `pnpm security:threat-matrix`                                 | Every PR   |
| New crypto library gate | Cryptographic Security Engineer review + ADR + human approval | Per change |

---

## Security-Sensitive Packages

Changes to these packages require Cryptographic Security Engineer review and human approval before merge:

| Package               | Sensitive area                                       |
| --------------------- | ---------------------------------------------------- |
| `@gtcx/crypto`        | Signing, hashing, ZKP engine, commitments            |
| `@gtcx/crypto-native` | Native binding loader — determines which engine runs |
| `@gtcx/security`      | Auth, AES-256-GCM storage, audit logging             |
| `@gtcx/verification`  | Certificate chains, proof bundle assembly            |
| `@gtcx/identity`      | DID creation, credential management, key lifecycle   |
| `rust/gtcx-crypto`    | Ed25519, SHA-256/512, Blake3 — core primitives       |
| `rust/gtcx-zkp`       | Groth16, Bulletproofs, Schnorr circuits              |

---

## Known Gaps (Roadmap)

- Full native binding coverage across all app runtimes (in progress)
- Hardware-backed key storage (HSM / secure enclave) integration
- Formalized key rotation policy and revocation registry
- DID resolution and revocation endpoint

---

## Reference

- [Security Framework](security-framework.md) — cryptographic standards in detail
- [`01-docs/decisions/`](../decisions/) — ADRs for crypto decisions
- [`01-docs/01-agents/roles/crypto-security-engineer.md`](../agents/roles/crypto-security-engineer.md) — gatekeeper role
- [`01-docs/01-agents/workflows/safety-rules.md`](../agents/workflows/safety-rules.md) — what requires human approval
- [`01-docs/specs/03-platform/packages/`](../specs/03-platform/packages/) — crypto and security package specs
