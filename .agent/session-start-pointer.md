## Session start (all terminals / LLMs — not IDE-specific)

**First command every session:**

```bash
pnpm agent:session-start
```

Runs Protocol 22 next-work, refreshes `.baseline/memory/session.md`, prints Proceed Brief skeleton (P26 + P28). Works in Cursor, Claude Code, Kimi CLI, Codex, plain terminal.

**JSON for automation:** `pnpm agent:session-start --json`

**Before PR (agent-path changes):** include attestation from `docs/operations/agent-attestation-template.md` · `pnpm agent:attestation:check --pr`
