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

Forensic audits and readiness scorecards for `gtcx-core`, organized in **five lanes**.

---

## Start here

**[readiness-model.md](./readiness-model.md)** — five lanes, rules, and full audit-folder map.

| Lane                                 | Index (rollup)                                                                                     | Primary forensic audits                                                                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Engineering completeness & quality | [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) | [internal-10-10-signoff](./internal-10-10-signoff-2026-05-28.md), [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md) |
| 2 Internal compliance                | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md)                           | [docs-standard-compliance-2026-06-05.md](./docs-standard-compliance-2026-06-05.md), [repo-hygiene-2026-06-05.md](./repo-hygiene-2026-06-05.md)         |
| 3 External-dependent compliance      | [external-dependent-compliance-2026-06-05.md](./external-dependent-compliance-2026-06-05.md)       | [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md)                                                         |
| 4 Bank-grade                         | [bank-grade-2026-06-05.md](./bank-grade-2026-06-05.md)                                             | [master-audit-2026-06-03.md](./master-audit-2026-06-03.md)                                                                                             |
| 5 GTM                                | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)                                       | [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md)                                                                              |

**Machine-readable:** [latest.json](./latest.json)

---

## How to use

1. **“Are gates green?”** → Lane 1 index + `internal-10-10-signoff`.
2. **“Are docs/controls in-repo complete?”** → Lane 2 index.
3. **“Is pen-test / SOC 2 / ceremony done?”** → Lane 3 register.
4. **“What’s the investor composite?”** → Lane 4 master audit only.
5. **“Can we sell / pilot?”** → Lane 5 GTM index.

---

## Other audits (tagged by lane in readiness-model)

| File                              | Typical lane                |
| --------------------------------- | --------------------------- |
| `full-audit-*.md`                 | 1 Engineering               |
| `moat-dimension-roadmap-10-10.md` | 1 Engineering               |
| `10-10-roadmap-*.md`              | 1–4 (mixed — see item tags) |
| `master-audit-*.md`               | 4 Bank-grade                |
| `remediation-*.md`                | Cross-lane tracker          |

Historical `master-audit-*` files before 2026-06-03 remain for trend analysis; do not cite as current without checking lane indexes.
