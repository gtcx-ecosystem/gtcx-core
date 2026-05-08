# FIPS Readiness — gtcx-core

This document consolidates the FIPS 140-3 compliance posture. For the full technical boundary statement, see [../security/fips-validation-boundary.md](../security/fips-validation-boundary.md).

---

## Status: Ready (TypeScript) / Design Complete (Rust)

### TypeScript Path — Production Ready

```
Application → @gtcx/crypto (GTCX_FIPS_MODE=true) → node:crypto → OpenSSL 3.x FIPS Provider
                                                                    CMVP Certificate #4282
```

- P-256 ECDSA replaces Ed25519 in FIPS mode
- SHA-256/512 only (BLAKE3 disabled)
- All operations execute within the validated module boundary
- Activated via `GTCX_FIPS_MODE=true` + Node.js `--enable-fips`

### Rust Path — Design Complete, Implementation Pending

```
Application → gtcx-crypto (--features fips) → aws-lc-rs → AWS-LC
                                                            CMVP Certificate #4816
```

- `SigningProvider` trait abstracts over backends
- Feature flag at compile time — zero runtime overhead
- aws-lc-rs includes Ed25519 in its FIPS validation scope (unlike OpenSSL)
- Implementation: ~2-3 days of Rust work

### What to Tell the Regulator

> gtcx-core inherits FIPS 140-3 validation from platform cryptographic modules with active CMVP certificates. No independent certification is required. The library's FIPS mode restricts all operations to FIPS-approved algorithms and delegates execution to the validated module boundary.

---

## Algorithm Availability

| Operation      | Default              | FIPS Mode                                    | FIPS-Approved? |
| -------------- | -------------------- | -------------------------------------------- | -------------- |
| Signing        | Ed25519              | P-256 ECDSA (TS) / Ed25519 (Rust via aws-lc) | Yes            |
| Hashing        | SHA-256 + BLAKE3     | SHA-256 only                                 | Yes            |
| Key generation | OS CSPRNG            | OpenSSL DRBG / aws-lc DRBG                   | Yes            |
| ZKP            | Groth16/Bulletproofs | Exempt (no FIPS standard)                    | N/A            |

## Source Documents

- [FIPS Validation Boundary](../security/fips-validation-boundary.md) — formal boundary statement with CMVP cert references
- [FIPS Assessment](../security/fips-assessment.md) — detailed technical assessment and implementation roadmap
