---
title: 'External Readiness Checklist'
status: 'current'
date: '2026-05-25'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['internal', 'readiness', 'checklist', 'gtm']
review_cycle: 'weekly'
---

# External Readiness Checklist

> **Status:** Current
> **Date:** 2026-05-25
> **Owner:** Quality & Evidence Lead

**Purpose:** Track all internal readiness items that must be complete before external outreach to regulators, enterprise customers, or investors. This is the single source of truth for "are we ready to talk to the outside world?"

---

## Scoring State

| Lens            | Score | Gate for External Outreach | Status |
| --------------- | ----- | -------------------------- | ------ |
| Core (honest)   | 8.9   | >= 8.5                     | PASS   |
| Investor        | 9.0   | >= 8.5                     | PASS   |
| Enterprise      | 8.7   | >= 8.0                     | PASS   |
| Sovereign / DFI | 9.0   | >= 8.5                     | PASS   |
| P0 count        | 0     | == 0                       | PASS   |
| P1 count        | 2     | <= 2                       | PASS   |
| Caps fired      | 0     | == 0                       | PASS   |

**Verdict:** All external outreach gates pass. The two remaining P1 items (pen-test vendor selection, SOC 2 CPA engagement) are coordination items, not code blockers.

---

## P1 Blockers — Must Close Before First Regulator Meeting

| #   | Item                                 | Owner                    | Status     | Due        | Evidence Location                          |
| --- | ------------------------------------ | ------------------------ | ---------- | ---------- | ------------------------------------------ |
| 1.1 | Select pen-test vendor from longlist | crypto-security-engineer | RFP ready  | 2026-06-16 | `docs/security/pen-test-engagement-log.md` |
| 1.2 | Confirm pen-test budget envelope     | Quality & Evidence Lead  | Approved   | 2026-05-25 | `docs/security/pen-test-rfp-2026.md`       |
| 1.3 | Select CPA firm for SOC 2 Type 1     | Quality & Evidence Lead  | Prep ready | 2026-06-09 | `docs/compliance/soc2-engagement-log.md`   |
| 1.4 | Confirm SOC 2 budget envelope        | Quality & Evidence Lead  | Approved   | 2026-05-29 | `docs/compliance/soc2-readiness-prep.md`   |

---

## P2 Items — Should Close Before First Regulator Meeting

| #   | Item                                            | Owner                   | Status        | Due        | Evidence Location                                                   |
| --- | ----------------------------------------------- | ----------------------- | ------------- | ---------- | ------------------------------------------------------------------- |
| 2.1 | Publish SLSA provenance to npm                  | mobile-engineering-lead | Ready to fire | 2026-05-30 | `.github/workflows/release.yml`                                     |
| 2.2 | Monitor upstream AWS SDK for rustls-webpki fix  | frontier-infra-engineer | Tracking      | TBD        | `rust/Cargo.lock`, `rust/.cargo/audit.toml`                         |
| 2.3 | Conduct first DR runbook drill (Scenario A)     | Protocol Architect      | Not scheduled | 2026-06-30 | `docs/devops/runbooks/dr-runbook.md`                                |
| 2.4 | Refactor `gtcx-zkp/src/tests.rs` (470 LOC)      | frontier-infra-engineer | Pending       | 2026-06-15 | `rust/gtcx-zkp/src/tests.rs`                                        |
| 2.5 | Send Zimbabwe pre-submission email              | gtm-lead                | Draft ready   | 2026-05-30 | `docs/gtm/09-pre-submission-email-zimbabwe.md`                      |
| 2.6 | ADR-012 Stage 1 — gtcx-protocols implementation | protocol-architect      | Handoff sent  | 2026-06-15 | `docs/agents/sessions/2026-05-25-handoff-gtcxcore-gtcxprotocols.md` |

---

## GTM Document Readiness

