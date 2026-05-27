---
title: 'Sprint Current — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['agile', 'sprint']
review_cycle: 'weekly'
sprintId: 'S46'
dates:
  start: '2026-05-17'
  end: '2026-05-31'
commitments: []
---

# Sprint S46 — gtcx-core 10/10 Remediation Sprint

> **Sprint goal:** Close all zero-cost gates and begin external validation engagement
> **Dates:** 2026-05-17 → 2026-05-31
> **Source plan:** [`docs/audit/10-10-remediation-plan-2026-05-27.md`](../../audit/10-10-remediation-plan-2026-05-27.md)

## Committed

| ID      | Task                                                          | Owner                 | Est. | Status   | Done      |
| ------- | ------------------------------------------------------------- | --------------------- | ---- | -------- | --------- |
| HYG-004 | Add `.gitattributes` for cross-OS line endings                | DevOps                | 0.5d | **Done** | `1cb52a3` |
| HYG-005 | Add maturity badges to scaffolding packages (`ai`, `network`) | Docs Lead             | 0.5d | **Done** | `1cb52a3` |
| DOC-005 | Add `docs:check-frontmatter` to `release.yml`                 | DevOps                | 0.5d | **Done** | `1cb52a3` |
| DOC-006 | Add sent-date columns to all 5 market response trackers       | GTM Lead              | 0.5d | **Done** | `1cb52a3` |
| GTM-005 | Create case study placeholder directory                       | GTM Lead              | 0.5d | **Done** | `1cb52a3` |
| NEW-004 | Mark `docs/remediation/remediation-plan.md` as superseded     | Protocol Architect    | 0.5d | **Done** | `1cb52a3` |
| HYG-002 | Document barrel export tracking issue                         | Protocol Architect    | 0.5d | **Done** | `1cb52a3` |
| DOC-003 | Write performance budget trend analysis                       | Quality Evidence Lead | 1d   | **Done** | `1cb52a3` |

## External / Human-Action Items (S46 Carry-Forward)

| ID      | Task                                                              | Owner         | Blocker                        | Target |
| ------- | ----------------------------------------------------------------- | ------------- | ------------------------------ | ------ |
| HYG-001 | Set 3 org secrets (`OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM`) | DevOps        | Requires `gh auth` + org admin | S46-W2 |
| SEC-008 | Trigger SLSA provenance publish via `workflow_dispatch`           | DevOps        | Requires human approval        | S46-W2 |
| GTM-001 | Send Zimbabwe pre-submission email                                | GTM Lead      | Requires human review          | S46-W2 |
| GTM-002 | Send Namibia, Zambia, Ghana pre-submission emails                 | GTM Lead      | Requires human review          | S46-W2 |
| SEC-009 | Select pen-test vendor from outreach shortlist                    | Security Lead | Vendor response time           | S47    |

## Blockers

| ID  | Description | Impact | Escalation |
| --- | ----------- | ------ | ---------- |
| —   | None active | —      | —          |

## Sprint Acceptance Criteria

- [ ] `pnpm ops:check` shows 11 pass, 0 warn (requires HYG-001)
- [ ] All zero-cost docs/hygiene items closed
- [ ] At least 1 regulator email sent (requires human action)
- [ ] `npm view @gtcx/crypto --json | jq '.dist.attestations'` returns non-null (requires SEC-008)

---

_Sprint started: 2026-05-17_  
_Sprint ends: 2026-05-31_  
_Last updated: 2026-05-27_
