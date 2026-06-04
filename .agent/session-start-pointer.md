## Session start (all terminals / LLMs — not IDE-specific)

**First command every session:**

```bash
pnpm agent:start
```

**Without `pnpm`** (one-time — from gtcx-core root):

```bash
pnpm agent:cli:path   # copy export line into ~/.zshrc
# then:
agent start
agent next-work --json
agent bout-progress
```

Runs Protocol 22 next-work, provisions **launch focus** + **execution bout**, **progress gauge**, refreshes `.baseline/memory/session.md`, prints Proceed Brief + bout scope (P26 + P28). Works in Cursor, Claude Code, Kimi CLI, Codex, plain terminal.

**Legacy alias:** `pnpm agent:session-start` (same script).

**Bout:** `docs/operations/agent-execution-bout.md` · `pnpm agent:bout`

**JSON for automation:** `pnpm agent:start --json`

**Before PR (agent-path changes):** include attestation from `docs/operations/agent-attestation-template.md` · `pnpm agent:attestation:check --pr`
