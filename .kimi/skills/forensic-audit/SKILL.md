---
name: forensic-audit
description: GTCX lane-1 audit (lane 1; 1–3 hours)
---

# forensic-audit

Run the GTCX **forensic-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/forensic-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/lanes/engineering-audit-prompt.md`
3. Read scoring protocol: `../gtcx-docs/tools/audit/lane-scoring/engineering-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `01-docs/05-audit/engineering-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `01-docs/05-audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per 01-docs/04-ops/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:forensic-audit` (not `/forensic-audit`).
