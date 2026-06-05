---
name: docs-machine-readable
description: GTCX supporting audit (2–4 hours)
---

# docs-machine-readable

Run the GTCX **docs-machine-readable** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/docs-machine-readable.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/docs/forensic-docs-machine-readable-prompt.md`
3. Follow scoring in command + prompt
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `All docs with YAML frontmatter` (today's date)
6. Update lane index + `docs/audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per docs/operations/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:docs-machine-readable` (not `/docs-machine-readable`).
