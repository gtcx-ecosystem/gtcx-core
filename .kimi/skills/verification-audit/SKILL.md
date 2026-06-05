---
name: verification-audit
description: GTCX supporting audit (1–2 hours)
---

# verification-audit

Run the GTCX **verification-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/verification-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/audit/forensic-verification-audit-prompt.md`
3. Follow scoring in command + prompt
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `Verification report` (today's date)
6. Update lane index + `01-docs/05-audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per 01-docs/04-ops/agent-git-workflow.md

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:verification-audit` (not `/verification-audit`).
