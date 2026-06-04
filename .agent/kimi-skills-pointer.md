## Kimi project skills (GTCX-native Cursor/Claude parity)

**Invoke:** `/skill:<name>` from `gtcx-core` root (restart Kimi after clone or `pnpm kimi:skills:sync`).

**Registry:** `.kimi/skills-expected.json` (22 skills: lane + domain + supporting audits, aliases, roadmap).

| Category   | Skills                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Lane       | `engineering-audit`, `compliance-audit`, `external-audit`, `bank-grade-audit`, `global-compliance-audit`, `gtm-audit` |
| Domain     | `sales-audit`, `partnership-audit`, `api-audit`, `security-audit`, `deployment-audit`                                 |
| Supporting | `doc-standard`, `repo-hygiene`, `execute-repo-hygiene`, `verification-audit`, `docs-machine-readable`                 |
| Aliases    | `master-audit`, `comprehensive-audit`, `full-audit`, `forensic-audit`                                                 |
| Roadmap    | `execute-roadmap`, `gtcx-reconcile-roadmap`                                                                           |

**Sync after framework changes:** `pnpm kimi:skills:sync` (requires `../gtcx-docs` sibling). **CI:** `pnpm kimi:skills:check`.

**Cursor/Claude:** same names as `/command` or `~/.cursor/commands/` — Kimi uses `/skill:` prefix only.
