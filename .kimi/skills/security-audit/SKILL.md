---
name: security-audit
description: GTCX domain audit (feeds compliance-audit; 1–2 hours)
---

# security-audit

Run the GTCX **security-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/security-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/audit/forensic-security-audit-prompt.md`
3. Read scoring protocol: `../gtcx-docs/tools/audit/audit-framework/../domain-scoring/security-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `docs/audit/security-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `docs/audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per docs/operations/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:security-audit` (not `/security-audit`).
