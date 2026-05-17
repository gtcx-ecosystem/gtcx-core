---
title: 'SLO Definitions and Error Budgets'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'frontier-infra-engineer'
tier: 'critical'
tags: ['slo', 'operations', 'enterprise', 'error-budget']
review_cycle: 'quarterly'
---

# SLO Definitions and Error Budgets

> **Scope:** `gtcx-core` is a library foundation, not a running service. These SLOs measure the operational reliability of the _artifact_ (npm packages, Rust crates, docs, security response) rather than service uptime or request latency.

---

## 1. Security Response SLO

| Property         | Value                                                                        |
| ---------------- | ---------------------------------------------------------------------------- |
| **Objective**    | 95% of critical vulnerabilities are patched within 72 hours of disclosure    |
| **Measurement**  | `(critical_vulns_patched_within_72h / total_critical_vulns_disclosed) × 100` |
| **Window**       | Rolling 90 days                                                              |
| **Error budget** | 5% — maximum 1 in 20 critical vulns may exceed 72h                           |

**Alerting:**

- WARN at 2% error budget consumed in 7 days
- PAGE at 4% error budget consumed in 7 days

**Evidence source:** `cargo audit`, `pnpm audit`, GitHub Security Advisories, RUSTSEC/DB

---

## 2. CI Reliability SLO

| Property         | Value                                                         |
| ---------------- | ------------------------------------------------------------- |
| **Objective**    | 99% of commits to `main` pass all CI gates on first run       |
| **Measurement**  | `(main_commits_passing_first_run / total_main_commits) × 100` |
| **Window**       | Rolling 30 days                                               |
| **Error budget** | 1% — maximum 1 in 100 commits may fail CI on first run        |

**Alerting:**

- WARN when 7-day pass rate drops below 99.5%
- PAGE when 7-day pass rate drops below 98%

**Exclusions:** Commits that intentionally break CI to test failure paths (documented in commit message)

---

## 3. Build Reproducibility SLO

| Property         | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Objective**    | 100% of release tags produce bit-for-bit reproducible builds |
| **Measurement**  | `(reproducible_releases / total_releases) × 100`             |
| **Window**       | Per release (no rolling window — every release must pass)    |
| **Error budget** | 0% — zero tolerance for non-reproducible releases            |

**Verification:** `pnpm build:reproducible --canonicalize` run in CI before tag push

---

## 4. Documentation Accuracy SLO

| Property         | Value                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Objective**    | 98% of docs have no broken internal links and match current code behavior             |
| **Measurement**  | `(docs_passing_link_check + docs_passing_frontmatter_check) / (2 × total_docs) × 100` |
| **Window**       | Rolling 14 days                                                                       |
| **Error budget** | 2% — maximum 2% of docs may have stale links or missing frontmatter                   |

**Verification:** `pnpm docs:check-links && pnpm docs:check-frontmatter`

---

## 5. Release Cadence SLO

| Property         | Value                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------- |
| **Objective**    | No more than 14 days between patch releases; no more than 90 days between minor releases |
| **Measurement**  | Days since last release tag                                                              |
| **Window**       | Per release cycle                                                                        |
| **Error budget** | 1 grace extension per quarter (documented reason required)                               |

**Alerting:**

- WARN at 10 days since last patch
- PAGE at 21 days since last patch (breach)

---

## Error Budget Dashboard

| SLO                    | Target     | Current (30d)                       | Budget Remaining | Status |
| ---------------------- | ---------- | ----------------------------------- | ---------------- | ------ |
| Security response      | 95% / 72h  | N/A (no critical vulns this period) | 100%             | 🟢     |
| CI reliability         | 99%        | 100%                                | 100%             | 🟢     |
| Build reproducibility  | 100%       | 100%                                | 100%             | 🟢     |
| Documentation accuracy | 98%        | 100%                                | 100%             | 🟢     |
| Release cadence        | ≤14d patch | 4 days since last patch             | 100%             | 🟢     |

---

## What This Does NOT Cover

- Service uptime (gtcx-core has no running services)
- Request latency (consumers measure this, not the library)
- Database availability (no database in this repo)
- Cloud infrastructure uptime (managed by downstream consumers)

For downstream service SLOs, see `gtcx-infrastructure/docs/operations/slo-definitions.md`.
