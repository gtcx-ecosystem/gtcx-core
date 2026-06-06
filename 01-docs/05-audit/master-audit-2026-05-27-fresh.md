---
title: 'gtcx-core Fresh Master Audit 2026-05-27'
status: 'current'
date: '2026-05-27'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'certification', 'master-audit', 'fresh-audit']
review_cycle: 'quarterly'
audit_type: master
target_repo: gtcx-core
audit_date: '2026-05-27'
composite: 8.9
composite_raw: 8.89
investor: 8.9
enterprise: 8.5
sov_dfi: 8.9
p0_count: 0
p1_count: 3
p2_count: 2
caps_fired: 0
---

# gtcx-core Fresh Master Audit

**Date:** 2026-05-27  
**Auditor:** Codex CLI  
**Repo:** `gtcx-core`  
**Methodology:** Fresh forensic master audit using the local repo instructions plus the available audit framework under `../gtcx-docs/03-platform/tools/audit/audit-framework/`. At audit start, the generated agent instructions still pointed at `../gtcx-agentic/audit/`; that same-session drift is now remediated.

## Executive Summary

| Lens                         |  Score | Verdict                                             |
| ---------------------------- | -----: | --------------------------------------------------- |
| Core weighted score          | 8.9/10 | Production-capable with certification gaps          |
| Investor lens                | 8.9/10 | Strong foundation, external assurance still pending |
| Enterprise buyer lens        | 8.5/10 | Technically ready, procurement evidence incomplete  |
| African sovereign / DFI lens | 8.9/10 | Strong mission fit and degraded-mode resilience     |

`gtcx-core` is a mature protocol foundation. The fresh run found no P0 blockers, no unsafe Rust, no source TODO/FIXME markers in production source, passing TypeScript and Rust gates, clean dependency audits, valid doc frontmatter, and real low-bandwidth/offline implementation. After same-session remediation of non-blocked docs and gate drift, the score is **8.89 raw, rounded to 8.9/10**. The remaining score holdback is external assurance and operational verification: pen-test, SOC 2, authenticated GitHub/org checks, performance trend depth, and explicit heavy Groth16 UAT evidence.

Top priorities:

1. Engage a pen-test vendor and schedule kickoff.
2. Engage a SOC 2 CPA firm and sign the Type 1 engagement letter.
3. Re-run `pnpm ops:check` with authenticated `gh`.
4. Seed performance trend history and run ignored Groth16 UAT evidence explicitly before regulator-facing release claims.

## Verification Evidence

| Check                                       | Result             | Notes                                                                                                 |
| ------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `git status --short` before audit           | Pass               | Clean working tree before changes.                                                                    |
| `pnpm ops:check`                            | Fail               | `gh-cli-available` failed: `gh` not found or not authenticated. Other GitHub/org checks were skipped. |
| `pnpm install`                              | Pass               | Lockfile up to date.                                                                                  |
| `pnpm typecheck`                            | Pass               | 40/40 Turbo tasks successful.                                                                         |
| `pnpm lint`                                 | Pass               | 40/40 Turbo tasks successful.                                                                         |
| `pnpm test`                                 | Pass               | 45/45 Turbo tasks successful.                                                                         |
| `pnpm build`                                | Pass               | 22/22 Turbo tasks successful, cached.                                                                 |
| `pnpm format:check`                         | Pass               | Prettier accepted matched files.                                                                      |
| `pnpm architecture:check`                   | Pass               | 21 packages, 241 source files.                                                                        |
| `pnpm docs:check-links`                     | Pass               | 420 markdown files checked.                                                                           |
| `pnpm docs:check-frontmatter`               | Pass               | 278/278 docs valid, 57 excluded.                                                                      |
| `pnpm quality:governance:check`             | Pass               | 14 scripts, 8 CODEOWNERS entries, 2 workflows, any-budget 6/40.                                       |
| `pnpm bundle:check-budgets`                 | Pass               | Added same session; 21/21 package gzip entry budgets pass.                                            |
| `pnpm perf:check-budgets`                   | Pass with warnings | 26 metrics pass; 13 trend checks lack 3 samples.                                                      |
| `pnpm api:check`                            | Pass               | 21 packages, report generated.                                                                        |
| `pnpm security:threat-matrix`               | Pass               | Matrix structurally valid; T11/T12 still red in the matrix itself.                                    |
| `pnpm security:secret-scan`                 | Pass               | 1075 repo files scanned.                                                                              |
| `pnpm test:coverage:critical`               | Pass               | Critical package coverage gate completed.                                                             |
| `pnpm build:reproducible --canonicalize`    | Pass               | Canonicalized `@gtcx/crypto` hash matched inside run.                                                 |
| `pnpm audit --audit-level moderate`         | Pass               | No known npm vulnerabilities found.                                                                   |
| `cargo test --workspace`                    | Pass               | Rust workspace tests pass; `gtcx-zkp` has 2 ignored heavy Groth16 tests.                              |
| `cargo clippy --workspace --all-targets`    | Pass               | Finished with no reported warnings.                                                                   |
| `cargo test -p gtcx-crypto --features fips` | Pass               | 63 unit tests and 30 doctests pass under FIPS feature.                                                |
| `cargo audit`                               | Pass               | 374 Rust dependencies scanned; no known vulnerabilities found.                                        |

