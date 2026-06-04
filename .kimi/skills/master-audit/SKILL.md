---
name: master-audit
description: GTCX lane-4 bank-grade audit for gtcx-core (alias master-audit; 3–6 hours)
---

# master-audit

Run the GTCX **master-audit** (bank-grade lane 4) in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/master-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/lanes/bank-grade-audit-prompt.md`
3. Read scoring: `../gtcx-docs/tools/audit/lane-scoring/bank-grade-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `docs/audit/bank-grade-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `docs/audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push in-session when done unless operator said **do not push**

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`

**Kimi invoke:** `/skill:master-audit` (not `/master-audit`).
