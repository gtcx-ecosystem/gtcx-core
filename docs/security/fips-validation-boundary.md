---
title: 'FIPS 140-3 Validation Boundary Statement — gtcx-core'
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

title: 'Fips Validation Boundary'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'

---

# FIPS 140-3 Validation Boundary Statement — gtcx-core

**Document ID:** GTCX-CORE-FIPS-BOUNDARY-001
**Version:** 1.0
**Date:** 2026-05-08
**Status:** Active
**Standard:** FIPS 140-3, NIST SP 800-140

---

## 1. Boundary Definition

gtcx-core is a **cryptographic library**, not a cryptographic module. Per NIST SP 800-140B, the FIPS 140-3 validation boundary is drawn around the **cryptographic module** — the component that performs the approved security functions. gtcx-core does not implement its own cryptographic primitives; it delegates to FIPS-validated modules provided by the platform.

**gtcx-core inherits FIPS validation from its underlying cryptographic providers. It does not require independent CMVP certification.**

---

## 2. Validated Cryptographic Providers

### 2.1 TypeScript Path (Node.js)

| Component                 | CMVP Certificate | Validation Level   | Algorithms                                        |
| ------------------------- | ---------------- | ------------------ | ------------------------------------------------- |
| OpenSSL 3.x FIPS Provider | #4282            | FIPS 140-3 Level 1 | AES, SHA-2, ECDSA (P-256, P-384), RSA, HMAC, DRBG |

**Activation:** Node.js `--enable-fips` flag or `--openssl-config` pointing to a FIPS-enabled OpenSSL configuration.

**gtcx-core integration:** When `GTCX_FIPS_MODE=true`:

- `@gtcx/crypto` routes key generation through `node:crypto.generateKeyPairSync('ec', { namedCurve: 'P-256' })`
- Signing uses `node:crypto.sign('SHA256', data, privateKey)`
- Verification uses `node:crypto.verify('SHA256', data, publicKey, signature)`
- Hashing uses only SHA-256/SHA-512 (BLAKE3 disabled)
- All operations execute within the OpenSSL FIPS provider boundary

**Implementation:** `packages/crypto/src/fips-backend.ts`

### 2.2 Rust Path (Planned)

| Component          | CMVP Certificate | Validation Level   | Algorithms                                                |
| ------------------ | ---------------- | ------------------ | --------------------------------------------------------- |
| AWS-LC (aws-lc-rs) | #4816            | FIPS 140-3 Level 1 | AES-GCM, SHA-2, ECDSA (P-256, P-384), Ed25519, HMAC, HKDF |

**Activation:** Compile `gtcx-crypto` with `--features fips` to select the aws-lc-rs backend.

**Integration design:**

- A `SigningProvider` trait abstracts over `ed25519-dalek` (default) and `aws-lc-rs` (FIPS)
- Feature flag at compile time selects the provider — no runtime overhead
- Public API signatures do not change; the abstraction is internal

**Status:** Implementation complete (Sprint 2 task 5). `AwsLcSigningProvider` and `AwsLcHashProvider` ship in `rust/gtcx-crypto/src/provider/aws_lc.rs` behind `#[cfg(feature = "fips")]`. CI runs `cargo test -p gtcx-crypto --features fips --lib` on every PR. An interop test (`fips_signing_interop_with_dalek`) verifies that signatures produced by either backend verify under the other — wire format compatibility is enforced, not assumed.

**Algorithm coverage in the FIPS backend:**

