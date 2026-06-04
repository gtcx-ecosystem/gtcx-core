## Agent protocols (P22–P28) — machine-enforced

| Resource          | Path                                                      |
| ----------------- | --------------------------------------------------------- |
| Hub index         | `gtcx-docs/docs/governance/protocols/`                    |
| Local manifest    | `docs/agents/agent-protocols-manifest.json`               |
| Enforcement guide | `docs/agents/agent-protocols-enforcement.md`              |
| P22 manifest      | `docs/operations/agent-work-selection.md`                 |
| P26 template      | `docs/operations/agent-proceed-brief-template.md`         |
| P24 bridge        | `docs/operations/coordination/cross-repo-agent-bridge.md` |

**Startup phases (INST-003):** 5.4 P22 · 5.5 P24 · 5.6 P26+P28 · 5.7 P27

**Session start (all LLMs):** `pnpm agent:session-start` — run before implementation (terminal, Kimi, Claude Code, Codex; not IDE-specific).

**Verify wiring:** `pnpm agent:protocols:check` (CI + `pnpm quality:governance:check`).
