---
title: 'gtcx-core Master Audit 2026-05-27'
status: 'current'
date: '2026-05-27'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'certification', 'master-audit']
review_cycle: 'quarterly'
audit_type: master
target_repo: gtcx-core
audit_date: '2026-05-27'
composite: 8.9
composite_raw: 8.92
investor: 9.0
enterprise: 8.7
sov_dfi: 9.0
p0_count: 0
p1_count: 1
p2_count: 5
caps_fired: 0
---

# gtcx-core — Master Audit & Bank-Grade Certification

**Date:** 2026-05-27 (delta audit — 1 commit since 2026-05-26)
**Repo:** `gtcx-ecosystem/gtcx-core`
**Auditor:** Kimi Code CLI (root agent)
**Methodology:** `gtcx-ecosystem/tools/audit-framework/forensic-master-prompt.md`
**Reference framework:** `gtcx-ecosystem/tools/audit-framework/SCORING_FRAMEWORK.md`
**Prior master audit:** `master-audit-2026-05-26.md` (8.9/10)
**Delta baseline:** `master-audit-2026-05-26.md` (commit `2e74573`)
**Current HEAD:** `54903f3`

---

## Executive Summary

| Dimension                    |  Score | Rating Band                        |
| ---------------------------- | -----: | ---------------------------------- |
| Core Weighted Score          | 8.9/10 | production-capable with known gaps |
| Investor Lens                | 9.0/10 | strong institutional platform      |
| Enterprise Buyer Lens        | 8.7/10 | production-capable with known gaps |
| African Sovereign / DFI Lens | 9.0/10 | strong institutional platform      |

**Verdict:** `gtcx-core` remains at **8.9/10** with zero score inflation. The single commit since the prior audit delivers minor documentation hygiene and ecosystem consistency improvements: the `baseline-os` coordination contract was added to `AGENTS.md`, numeric package references in code comments were renamed to canonical repo names, and a Sprint S46 tracking skeleton was added. No new findings. All verification gates pass.

**Top 3 priorities for next sprint:**

1. **Select pen-test vendor** from outreach shortlist and execute kickoff — `docs/internal/vendor-outreach-pen-test.md`
2. **Trigger SLSA publish** during operational window — `gh workflow run release.yml`
3. **Monitor upstream AWS SDK** for rustls-webpki fix — `rust/.cargo/audit.toml`

> **Hardcore sanity check:** Forensic verification confirmed no score inflation. All 45 CI tasks pass (typecheck, lint, test, build, architecture, governance, docs, frontmatter, format). Honest recalculation in Section 9.

---

## 1. Initial State (Phase 1 — Pre-Improvement)

Same as prior audit (`2e74573`). No new pre-existing findings introduced. Key carry-forward:

- **[P1] `docs/security/pen-test-engagement-log.md`** — pen-test vendor not selected. _(outreach emails drafted, vendor selection pending)_
- **[P2] `rust/.cargo/audit.toml:39-41`** — 3 `rustls-webpki` RUSTSECs (0098, 0099, 0104) mitigated via documented exceptions; upstream fix pending. _(unchanged)_
- **[P2] `rust/.cargo/audit.toml:15,19`** — 2 unmaintained arkworks transitive dependencies (`derivative`, `paste`) tracked for 0.5 migration. _(unchanged)_
- **[P2] `README.md:47`** — `@gtcx/crypto-native` odd-length-hex NAPI boundary edge case queued for Sprint 2. _(unchanged)_
- **[P2] `packages/api-client/src/index.ts:1`** — `export *` barrel defeats tree-shaking. _(unchanged)_

---

## 2. Doc Cleanup (Phase 2)

Phase 2 skipped — repo has only `/docs/` documentation root. No competing roots to consolidate. Routed directly to Phase 3.

---

## 3. Docs-Standard Compliance (Phase 3)

| Axis                | Score      | Notes                                                            |
| ------------------- | ---------- | ---------------------------------------------------------------- |
| Structural          | 9.5/10     | Canonical taxonomy present; no empty dirs                        |
| Naming              | 9.5/10     | Kebab-case enforced; audit snapshots date-prefixed correctly     |
| Frontmatter         | 9.5/10     | 264/264 docs valid frontmatter (up from 261); standard enforced  |
| Linking             | 10/10      | 404 files checked; zero broken links                             |
| Length              | 9.0/10     | Audit snapshots exempt; architectural docs within 500-line limit |
| Agentic Conventions | 9.5/10     | Conclusion-first; structured data; decisions marked              |
| RAG Indexing        | 10/10      | `baseline.config.ts` excludes archive/templates                  |
| Master INDEX        | 9.5/10     | `docs/README.md` present with all required sections              |
| **Overall**         | **9.4/10** |                                                                  |