## Bank-Grade Scorecard

| Dimension                         | Weight | Score | Confidence | Rationale                                                                                                                                                 |
| --------------------------------- | -----: | ----: | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Code Quality                      |     15 |   9.5 | A          | Typecheck, lint, tests, build, architecture, coverage, Rust tests, and clippy pass. No TODO/FIXME/HACK/XXX markers found in production source.            |
| Repo / Folder Hygiene             |     10 |   9.5 | A          | Single canonical `01-docs/` tree, no tracked OS junk, frontmatter and links pass; docs index drift remediated same session.                               |
| Security                          |     20 |   8.1 | B          | FIPS-feature tests pass; `aws-lc-rs` FIPS feature is wired; secret scan, npm audit, cargo audit pass. Pen-test and SOC 2 are not yet externally complete. |
| Global South Resilience           |     15 |   9.0 | A-         | Offline queue and USSD parser/session surfaces are implemented and tested; performance trend samples remain thin.                                         |
| Ecosystem Integration             |     15 |   9.2 | A-         | 21 packages, API surface check, package boundary check, and downstream-oriented docs are strong. GitHub/org controls could not be verified locally.       |
| Agentic Maturity                  |     10 |   9.2 | A-         | Agent routing, safety rules, sessions, roles, and machine-readable docs exist. Generated TODOs and stale audit framework paths remediated same session.   |
| Enterprise / Production Readiness |     15 |   8.3 | B          | Reproducible-build check, governance, release docs, and quality gates are strong; external assurance and ops verification gaps keep this below 9.         |

**Raw weighted score:** 8.89/10  
**Caps fired:** 0  
**Final score:** 8.9/10

## Findings

### P1 Findings

**P1-1: External penetration test is not engaged.**  
`01-docs/09-security/pen-test-engagement-log.md:24` records the phase as RFP approved and vendor outreach ready; lines 29-34 show no vendor, no SoW, no kickoff, no testing window, no final report, and no budget commitment. The threat matrix also marks T11 red at `01-docs/09-security/threat-control-matrix.md:50`.

**P1-2: SOC 2 Type 1 engagement is not signed.**  
`01-docs/10-compliance/soc2-engagement-log.md:25` records readiness prep approved and CPA outreach ready; lines 30-36 show no CPA firm, no engagement letter, no kickoff, no draft report, no final letter, and no budget commitment. The threat matrix marks T12 red at `01-docs/09-security/threat-control-matrix.md:51`.

**P1-3: Operational GitHub controls could not be verified in this audit environment.**  
`pnpm ops:check` failed on `gh-cli-available`, then skipped GitHub/org/branch-protection checks. Because branch protection, org secrets, npm org access, and related controls are material enterprise evidence, the repo should keep this as a release-readiness blocker until run in an authenticated environment.

### P2 Findings

**P2-1: Performance budget trends are not yet statistically backed.**  
`pnpm perf:check-budgets` passed, but 13 connectivity/adaptive/batch metrics reported insufficient trend samples at 0/3. This is acceptable for current gate passage but weak for enterprise performance claims.

