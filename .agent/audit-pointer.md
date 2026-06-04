## Audits — lane + domain commands

**Lane scores (run for readiness):** `gtcx-docs/tools/audit/lane-audits/README.md`

| Goal                | Command                   |
| ------------------- | ------------------------- |
| Engineering         | `engineering-audit`       |
| Internal compliance | `compliance-audit`        |
| Industry / external | `external-audit`          |
| Bank-grade          | `bank-grade-audit`        |
| GTM                 | `gtm-audit`               |
| GCR rollup          | `global-compliance-audit` |

**Domain depth (run first, then lane):** `gtcx-docs/tools/audit/domain-audits/README.md`

| Domain       | Command             | Feeds                                   |
| ------------ | ------------------- | --------------------------------------- |
| Sales        | `sales-audit`       | `gtm-audit`                             |
| Partnerships | `partnership-audit` | `gtm-audit`                             |
| API          | `api-audit`         | `engineering-audit`                     |
| Security     | `security-audit`    | `compliance-audit`                      |
| Deployment   | `deployment-audit`  | `engineering-audit`, `bank-grade-audit` |

**Install slash commands (once):** `gtcx-docs/tools/audit/agent-commands/install.sh` → Claude/Cursor `/engineering-audit` · Gemini `/gtcx:engineering-audit` · Kimi/Codex `/skill:engineering-audit`.

**How to run:** `gtcx-docs/tools/audit/audit-framework/AGENT-START.md` → `commands/<command>.md` → prompt → forensic → lane index + `latest.json` → `pnpm readiness:lanes:check`.
