---
title: 'Agent Protocol 22 Brief (paste to agents)'
status: current
date: 2026-06-03
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['agents', 'protocol-22', 'onboarding']
review_cycle: on-change
document_id: OPS-AWS-002
---

# Agent Protocol 22 — Session opener (gtcx-core)

Copy the block below into any agent chat for this repo.

---

```
GTCX Protocol 22 is ESTABLISHED in gtcx-core.

Before coding:
1. AGENTS.md Phases 1–5.3 (baseline, .baseline/memory/*, git status).
2. Read 01-docs/04-ops/agent-work-selection.md
3. Run: pnpm agent:next-work
4. Announce storyId + tier; mark in_progress in 01-docs/05-audit/moat-dimension-roadmap-10-10.md
5. Implement — do NOT ask me which story to pick.

Override: only if I name a story ID in this message.

After each story: done in roadmap, refresh .baseline/memory/session.md,
micro-commit, pnpm agent:next-work again.

Verify wiring: pnpm agent:work-selection:check
```

---

## Repo paths

| Item               | Path                                                |
| ------------------ | --------------------------------------------------- |
| Manifest           | `01-docs/04-ops/agent-work-selection.md`            |
| Roadmap            | `01-docs/05-audit/moat-dimension-roadmap-10-10.md`  |
| Session pointer    | `.baseline/memory/session.md`                       |
| Ecosystem protocol | `gtcx-docs/.../22-agent-work-selection/protocol.md` |
