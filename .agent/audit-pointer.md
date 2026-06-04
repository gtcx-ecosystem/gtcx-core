## Audits (cross-repo + five lanes)

### Local readiness (read first)

`docs/agents/readiness-and-audit-lanes.md` — lane names, scores, forensic workflow, anti-drift. Machine-readable: `docs/audit/latest.json`.

### Forensic audit commands (gtcx-docs framework)

To run any forensic audit on this repo (master-audit, full-audit, 10-10-roadmap, repo-overview, doc-cleanup, doc-standard, verification-audit, docs-machine-readable, repo-hygiene, gtm-audit):

1. Read `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md` — canonical entry: commands, prompts, output paths.
2. Read the command file (`../gtcx-docs/tools/audit/audit-framework/commands/<command>.md`).
3. Read the prompt referenced (`../gtcx-docs/tools/audit/audit-framework/prompts/<category>/<file>.md`).
4. Execute the prompt against this repo.
5. Write output to the path the command specifies (typically `docs/audit/<command>-<YYYY-MM-DD>.md`).
6. Update the **lane index** and `docs/audit/latest.json` if readiness outcomes changed.

Provider-agnostic — Claude, Codex, Gemini, Kimi, Cursor, Copilot, etc.
