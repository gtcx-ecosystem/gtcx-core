# Agent Instruction Source of Truth

This directory is the **source of truth** for synced sections in `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `KIMI.md`, `CODEX.md`, `CONVENTIONS.md`, `.cursor/rules/main.mdc`, `.github/copilot/instructions.md` (see `targets.json`).

The generator at `03-platform/scripts/agent-sync/sync.mjs` injects content from the partials below into target files, between `<!-- AGENT-SYNC:START -->` and `<!-- AGENT-SYNC:END -->` markers. Anything outside those markers is human-managed.

## Files

| File                         | Purpose                                                           |
| ---------------------------- | ----------------------------------------------------------------- |
| `base.md`                    | Shared content emitted to every target                            |
| `readiness-pointer.md`       | **Five audit lanes**, scores, anti-drift (read before citing 8.9) |
| `audit-pointer.md`           | Cross-repo forensic audit workflow (`gtcx-docs` AGENT-START)      |
| `credentials-pointer.md`     | Vault / Protocol 19                                               |
| `execute-roadmap-pointer.md` | execute-roadmap framework                                         |
| `coordination-pointer.md`    | Protocol 24 cross-repo                                            |
| `claude.partial.md`          | Claude-only addenda                                               |
| `targets.json`               | Maps target files → which partials to include                     |

**Full agent guide (not synced — edit directly):** [`01-docs/01-agents/readiness-and-audit-lanes.md`](../01-docs/01-agents/readiness-and-audit-lanes.md)

**Coverage matrix:** [`01-docs/01-agents/agent-sync-coverage.md`](../01-docs/01-agents/agent-sync-coverage.md) — Kimi CLI, Cursor, Codex, Copilot, Claude, Gemini

## Commands

```bash
pnpm agent:sync              # regenerate target files
pnpm agent:check             # CI gate: exit non-zero on agent-sync drift
pnpm readiness:lanes:check   # latest.json + lane indexes + anti-drift hub scan
```

## Generator updates

The generator `03-platform/scripts/agent-sync/sync.mjs` is vendored from `gtcx-agentic/agent-sync/sync.mjs`. To pull the latest version across the ecosystem, run from gtcx-agentic:

```bash
node agent-sync/rollout.mjs --update-generator
```