- Frontmatter check: 264/264 valid (up from 261 — 3 new docs added with valid frontmatter)
- Link check: 404 files (up from 401)

---

## 3.5. Repo Folder Hygiene (Phase 3.5)

### 8-axis scorecard

| Axis                          | Score      | Notes                                                                 |
| ----------------------------- | ---------- | --------------------------------------------------------------------- |
| 1. Root cleanliness           | 9.5/10     | `AGENTS.md` and agent files present; `.kimi/AGENTS.md` added          |
| 2. Per-directory README       | 9.0/10     | Top-level dirs documented; packages/, rust/, docs/ have READMEs       |
| 3. Build-artifact tracking    | 10/10      | No generated output in git; `.gitignore` complete                     |
| 4. Archive directory handling | 10/10      | `_delete/` removed in commit `9ac824e`; no active content staged      |
| 5. Naming consistency         | 9.0/10     | 14 `export *` barrels noted; class files use PascalCase appropriately |
| 6. File-size outliers         | 10/10      | No tracked files >500KB outside lockfiles                             |
| 7. IDE/OS junk                | 10/10      | `.DS_Store` gitignored; none tracked                                  |
| 8. Empty / orphan directories | 10/10      | No empty dirs outside `rust/target/` (gitignored)                     |
| **Overall**                   | **9.6/10** |                                                                       |

---

## 4. Post-Improvement State (Phase 4 — Re-Audit)

### Closed since 2026-05-26 audit

| Finding                                           | Resolution                                                        | Commit    |
| ------------------------------------------------- | ----------------------------------------------------------------- | --------- |
| No baseline-os coordination contract in AGENTS.md | Added coordination contract with reporting and trust requirements | `54903f3` |
| Numeric package references in code comments       | Renamed to canonical repo names (`gtcx-intelligence`, etc.)       | `54903f3` |
| No current sprint tracking file                   | Added `docs/agile/sprints/current.md` with Sprint S46 skeleton    | `54903f3` |

### New / Remaining

| ID      | Finding                                                             | Severity | Milestone |
| ------- | ------------------------------------------------------------------- | -------- | --------- |
| SEC-007 | 3 `rustls-webpki` vulnerabilities (RUSTSEC-2026-0098/0099/0104)     | P2       | M2        |
| SEC-008 | SLSA provenance awaiting publish trigger                            | P2       | M2        |
| SEC-009 | Pen-test vendor not selected (outreach drafted, selection pending)  | P1       | M2/M3     |
| SEC-010 | 3 org secrets unset (`OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM`) | P2       | M2        |
| RES-006 | Zimbabwe pre-submission email not sent                              | P2       | M2        |
| PERF-01 | 13 performance budget metrics lack trend samples                    | P2       | M3        |

---

## 5. Bank-Grade Scorecard (Phase 5)

> **Note:** These are the claimed scores. The honest recalculation is in Section 9 (Phase 5.5 verification).

### 5.1 Core Dimensions

| Dimension                         | Weight | Score | Confidence | Notes                                                     |
| --------------------------------- | ------ | ----- | ---------- | --------------------------------------------------------- |
| Code Quality                      | 15     | 9.5   | A          | 376 workproof tests; property tests; all CI clean         |
| Repo / Folder Hygiene             | 10     | 9.5   | A          | Phase 3: 9.4; Phase 3.5: 9.6; blended + doc consistency   |
| Security                          | 20     | 8.0   | B          | FIPS verified; cargo audit passes; pen-test pending       |
| Global South Resilience           | 15     | 9.0   | A          | USSD handlers shipped; adaptive mode operational          |
| Ecosystem Integration             | 15     | 9.3   | A          | ADR-012 Stage 0; continental predicates; migration helper |
| Agentic Maturity                  | 10     | 9.2   | A          | Multi-agent infra; handoff protocol; 264/264 frontmatter  |
| Enterprise / Production Readiness | 15     | 8.5   | B          | SLOs present; DR runbook updated; publish window ready    |

**Raw weighted score:** 8.92/10

