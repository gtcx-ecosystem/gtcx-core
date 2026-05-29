---
title: "Compliance Matrix — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "gtm"]
review_cycle: "on-change"
---

---
title: '02 Compliance Matrix'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# Compliance Matrix — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**One view across all applicable frameworks.**

---

## Framework Applicability

| Framework         | Applicable?     | Rationale                                                    | Document                                                               |
| ----------------- | --------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **ISO 27001**     | Yes — partial   | Cryptographic controls, access management, change management | [compliance-requirements.md](../compliance/compliance-requirements.md) |
| **SOC 2 Type II** | Yes — partial   | Security CC6 and Processing Integrity CC8                    | [soc2-evidence-pipeline.md](../compliance/soc2-evidence-pipeline.md)   |
| **GDPR**          | No — zero PII   | Library processes no personal data                           | [gdpr-assessment.md](../compliance/gdpr-assessment.md)                 |
| **PCI-DSS**       | No — zero CHD   | Library does not process cardholder data                     | [pci-dss-scope.md](../compliance/pci-dss-scope.md)                     |
| **SOX**           | Yes — ITGCs     | Change management controls for downstream financial systems  | [sox-controls.md](../compliance/sox-controls.md)                       |
| **FIPS 140-3**    | Yes — inherited | Cryptographic module validation via OpenSSL and aws-lc-rs    | [fips-validation-boundary.md](../security/fips-validation-boundary.md) |
| **NIST 800-53**   | Yes — partial   | Security control families mapped                             | [nist-800-53-mapping.md](../security/nist-800-53-mapping.md)           |

---

## ISO 27001 Controls

| Control Area                                      | Status     | Evidence                                               |
| ------------------------------------------------- | ---------- | ------------------------------------------------------ |
| A.5 Information security policies                 | Documented | SECURITY.md, security-policy.md                        |
| A.6 Organization of information security          | Documented | CODEOWNERS, 4-tier risk stratification                 |
| A.8 Asset management                              | Documented | pnpm-workspace.yaml, Cargo.toml workspace              |
| A.9 Access control                                | Enforced   | GitHub 2FA, CODEOWNERS, branch protection              |
| A.10 Cryptography                                 | Enforced   | Ed25519, SHA-256, AES-256-GCM; no custom crypto        |
| A.12 Operations security                          | Enforced   | 21 CI gates, secret scanning, threat matrix validation |
| A.12.6 Technical vulnerability management         | Enforced   | pnpm audit, cargo audit, Trivy, Dependabot             |
| A.14 System acquisition, development, maintenance | Enforced   | PR-gated, 14 ADRs, architecture boundary check         |

## SOC 2 Trust Service Criteria

| Criterion                                           | Status   | Evidence                                                   |
| --------------------------------------------------- | -------- | ---------------------------------------------------------- |
| CC6.1 — Logical and physical access                 | Enforced | GitHub org 2FA, CODEOWNERS                                 |
| CC6.6 — Restrictions on access to system components | Enforced | Package boundary enforcement in CI                         |
| CC8.1 — Processing integrity                        | Enforced | Deterministic operations, RFC test vectors, property tests |
| CC7 — Availability                                  | N/A      | Library, not a service                                     |
| CC9 — Confidentiality                               | Enforced | No PII; keys zeroized; secret scanning                     |

## GDPR — Summary

**Determination: Not applicable.** gtcx-core processes zero personal data. Downstream services binding DIDs to identifiable persons must conduct their own DPIA. Full assessment: [gdpr-assessment.md](../compliance/gdpr-assessment.md).

## PCI-DSS — Summary

**Determination: Out of scope.** gtcx-core does not store, process, or transmit cardholder data. Cryptographic primitives may be used by downstream payment services — they are responsible for their own PCI assessment. Full declaration: [pci-dss-scope.md](../compliance/pci-dss-scope.md).

## SOX — Summary

All four ITGC domains mapped to existing CI controls:

| ITGC                | Control                                | Enforcement          |
| ------------------- | -------------------------------------- | -------------------- |
| Change management   | PR + CODEOWNERS + 21 CI gates          | Automated, no bypass |
| Access controls     | GitHub 2FA + team permissions          | Org-level            |
| Program development | ADRs + code review + automated testing | PR-gated             |
| Computer operations | Turborepo CI/CD + provenance manifest  | Automated            |

Full mapping: [sox-controls.md](../compliance/sox-controls.md).

## FIPS 140-3 — Summary

FIPS validation is inherited from platform cryptographic modules:

- TypeScript: OpenSSL 3.x FIPS Provider (CMVP #4282)
- Rust (planned): AWS-LC (CMVP #4816)

ZKP operations are exempt — no FIPS standard exists. Full boundary statement: [fips-validation-boundary.md](../security/fips-validation-boundary.md).

---

## Gaps to 10/10

| Gap                                   | Framework           | Impact                                          | Path to Close               |
| ------------------------------------- | ------------------- | ----------------------------------------------- | --------------------------- |
| Fuzz campaigns not yet run            | Internal assessment | Can't reference clean results                   | Run 24hr campaigns          |
| Rust FIPS backend not implemented     | FIPS 140-3          | TypeScript path works; Rust path is design-only | Implement aws-lc-rs feature |
| SOC 2 evidence not formally collected | SOC 2               | Pipeline exists, not executed                   | Execute pipeline            |
| No external security validation       | All                 | Internal assessment accepted for sandbox        | Optional: bug bounty        |