| #    | Document                            | Audience               | Status      | Last Updated |
| ---- | ----------------------------------- | ---------------------- | ----------- | ------------ |
| 3.1  | Executive Brief                     | Regulators, investors  | Current     | 2026-05-25   |
| 3.2  | Security Posture                    | Auditors               | Current     | 2026-05-25   |
| 3.3  | Compliance Matrix                   | Auditors               | Current     | 2026-05-17   |
| 3.4  | FIPS Readiness                      | Regulators             | Current     | 2026-05-17   |
| 3.5  | Evidence Inventory                  | Auditors               | Current     | 2026-05-17   |
| 3.6  | Sandbox Submission Guide            | Team                   | Current     | 2026-05-17   |
| 3.7  | Budget Readiness Plan               | Team, investors        | Current     | 2026-05-25   |
| 3.8  | Downstream Integration              | Enterprise customers   | Current     | 2026-05-17   |
| 3.9  | Target Markets                      | Team, investors        | Current     | 2026-05-17   |
| 3.10 | Pre-submission emails (5 countries) | Regulators             | Draft ready | 2026-05-24   |
| 3.11 | ADR-012 Ecosystem Integration Brief | Regulators, enterprise | Current     | 2026-05-25   |
| 3.12 | SLSA Provenance Consumer Guide      | Enterprise customers   | Current     | 2026-05-25   |

---

## Technical Gates — Must Pass Before Any External Demo

| Gate                    | Command                                    | Status | Last Pass  |
| ----------------------- | ------------------------------------------ | ------ | ---------- |
| Architecture boundaries | `pnpm architecture:check`                  | PASS   | 2026-05-25 |
| Lint                    | `pnpm lint`                                | PASS   | 2026-05-25 |
| Format                  | `pnpm format:check`                        | PASS   | 2026-05-25 |
| Type check              | `pnpm typecheck`                           | PASS   | 2026-05-25 |
| Test suite              | `pnpm test`                                | PASS   | 2026-05-25 |
| Critical coverage       | `pnpm test:coverage:critical`              | PASS   | 2026-05-25 |
| Build                   | `pnpm build`                               | PASS   | 2026-05-25 |
| API surface             | `pnpm api:check`                           | PASS   | 2026-05-25 |
| Dependency audit (npm)  | `pnpm audit --audit-level=high`            | PASS   | 2026-05-25 |
| Dependency audit (Rust) | `cargo audit` (with documented exceptions) | PASS   | 2026-05-25 |
| Secret scan             | `pnpm security:secret-scan`                | PASS   | 2026-05-25 |
| Threat matrix           | `pnpm security:threat-matrix`              | PASS   | 2026-05-25 |
| Performance budgets     | `pnpm perf:check-budgets`                  | PASS   | 2026-05-25 |
| Docs links              | `pnpm docs:check-links`                    | PASS   | 2026-05-25 |
| Docs frontmatter        | `pnpm docs:check-frontmatter`              | PASS   | 2026-05-25 |
| Governance              | `pnpm quality:governance:check`            | PASS   | 2026-05-25 |
| Rust tests              | `cargo test --workspace`                   | PASS   | 2026-05-25 |
| Rust clippy             | `cargo clippy --workspace --all-targets`   | PASS   | 2026-05-25 |
| Rust format             | `cargo fmt --all -- --check`               | PASS   | 2026-05-25 |
| FIPS tests              | `cargo test --features fips`               | PASS   | 2026-05-25 |

---

## Contact Escalation for External Outreach

| Role               | Primary                  | Responsibility                              |
| ------------------ | ------------------------ | ------------------------------------------- |
| GTM Lead           | gtm-lead                 | Owns regulator relationships and scheduling |
| Protocol Architect | protocol-architect       | Owns technical narrative and demo readiness |
| Security Lead      | crypto-security-engineer | Owns pen-test and security evidence         |
| Compliance Lead    | quality-evidence-lead    | Owns SOC 2, ISO, and audit coordination     |

---

## Sign-Off

This checklist must be reviewed and signed off before any external outreach:

| Role               | Status  | Date | Notes |
| ------------------ | ------- | ---- | ----- |
| GTM Lead           | Pending | —    |       |
| Protocol Architect | Pending | —    |       |
| Security Lead      | Pending | —    |       |
| Compliance Lead    | Pending | —    |       |
