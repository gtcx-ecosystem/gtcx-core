---
name: api-audit
description: GTCX domain audit (feeds engineering-audit; 1–3 hours)
---

# api-audit

Run the GTCX **api-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/03-platform/tools/audit/audit-framework/commands/api-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/03-platform/tools/audit/audit-framework/prompts/domains/api-audit-prompt.md`
3. Read scoring protocol: `../gtcx-docs/03-platform/tools/audit/audit-framework/../domain-scoring/api-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `01-docs/05-audit/api-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `01-docs/05-audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per 01-docs/04-ops/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/03-platform/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/03-platform/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/03-platform/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:api-audit` (not `/api-audit`).
