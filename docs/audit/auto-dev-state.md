---
title: 'Auto-Dev State — gtcx-core'
status: current
updated: '2026-06-05'
date: '2026-06-05'
owner: gtcx-core
protocol: execute-roadmap
tier: evidence
tags: ['audit', 'agent']
review_cycle: on-change
---

# Auto-dev state — gtcx-core (2026-06-05)

**Machine-readable:** [`auto-dev-data.json`](./auto-dev-data.json)  
**Execution plan:** [`execution-roadmap.md`](./execution-roadmap.md)  
**Readiness SSOT:** [`latest.json`](./latest.json) · engineering signoff **10**

## Next work (computed)

Run `pnpm agent:next-work` for authoritative selection. **Launch plan bout complete. Commercial ceiling: DTF-5.5.4 LOI + CORE-004-CEREMONY (Class S).**

| Field                | Value             |
| -------------------- | ----------------- |
| backlogClear         | **true**          |
| role                 | witness_only      |
| certificationCeiling | tier-5-commercial |
| nextStoryId          | **DTF-5.5.4**     |
| launchFocus mode     | **witness**       |

## Active phase

**FA-S6** — automatable repo work **exhausted**; Class S wall.

| Story                             | Status      | Owner             |
| --------------------------------- | ----------- | ----------------- |
| FA-S6-02 vendor pen-test pack     | **done**    | gtcx-core         |
| ER-AUTO-DEV-01 auto-dev-data sync | **done**    | gtcx-core         |
| FA-S6-03 Zimbabwe / LOI tracker   | **blocked** | gtm-lead          |
| FA-S6-04 CORE-004 ceremony        | **blocked** | custodian         |
| DTF-5.5.4 LOI / regulator letter  | **blocked** | Human / GTM       |
| CORE-004-CEREMONY transcript      | **blocked** | Custodian         |
| DTF-5.5.4                         | **blocked** | Human / GTM       |
| CORE-004-CEREMONY                 | **blocked** | Custodian / human |

## Lane scores (summary)

| Lane          | Metric              | Value                |
| ------------- | ------------------- | -------------------- |
| 1 Engineering | internal signoff    | **10**               |
| 2 Internal    | composite           | **9**                |
| 4 Bank-grade  | certified composite | **8.9**              |
| 5 GTM         | library tier        | **GR-T1**            |
| GCR           | tier                | **GCR-T0** (BLOCKED) |

## Verification (execute-roadmap UAT)

| Command                                | Exit  |
| -------------------------------------- | ----- |
| `pnpm agent:protocols:check`           | **0** |
| `pnpm readiness:lanes:check`           | **0** |
| `pnpm vendor-evidence:verify-manifest` | **0** |
| `pnpm docs:check-frontmatter`          | **0** |

## Cross-repo witness

| ID          | Status                 | Owner               |
| ----------- | ---------------------- | ------------------- |
| OI-X02      | outbound-filed         | gtcx-infrastructure |
| EXT-INF-002 | open (core pack ready) | gtcx-infrastructure |

## Resume

1. `pnpm agent:reconcile-auto-dev` — refresh JSON + this file after roadmap changes
2. `pnpm agent:reconcile-launch` — refresh tier5 commercial mirror
3. Human: **DTF-5.5.4** LOI · **CORE-004-CEREMONY** transcript publish

**Do not hand-edit** `auto-dev-data.json` — run `pnpm agent:reconcile-auto-dev`.
