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

**Run an audit:** [lane-audits](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/lane-audits/README.md) (scores) · [domain-audits](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/03-platform/tools/audit/domain-audits/README.md) (depth: sales, api, security, deployment, …).

| Goal                    | Command                   |
| ----------------------- | ------------------------- |
| Engineering             | `engineering-audit`       |
| Internal compliance     | `compliance-audit`        |
| Industry / external     | `external-audit`          |
| Bank-grade              | `bank-grade-audit`        |
| GTM                     | `gtm-audit`               |
| Global Compliance (GCR) | `global-compliance-audit` |

**Agents:** [readiness-and-audit-lanes.md](../agents/readiness-and-audit-lanes.md) — lane names, scores, anti-drift.

**[readiness-model.md](./readiness-model.md)** — five lanes + GCR. **Machine-readable:** [latest.json](./latest.json) · `pnpm readiness:lanes:check`

**[ecosystem-audit-catalog-2026-06-05.md](./ecosystem-audit-catalog-2026-06-05.md)** — **gtcx-docs / gtcx-agile / gtcx-agentic** audits (not only this folder).

| Lane                                 | Index (rollup)                                                                                     | Primary forensic audits                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Engineering completeness & quality | [engineering-completeness-quality-2026-06-05.md](./engineering-completeness-quality-2026-06-05.md) | [internal-10-10-signoff](./internal-10-10-signoff-2026-05-28.md), [internal-completion-audit-2026-05-21.md](./internal-completion-audit-2026-05-21.md)     |
| 2 Internal compliance                | [internal-compliance-2026-06-05.md](./internal-compliance-2026-06-05.md)                           | [docs-standard](./docs-standard-compliance-2026-06-05.md), [repo-hygiene](./repo-hygiene-2026-06-05.md), [soc2-readiness](../compliance/soc2-readiness.md) |
| 3 Industry Compliance                | [industry-compliance-2026-06-05.md](./industry-compliance-2026-06-05.md)                           | [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md)                                                             |
| **GCR** (Global Compliance Rating)   | [global-compliance-rating-2026-06-05.md](./global-compliance-rating-2026-06-05.md)                 | Rollup L2+L3 — **GCR-T0** · **BLOCKED** (not GCI, not 8.9)                                                                                                 |
| 4 Bank-grade                         | [bank-grade-2026-06-05.md](./bank-grade-2026-06-05.md)                                             | [master-audit-2026-06-03.md](./master-audit-2026-06-03.md)                                                                                                 |
| 5 GTM-Readiness                      | [gtm-readiness-2026-06-05.md](./gtm-readiness-2026-06-05.md)                                       | [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md)                                                                                  |

**Machine-readable:** [latest.json](./latest.json)

---

## How to use

1. **“Are gates green?”** → Lane 1 index + `internal-10-10-signoff`.
2. **“Are 01-docs/hygiene/AI/security/corporate controls in-repo?”** → Lane 2 domain scorecard.
3. **“Is pen-test / SOC 2 / ceremony done?”** → Lane 3 Industry Compliance (IC tiers).
4. **“What’s the investor composite?”** → Lane 4 master audit only.
5. **“Can we sell / pilot?”** → Lane 5 GTM-Readiness (GR tiers).

---

## Other audits (tagged by lane in readiness-model)

| File                              | Typical lane                |
| --------------------------------- | --------------------------- |
| `full-audit-*.md`                 | 1 Engineering               |
| `moat-dimension-roadmap-10-10.md` | 1 Engineering               |
| `10-10-roadmap-*.md`              | 1–4 (mixed — see item tags) |
| `master-audit-*.md`               | 4 Bank-grade                |
| `remediation-*.md`                | Cross-lane tracker          |

Historical `master-audit-*` and `full-audit-*` files before 2026-06-05 remain for trend analysis. **Bannered** snapshots (five-lane pointer): `full-audit-2026-05-09`, `full-audit-2026-06-01`, `full-audit-2026-06-04`, `master-audit-2026-05-12`, `master-audit-2026-05-27`, `10-10-roadmap-2026-05-25`. **Current lane indexes:** dated 2026-06-05 in filenames. **Ecosystem agile audits:** see [ecosystem-audit-catalog-2026-06-05.md](./ecosystem-audit-catalog-2026-06-05.md) — `gtcx-agile` 6/10 snapshot is informational; owner repo refresh pending.
