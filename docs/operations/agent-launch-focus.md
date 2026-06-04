---
title: 'Agent launch focus (GTM north star + work set)'
status: current
date: 2026-06-06
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-LAUNCH-001
tier: standard
tags: ['agents', 'gtm', 'launch', 'protocol-22']
review_cycle: on-change
---

# Agent launch focus

**Problem:** Operators should not re-run forensic audits or `execute-roadmap` prompts every session so agents know the goal is **launch downstream apps → GTM**.

**Solution:** Machine-provisioned **launch focus** on every `agent:session-start` / `agent:next-work`.

| File                                            | Role                                                  |
| ----------------------------------------------- | ----------------------------------------------------- |
| `.baseline/launch-focus.json`                   | SoR — full work set + session mode                    |
| `.baseline/execution-bout.json`                 | Drain queue (subset of launch focus)                  |
| `docs/audit/auto-dev-state-tier5-commercial.md` | Human-readable mirror (`pnpm agent:reconcile-launch`) |

## North star (gtcx-core)

**Outcome:** Finish foundation evidence and coordination so **markets, intelligence, infrastructure** can ship apps — GTM closes **GR-T2+** sovereign deals.

**Not in this repo:** Product UI, pilot deploy, pen-test vendor — witness or plan coordination only.

**Not required to start work:** `master-audit`, `execute-roadmap` prompt, operator story menus.

## Session modes

| Mode          | When                          | Agent does                                                 |
| ------------- | ----------------------------- | ---------------------------------------------------------- |
| **implement** | `workSet.implement` non-empty | Code/docs/ceremony in gtcx-core                            |
| **plan**      | Implement empty               | Reconcile roadmaps, coordination, auto-dev state (Class R) |
| **witness**   | Only human gates left         | Indexes, outbound acks, Status Updates                     |

`backlogClear` from P22 does **not** mean idle — enter **plan** mode and drain `workSet.plan`.

## Work set buckets

```json
"workSet": {
  "implement": [ "CORE-004", "OI-X02", … ],
  "plan": [ "LAUNCH-PLAN-01", … ],
  "witness": [ … ],
  "human": [ "DTF-5.5.4", "EXT-INF-002", … ]
}
```

**Execution bout** drains `implement` or `plan` depending on `sessionMode`.

## Commands

```bash
pnpm agent:session-start --json   # includes launchFocus + executionBout
pnpm agent:reconcile-launch       # refresh auto-dev-state + roadmap stamp
pnpm agent:launch:check           # CI smoke
```

## Planning tasks (LAUNCH-PLAN-\*)

| ID             | Action                                              |
| -------------- | --------------------------------------------------- |
| LAUNCH-PLAN-01 | `pnpm agent:reconcile-launch`                       |
| LAUNCH-PLAN-02 | Update `docs/audit/execution-roadmap.md` open items |
| LAUNCH-PLAN-03 | Update `cross-repo-agent-bridge.md` Latest row      |
| LAUNCH-PLAN-04 | Infra outbound OI-X02 / ER-1-08                     |
| LAUNCH-PLAN-05 | `pnpm readiness:lanes:check`                        |

## vs execute-roadmap

| Tool                | Use                                                                         |
| ------------------- | --------------------------------------------------------------------------- |
| **Launch focus**    | Every session — **what** to ship toward GTM                                 |
| **Execution bout**  | **How** to drain the queue in one session                                   |
| **execute-roadmap** | Rare — merge audit **findings** into execution-roadmap when strategy shifts |

## Related

- [agent-execution-bout.md](agent-execution-bout.md)
- [agent-work-selection.md](agent-work-selection.md)
- [execution-roadmap.md](../audit/execution-roadmap.md)
- [gtm-reality-check-2026-06-02.md](../gtm/gtm-reality-check-2026-06-02.md)
