---
title: 'FIPS Hash Inventory — gtcx-core'
status: 'current'
date: '2026-06-02'
owner: 'gtcx-core'
role: 'crypto-security-engineer'
agent_id: 'agent://gtcx-core/2026-06-02/fips-hash-inventory'
trust_score: 75
autonomy_level: 'authorized'
tier: 'critical'
tags: ['documentation', 'security', 'fips', 'hash', 'inventory']
review_cycle: 'quarterly'
---

---

title: 'FIPS Hash Inventory'
status: 'current'
date: '2026-06-02'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security', 'fips', 'hash']
review_cycle: 'quarterly'

---

# FIPS Hash Inventory — gtcx-core

**Document ID:** GTCX-CORE-FIPS-HASH-001
**Version:** 1.0
**Date:** 2026-06-02
**Status:** Active
**Standard:** FIPS 180-4, FIPS 140-3

---

## 1. Purpose

This document inventories every hash call in the gtcx-core codebase and classifies each as either:

- **FIPS-approved** — SHA-256 or SHA-512 executed inside a validated cryptographic module boundary (OpenSSL FIPS Provider CMVP #4282, or AWS-LC CMVP #4816).
- **Supplementary** — BLAKE3, used for performance-critical paths where FIPS compliance is not required.

**Scope:** `packages/crypto/`, `rust/gtcx-crypto/`, `rust/gtcx-zkp/`

---

## 2. Inventory by Component

### 2.1 TypeScript — `packages/crypto/`

| Function            | File                  | Algorithm                | Backend                                 | FIPS Status  | Fallback when `GTCX_FIPS_MODE=1` |
| ------------------- | --------------------- | ------------------------ | --------------------------------------- | ------------ | -------------------------------- |
| `hash256`           | `src/hashing.ts`      | SHA-256                  | `@noble/hashes/sha256` or native crypto | **Approved** | Native `node:crypto` SHA-256     |
| `hash512`           | `src/hashing.ts`      | SHA-512                  | `@noble/hashes/sha512` or native crypto | **Approved** | Native `node:crypto` SHA-512     |
| `hash`              | `src/hashing.ts`      | SHA-256 / SHA-512        | `@noble/hashes/*` or native crypto      | **Approved** | Same algorithm via native crypto |
| `hashObject`        | `src/hashing.ts`      | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `doubleHash256`     | `src/hashing.ts`      | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `createCommitment`  | `src/hashing.ts`      | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `verifyCommitment`  | `src/hashing.ts`      | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `combineHashes`     | `src/hashing.ts`      | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `generateSalt`      | `src/hashing.ts`      | N/A (CSPRNG)             | `crypto.getRandomValues`                | **Approved** | OS CSPRNG (SP 800-90A)           |
| `buildMerkleTree`   | `src/proofs.ts`       | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `verifyMerkleProof` | `src/proofs.ts`       | SHA-256                  | `hash256` wrapper                       | **Approved** | SHA-256                          |
| `fipsSign`          | `src/fips-backend.ts` | SHA-256 (message digest) | `node:crypto`                           | **Approved** | N/A — already FIPS path          |
| `fipsVerify`        | `src/fips-backend.ts` | SHA-256 (message digest) | `node:crypto`                           | **Approved** | N/A — already FIPS path          |

**TypeScript BLAKE3 usage:** None in `packages/crypto/src/`. BLAKE3 is referenced in `src/fips.ts` as a **warned** algorithm (logs a FIPS warning if used), but no production code path in `packages/crypto/` calls BLAKE3. Downstream consumers (e.g., `@gtcx/crypto` consumers in other repos) may use BLAKE3 via direct `@noble/hashes/blake3` imports; those are outside this inventory.

---

### 2.2 Rust — `rust/gtcx-crypto/`

| Function           | File                       | Algorithm          | Backend Crate                     | FIPS Status       | Notes                                                                                                              |
| ------------------ | -------------------------- | ------------------ | --------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `sha256`           | `src/hashing/mod.rs`       | SHA-256            | `sha2` (RustCrypto)               | **Approved**      | Delegates to `sha2::Sha256`; when `--features fips` is enabled, AWS-LC path replaces this via provider abstraction |
| `sha512`           | `src/hashing/mod.rs`       | SHA-512            | `sha2` (RustCrypto)               | **Approved**      | Delegates to `sha2::Sha512`; same FIPS path as SHA-256                                                             |
| `blake3`           | `src/hashing/mod.rs`       | BLAKE3             | `blake3`                          | **Supplementary** | Not NIST-approved; disabled in FIPS mode                                                                           |
| `blake3_keyed`     | `src/hashing/mod.rs`       | BLAKE3 (keyed)     | `blake3`                          | **Supplementary** | MAC construction; not FIPS-approved                                                                                |
| `blake3_derive`    | `src/hashing/mod.rs`       | BLAKE3 (KDF)       | `blake3`                          | **Supplementary** | Key derivation; not FIPS-approved                                                                                  |
| `sign` (Ed25519)   | `src/signing/ed25519.rs`   | SHA-512 (internal) | `ed25519-dalek` / `sha2`          | **Approved**      | Ed25519 uses SHA-512 internally; FIPS 186-5 approved algorithm                                                     |
| `sign` (P-256)     | `src/signing/p256.rs`      | SHA-256            | `aws-lc-rs` (with `fips` feature) | **Approved**      | CMVP #4816 validated                                                                                               |
| `sign` (secp256k1) | `src/signing/secp256k1.rs` | SHA-256            | `k256` / `sha2`                   | **Approved**      | ECDSA with SHA-256; FIPS 186-4 approved                                                                            |

**Rust FIPS feature flag:**

- Default: `ed25519-dalek` + `sha2` (not independently CMVP-validated, but uses FIPS-approved algorithms).
- `--features fips`: `aws-lc-rs` backend (CMVP #4816) for all signing and hashing.

---

### 2.3 Rust — `rust/gtcx-zkp/`

| Function / Gadget            | File                 | Algorithm             | Backend Crate                      | FIPS Status       | Notes                                                     |
| ---------------------------- | -------------------- | --------------------- | ---------------------------------- | ----------------- | --------------------------------------------------------- |
| `sha256_digest`              | `src/utils.rs`       | SHA-256               | `ark-crypto-primitives` (`Sha256`) | **Approved**      | Used for commitment pre-computation outside the circuit   |
| `Sha256Gadget::evaluate`     | `src/groth16/mod.rs` | SHA-256 (R1CS gadget) | `ark-crypto-primitives`            | **Approved**      | SHA-256 constraints inside Groth16 circuits               |
| `PathVar::verify_membership` | `src/groth16/mod.rs` | SHA-256 (Merkle path) | `ark-crypto-primitives`            | **Approved**      | Merkle tree uses `Sha256Gadget` for leaf and inner hashes |
| `commit`                     | `src/commitment.rs`  | BLAKE3                | `blake3`                           | **Supplementary** | Lightweight hash-commitment proofs (non-Groth16 fallback) |
| `generate_proof`             | `src/commitment.rs`  | BLAKE3                | `blake3`                           | **Supplementary** | Hash-commitment baseline proofs                           |

**Note on ZKP FIPS status:** Groth16 proof generation and verification are not FIPS-applicable (no NIST standard exists). The SHA-256 gadgets inside the circuits are FIPS-approved algorithms, but the proof system itself is outside the CMVP boundary. See [FIPS Validation Boundary Statement](../security/fips-validation-boundary.md).

---

## 3. Algorithm Summary

| Algorithm | TypeScript Paths                                   | Rust Paths (`gtcx-crypto`)                               | Rust Paths (`gtcx-zkp`)                            | Overall Classification |
| --------- | -------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------- | ---------------------- |
| SHA-256   | `hash256`, Merkle trees, commitments, FIPS backend | `sha256`, Ed25519 internal, P-256 ECDSA, secp256k1 ECDSA | Circuit gadgets, Merkle constraints, digest helper | **FIPS-approved**      |
| SHA-512   | `hash512`                                          | `sha512`, Ed25519 internal                               | —                                                  | **FIPS-approved**      |
| BLAKE3    | None (warned only)                                 | `blake3`, `blake3_keyed`, `blake3_derive`                | `commit`, `generate_proof` (hash-commitment)       | **Supplementary**      |

---

## 4. Fallback Behavior

### 4.1 TypeScript Path (`packages/crypto/`)

When `GTCX_FIPS_MODE=true`:

1. `isFipsMode()` returns `true` (reads `GTCX_FIPS_MODE` env var).
2. `fipsWarn('Blake3', 'SHA-256')` fires if any downstream code attempts BLAKE3.
3. All `hash256` / `hash512` calls route through `node:crypto` when native bindings are available, executing inside the OpenSSL FIPS provider boundary (CMVP #4282).
4. No BLAKE3 fallback exists in `packages/crypto/` itself.

**Activation:**

```bash
GTCX_FIPS_MODE=true node --enable-fips app.js
```

### 4.2 Rust Path (`rust/gtcx-crypto/`)

When compiled with `--features fips`:

1. `AwsLcSigningProvider` and `AwsLcHashProvider` are selected at compile time.
2. All SHA-256 / SHA-512 operations execute inside AWS-LC (CMVP #4816).
3. BLAKE3 functions remain available but are **not** routed through AWS-LC; they continue to use the `blake3` crate.
4. Regulatory deployments must ensure callers do not use `blake3()` when FIPS compliance is required.

**Activation:**

```bash
cargo build -p gtcx-crypto --features fips
cargo test -p gtcx-crypto --features fips --lib
```

### 4.3 Performance Mode (Default)

When FIPS mode is **not** active:

- TypeScript: SHA-256 via `@noble/hashes/sha256` (pure JS, fast) or native crypto if available.
- Rust: SHA-256 via `sha2` crate; BLAKE3 via `blake3` crate.
- BLAKE3 is used for hash-commitment proofs and any downstream performance-critical hashing.

---

## 5. Deployment Guidance

| Requirement                 | Configuration                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------- |
| FIPS-compliant hashing only | `GTCX_FIPS_MODE=true` (TS) or `--features fips` (Rust)                                  |
| Maximum performance         | Default mode; BLAKE3 permitted for non-regulatory paths                                 |
| Mixed deployment            | Use SHA-256 for all on-chain / regulatory data; BLAKE3 for off-chain caching / indexing |

---

## 6. Change Log

| Date       | Change            |
| ---------- | ----------------- |
| 2026-06-02 | Initial inventory |

---

## References

- [FIPS Validation Boundary Statement](../security/fips-validation-boundary.md)
- `packages/crypto/src/hashing.ts`
- `packages/crypto/src/fips.ts`
- `packages/crypto/src/fips-backend.ts`
- `packages/crypto/src/proofs.ts`
- `rust/gtcx-crypto/src/hashing/mod.rs`
- `rust/gtcx-zkp/src/utils.rs`
- `rust/gtcx-zkp/src/groth16/mod.rs`
- `rust/gtcx-zkp/src/commitment.rs`
