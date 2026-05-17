---
title: 'Fips Assessment'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# FIPS 140-2/3 Cryptographic Assessment — gtcx-core

**Version:** 1.0.0
**Date:** 2026-05-06
**Reviewer:** Security Engineering
**Status:** Assessment Complete — Pathway Defined

---

## Summary

gtcx-core uses cryptographic primitives across 18 public TypeScript packages, 4 shared config workspace packages, and 6 Rust crates. This assessment inventories all cryptographic operations, classifies their FIPS 140-2/3 validation status, and defines the pathway to full FIPS compliance for government deployment.

**Current status:** Partially compliant. FIPS-validated alternatives exist for all critical operations except zero-knowledge proofs.

---

## Cryptographic Inventory

### FIPS-Validated Operations (Ready)

| Operation  | Algorithm       | Standard   | Library (TS)                | Library (Rust)   | Status    |
| ---------- | --------------- | ---------- | --------------------------- | ---------------- | --------- |
| Hashing    | SHA-256         | FIPS 180-4 | @noble/hashes 1.8.0         | sha2 0.10        | Validated |
| Hashing    | SHA-512         | FIPS 180-4 | @noble/hashes 1.8.0         | sha2 0.10        | Validated |
| Hashing    | SHAKE-256       | FIPS 202   | node:crypto                 | N/A              | Validated |
| Signing    | ECDSA/secp256k1 | FIPS 186-4 | @noble/curves 1.9.0         | k256 0.13        | Validated |
| RNG        | OS CSPRNG       | SP 800-90A | node:crypto                 | rand 0.8 (OsRng) | Validated |
| Comparison | Constant-time   | N/A        | node:crypto timingSafeEqual | ed25519-dalek    | Validated |

### Non-FIPS Operations (Alternatives Available)

| Operation         | Current Algorithm  | FIPS Alternative                                | Migration Path                                                                          | Effort |
| ----------------- | ------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------- | ------ |
| Signing (primary) | Ed25519 (RFC 8032) | Secp256k1 ECDSA (FIPS 186-4)                    | Make Secp256k1 the default for FIPS mode; Ed25519 remains for non-FIPS contexts         | S      |
| Key derivation    | Blake3 KDF         | HKDF-SHA256 (SP 800-56C) or PBKDF2 (SP 800-132) | Add FIPS KDF alongside Blake3; select via config flag                                   | M      |
| Fast hashing      | Blake3             | SHA-256                                         | Already dual-implemented; Blake3 used for performance, SHA-256 used everywhere critical | XS     |

### Non-FIPS Operations (No Alternative)

| Operation          | Algorithm                   | Library                     | FIPS Status             | Rationale                                                   |
| ------------------ | --------------------------- | --------------------------- | ----------------------- | ----------------------------------------------------------- |
| ZKP (SNARK)        | Groth16 over BN254          | arkworks 0.4                | No FIPS standard exists | Cutting-edge; NIST post-quantum standardization in progress |
| ZKP (range proofs) | Bulletproofs over Ristretto | bulletproofs 5.0            | No FIPS standard exists | Research-grade protocol                                     |
| ZKP (identity)     | Schnorr identity proofs     | arkworks + curve25519-dalek | No FIPS standard exists | Research-grade protocol                                     |

---

## FIPS Compliance Pathway

### Phase 1: FIPS Mode Flag (2-4 weeks)

Add a `GTCX_FIPS_MODE` environment variable that, when set:

1. **Signing**: Uses Secp256k1 ECDSA instead of Ed25519 as default algorithm
2. **Hashing**: Uses SHA-256 exclusively (Blake3 disabled)
3. **Key derivation**: Uses HKDF-SHA256 instead of Blake3 KDF
4. **RNG**: Verified OS CSPRNG only (already the case)
5. **ZKP**: Logs a warning that ZKP operations are not FIPS-validated

No code paths change for non-FIPS deployments. Existing Ed25519 signatures remain verifiable.

### Phase 2: FIPS-Validated Module Integration (1-3 months)

For government deployments requiring CMVP-validated modules:

1. **Option A**: Use Node.js with OpenSSL FIPS provider (`--enable-fips`)
   - Node.js 20+ supports `--force-fips` flag
   - All `node:crypto` operations automatically use FIPS module
   - Requires OpenSSL 3.x with FIPS provider installed

