---
title: 'gtcx-core Test Plan'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'testing']
review_cycle: 'on-change'
---

---

title: 'Test Plan'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'testing']
review_cycle: 'on-change'

---

# gtcx-core Test Plan

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

**Document ID**: GTCX-CORE-TEST-PLAN
**Version**: 1.0
**Date**: 2026-05-06
**Status**: Active

## 1. Scope

This plan covers `gtcx-core`, the shared TypeScript and Rust foundation library for cryptography, identity, verification, schemas, domain logic, sync, networking, and release evidence.

In scope:

1. Public `@gtcx/*` package APIs.
2. Rust crates under `rust/`.
3. Cross-package integration behavior.
4. Critical trust paths: signing, verification, offline lockout, offline replay, ZKP parity, API stability, and release evidence.

Out of scope:

1. Product UI and accessibility testing. This repo has no UI surface.
2. Runtime service SLOs, request throughput, and uptime dashboards. This repo ships libraries, not a hosted service.
3. Downstream product UAT. Consumer validation is tracked in `01-docs/release/downstream-validation-report-template.md`.

## 2. Test Strategy

| Layer                       | Tooling / Command                                                                                                     | Release Requirement                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| TypeScript unit tests       | `pnpm test`                                                                                                           | All package suites pass                                  |
| Cross-package integration   | `pnpm --filter @gtcx/integration-tests test`                                                                          | Trust-path and package-contract tests pass               |
| Critical coverage           | `pnpm test:coverage:critical`                                                                                         | Critical packages meet enforced thresholds               |
| Type safety                 | `pnpm typecheck`                                                                                                      | Zero TypeScript errors                                   |
| Lint and format             | `pnpm lint`, `pnpm format:check`                                                                                      | No lint errors; formatting stable                        |
| API stability               | `pnpm api:check`, `pnpm api:check:release`                                                                            | No unapproved drift or semver violation                  |
| Architecture boundaries     | `pnpm architecture:check`                                                                                             | No circular dependencies or forbidden package boundaries |
| Governance                  | `pnpm quality:governance:check`                                                                                       | Required scripts, CODEOWNERS, and workflows are present  |
| Release evidence freshness  | `pnpm release:ga:evidence:check`                                                                                      | GA evidence summary matches the evidence log             |
| Markdown links              | `pnpm docs:check-links`                                                                                               | All tracked markdown links resolve                       |
| Rust unit and quality gates | `cargo fmt --all -- --check`, `cargo clippy --workspace --all-targets -- -D warnings`, `cargo test --workspace --lib` | Rust workspace is clean                                  |
| Heavy proof validation      | `cargo test -p gtcx-zkp --release -- --ignored`                                                                       | Required within 7 days of a release                      |

## 3. Critical Test Areas

| Area                     | Required Evidence                                                 | Owner         |
| ------------------------ | ----------------------------------------------------------------- | ------------- |
| Cryptographic signing    | Unit tests, property tests, Rust tests, and integration contracts | Security      |
| Certificate verification | Negative-path tests for unsigned, malformed, and wrong-key inputs | Security      |
| Token verification       | Encoding contract tests for assembly and verification             | Security      |
| Offline lockout          | Persisted timestamp and expiry tests                              | Security      |
| Offline replay           | Logical sequence tests, restart tests, backward-clock tests       | Core Platform |
| Public API surface       | API baseline report and release semver check                      | Core Platform |
| Global-south resilience  | Offline/degraded behavior tests and resilience profile review     | Core Platform |
| Agentic reproducibility  | Risk-tier gates, evidence templates, and governance checks        | Quality       |
| Enterprise adoption      | Release artifact pack, downstream checklist, external validation  | Quality       |

## 4. Release Gate

A production release candidate cannot be approved unless:

1. All repo-owned gates in `01-docs/devops/runbooks/quality-runbook.md` pass.
2. GA release evidence is current and all release gates have dated evidence.
3. SAST, SBOM, secret scan, dependency audit, and provenance artifacts are attached to the release evidence set.
4. External security review or pen test findings are closed or explicitly accepted.
5. At least one downstream consumer validates the release artifact pack.
6. SOC2 and ISO 27001 evidence is collected for the release period.
7. Security, Platform, Product, and Compliance signoff is recorded.

## 5. Defect Classification

| Severity | Definition                                          | Release Impact                    |
| -------- | --------------------------------------------------- | --------------------------------- |
| P0       | Security vulnerability, key exposure, data loss     | Blocks release                    |
| P1       | Broken trust path, public API break, sync data loss | Blocks release                    |
| P2       | Non-critical package defect with safe workaround    | Requires owner-approved exception |
| P3       | Documentation, examples, or non-critical DX issue   | May ship if tracked               |

## 6. Evidence Locations

| Evidence Type            | Location                                                    |
| ------------------------ | ----------------------------------------------------------- |
| Current release evidence | `quality/release-2026-05-06-evidence.md`                    |
| GA evidence log          | `01-docs/release/ga-release/ga-release-evidence-log.md`     |
| GA evidence summary      | `01-docs/release/ga-release/ga-release-evidence-summary.md` |
| Release checklist        | `01-docs/release/ga-release/ga-release-checklist.md`        |
| API report               | `quality/api-surface-report.json`                           |
| KPI metrics              | `quality/kpi-metrics.json`                                  |
| Provenance manifest      | `artifacts/provenance-manifest.json`                        |
| Downstream validation    | `01-docs/release/downstream-validation-report-template.md`  |
| External findings        | `01-docs/release/external-validation-findings-log.md`       |
| Final signoff            | `01-docs/release/final-signoff-artifact-template.md`        |

## 7. Sign-Off

| Area       | Owner                | Required Before 10/10 Production Readiness             |
| ---------- | -------------------- | ------------------------------------------------------ |
| Security   | CISO / Security Lead | Pen test, SAST, secret scan, dependency evidence       |
| Platform   | CTO / Core Platform  | All local gates, release artifact pack, tagged release |
| Product    | Product Owner        | Downstream consumer validation                         |
| Compliance | Compliance Lead      | SOC2 and ISO evidence collection                       |