- Ed25519 signing → FIPS-validated via aws-lc-rs (CMVP #4816)
- SHA-256 → FIPS-validated via aws-lc-rs
- SHA-512 → FIPS-validated via aws-lc-rs
- BLAKE3 → falls through to the `blake3` crate; **not** FIPS-approved at any module level. Consumers in regulatory paths must use SHA-256, not BLAKE3, even with `--features fips` enabled.

---

## 3. Algorithm Mapping

| gtcx-core Operation     | Default Backend               | FIPS Backend                         | FIPS-Approved?          |
| ----------------------- | ----------------------------- | ------------------------------------ | ----------------------- |
| Ed25519 signing         | @noble/curves / ed25519-dalek | P-256 ECDSA via OpenSSL / aws-lc-rs  | Yes (P-256 ECDSA)       |
| Secp256k1 signing       | @noble/curves / k256          | P-256 ECDSA via OpenSSL / aws-lc-rs  | Yes (P-256 ECDSA)       |
| SHA-256 hashing         | @noble/hashes / sha2          | OpenSSL SHA-256 / aws-lc sha2        | Yes                     |
| SHA-512 hashing         | @noble/hashes / sha2          | OpenSSL SHA-512 / aws-lc sha2        | Yes                     |
| BLAKE3 hashing          | @noble/hashes / blake3        | **Disabled** (falls back to SHA-256) | N/A (not NIST-approved) |
| Key generation (CSPRNG) | Web Crypto / OsRng            | OpenSSL DRBG / aws-lc DRBG           | Yes                     |
| AES-256-GCM encryption  | node:crypto / ring            | OpenSSL AES-GCM / aws-lc AES-GCM     | Yes                     |

### 3.1 Ed25519 in FIPS Mode

Ed25519 is listed in FIPS 186-5 (2023) as an approved digital signature algorithm. However, not all CMVP-validated modules include Ed25519 in their validation scope.

- **OpenSSL 3.x FIPS Provider (CMVP #4282):** Does NOT include Ed25519. gtcx-core uses P-256 ECDSA as the FIPS alternative.
- **AWS-LC (CMVP #4816):** DOES include Ed25519 in its validation scope. When the Rust `fips` feature is enabled, Ed25519 signatures are FIPS-validated through aws-lc-rs.

**Recommendation:** Use the Rust path with aws-lc-rs for deployments requiring FIPS-validated Ed25519. Use the TypeScript path with P-256 for deployments where P-256 is acceptable.

---

## 4. ZKP Exemption

Zero-knowledge proof operations (Groth16, Bulletproofs, Schnorr) have **no FIPS standard**. These operations are mathematically sound but cannot be FIPS-validated because no CMVP testing methodology exists for ZKP circuits.

**gtcx-core's position:**

- ZKP circuits use FIPS-approved hash functions (SHA-256) as internal components
- The proof generation/verification logic itself is not FIPS-applicable
- Downstream deployments requiring FIPS compliance should document this exemption in their system security plan

**Relevant NIST guidance:** NIST SP 800-175B Section 4.3 — "Organizations should document the use of non-approved algorithms and the associated risk acceptance."

---

## 5. For the Information System Security Officer (ISSO)

**Pre-written paragraph for inclusion in system security plans:**

> The gtcx-core cryptographic library delegates all FIPS-applicable security functions to platform-level cryptographic modules with active CMVP certificates. In TypeScript environments, the OpenSSL 3.x FIPS Provider (CMVP #4282) is activated via Node.js `--enable-fips` and the `GTCX_FIPS_MODE=true` environment variable. In Rust environments, the AWS-LC cryptographic module (CMVP #4816) is selected at compile time via the `fips` feature flag. All key generation, signing, verification, and hashing operations in FIPS mode execute within the validated module boundary. Zero-knowledge proof operations use FIPS-approved hash functions internally but are themselves exempt from FIPS validation as no applicable standard exists. The library does not implement custom cryptographic primitives; `#![deny(unsafe_code)]` is enforced across all Rust crates.

---

## 6. Deployment Checklist

For deployments requiring FIPS compliance:

- [ ] Set `GTCX_FIPS_MODE=true` in environment
- [ ] Run Node.js with `--enable-fips` flag (TypeScript path)
- [ ] Or compile Rust crates with `--features fips` (Rust path)
- [ ] Set `GTCX_REQUIRE_NATIVE=true` to enforce Rust crypto backend
- [ ] Verify FIPS mode activation: `isFipsMode()` returns `true`
- [ ] Document ZKP exemption in system security plan
- [ ] Verify CMVP certificates are still active (check NIST CMVP database)
- [ ] Record FIPS deployment configuration in change management system

---

## Appendix: CMVP Certificate References

| Module                    | Certificate | Status | URL                                                                                     |
| ------------------------- | ----------- | ------ | --------------------------------------------------------------------------------------- |
| OpenSSL 3.x FIPS Provider | #4282       | Active | https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4282 |
| AWS-LC                    | #4816       | Active | https://csrc.nist.gov/projects/cryptographic-module-validation-program/certificate/4816 |

---

## References

- FIPS 140-3 — Security Requirements for Cryptographic Modules
- FIPS 186-5 — Digital Signature Standard (DSS)
- NIST SP 800-140 — FIPS 140-3 Derived Test Requirements
- NIST SP 800-175B — Guideline for Using Cryptographic Standards
- [FIPS Assessment](./fips-assessment.md) — detailed assessment and implementation roadmap
- [Security Framework](./security-framework.md) — security architecture overview
