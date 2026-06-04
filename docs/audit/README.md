---
title: 'Audit Documentation'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
tier: critical
tags: ['documentation', 'audit']
review_cycle: on-change
---

# Audit Documentation

Forensic audits, readiness scorecards, and remediation plans for `gtcx-core`.

---

## Start here — three readiness lanes

**Do not use a single “bank-grade composite” for engineering status.**

| Lane                         | Question                                 | Canonical doc (2026-06-05)                                                                              |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Engineering**              | Can we build, test, and release?         | [engineering-readiness-2026-06-05.md](./engineering-readiness-2026-06-05.md) — **9.5/10**               |
| **Compliance & attestation** | Do we have third-party/regulatory proof? | [compliance-attestation-2026-06-05.md](./compliance-attestation-2026-06-05.md) — **5.5/10** attestation |
| **GTM**                      | Can which buyer adopt today?             | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md) — library **S1 Ready**                     |

**Model:** [readiness-model.md](./readiness-model.md)

---

## Key docs

| File                                   | Purpose                                          |
| -------------------------------------- | ------------------------------------------------ |
| `engineering-readiness-YYYY-MM-DD.md`  | CI, tests, hygiene, DTF technical — in-repo only |
| `compliance-attestation-YYYY-MM-DD.md` | Pen-test, SOC 2, ceremony, trust artifacts       |
| `gtm-readiness-YYYY-MM-DD.md`          | GTM stages S0–S6; library vs ecosystem buyers    |
| `master-audit-YYYY-MM-DD.md`           | **Legacy** blended investor/enterprise lens      |
| `internal-completion-audit-*.md`       | Engineering lane source (9.5 internal)           |
| `full-audit-YYYY-MM-DD.md`             | Architecture sprint snapshots                    |
| `docs-standard-compliance-*.md`        | Docs machine-readable gate                       |
| `repo-hygiene-*.md`                    | Workspace root + folder policy                   |
| `10-10-roadmap-*.md`                   | Improvement program (cross-lane items tagged)    |
| `moat-dimension-roadmap-10-10.md`      | DTF per-dimension crypto moat                    |

---

## How to use

1. **Engineering status** → latest `engineering-readiness-*.md` + run gates in that doc.
2. **Procurement / regulator** → `compliance-attestation-*.md` + [trust portal](../governance/trust-portal.md).
3. **Commercial adoptability** → `gtm-readiness-*.md` + [gtm/README.md](../gtm/README.md).
4. **Historical composite** → `master-audit-*.md` (do not cite as engineering score).
