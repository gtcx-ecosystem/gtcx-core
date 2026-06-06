---
name: global-compliance-audit
description: GTCX gcr audit (GCR rollup; requires compliance-audit + external-audit; 30–60 min)
---

# global-compliance-audit

Run the GTCX **global-compliance-audit** audit in **this repo** (`gtcx-core`).

## Steps

1. Read command spec: `../gtcx-docs/03-platform/tools/audit/audit-framework/commands/global-compliance-audit.md`
2. Read prompt (BEGIN PROMPT → END PROMPT): `../gtcx-docs/03-platform/tools/audit/audit-framework/prompts/lanes/global-compliance-audit-prompt.md`
3. Read scoring protocol: `../gtcx-docs/03-platform/tools/audit/lane-scoring/global-compliance-scoring.md`
4. **Protocol 27:** Run verification gates in-session; report command + exit code
5. Write forensic: `01-docs/05-audit/global-compliance-audit-YYYY-MM-DD.md` (today's date)
6. Update lane index + `01-docs/05-audit/latest.json` if readiness changed
7. `pnpm readiness:lanes:check`
8. Commit audit artifacts; push after each micro-commit per 01-docs/04-ops/agent-git-workflow.md

**Prerequisites:** Run `compliance-audit`, `external-audit` first (or cite forensics ≤7 days old).

## Registry

- Framework: `../gtcx-docs/03-platform/tools/audit/audit-framework/AGENT-START.md`
- Lane audits: `../gtcx-docs/03-platform/tools/audit/lane-audits/README.md`
- Domain audits: `../gtcx-docs/03-platform/tools/audit/domain-audits/README.md`

**Kimi invoke:** `/skill:global-compliance-audit` (not `/global-compliance-audit`).
