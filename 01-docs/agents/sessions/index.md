---
title: 'Agent Session Handoffs — Index'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

# Agent Session Handoffs — Index

> **Status:** Current
> **Date:** 2026-05-12
> **Owner:** Protocol Architect

---

## Active Handoffs

| Date       | From      | To                  | Scope                                                    | File                                                | Status   |
| ---------- | --------- | ------------------- | -------------------------------------------------------- | --------------------------------------------------- | -------- |
| 2026-05-12 | Kimi      | Any                 | 10/10 roadmap expansion (Lightweight + Machine-Readable) | `2026-05-12-handoff-kimi-any.md`                    | Complete |
| 2026-05-25 | gtcx-core | gtcx-protocols      | ADR-012 Stage 1 — predicate bridge                       | `2026-05-25-handoff-gtcxcore-gtcxprotocols.md`      | Ready    |
| 2026-06-02 | gtcx-core | gtcx-protocols      | 10/10 Moat M6.5 KAT package + FIPS strict mode           | `2026-06-02-handoff-gtcxcore-gtcxprotocols.md`      | Open     |
| 2026-06-02 | gtcx-core | gtcx-infrastructure | SLSA provenance gap + new CI gate                        | `2026-06-02-handoff-gtcxcore-gtcxinfrastructure.md` | Open     |
| 2026-06-02 | gtcx-core | gtcx-protocols      | 10/10 Moat M6.5 KAT package + FIPS strict mode           | `2026-06-02-handoff-gtcxcore-gtcxprotocols.md`      | Open     |
| 2026-06-02 | gtcx-core | gtcx-infrastructure | SLSA provenance gap + new CI gate                        | `2026-06-02-handoff-gtcxcore-gtcxinfrastructure.md` | Open     |
| 2026-06-02 | gtcx-core | baseline-os         | Moat progress + Zimbabwe email + provenance priority     | `2026-06-02-handoff-gtcxcore-baselineos.md`         | Open     |
| 2026-06-02 | gtcx-core | all-downstream      | **Master tracker: all remaining cross-repo work**        | `2026-06-02-remaining-cross-repo-work.md`           | Open     |

## Cross-repo coordination (new 2026-06-03)

| Date       | From      | To             | Scope                                            | File                                                                               | Status |
| ---------- | --------- | -------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- | ------ |
| 2026-06-03 | gtcx-core | ecosystem      | Coordination folder + bridge + sprint workplan   | `01-docs/04-ops/coordination/`                                                     | Open   |
| 2026-06-03 | gtcx-core | gtcx-protocols | `@gtcx/zkp-kat-vectors` consumption tracking     | `01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md`              | Open   |
| 2026-06-03 | gtcx-core | gtcx-infra     | **EAP bundle sync DONE** — ESO refresh requested | `01-docs/04-ops/coordination/to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md` | Done   |
| 2026-06-03 | gtcx-core | baseline-os    | External vendor + Zimbabwe email tracking        | `01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md`              | Open   |

## Handoff Template

Create a new handoff with:

```bash
cp 01-docs/01-agents/sessions/TEMPLATE.md 01-docs/01-agents/sessions/$(date +%Y-%m-%d)-handoff-<from>-<to>.md
```

Then update this INDEX.

## Cross-Agent Protocol

1. **Handoff writer** documents: done, in-progress, blockers, decisions, files touched, next steps
2. **Handoff reader** reads: this INDEX → relevant handoff → `AGENTS.md` → resumes work
3. **Handoff is mandatory** when switching agents or ending a long session
4. **Handoff is tagged** with `handoff`, `<agent-from>`, `<agent-to>`, `<scope>`
