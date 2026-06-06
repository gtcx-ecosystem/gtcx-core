---
name: execute-repo-hygiene
description: GTCX supporting audit (2–4 hours)
---

# execute-repo-hygiene

Run the GTCX **execute-repo-hygiene** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/03-platform/tools/audit/audit-framework/commands/execute-repo-hygiene.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/03-platform/tools/audit/audit-framework/prompts/hygiene/repo-hygiene-remediation-prompt.md`
3. Follow scoring in command + prompt
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `01-docs/05-audit/repo-hygiene-YYYY-MM-DD.md` (today's date)
6. Update lane index + `01-docs/05-audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per 01-docs/04-ops/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/03-platform/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/03-platform/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/03-platform/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:execute-repo-hygiene` (not `/execute-repo-hygiene`).
