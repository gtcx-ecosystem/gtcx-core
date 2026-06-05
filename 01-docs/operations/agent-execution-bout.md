---
title: 'Agent execution bout (intrinsic multi-story work)'
status: current
date: 2026-06-06
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-BOUT-001
protocol: P22-extension
tier: standard
tags: ['agents', 'protocol-22', 'protocol-26', 'protocol-27']
review_cycle: on-change
---

# Agent execution bout

**Drains the launch-focus work set** — see [agent-launch-focus.md](agent-launch-focus.md) (GTM north star + full implement/plan/human buckets). Replaces ad-hoc `execute-roadmap` for session implementation. Use [execute-roadmap](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/03-platform/tools/roadmap/roadmap-framework) only when audit findings must be merged into `01-docs/05-audit/execution-roadmap.md`.

## What it is

An **execution bout** is a machine-provisioned queue of Class **R** stories the agent drains in one session before **bout check-in**. It is emitted on every:

- `pnpm agent:session-start`
- `pnpm agent:next-work`
- `pnpm agent:bout`

State file: `.baseline/execution-bout.json` (schema `gtcx.executionBout.v1`).

## Rhythms (three checkpoints)

| Rhythm           | When                                   | Operator                                 | Git           |
| ---------------- | -------------------------------------- | ---------------------------------------- | ------------- |
| Story checkpoint | Each story done                        | Optional 1-line chat                     | Micro-commit  |
| Progress report  | Every `reportEveryStories` (default 2) | Short Status Update + **Progress gauge** | —             |
| Bout check-in    | Plan complete or Class S wall          | Full Status Update + session.md          | Push optional |

**`backlogClear` does not mean stop.** It means P22 has no mandatory next story; the bout may still list `repoCompletable` Class R work (e.g. CORE-004).

## Agent loop (normative)

1. `pnpm agent:session-start` — read `executionBout` in JSON output.
2. Emit **Proceed Brief** with bout scope: drain `executionBout.stories[]`.
3. Implement P22 head story → V-ladder → micro-commit → update `session.md`.
4. `pnpm agent:next-work` — refresh bout state.
5. Repeat steps 3–4 while `executionBout.boutComplete === false`.
6. **Bout check-in:** full Status Update; hub log row if cross-repo.

## Stop conditions (`stopWhen`)

| Signal          | Action                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| `plan_complete` | All Class R stories in bout done → check-in                              |
| `class_s_only`  | Next work is human-only (e.g. DTF-5.5.4 LOI) → check-in, Approval needed |
| `gate_failure`  | Fix or Blocker Report; do not hand off with failing gates                |
| `operator_stop` | Human said stop                                                          |

## Operator override (optional)

`.baseline/execution-bout.override.json`:

```json
{
  "mode": "operator",
  "includeStoryIds": ["CORE-004"],
  "excludeStoryIds": ["DTF-5.5.3"],
  "reportEveryStories": 3
}
```

Re-run `pnpm agent:bout` after edits.

## Commands

```bash
pnpm agent:session-start --json   # includes executionBout
pnpm agent:next-work --json       # refreshes .baseline/execution-bout.json
pnpm agent:bout                   # human-readable bout summary
pnpm agent:bout:check             # CI smoke — valid bout provisioned
```

## vs execute-roadmap

| Concern                   | Execution bout      | execute-roadmap                        |
| ------------------------- | ------------------- | -------------------------------------- |
| In-repo drain             | **Yes** — automatic | Manual prompt; easy to stop after plan |
| Reconcile audits → plan   | No                  | **Yes**                                |
| Provisioned every session | **Yes**             | No — external docs only                |
| P22 integration           | **Native**          | None                                   |

## Related

- [Agent work selection](agent-work-selection.md) (P22)
- [Agent universal instructions](agent-universal-instructions.md)
- [Status Update template](agent-status-update-template.md) (P26 §3b)
- [Proceed Brief template](agent-proceed-brief-template.md) (P26)
