---
name: gtcx-reconcile-roadmap
description: GTCX gtcx-reconcile-roadmap — reconcile and plan only (no implementation)
---

# gtcx-reconcile-roadmap

**Reconcile and plan only** — updates the execution roadmap from latest audits/strategy. Does **not** implement stories.

For reconcile + ship, use `/skill:execute-roadmap`.

## Execute (read in order)

1. `../gtcx-docs/03-platform/tools/roadmap/roadmap-framework/AGENT-START.md`
2. `../gtcx-docs/03-platform/tools/roadmap/roadmap-framework/commands/gtcx-reconcile-roadmap.md`
3. `../gtcx-docs/03-platform/tools/roadmap/roadmap-framework/prompts/roadmap/roadmap-reconcile-execute-prompt.md` — Phases 0–2 only (stop before Execute)
4. `../gtcx-docs/03-platform/tools/roadmap/roadmap-framework/ECOSYSTEM-CONTEXT.md`

## Output

Update `01-docs/strategy/execution-roadmap.md` or `01-docs/05-audit/execution-roadmap.md`; set `Last reconciled: YYYY-MM-DD`.

## Rules

- Read-only reconcile — no code changes unless fixing the plan doc
- Every open audit issue → story or explicit deferral

**Kimi invoke:** `/skill:gtcx-reconcile-roadmap`