### 5.2 Caps Applied

| Cap                                      | Triggered? | Triggering finding | New ceiling |
| ---------------------------------------- | ---------- | ------------------ | ----------- |
| Unresolved critical                      | No         | —                  | —           |
| 2+ unresolved high (consequential)       | No         | —                  | —           |
| Money/settlement in process memory       | No         | —                  | —           |
| Non-durable audit on consequential paths | No         | —                  | —           |
| Raw AI output approves consequential     | No         | —                  | —           |
| Local placeholder ecosystem authority    | No         | —                  | —           |
| No safe degraded-mode                    | No         | —                  | —           |

**Final core score:** 8.92/10 → **8.9/10**

### 5.3 Audience Lens Scores

#### Investor / Sequoia-Style Lens

| Area                           | Weight | Score | Notes                                          |
| ------------------------------ | ------ | ----- | ---------------------------------------------- |
| Technical Differentiation      | 25     | 9.5   | Code quality + ecosystem + agentic maturity    |
| Execution Credibility          | 25     | 8.7   | Code quality + security + enterprise readiness |
| Ecosystem Leverage             | 20     | 9.2   | Ecosystem integration + resilience             |
| Commercialization Readiness    | 15     | 8.3   | Enterprise readiness + security                |
| Platform Compounding Potential | 15     | 9.2   | Resilience + ecosystem + agentic maturity      |

**Investor lens score:** 9.0/10 — strong institutional platform

#### Enterprise Buyer Lens

| Area                           | Weight | Score | Notes                                              |
| ------------------------------ | ------ | ----- | -------------------------------------------------- |
| Control Environment            | 25     | 8.6   | Security + enterprise readiness + agentic maturity |
| Security and Auditability      | 25     | 8.0   | FIPS verified; cargo audit clean; pen-test pending |
| Integration Reliability        | 20     | 9.4   | Ecosystem integration + code quality               |
| Operability and Supportability | 15     | 9.0   | Repo hygiene + enterprise readiness + resilience   |
| Deployment Readiness           | 15     | 8.8   | Enterprise readiness + resilience                  |

**Enterprise buyer lens score:** 8.7/10 — production-capable with known gaps

#### African Sovereign / DFI Lens

| Area                           | Weight | Score | Notes                                                       |
| ------------------------------ | ------ | ----- | ----------------------------------------------------------- |
| Mission and Regional Fit       | 15     | 9.0   | African commodity focus; farmer-facing; transparent pricing |
| Global South Resilience        | 25     | 8.8   | Resilience + enterprise readiness (USSD handlers help)      |
| Governance and Trust           | 25     | 8.7   | Security + agentic maturity + audit behavior                |
| Institutional Interoperability | 15     | 9.4   | Ecosystem integration + repo hygiene                        |
| Long-Term Strategic Value      | 20     | 9.2   | Ecosystem integration + resilience + code quality           |

**Sovereign / DFI lens score:** 9.0/10 — strong institutional platform

---

## 6. Sprint Plan (Phase 4 / 6 Synthesis)

| Sprint        | Focus                                            | Status          |
| ------------- | ------------------------------------------------ | --------------- |
| Sprint 1 (M1) | Foundation — CI, FIPS, coverage, API fix         | **Complete**    |
| Sprint 2 (M2) | Hardening — security CI, threat matrix, barrels  | **Complete**    |
| Sprint 3 (M2) | Hardening — Rust refactor, low-bandwidth, USSD   | **Complete**    |
| Sprint 4 (M3) | Certification — pen-test, SOC 2, property tests  | **In Progress** |
| Sprint 5 (M3) | Scale — bundle gates, frontmatter 100%, DR drill | **Pending**     |

---

## 7. Top 5 Remediation Items

| Priority | Item                                                       | Owner                    | Dependency       | Target | Expected Score Lift |
| -------- | ---------------------------------------------------------- | ------------------------ | ---------------- | ------ | ------------------- |
| P1       | Select pen-test vendor and execute kickoff                 | crypto-security-engineer | Vendor selection | M2/M3  | Security +0.5       |
| P2       | Trigger SLSA publish during operational window             | mobile-engineering-lead  | None             | M2     | Enterprise +0.2     |
| P2       | Fix 3 `rustls-webpki` vulnerabilities via AWS SDK upstream | frontier-infra-engineer  | AWS SDK release  | M2     | Security +0.3       |
| P2       | Send Zimbabwe pre-submission email                         | gtm-lead                 | None             | M2     | GTM +0.3            |
| P2       | Populate performance budget trend samples (13 metrics)     | performance-engineer     | CI history       | M3     | Code Quality +0.1   |

