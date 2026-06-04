# Agent Instruction Source of Truth

This directory is the **source of truth** for the synced sections of every agent-config file in this repo (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/main.mdc`, `CONVENTIONS.md`).

The generator at `scripts/agent-sync/sync.mjs` injects content from the partials below into target files, between `<!-- AGENT-SYNC:START -->` and `<!-- AGENT-SYNC:END -->` markers. Anything outside those markers is human-managed.

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

**Full agent guide (not synced — edit directly):** [`docs/agents/readiness-and-audit-lanes.md`](../docs/agents/readiness-and-audit-lanes.md)

## Commands

```bash
pnpm agent:sync              # regenerate target files
pnpm agent:check             # CI gate: exit non-zero on agent-sync drift
pnpm readiness:lanes:check   # latest.json + lane indexes + anti-drift hub scan
```

## Generator updates

The generator `scripts/agent-sync/sync.mjs` is vendored from `gtcx-agentic/agent-sync/sync.mjs`. To pull the latest version across the ecosystem, run from gtcx-agentic:

```bash
node agent-sync/rollout.mjs --update-generator
```
