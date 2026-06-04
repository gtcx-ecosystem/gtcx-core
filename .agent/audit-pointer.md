## Audits — one command per goal

**Start:** `gtcx-docs/tools/audit/lane-audits/README.md`

| Goal                    | Command                   | Forensic output                                |
| ----------------------- | ------------------------- | ---------------------------------------------- |
| Engineering             | `engineering-audit`       | `docs/audit/engineering-audit-<date>.md`       |
| Internal compliance     | `compliance-audit`        | `docs/audit/compliance-audit-<date>.md`        |
| Industry / external     | `external-audit`          | `docs/audit/external-audit-<date>.md`          |
| Bank-grade              | `bank-grade-audit`        | `docs/audit/bank-grade-audit-<date>.md`        |
| GTM-Readiness           | `gtm-audit`               | `docs/audit/gtm-audit-<date>.md`               |
| Global Compliance (GCR) | `global-compliance-audit` | `docs/audit/global-compliance-audit-<date>.md` |

**How to run:** `gtcx-docs/tools/audit/audit-framework/AGENT-START.md` → `commands/<command>.md` → prompt → write forensic → update lane index + `docs/audit/latest.json` → `pnpm readiness:lanes:check`.

**Lane indexes (scores):** `docs/agents/readiness-and-audit-lanes.md` · `docs/audit/latest.json`

Legacy aliases: `master-audit` = `bank-grade-audit` · `full-audit` = `engineering-audit`.
