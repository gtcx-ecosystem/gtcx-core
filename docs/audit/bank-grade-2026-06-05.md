---
title: 'Bank-grade — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-BANK-GRADE-2026-06-05
audit_lane: bank-grade
composite: 8.9
tier: critical
tags: ['audit', 'bank-grade', 'composite', 'index']
review_cycle: quarterly
---

# Bank-grade — index

**Lane 4 of 5** — [readiness-model.md](./readiness-model.md)

**Primary command:** `bank-grade-audit` → `docs/audit/bank-grade-audit-<date>.md` (legacy: `master-audit-*.md`)  
**Scoring:** [bank-grade-scoring.md](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/tools/audit/lane-scoring/bank-grade-scoring.md)

**Certified composite** per `gtcx-docs` SCORING_FRAMEWORK — blends engineering, compliance, and buyer lenses. **Not** a substitute for lane 1–3 or GTM-Readiness.

---

## Audit quality (1–10)

**Lane 4 master-audit artifact quality:** **8.5/10**

## Readiness outcomes (from master audit)

| Metric              |      Value | Source                                                             |
| ------------------- | ---------: | ------------------------------------------------------------------ |
| Certified composite | **8.9/10** | [bank-grade-audit-2026-06-07.md](./bank-grade-audit-2026-06-07.md) |
| Investor lens       |        8.9 | §Lens table                                                        |
| Enterprise lens     |        8.8 | §Lens table (+0.1 coordination)                                    |
| Sovereign / DFI     |        9.0 | §Lens table                                                        |

Machine-readable: [latest.json](./latest.json)

---

## Canonical audits

| Audit                                                                        | Role                                                |
| ---------------------------------------------------------------------------- | --------------------------------------------------- |
| [bank-grade-audit-2026-06-07.md](./bank-grade-audit-2026-06-07.md)           | **Latest** lane-4 forensic (master-audit alias)     |
| [master-audit-2026-06-03.md](./master-audit-2026-06-03.md)                   | Prior blended certification (refresh)               |
| [master-audit-2026-05-28.md](./master-audit-2026-05-28.md)                   | Certified 8.9 reconciled with internal 10.0 signoff |
| [full-audit-2026-06-04.md](./full-audit-2026-06-04.md)                       | Sprint synthesis feeding master narrative           |
| [gtcx-ecosystem-rating-2026-05-08.md](./gtcx-ecosystem-rating-2026-05-08.md) | Ecosystem context                                   |

---

## How composite is formed

```
Certified composite ≈ weighted(engineering, security, hygiene, enterprise, …)
  capped by Industry Compliance (lane 3)
```

**Path to 9.5+ composite:** Close [external-dependencies-register](./external-dependencies-register-2026-05-28.md) compliance rows + re-run master audit — **not** more internal doc splits.

---

## Do not use bank-grade for

| Wrong use                      | Use instead                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| CI / test status               | Lane 1 [engineering-completeness-quality](./engineering-completeness-quality-2026-06-05.md) |
| Docs frontmatter pass          | Lane 2 [internal-compliance](./internal-compliance-2026-06-05.md)                           |
| “Can we close Zimbabwe pilot?” | Lane 5 [gtm-readiness](./gtm-readiness-2026-06-05.md)                                       |