**P2-2: Heavy Groth16 UAT tests are ignored by default.**  
`rust/gtcx-zkp/03-platform/src/tests/groth16.rs:71-97` marks asset ownership and location-region proof/tamper tests as ignored because proof generation is heavy. This is reasonable for default CI, but release evidence should include an explicit UAT run before relying on those claims in regulator-facing material.

### Closed Same-Session Findings

| Original finding                                    | Resolution                                                                                                            | Validation                                                                                 |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Required M2 `bundle:check-budgets` script missing   | Added `03-platform/tools/check-bundle-budgets.mjs` and `package.json` script.                                         | `pnpm bundle:check-budgets` passes 21/21 packages; `--package @gtcx/crypto` filter passes. |
| Agent audit framework path stale                    | Updated `.agent/audit-pointer.md` to `../gtcx-docs/03-platform/tools/audit/audit-framework/` and regenerated targets. | `pnpm agent:check` passes.                                                                 |
| Generated agent-sync TODO placeholders              | Updated `.agent/base.md` with repo purpose, stack, and build/run commands; regenerated targets.                       | `pnpm agent:check` passes.                                                                 |
| Docs index stale latest-audit and file-size claims  | Updated `01-docs/README.md` to point at this audit and current file-size posture.                                     | `pnpm docs:check-frontmatter`, `pnpm docs:check-links`, and `pnpm format:check` pass.      |
| Agent sync check was non-idempotent for `AGENTS.md` | Trimmed post-marker trailing whitespace in `03-platform/scripts/agent-sync/sync.mjs`.                                 | `pnpm agent:sync` followed by `pnpm agent:check` is stable.                                |

## Positive Evidence

- Rust crate roots use `#![deny(unsafe_code)]`, and source search found no `unsafe {` or `unsafe fn`.
- `rust/gtcx-crypto/Cargo.toml:40-44` wires `aws-lc-rs` with `features = ["fips"]`, and `cargo test -p gtcx-crypto --features fips` passed.
- AWS KMS support is real, not a placeholder: `rust/gtcx-crypto/03-platform/src/cloud_kms_keystore.rs:155-160` calls KMS `CreateKey`, lines 190-196 call KMS `Sign`, lines 218-220 call `GetPublicKey`, and lines 270-277 schedule key deletion.
- Offline-first behavior is implemented in `03-platform/packages/domain/src/internal/offline-queue.ts:100` with bounded queues, dependencies, conflict states, persistence, and retry handling.
- USSD parsing exists in `03-platform/packages/connectivity/src/ussd/parser.ts:17`, accepting multiple gateway field styles and dial-string parsing for low-bandwidth channels.
- Documentation standards are enforced by executable gates: links passed across 420 markdown files and frontmatter passed across 278 docs.
- Bundle-size budgets are now executable: `pnpm bundle:check-budgets` passes all 21 budgeted packages and supports `--package <name>`.

## Remediation Plan

| Priority | Item                                            | Owner                            | Exit criterion                                                    |
| -------- | ----------------------------------------------- | -------------------------------- | ----------------------------------------------------------------- |
| P1       | Select and engage pen-test vendor               | Cryptographic Security Engineer  | Signed SoW, scheduled kickoff, final report target date recorded. |
| P1       | Engage SOC 2 CPA                                | Quality & Evidence Lead          | Engagement letter signed and Type 1 fieldwork window recorded.    |
| P1       | Re-run `pnpm ops:check` with authenticated `gh` | Quality & Evidence Lead          | GitHub/org/branch/npm checks pass or produce tracked findings.    |
| P2       | Seed performance trend history                  | Frontier Infrastructure Engineer | At least 3 samples for each budgeted trend metric.                |
| P2       | Run ignored Groth16 UAT tests explicitly        | Cryptographic Security Engineer  | UAT evidence captured for heavy proof circuits.                   |

## Final Verdict

This repo is not a prototype. It is a strong, tested, security-conscious upstream foundation with meaningful degraded-mode and cryptographic implementation depth. It is still not a 9.5+ institutional artifact because several claims depend on external controls not yet completed: pen-test, SOC 2, authenticated GitHub/org verification, trend-backed performance evidence, and explicit heavy-circuit UAT evidence.

**Certified current score:** 8.9/10.
