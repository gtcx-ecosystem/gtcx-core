---
title: "Sprint Current — gtcx-core"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agile"]
review_cycle: "on-change"
---

---
sprintId: 'S46'
title: 'Sprint S46 — gtcx-core'
date: '2026-05-17'
status: current
owner: protocol-architect
role: protocol-architect
tier: standard
tags:
  - agile
  - sprint
review_cycle: bi-weekly
dates:
  start: '2026-05-17'
  end: '2026-05-31'
commitments: []
---

# Sprint Current — gtcx-core

> **Team:** [Team Definition](../team.md)  
> **Backlog:** [Backlog](../backlog.md)  
> **Roadmap:** [Roadmap](../roadmap.md)

## Committed

| ID       | Task                                                          | Owner              | Est. | Status      | Done                                                                   |
| -------- | ------------------------------------------------------------- | ------------------ | ---- | ----------- | ---------------------------------------------------------------------- |
| SEC-008a | Execute `workflow_dispatch` release via `release.yml`         | DevOps             | 1d   | **DONE**    | 2026-05-27                                                             |
| SEC-008b | Verify SLSA provenance on npm                                 | DevOps             | 0.5d | **BLOCKED** | Org policy denies `id-token: write`                                    |
| HYG-004  | Add `.gitattributes` with `* text=auto eol=lf`                | DevOps             | 0.5d | **DONE**    | 2026-05-27                                                             |
| HYG-005  | Add `MATURITY: Scaffolding` badge to `packages/ai/README.md`  | Docs Lead          | 0.5d | **DONE**    | 2026-05-27                                                             |
| DOC-005  | Fix frontmatter + link validation gates in CI                 | DevOps             | 1d   | **DONE**    | 2026-05-27                                                             |
| WF-001   | Add auto-push git tags step to `release.yml`                  | DevOps             | 0.5d | **DONE**    | 2026-05-27                                                             |
| HYG-001  | Set `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM` org secrets | DevOps             | 0.5d | **BLOCKED** | Needs secret values from admin                                         |
| SEC-009  | Select pen-test vendor                                        | Security Lead      | 5d   | **BLOCKED** | Shortlist done; NCC Group recommended. Awaiting RFP send by 2026-05-29 |
| GTM-001  | Send Zimbabwe pre-submission email                            | GTM Lead           | 0.5d | **BLOCKED** | Render ready. Needs engagement-lead name + human send                  |
| GTM-002  | Send Namibia, Zambia, Ghana emails                            | GTM Lead           | 1d   | **BLOCKED** | Renders ready. Needs engagement-lead name + human send                 |
| DOC-004  | Fix `docs/quality/10-10-remediation-tracker.md` KPIs          | Quality Lead       | 0.5d | **DONE**    | 2026-05-27                                                             |
| NEW-003  | Populate sprint docs with committed items                     | Protocol Architect | 0.5d | **DONE**    | 2026-05-27                                                             |

## Blockers

| ID    | Description                                                  | Impact   | Escalation               | Resolution Path                                            |
| ----- | ------------------------------------------------------------ | -------- | ------------------------ | ---------------------------------------------------------- |
| B-001 | Org policy blocks `id-token: write` for SLSA provenance      | High     | Product Lead → Org admin | Request org-level exception for `gtcx-ecosystem/gtcx-core` |
| B-002 | Pen-test vendor shortlist complete; RFPs not sent            | Critical | Security Lead → CTO      | Send to NCC Group + Kudelski by 2026-05-29                 |
| B-003 | `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM` values unknown | Medium   | DevOps → Org admin       | Collect from respective service admins                     |

## Metrics

| Metric                 | Target          | Current                          |
| ---------------------- | --------------- | -------------------------------- |
| `pnpm ops:check`       | 11 pass, 0 warn | 8 pass, 3 warn (missing secrets) |
| CI pass rate on `main` | 100%            | 100% (last 3 runs)               |
| Packages published     | 15              | 15 (2026-05-27)                  |
| SLSA attestations      | 15              | 0 (blocked)                      |
| Regulator emails sent  | >= 1            | 0                                |

---

_Sprint started: 2026-05-17_  
_Sprint ends: 2026-05-31_  
_Last updated: 2026-05-27_  
_Sprint roadmap: [10/10 Remediation Sprint Roadmap](../roadmap/10-10-remediation-sprint-roadmap-2026-05-27.md)_