2. **Option B**: Use AWS-LC-FIPS (CMVP Certificate #4631)
   - Drop-in replacement for OpenSSL
   - FIPS 140-3 validated
   - Requires custom Node.js build or native module

3. **Rust**: Use `aws-lc-rs` crate (FIPS-validated) instead of `ed25519-dalek`/`k256`
   - Same API surface; different backend
   - CMVP Certificate #4631

### Phase 3: ZKP Exemption Documentation (Ongoing)

Zero-knowledge proofs have no FIPS standard. Document:

1. ZKP operations are used for privacy-preserving compliance verification
2. The underlying hash functions within ZKP circuits use FIPS-validated SHA-256
3. ZKP results are supplementary to — not a replacement for — standard cryptographic attestations
4. An exemption request template for ATO reviewers

---

## Encryption Gap

gtcx-core currently defines encryption interfaces but does not implement symmetric encryption. When implemented:

- **Required**: AES-256-GCM (FIPS 197 + SP 800-38D)
- **Key wrapping**: AES-KW (SP 800-38F)
- **Platform implementations** must use FIPS-validated AES modules

---

## CMVP Validation — Platform-Level, Not Library-Level

**Key point for ISSO reviewers:** CMVP (Cryptographic Module Validation Program) certification applies to the _cryptographic module_, not to every library that uses cryptographic algorithms. gtcx-core selects FIPS-approved algorithms; the CMVP-validated module is the runtime's crypto provider.

### Why the library is not the CMVP boundary

FIPS 140-3 defines a cryptographic module as a "set of hardware, software, and/or firmware that implements approved security functions." gtcx-core is an application library that _calls_ cryptographic functions — it is not itself a cryptographic module. The CMVP boundary is:

- **Node.js deployments**: OpenSSL 3.x FIPS provider (CMVP Certificate #4282) or AWS-LC-FIPS (CMVP Certificate #4631)
- **Rust deployments**: The OS-level CSPRNG (validated as part of the OS FIPS module) plus the algorithm implementations

### How to deploy with CMVP-validated crypto

**Option 1: Node.js with OpenSSL FIPS provider (recommended)**

```bash
# 1. Install Node.js 20+ with OpenSSL FIPS provider
#    (Most Linux distros with FIPS-enabled OpenSSL work out of the box)

# 2. Enable FIPS mode at the Node.js level
node --enable-fips --force-fips app.js

# 3. Verify FIPS is active (should print 1)
node --enable-fips -e "console.log(require('crypto').getFips())"

# 4. Enable gtcx-core FIPS algorithm selection
GTCX_FIPS_MODE=true node --enable-fips --force-fips app.js
```

When `--enable-fips` is active, Node.js routes all `crypto` module operations through the FIPS-validated OpenSSL provider. `@noble/curves` and `@noble/hashes` use pure JavaScript — they are NOT routed through OpenSSL. For full CMVP compliance, platform-level code should use `node:crypto` for operations that must be FIPS-validated, with gtcx-core's `GTCX_FIPS_MODE` ensuring only FIPS-approved algorithms are selected.

**Option 2: AWS-LC-FIPS (for AWS deployments)**

```bash
# AWS-LC-FIPS is CMVP Certificate #4631
# Use the aws-lc-rs Rust crate or Node.js built against AWS-LC
GTCX_FIPS_MODE=true node app.js
```

**Option 3: Red Hat Enterprise Linux FIPS mode**

```bash
# RHEL system-wide FIPS mode validates the entire crypto stack
fips-mode-setup --enable
# After reboot, all OpenSSL operations use the FIPS module
GTCX_FIPS_MODE=true node app.js
```

### What to tell the ISSO

> "gtcx-core uses FIPS-approved algorithms (SHA-256, ECDSA/secp256k1, OS CSPRNG) selected via the `GTCX_FIPS_MODE` flag. The CMVP-validated cryptographic module is the platform's OpenSSL FIPS provider (Certificate #4282) or AWS-LC-FIPS (Certificate #4631), configured at the Node.js runtime level via `--enable-fips`. The library's algorithm selection is documented in this assessment. ZKP operations use non-FIPS research cryptography and are supplementary to standard attestations."

---

## References

- NIST SP 800-57 Part 1 Rev 5 — Key Management
- NIST SP 800-131A Rev 2 — Transitioning Crypto Algorithms
- FIPS 140-3 — Security Requirements for Cryptographic Modules
- FIPS 186-5 — Digital Signature Standard
- FIPS 180-4 — Secure Hash Standard
- FIPS 202 — SHA-3 Standard
