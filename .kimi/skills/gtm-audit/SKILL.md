---
name: gtm-audit
description: GTCX lane-5 audit (lane 5; 1–2 hours)
---

# gtm-audit

Run the GTCX **gtm-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/gtm-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/audit/forensic-gtm-audit-prompt.md`
3. Read scoring protocol: `../gtcx-docs/tools/audit/lane-scoring/gtm-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `01-docs/05-audit/gtm-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `01-docs/05-audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per 01-docs/04-ops/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:gtm-audit` (not `/gtm-audit`).