---

## 8. One-Point-Uplift Conditions

**To raise core score by 1.0 (8.9 to 9.9):**

- Complete pen-test engagement with report
- Publish SLSA provenance to npm
- Resolve upstream rustls-webpki vulnerabilities
- Conduct DR runbook drill
- Achieve SOC 2 Type 1 readiness

**To raise investor lens by 1.0 (9.0 to 10.0):**

- Land visible external validation artifact (pen-test or SOC 2)
- Send Zimbabwe email and capture first positive response

**To raise enterprise buyer lens by 1.0 (8.7 to 9.7):**

- Complete external validation (pen-test + SOC 2)
- Fix cargo audit vulnerabilities
- Publish SLSA provenance

**To raise sovereign / DFI lens by 1.0 (9.0 to 10.0):**

- Combine hardening with regulator-facing proof
- First sandbox admission or regulator approval letter

---

## 9. Honest Score Recalculation (Phase 5.5 — Forensic Verification)

### 9.1 What Changed

| Claim                    | Original         | Forensic Finding                                                                | Honest                          |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------- | ------------------------------- |
| Test suite fully passing | 45/45 tasks pass | Verified: 376 workproof tests, 45 tasks, 0 failures                             | Same (9.5)                      |
| FIPS 140-3 validated     | CMVP #4816       | `aws-lc-fips-sys` 0.13.14 in `Cargo.lock`; feature flag wired                   | Same (9.5)                      |
| `#![deny(unsafe_code)]`  | All 6 crates     | Verified in all 6 `lib.rs` files; `grep "unsafe {"` returns 0 matches           | Same (10.0)                     |
| Threat matrix 12/12      | Validator passes | `tools/check-threat-matrix.mjs` reads controls; validator passes                | Same (9.0)                      |
| SLSA Build L3            | Aspirational     | NPM_TOKEN present; provenance manifest generates clean; workflow ready          | Same (7.5 sub-score)            |
| Coverage 95% branch      | 19 packages      | Verified via `vitest.config.ts` thresholds; `test:coverage:critical` passes     | Same (9.5)                      |
| USSD protocol            | Config-only (P2) | `packages/connectivity/src/ussd/` has parser.ts, session.ts, types.ts, index.ts | Same (9.0)                      |
| Frontmatter compliance   | 261/261 valid    | 264/264 valid (3 new docs added: current.md + 2 existing fixed)                 | Same (9.5)                      |
| Coordination contract    | Not present      | Added in AGENTS.md with baseline-os reporting and trust requirements            | Repo Hygiene +0.0 (already 9.5) |

### 9.2 Honest Dimension Scores

| Dimension                         | Weight  | Honest Score | Weighted    | Rationale                                            |
| --------------------------------- | ------- | ------------ | ----------- | ---------------------------------------------------- |
| Code Quality                      | 15      | 9.5          | 1.43        | Tests pass; 95% thresholds; all CI clean             |
| Repo / Folder Hygiene             | 10      | 9.5          | 0.95        | Post-remediation state verified; docs consistent     |
| Security                          | 20      | 8.0          | 1.60        | FIPS true; cargo audit passes; pen-test pending      |
| Global South Resilience           | 15      | 9.0          | 1.35        | USSD handlers shipped; adaptive mode operational     |
| Ecosystem Integration             | 15      | 9.3          | 1.40        | ADR-012 Stage 0; continental predicates; handoff     |
| Agentic Maturity                  | 10      | 9.2          | 0.92        | Multi-agent infra; 264/264 frontmatter; safety rules |
| Enterprise / Production Readiness | 15      | 8.5          | 1.28        | SLOs present; publish ready; trends incomplete       |
| **Total**                         | **100** |              | **8.93/10** |                                                      |

### 9.3 Honest Audience Lenses

| Lens          | Claimed | Honest | Delta | Key Driver                             |
| ------------- | ------- | ------ | ----- | -------------------------------------- |
| Investor      | 9.0     | 9.0    | 0.0   | Claims verified; no inflation detected |
| Enterprise    | 8.7     | 8.7    | 0.0   | SLSA gap narrowed; pen-test still P1   |
| Sovereign/DFI | 9.0     | 9.0    | 0.0   | Continental predicates improve fit     |

