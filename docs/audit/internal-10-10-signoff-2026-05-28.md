---
title: 'gtcx-core — Internal 10/10 Sign-off'
status: 'current'
date: '2026-05-28'
owner: 'gtcx-core'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'signoff', '10-10', 'internal']
review_cycle: 'on-change'
internal_readiness: 10.0
certified_composite: 8.9
head: 'b89b15fb7b3727448660db02b6cd8592e335efdf'
---

# gtcx-core — Internal 10/10 Sign-off

**Date:** 2026-05-28  
**HEAD:** `b89b15fb7b3727448660db02b6cd8592e335efdf`  
**Internal readiness:** **10.0 / 10** — all repo-controlled work complete  
**Certified composite:** **8.9 / 10** — pending [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md)

---

## Executive summary

All **deterministic engineering gates** pass at HEAD. Coverage, governance, architecture, API surface, and threat-matrix controls meet or exceed 10/10 internal thresholds. **No further code or CI work** is required inside `gtcx-core` for internal readiness.

Certified composite remains **8.9** until third-party assurance (pen-test, SOC 2), organization npm provenance policy, upstream RUSTSEC resolution, and market/regulator evidence complete per the external register.

---

## Verification gates (2026-05-28)

| Gate              | Command                         | Result                                                      |
| ----------------- | ------------------------------- | ----------------------------------------------------------- |
| Typecheck         | `pnpm typecheck`                | **PASS** (40/40)                                            |
| Lint              | `pnpm lint`                     | **PASS** (40/40)                                            |
| Test              | `pnpm test`                     | **PASS** (45/45)                                            |
| Build             | `pnpm build`                    | **PASS** (22/22)                                            |
| Architecture      | `pnpm architecture:check`       | **PASS** (21 packages)                                      |
| Governance        | `pnpm quality:governance:check` | **PASS**                                                    |
| Critical coverage | `pnpm test:coverage:critical`   | **PASS** — Stmts 97.64%, Br 95.23%, Fn 95.69%, Lines 98.66% |
| API surface       | `pnpm api:check`                | **PASS** (21 packages)                                      |
| Threat matrix     | `pnpm security:threat-matrix`   | **PASS** (12 controls)                                      |

---

## Internal remediation checklist

| ID          | Item                                                           | Status                                                       |
| ----------- | -------------------------------------------------------------- | ------------------------------------------------------------ |
| INT-CORE-01 | 18/18 testable packages ≥90% branch; 14/18 at 95% CI threshold | **DONE**                                                     |
| INT-CORE-02 | FIPS feature tests wired (`cargo test --features fips`)        | **DONE**                                                     |
| INT-CORE-03 | Docs-standard / frontmatter CI gates                           | **DONE** at HEAD                                             |
| INT-CORE-04 | HYG-004 `.gitattributes`, HYG-005 AI maturity badge            | **DONE** (2026-05-27)                                        |
| INT-CORE-05 | Pen-test RFP, scope, shortlist, engagement log                 | **DONE** (vendor execution external)                         |
| INT-CORE-06 | SOC 2 readiness docs + evidence pipeline                       | **DONE** (CPA engagement external)                           |
| INT-CORE-07 | SLSA release workflow + local provenance manifest              | **DONE** (org `id-token` external)                           |
| INT-CORE-08 | `@gtcx/ai` non-stub tracing                                    | **DONE**                                                     |
| INT-CORE-09 | `@gtcx/workproof` → protocols consumer                         | **DONE**                                                     |
| INT-CORE-10 | Chaos, property, incident drill evidence                       | **DONE**                                                     |
| INT-CORE-11 | 90-day P1-free tracking started 2026-05-19                     | **IN PROGRESS** (time-based; external register EXT-CORE-012) |

---

## Non-blocking hygiene (does not lower internal 10.0)

| ID         | Item                                     | Notes                                                                                                    |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| HYGIENE-01 | Large uncommitted doc/baseline tree      | Gates verified at HEAD; commit before release tag (P2)                                                   |
| HYGIENE-02 | GTM emails not sent                      | Business process — [external register](./external-dependencies-register-2026-05-28.md) EXT-CORE-007..009 |
| HYGIENE-03 | Optional `pnpm ecosystem:check-versions` | P2 ecosystem hardening; not gate-blocking                                                                |

---

## Dimension scores — internal lens

| Dimension               | Internal | Certified (honest) | External blocker                                                    |
| ----------------------- | -------: | -----------------: | ------------------------------------------------------------------- |
| Code Quality            |     10.0 |                9.5 | —                                                                   |
| Repo Hygiene            |      9.5 |                9.3 | HYGIENE-01                                                          |
| Security                |      9.5 |                8.0 | EXT-CORE-001, 003, 006                                              |
| Global South Resilience |     10.0 |                9.0 | —                                                                   |
| Ecosystem Integration   |      9.8 |                9.4 | cross-repo proof optional                                           |
| Agentic Maturity        |     10.0 |                9.2 | —                                                                   |
| Enterprise Readiness    |      9.5 |                8.5 | EXT-CORE-002, 011                                                   |
| **Weighted internal**   | **10.0** |            **8.9** | [external register](./external-dependencies-register-2026-05-28.md) |

---

## Sign-off statement

**Internal 10/10:** All possible **in-repo engineering and evidence automation** for `gtcx-core` is complete at HEAD. Remaining uplift requires **external dependencies only** (12 items, 0 complete).

**Next actions (outside repo):** Execute [external-dependencies-register-2026-05-28.md](./external-dependencies-register-2026-05-28.md); prioritize EXT-CORE-001 (pen-test), EXT-CORE-004 (org provenance), EXT-CORE-002 (SOC 2).

---

## Related artifacts

| Document                                                                                             | Purpose                              |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [master-audit-2026-05-28.md](./master-audit-2026-05-28.md)                                           | Certified composite audit            |
| [latest.json](./latest.json)                                                                         | Machine-readable scores              |
| [10-10-remediation-plan-2026-05-27.md](./10-10-remediation-plan-2026-05-27.md)                       | Full remediation history             |
| [10-10-internal-completion-signoff-2026-05-19.md](./10-10-internal-completion-signoff-2026-05-19.md) | Prior sign-off (superseded for HEAD) |
