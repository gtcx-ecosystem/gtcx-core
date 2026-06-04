---
title: 'Internal compliance — index'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: AUDIT-INT-COMPLIANCE-2026-06-05
audit_lane: internal-compliance
composite: 9.3
tier: critical
tags: ['audit', 'compliance', 'internal', 'index']
review_cycle: quarterly
---

# Internal compliance — index

**Lane 2 of 5** — [readiness-model.md](./readiness-model.md)

In-repo **control design and evidence automation** — not third-party attestation (lane 3) or commercial GTM (lane 5).

---

## Rollup score

**~9.3/10** — weighted from audits below (2026-06-05).

| Source audit                                                                                  |       Score |
| --------------------------------------------------------------------------------------------- | ----------: |
| [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md)            |         9.6 |
| [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)                                    |         9.6 |
| [internal-10-10-signoff](./internal-10-10-signoff-2026-05-28.md) — governance + threat matrix |        pass |
| [soc2-readiness.md](../compliance/soc2-readiness.md) — TSC mapping                            | ~8.5 design |

---

## Canonical audits

| Audit / doc                                                                                | What it proves                                                                         |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md)         | Frontmatter, links, INDEX, length                                                      |
| [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)                                 | Root allowlist + `check:workspace-root-cleanliness:strict`                             |
| [internal-10-10-signoff-2026-05-28.md](./internal-10-10-signoff-2026-05-28.md)             | INT-CORE-03 docs gates; INT-CORE-05/06 pen-test **prep** + SOC 2 **prep** done in-repo |
| [anti-inflation-audit-results-2026-05-11.md](./anti-inflation-audit-results-2026-05-11.md) | Score honesty guardrails                                                               |
| [../compliance/soc2-readiness.md](../compliance/soc2-readiness.md)                         | AICPA TSC gap analysis (library scope)                                                 |
| [../compliance/soc2-evidence-pipeline.md](../compliance/soc2-evidence-pipeline.md)         | Evidence collection automation                                                         |
| [../security/threat-control-matrix.md](../security/threat-control-matrix.md)               | 12 controls validated in CI                                                            |
| [../governance/trust-portal-evidence.md](../governance/trust-portal-evidence.md)           | Controls-by-category index                                                             |

---

## Gates (internal compliance)

```bash
pnpm docs:check-frontmatter && pnpm docs:check-links
pnpm quality:governance:check && pnpm security:threat-matrix
pnpm check:workspace-root-cleanliness:strict
```

---

## Not in this lane

| Item                             | Lane                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------ |
| Delivered pen-test PDF           | [external-dependent-compliance](./external-dependent-compliance-2026-06-05.md) |
| SOC 2 Type I **letter** from CPA | [external-dependent-compliance](./external-dependent-compliance-2026-06-05.md) |
| Regulator sandbox send           | [gtm-readiness](./gtm-readiness-2026-06-05.md)                                 |
