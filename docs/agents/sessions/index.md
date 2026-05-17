# Agent Session Handoffs — Index

> **Status:** Current
> **Date:** 2026-05-12
> **Owner:** Protocol Architect

---

## Active Handoffs

| Date       | From | To  | Scope                                                    | File                             | Status   |
| ---------- | ---- | --- | -------------------------------------------------------- | -------------------------------- | -------- |
| 2026-05-12 | Kimi | Any | 10/10 roadmap expansion (Lightweight + Machine-Readable) | `2026-05-12-handoff-kimi-any.md` | Complete |

## Handoff Template

Create a new handoff with:

```bash
cp docs/agents/sessions/TEMPLATE.md docs/agents/sessions/$(date +%Y-%m-%d)-handoff-<from>-<to>.md
```

Then update this INDEX.

## Cross-Agent Protocol

1. **Handoff writer** documents: done, in-progress, blockers, decisions, files touched, next steps
2. **Handoff reader** reads: this INDEX → relevant handoff → `AGENTS.md` → resumes work
3. **Handoff is mandatory** when switching agents or ending a long session
4. **Handoff is tagged** with `handoff`, `<agent-from>`, `<agent-to>`, `<scope>`
