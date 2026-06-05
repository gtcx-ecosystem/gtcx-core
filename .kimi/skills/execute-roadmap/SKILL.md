---
name: execute-roadmap
description: GTCX execute-roadmap — reconcile audits and implement until phase complete
---

# execute-roadmap

Reconcile audits/strategy into a living execution plan **and implement stories** until the active phase is complete.

**Not `roadmap`** — plan-only shortcut is `gtcx-reconcile-roadmap`.

## Execute (read in order)

1. `../gtcx-docs/tools/roadmap/roadmap-framework/AGENT-START.md`
2. `../gtcx-docs/tools/roadmap/roadmap-framework/commands/execute-roadmap.md`
3. `../gtcx-docs/tools/roadmap/roadmap-framework/prompts/roadmap/roadmap-reconcile-execute-prompt.md` — all phases (reconcile + plan + ship)
4. `../gtcx-docs/tools/roadmap/roadmap-framework/ECOSYSTEM-CONTEXT.md`

## Output

Update `01-docs/strategy/execution-roadmap.md` or `01-docs/05-audit/execution-roadmap.md` in **gtcx-core**, then implement stories.

## Rules

- Prefer **execution bout** (`pnpm agent:session-start`) for shipping; do not use this skill only to discover priorities
- **Protocol 27:** Run gates in-session; report command + exit code
- Do not stop after planning

**Kimi invoke:** `/skill:execute-roadmap`
