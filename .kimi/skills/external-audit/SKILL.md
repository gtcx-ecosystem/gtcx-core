---
name: external-audit
description: GTCX lane-3 audit (lane 3; 1–2 hours)
---

# external-audit

Run the GTCX **external-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/tools/audit/audit-framework/commands/external-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/tools/audit/audit-framework/prompts/lanes/external-audit-prompt.md`
3. Read scoring protocol: `../gtcx-docs/tools/audit/lane-scoring/external-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `docs/audit/external-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `docs/audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push in-session when done unless operator said **do not push**

## Registry

- Framework: `../gtcx-docs/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:external-audit` (not `/external-audit`).
