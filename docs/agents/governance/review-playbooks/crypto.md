---
title: "Crypto Review Playbook"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agents"]
review_cycle: "on-change"
---

---
title: 'Crypto'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'
---

# Crypto Review Playbook

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Version:** 1.0.0
**Applies to:** `packages/crypto/`, `packages/crypto-native/`, `rust/gtcx-crypto/`, `rust/gtcx-zkp/`
**Owner role:** `docs/agents/roles/crypto-security-engineer.md`

The bot applies every check in this playbook to the diff. Each check states the rule, the violation pattern to scan for, the schema category, and the severity.

---

## 1. No custom cryptographic primitives

**Rule:** Cryptographic primitives — block ciphers, hash functions, signature schemes, AEADs, KDFs, ZKP circuits — must be imported from approved audited libraries. Custom implementations are forbidden.

**Approved sources:**

- TypeScript: `@noble/curves`, `@noble/hashes`, `@noble/ed25519`, Node `node:crypto`, Web Crypto API
- Rust: `ed25519-dalek`, `sha2`, `blake3`, `secp256k1`, `aws-lc-rs` (FIPS), `rand_chacha`, `arkworks-*`, `bulletproofs`

**Violation pattern:**

- New file in `packages/crypto/src/` containing bitwise rotation operations on raw bytes
- New `fn` in `rust/gtcx-crypto/src/` implementing constraint construction or polynomial arithmetic outside the approved arkworks crates
- Inline implementations of HKDF, HMAC, PBKDF2 instead of imports

**Category:** `cryptographic-correctness`
**Severity:** `critical`
**References:** `docs/decisions/001-rust-for-cryptography.md`, `docs/decisions/005-ed25519-signing.md`

---

## 2. `Math.random()` ban in source

**Rule:** `Math.random()` must never appear in `packages/*/src/`. Use `crypto.randomBytes` (Node) or `crypto.getRandomValues` (Web Crypto). Test files are exempt; ESLint already enforces this in `eslint.config.js` `no-restricted-properties`.

**Violation pattern:**

- Diff adds `Math.random()` in any file under `packages/*/src/`
- Diff weakens the ESLint `no-restricted-properties` rule

**Category:** `cryptographic-correctness`
**Severity:** `critical`

---

## 3. Constant-time comparison for sensitive equality

**Rule:** Equality comparisons of secrets, signatures, MACs, tokens, or any output of a cryptographic primitive must use a constant-time comparison routine. TypeScript: `secureCompare` from `@gtcx/security`. Rust: `subtle::ConstantTimeEq`.

**Violation pattern:**

- New `===`, `==`, `!==`, `!=` in `packages/crypto/src/`, `packages/security/src/`, `packages/verification/src/` comparing `Uint8Array`, `Buffer`, signature variables, or hex-string variables that hold cryptographic outputs
- New `if a == b` in `rust/gtcx-crypto/` comparing `&[u8]` or signature/key types where the import of `subtle` or `ConstantTimeEq` is missing

**Category:** `constant-time`
**Severity:** `high`

---

## 4. Domain separation on hash usage

**Rule:** Every distinct use of a hash function must use a domain-separation prefix. Mixing hash inputs across domains enables cross-protocol attacks.

**Violation pattern:**

- Diff adds `hash256(input)` where `input` is a raw caller-supplied value with no domain prefix string
- Diff adds `Sha256::digest(bytes)` in Rust where `bytes` is not preceded by a domain tag
- Diff removes a domain prefix from existing code

**Category:** `domain-separation`
**Severity:** `high`
**References:** `docs/security/threat-model.md` (TC-002)

---

## 5. ZKP TS fallback boundary preserved

**Rule:** `HashCommitmentZkpEngine` in `packages/crypto/src/zkp.ts` is a placeholder, not a ZK proof system. Its presence is acceptable only with the `fipsWarn()` call, the placeholder warning comment, and (post-Sprint 2) the default-throw behavior unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1` is set.

**Violation pattern:**

- Diff modifies `packages/crypto/src/zkp.ts` and removes any of: `fipsWarn()` call, `WARNING: This engine does NOT provide zero-knowledge proofs` comment block, the env-flag guard
- Diff exports `HashCommitmentZkpEngine` from a higher-level package (e.g., `@gtcx/verification`)
- Diff renames the engine to remove the `Placeholder` / `HashCommitment` qualifier

**Category:** `cryptographic-correctness`
**Severity:** `critical`
**References:** SA-002 (`,auto-dev-state.md`)

---

## 6. FIPS provider trait stability

**Rule:** The `SigningProvider`, `HashProvider`, and `KeyStore` traits in `rust/gtcx-crypto/src/provider/mod.rs` and `keystore.rs` are public API. Adding methods is a breaking change requiring a major version bump in the crate's Cargo.toml + an entry in the API surface baseline.

**Violation pattern:**

- Diff adds a method to `SigningProvider`, `HashProvider`, or `KeyStore` without `default fn` body
- Diff changes signature of an existing trait method
- Diff removes a trait method
- None of: Cargo.toml major-version bump, changeset entry

**Category:** `api-surface-drift`
**Severity:** `high`
**References:** `docs/decisions/013-api-baseline-and-performance-budget-gates.md`

---

## 7. `unsafe` Rust requires `// SAFETY:` comment

