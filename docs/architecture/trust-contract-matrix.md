# Trust Contract Matrix

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Last updated:** 2026-05-06  
**Purpose:** Make the public trust-bearing behavior of `gtcx-core` explicit so security fixes, reviews, and audits operate against stable contracts instead of informal assumptions.

---

## Scope

This matrix covers public APIs whose behavior can influence a trust decision, cryptographic validity decision, identity resolution decision, or offline security state transition.

---

## Core Contracts

| Package              | Trust-bearing API / Surface                 | Required invariant                                                                     | Failure must look like                                            | Evidence today                       |
| -------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------ |
| `@gtcx/crypto`       | `sign`, `verify`, `signHash`, `verifyHash`  | Signature verification only succeeds for the right message/key/signature tuple         | Explicit verification failure, never truthy fallback              | Unit tests, Rust tests, API baseline |
| `@gtcx/crypto`       | `createZkpEngine`, native loader            | Production-native requirement is explicit and fallback semantics are documented        | Hard fail when `GTCX_REQUIRE_NATIVE=true` and native is absent    | Unit tests, docs, Rust crates        |
| `@gtcx/security`     | `assembleToken`, `verifyTokenSignature`     | Signature encoding is canonical and verification rejects malformed/tampered tokens     | Invalid signature / malformed token result                        | Coverage tests, integration tests    |
| `@gtcx/security`     | `SecureStorageBase.unlock`                  | Lockout, retry, integrity, and recovery state are deterministic across restarts        | Clear error code, never silent unlock or permanent false state    | Unit tests, integration tests        |
| `@gtcx/security`     | Offline storage / tamper detection          | Corruption and tamper states are surfaced explicitly                                   | Explicit validation or integrity failure                          | Unit tests                           |
| `@gtcx/verification` | `tracedGenerateCertificate`                 | When keys are provided, traced generation produces a real signable/verifiable artifact | Validation/signing failure, never placeholder success             | Unit tests, integration tests        |
| `@gtcx/verification` | `tracedVerifyCertificate`                   | Certificate validity requires actual cryptographic verification                        | `isValid=false` with failed checks, never signature-presence pass | Unit tests, integration tests        |
| `@gtcx/verification` | Certificate templates / generator inputs    | Every exported template is constructible through the exported public input surface     | Validation failure only for real missing/invalid inputs           | Unit tests                           |
| `@gtcx/verification` | `checkRevocationStatus`, `assertNotRevoked` | Revocation state is explicit and blocks trust decisions when revoked                   | Revoked status or thrown verification error                       | Unit tests                           |
| `@gtcx/identity`     | DID resolver and cache interfaces           | Invalid DIDs, resolver errors, and revocation states are explicit                      | Typed resolver error / null document with metadata                | Unit tests, type exports             |
| `@gtcx/domain`       | `OfflineQueue.getNext`, persisted queue     | Replay order uses monotonic logical sequence, not wall-clock timestamps                | Stable replay order across clock skew and restart                 | Unit tests, integration tests        |

---

## Review Expectations

| Tier                 | Packages                                                                                                                                                                                                                                 | Required review posture                                                         |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `security-sensitive` | `@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `rust/gtcx-crypto`, `rust/gtcx-zkp`                                                                                                     | Human review plus security-role scrutiny, full trust-path regression confidence |
| `foundational`       | `@gtcx/types`, `@gtcx/events`, `@gtcx/schemas`, `@gtcx/domain`                                                                                                                                                                           | Contract stability, dependency-boundary scrutiny                                |
| `release-sensitive`  | `@gtcx/services`, `@gtcx/api-client`, `@gtcx/connectivity`, `@gtcx/network`, `@gtcx/sync`, `@gtcx/workproof`, `@gtcx/logging`, `@gtcx/utils`, `@gtcx/ai`, `rust/gtcx-node`, `rust/gtcx-network`, `rust/gtcx-consensus`, `rust/gtcx-edge` | Integration, performance, and downstream behavior scrutiny                      |
| `internal-tooling`   | `@gtcx/eslint-config`, `@gtcx/typescript-config`, `@gtcx/tsup-config`, `@gtcx/jurisdiction-config`                                                                                                                                       | Build/release impact scrutiny                                                   |

---

## Known Next-Step Gaps

1. External downstream consumer validation is not yet attached as release evidence.
2. External security review findings are not yet attached to this matrix.

---

## References

- [quality/package-risk-tiers.json](../../quality/package-risk-tiers.json)
- [release-2026-05-06-evidence.md](../../quality/release-2026-05-06-evidence.md)
- [global-south-resilience-profile.md](./global-south-resilience-profile.md)
- [overview.md](./overview.md)