### 9.4 What This Means for 10/10

The honest gap to 10.0 is **1.07 points**. The highest-leverage items are:

1. **Security external validation** (pen-test + SOC 2) — lifts Security by approximately 1.0 and Enterprise by approximately 0.8
2. **SLSA provenance publish** — lifts Enterprise by approximately 0.2
3. **Upstream rustls-webpki fix** — lifts Security by approximately 0.3
4. **DR runbook drill** — lifts Enterprise by approximately 0.2
5. **Zimbabwe regulator engagement** — lifts Sovereign by approximately 0.3

No score inflation was detected in this delta audit. The single commit since the 2026-05-26 audit delivers incremental hygiene improvements (coordination contract, package naming consistency, sprint tracking). The composite score remains **8.9/10** because these improvements are minor documentation and consistency fixes on an already-high baseline, not material closure of the remaining security and enterprise readiness gaps.

---

## 10. Audit Trail (Commits This Session)

| Phase       | Commit    | What                                                                                 |
| ----------- | --------- | ------------------------------------------------------------------------------------ |
| 3.5 Hygiene | `54903f3` | docs: add coordination contract, fix package naming consistency, add sprint tracking |
| 6. Master   | —         | docs(audit): master forensic certification 2026-05-27 (8.9/10) — this file           |

---

## 11. Forensic Evidence Log

| Gate                    | Command                                             | Result      | Evidence                                        |
| ----------------------- | --------------------------------------------------- | ----------- | ----------------------------------------------- |
| Install                 | `pnpm install`                                      | ✅ Pass     | Lockfile up to date                             |
| TypeCheck               | `pnpm typecheck`                                    | ✅ 40/40    | Zero errors across all packages                 |
| Lint                    | `pnpm lint`                                         | ✅ 40/40    | Zero ESLint errors                              |
| Test                    | `pnpm test`                                         | ✅ 45/45    | 376+ tests passed, 0 failures                   |
| Build                   | `pnpm build`                                        | ✅ 22/22    | All packages build clean                        |
| Format                  | `pnpm format:check`                                 | ✅ Pass     | Prettier clean                                  |
| Architecture            | `pnpm architecture:check`                           | ✅ Pass     | 21 packages, 241 files, zero circular deps      |
| Docs Links              | `pnpm docs:check-links`                             | ✅ Pass     | 404 files, zero broken links                    |
| Docs Frontmatter        | `pnpm docs:check-frontmatter`                       | ✅ Pass     | 264/264 valid                                   |
| Governance              | `pnpm quality:governance:check`                     | ✅ Pass     | 14 scripts, 8 CODEOWNERS, 2 workflows           |
| Performance Budgets     | `pnpm perf:check-budgets`                           | ⚠️ Warnings | 13 metrics lack trend samples                   |
| Secret Scan             | `node tools/check-secrets.mjs`                      | ✅ Pass     | 1,054 files scanned, 0 findings                 |
| Rust Test               | `cd rust && cargo test --workspace`                 | ✅ Pass     | Tests passed, 0 failures                        |
| Rust Clippy             | `cd rust && cargo clippy --workspace --all-targets` | ✅ Pass     | Zero warnings                                   |
| Rust Audit              | `cd rust && cargo audit`                            | ✅ Pass     | 7 documented exceptions, no new vulns           |
| Coverage (verification) | `pnpm test:coverage:critical`                       | ✅ Pass     | 95.2% branch (threshold: 95%)                   |
| Unsafe Code (Rust)      | `grep "unsafe {" rust/*/src/*.rs`                   | ✅ Pass     | 0 matches in production code                    |
| FIPS Verification       | `Cargo.lock` + feature flags                        | ✅ Pass     | `aws-lc-fips-sys` 0.13.14 wired                 |
| Ops Check               | `pnpm ops:check`                                    | ⚠️ 3 warns  | OPENAI_API_KEY, TURBO_TOKEN, TURBO_TEAM missing |

---

## 12. Sign-Off

| Role               | Status  | Date       |
| ------------------ | ------- | ---------- |
| Author             | Drafted | 2026-05-27 |
| CTO                | Pending | —          |
| Head of Security   | Pending | —          |
| Head of Compliance | Pending | —          |
| Repo lead          | Pending | —          |