**Rule:** All crates enforce `#![deny(unsafe_code)]` at the lib.rs level (CI gate `Verify deny(unsafe_code)`). Any PR that introduces an `#![allow(unsafe_code)]` exception must accompany every `unsafe { ... }` block with a `// SAFETY:` comment within 3 lines above explaining the invariant.

**Violation pattern:**

- Diff adds `#![allow(unsafe_code)]` or removes `#![deny(unsafe_code)]`
- Diff adds an `unsafe { ... }` block with no `// SAFETY:` comment in the preceding 3 lines

**Category:** `cryptographic-correctness`
**Severity:** `critical`

---

## 8. Fuzz coverage for new public crypto entry points

**Rule:** Every new public function in `rust/gtcx-crypto/src/` that takes attacker-controlled bytes (signatures, keys, messages, hash inputs, ZKP proof bytes) requires a corresponding fuzz target in `rust/gtcx-crypto/fuzz/fuzz_targets/`.

**Violation pattern:**

- Diff adds a `pub fn` in `rust/gtcx-crypto/src/` that accepts `&[u8]` and is not exclusively used in test-only contexts
- Diff does not add a corresponding `fuzz_targets/fuzz_<name>.rs` and does not extend an existing target to cover the new entry point

**Category:** `fuzz-coverage-gap`
**Severity:** `high`
**References:** `quality/fuzz-results/campaign-summary.md`

---

## 9. Threat model delta required for crypto-surface changes

**Rule:** Any diff touching `packages/crypto/src/`, `packages/crypto-native/src/`, `rust/gtcx-crypto/src/`, or `rust/gtcx-zkp/src/` requires a corresponding update to `docs/security/threat-model.md` — either a new STRIDE row, a modification to an existing mitigation, or an explicit reviewer note in the PR description stating "no threat-model change because <reason>".

**Violation pattern:**

- Diff modifies a crypto-surface file
- Diff does not modify `docs/security/threat-model.md`
- PR description does not contain "no threat-model change" with rationale

**Category:** `threat-model-drift`
**Severity:** `medium`

---

## 10. NIST algorithm mapping kept current

**Rule:** Adding a new cryptographic algorithm (a new signing scheme, hash, KEM, or KDF) requires updating the algorithm-mapping table in `docs/security/fips-validation-boundary.md`.

**Violation pattern:**

- Diff adds support for a new algorithm name (regex match in code: `Ed448`, `Falcon`, `ML-DSA`, `Kyber`, `BLAKE2`, etc.)
- Diff does not modify `docs/security/fips-validation-boundary.md`

**Category:** `fips-boundary`
**Severity:** `medium`

---

## 11. Test vectors for new signing/verifying functions

**Rule:** New signing or verification functions must include at least one RFC-derived or NIST CAVP-derived test vector in the test suite.

**Violation pattern:**

- Diff adds a new `pub fn sign` or `pub fn verify` in `rust/gtcx-crypto/src/`
- No corresponding test in `rust/gtcx-crypto/tests/` or `#[cfg(test)] mod tests` with hardcoded byte arrays
- No comment referencing an RFC or NIST CAVP source

**Category:** `test-vector-missing`
**Severity:** `high`

---

## 12. Approved-source dependency rule for new crypto crates

**Rule:** Adding a new dependency in `rust/gtcx-crypto/Cargo.toml` or `packages/crypto/package.json` is permitted only for crates on the approved list (Check 1). Any other crypto-related dependency requires an ADR.

**Violation pattern:**

- Diff adds a `[dependencies]` entry in a crypto crate's Cargo.toml that is not on the approved list and is crypto-related (regex hints: `aes`, `sha`, `signature`, `curve`, `hash`, `merkle`, `proof`, `zk`, `commit`)
- Diff adds a TS package dep with similar regex hits
- No new ADR in `docs/decisions/` introducing the dependency

**Category:** `supply-chain`
**Severity:** `high`

---

## Severity-to-decision mapping

Per the system prompt, any single `critical` finding or any `cryptographic-correctness`, `fips-boundary`, `revocation-path`, or `supply-chain` finding triggers `decision=REQUEST_CHANGES`. Two or more `high` findings also trigger `REQUEST_CHANGES`. Otherwise the bot emits `COMMENT`.

## Changelog

- **1.0.0** (2026-05-09) — Initial 12 checks covering crypto-correctness, supply chain, threat model delta, fuzz coverage, and FIPS boundary.
