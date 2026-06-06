---
title: 'Threat-Control Matrix — gtcx-core'
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

title: 'Threat Control Matrix'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'

---

# Threat-Control Matrix — gtcx-core

> **Status:** Current  
> **Date:** 2026-06-06  
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

| #   | Threat                                    | Control                                                     | Status | Evidence                                                                                 | Last Verified |
| --- | ----------------------------------------- | ----------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------- | ------------- |
| T01 | Unauthorized code merge (Spoofing)        | Source Level 2 — all commits on `main` must be GPG-signed   | ✅     | `.github/CODEOWNERS`, `01-docs/04-ops/repo/CONTRIBUTING.md`                              | 2026-06-06    |
| T02 | Merge without review (Tampering)          | Branch protection + CODEOWNER review required               | ✅     | `.github/workflows/ci.yml`, `03-platform/tools/check-ops-prereqs.mjs`                    | 2026-05-12    |
| T03 | Secret leakage in logs (Info Disclosure)  | Secret redaction in traced operations                       | ✅     | `03-platform/packages/ai/src/redaction.ts`, `03-platform/packages/logging/src/logger.ts` | 2026-05-12    |
| T04 | Weak cryptographic primitives (Tampering) | FIPS 140-3 via `aws-lc-fips-sys` (CMVP #4816)               | ✅     | `rust/gtcx-crypto/Cargo.toml`, `rust/Cargo.lock`                                         | 2026-05-12    |
| T05 | Dependency supply chain attack            | Exact-version pinning + content-hash allowlist              | ✅     | `03-platform/tools/check-crypto-deps.mjs`, `pnpm-lock.yaml`                              | 2026-05-12    |
| T06 | ZKP proof forgery                         | Hash-commitment engine fails closed by default              | ✅     | `03-platform/packages/crypto/src/zkp.ts`, `01-docs/security/threat-model.md`             | 2026-06-06    |
| T07 | Offline data tampering                    | AES-GCM-encrypted offline queue with integrity verification | ✅     | `03-platform/packages/domain/src/internal/offline-queue.ts`                              | 2026-05-12    |
| T08 | AI-generated insecure code                | CODEOWNER human review + proof-gated AI approvals           | ✅     | `.claude/CLAUDE.md`, `01-docs/04-ops/repo/CONTRIBUTING.md`                               | 2026-06-06    |
| T09 | CI/CD pipeline compromise                 | SLSA Source Level 2 — ephemeral runners, signed artifacts   | ⚠️     | `.github/workflows/ci.yml`, `.github/workflows/release.yml`                              | 2026-05-12    |
| T10 | Production key export                     | `production-guard` tier + Secure Enclave / Keystore path    | ⚠️     | `rust/gtcx-crypto/src/keystore.rs`, `01-docs/security/cloud-kms-keystore.md`             | 2026-06-06    |
| T11 | Penetration test coverage                 | Third-party pen-test scoped, vendor not engaged             | 🔴     | `01-docs/security/pen-test-scope.md`, `01-docs/security/pen-test-rfp-2026.md`            | 2026-06-06    |
| T12 | SOC 2 attestation                         | Readiness analysis complete, CPA engagement pending         | 🔴     | `01-docs/compliance/soc2-readiness.md`, `01-docs/compliance/soc2-readiness-prep.md`      | 2026-06-06    |

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
node 03-platform/tools/check-threat-matrix.mjs
```

Expected output:

```
Threat matrix validation passed (12 controls, N evidence references).
```

---

## Change Log

- 2026-05-12 — Initial matrix (12 controls) — Kimi Code CLI
