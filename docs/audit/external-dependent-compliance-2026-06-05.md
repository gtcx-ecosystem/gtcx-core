---
title: 'External-dependent compliance — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: crypto-security-engineer
document_id: AUDIT-EXT-COMPLIANCE-2026-06-05
audit_lane: external-dependent-compliance
tier: critical
tags: ['audit', 'compliance', 'external', 'index']
review_cycle: weekly
---

# External-dependent compliance — index

**Lane 3 of 5** — [readiness-model.md](./readiness-model.md)

Dependencies **outside repo control** required for certified uplift. **System of record:** [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md).

---

## Status

| Metric                               | Value                                            |
| ------------------------------------ | ------------------------------------------------ |
| Register items (compliance-relevant) | **7** of 12 (excludes GTM-only EXT-CORE-007–010) |
| Complete                             | **0**                                            |
| Certified composite cap              | Remains **8.9** until lane 3 closes              |

**GTM-only register rows** (007–010) → [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md), not this lane.

---

## Compliance-relevant register rows

| ID                | Item                                    | Owner                    |
| ----------------- | --------------------------------------- | ------------------------ |
| EXT-CORE-001      | Pen-test execution + report             | crypto-security-engineer |
| EXT-CORE-002      | SOC 2 Type I CPA report                 | quality-evidence-lead    |
| EXT-CORE-003      | FIPS boundary independent review        | crypto-security-engineer |
| EXT-CORE-004/005  | npm org provenance policy + publish     | frontier-infra-engineer  |
| EXT-CORE-006      | RUSTSEC upstream (rustls-webpki)        | crypto-security-engineer |
| EXT-CORE-011      | DR live drill witness                   | frontier-infra-engineer  |
| EXT-CORE-012      | 90-day P1-free window (ends 2026-08-17) | quality-evidence-lead    |
| XR-402 / CORE-004 | Trusted-setup ceremony transcript       | core + infra             |

Cross-repo: EXT-CORE-X01, X02 in register.

---

## Canonical audits

| Audit                                                                                          | Role                             |
| ---------------------------------------------------------------------------------------------- | -------------------------------- |
| [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md) | **SoR** — itemized blockers      |
| [external-validation-findings-log.md](../release/external-validation-findings-log.md)          | Pen-test findings when delivered |
| [../security/pen-test-engagement-log.md](../security/pen-test-engagement-log.md)               | Vendor engagement state          |
| [../compliance/soc2-engagement-log.md](../compliance/soc2-engagement-log.md)                   | CPA engagement state             |

---

## Repo-side prep (complete — lane 2)

Pen-test RFP, SOC 2 readiness docs, SLSA workflow — see register § “Repo-side materials ready” and [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md).

---

## Supersedes

[compliance-attestation-2026-06-05.md](./compliance-attestation-2026-06-05.md) — removed; use this index + external register.
