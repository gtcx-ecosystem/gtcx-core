# Threat-Control Matrix — gtcx-core

> **Status:** Current  
> **Date:** 2026-05-12  
> **Owner:** Security Lead  
> **Review cadence:** Quarterly  
> **Methodology:** STRIDE + GTCX ecosystem baseline

---

## Coverage Summary

```
Spoofing / Tampering     : 4 controls (Signed commits, branch protection, CODEOWNERS, envelope hash)
Repudiation              : 3 controls (Audit trail, signed commits, traced ops logging)
Information Disclosure   : 4 controls (Secret redaction, FIPS crypto, AES-GCM, PII redaction)
Denial of Service        : 3 controls (Circuit breakers, rate limits, offline queue)
Elevation of Privilege   : 3 controls (RBAC, scope hierarchy, production-guard)
Supply Chain             : 3 controls (Exact-version pinning, content-hash verify, pnpm audit)
AI-Specific              : 2 controls (Human review gates, proof-gated AI approvals)
```

---

## Control Register

| #   | Threat                                    | Control                                                     | Status | Evidence                                                         | Last Verified |
| --- | ----------------------------------------- | ----------------------------------------------------------- | ------ | ---------------------------------------------------------------- | ------------- |
| T01 | Unauthorized code merge (Spoofing)        | Source Level 2 — all commits on `main` must be GPG-signed   | ✅     | `.github/CODEOWNERS`, `CONTRIBUTING.md`                          | 2026-05-12    |
| T02 | Merge without review (Tampering)          | Branch protection + CODEOWNER review required               | ✅     | `.github/workflows/ci.yml`, `tools/check-ops-prereqs.mjs`        | 2026-05-12    |
| T03 | Secret leakage in logs (Info Disclosure)  | Secret redaction in traced operations                       | ✅     | `packages/ai/src/redaction.ts`, `packages/logging/src/logger.ts` | 2026-05-12    |
| T04 | Weak cryptographic primitives (Tampering) | FIPS 140-3 via `aws-lc-fips-sys` (CMVP #4816)               | ✅     | `rust/gtcx-crypto/Cargo.toml`, `rust/Cargo.lock`                 | 2026-05-12    |
| T05 | Dependency supply chain attack            | Exact-version pinning + content-hash allowlist              | ✅     | `tools/check-crypto-deps.mjs`, `pnpm-lock.yaml`                  | 2026-05-12    |
| T06 | ZKP proof forgery                         | Hash-commitment engine fails closed by default              | ✅     | `packages/crypto/src/zkp.ts`, `docs/security/threat-model.md`    | 2026-05-12    |
| T07 | Offline data tampering                    | AES-GCM-encrypted offline queue with integrity verification | ✅     | `packages/domain/src/internal/offline-queue.ts`                  | 2026-05-12    |
| T08 | AI-generated insecure code                | CODEOWNER human review + proof-gated AI approvals           | ✅     | `CLAUDE.md`, `CONTRIBUTING.md`                                   | 2026-05-12    |
| T09 | CI/CD pipeline compromise                 | SLSA Source Level 2 — ephemeral runners, signed artifacts   | ⚠️     | `.github/workflows/ci.yml`, `.github/workflows/release.yml`      | 2026-05-12    |
| T10 | Production key export                     | `production-guard` tier + Secure Enclave / Keystore path    | ⚠️     | `rust/gtcx-crypto/src/keystore.rs`                               | 2026-05-12    |
| T11 | Penetration test coverage                 | Third-party pen-test scoped, vendor not engaged             | 🔴     | `docs/security/pen-test-scope.md`                                | —             |
| T12 | SOC 2 attestation                         | Readiness analysis complete, CPA engagement pending         | 🔴     | `docs/compliance/soc2-readiness.md`                              | —             |

---

## Legend

```
✅  Control implemented and verified
⚠️  Control partially implemented or aspirational
🔴  Control missing or not started
```

---

## Validation

Run the control validator:

```bash
node tools/check-threat-matrix.mjs
```

Expected output:

```
Threat matrix validation passed (12 controls, N evidence references).
```

---

## Change Log

- 2026-05-12 — Initial matrix (12 controls) — Kimi Code CLI
