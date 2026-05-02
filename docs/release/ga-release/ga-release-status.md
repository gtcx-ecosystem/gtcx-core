# GA Release Readiness Tracker

**Release**: gtcx-core v1.0.x
**Owner**: Core Platform
**Full-stack GA status**: See `docs/release/ga-release/ga-release-evidence-log.md`

---

## Context

gtcx-core is a shared library — no runtime service, no uptime SLA, no request throughput. Gates are adapted accordingly: service-specific gates (error rate, monitoring dashboards, alerting, DR drill, SLA metrics) are marked N/A. Library-relevant gates are tracked below.

---

## Gate Status

| Gate                            | Owner      | Status      | Notes                                                                                                                                                        |
| ------------------------------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Security remediation complete   | Security   | In Progress | Phases 0-3 complete; no known security defects in production deps                                                                                            |
| Pen test complete               | Security   | Pending     | Not yet scheduled — required before enterprise downstream deployment                                                                                         |
| Dependency scans clean          | Security   | Partial     | 2026-05-02: pnpm audit — 0 production vulns, 4 dev-only (vite 8.0.3, postcss 8.5.8); cargo audit — 0 production vulns, 1 test-only (rand 0.9.2 via proptest) |
| SAST clean                      | Security   | Pending     | CodeQL not yet configured for this repo                                                                                                                      |
| Internal auth + mTLS            | Security   | N/A         | Library — no internal routes; mTLS support implemented in `@gtcx/api-client`                                                                                 |
| Perf targets (library-specific) | Platform   | Pass        | All 12 crypto benchmarks within budget (2026-04-05); Ed25519 sign 78us, verify 58us; trend enforcement active                                                |
| Error rate < 1%                 | Platform   | N/A         | Library — no runtime error rate; 1,921 tests passing, 0 flaky                                                                                                |
| OpenAPI v[X] published          | Platform   | N/A         | Library — no API endpoints; API surface baselined in `quality/api-surface-baseline.json` (2026-04-05)                                                        |
| SDKs aligned                    | Platform   | Pass        | 18 packages versioned at v1.0.x; API drift = 0 changes (2026-04-05 report)                                                                                   |
| Developer portal content        | Product    | Partial     | Per-package READMEs complete; cross-package integration guide missing                                                                                        |
| Monitoring dashboards           | Platform   | N/A         | Library — no runtime dashboards; CI KPI tracking operational (`quality/kpi-metrics.json`)                                                                    |
| Alerting configured             | Platform   | N/A         | Library — no runtime alerting; CI failure notifications via GitHub Actions                                                                                   |
| Runbooks updated                | Platform   | Pass        | Quality runbook at `docs/devops/runbooks/quality-runbook.md`; release checklist at `docs/devops/release-mgmt/release-checklist.md`                           |
| SOC2 evidence pipeline          | Compliance | Partial     | Pipeline documented at `docs/compliance/soc2-evidence-pipeline.md`; evidence not yet collected                                                               |
| Change management evidence      | Compliance | Pass        | All changes via PR with required reviews; conventional commits; ADRs for architectural decisions; 232 commits since 2026-01-01                               |
| Audit log verification          | Compliance | Partial     | Hash-chain audit log implemented in `rust/gtcx-crypto`; verification script not yet run as formal gate                                                       |

---

## Blockers

1. **Pen test not scheduled** — Owner: Security — ETA: TBD
2. **SAST not configured** — Owner: Platform — ETA: TBD
3. **SOC2 evidence not collected** — Owner: Compliance — ETA: TBD
4. **Cross-package integration guide missing** — Owner: Product — ETA: TBD

---

## Evidence Log

- `docs/release/ga-release/ga-release-evidence-log.md`
- `docs/release/ga-release/ga-release-evidence-summary.md`

---

## Sign-off

| Area       | Owner           | Status  | Date |
| ---------- | --------------- | ------- | ---- |
| Security   | CISO            | Pending |      |
| Platform   | CTO             | Pending |      |
| Product    | PM              | Pending |      |
| Compliance | Compliance Lead | Pending |      |
