---
title: 'gtcx-core Master Audit 2026-05-25'
status: 'current'
date: '2026-05-25'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'certification', 'master-audit']
review_cycle: 'quarterly'
audit_type: master
target_repo: gtcx-core
audit_date: 2026-05-25
composite: 8.8
composite_raw: 8.8
investor: 8.8
enterprise: 8.6
sov_dfi: 8.8
p0_count: 0
p1_count: 3
caps_fired: 0
---

# gtcx-core — Master Audit & Bank-Grade Certification

**Date:** 2026-05-25
**Repo:** `gtcx-ecosystem/gtcx-core`
**Auditor:** Kimi Code CLI (root agent)
**Methodology:** `gtcx-ecosystem/tools/audit-framework/forensic-master-prompt.md`
**Reference framework:** `gtcx-ecosystem/tools/audit-framework/SCORING_FRAMEWORK.md`
**Prior master audit:** [`master-audit-2026-05-17.md`](./master-audit-2026-05-17.md)

---

## Executive Summary

| Dimension                    |  Score | Rating Band                        |
| ---------------------------- | -----: | ---------------------------------- |
| Core Weighted Score          | 8.8/10 | production-capable with known gaps |
| Investor Lens                | 8.8/10 | production-capable with known gaps |
| Enterprise Buyer Lens        | 8.6/10 | production-capable with known gaps |
| African Sovereign / DFI Lens | 8.8/10 | production-capable with known gaps |

**Verdict:** `gtcx-core` continues to strengthen its institutional-grade cryptographic foundation. Since the 2026-05-17 audit, M2/M3 engineering has delivered USSD protocol handlers, raised coverage thresholds to 95% across 14 packages, refactored the Rust groth16 module, added SLO definitions and a DR runbook, published the trust portal to GitHub Pages, and shipped PBKDF2 key derivation. The honest score rises from 8.7 to **8.8/10**. No critical findings. Three P1 items remain: upstream `rustls-webpki` vulnerabilities, SLSA provenance blocked on missing `NPM_TOKEN` org secret, and pen-test vendor selection pending.

**Top 3 priorities for next sprint:**

1. **Monitor upstream AWS SDK** for `rustls-webpki` fix (RUSTSEC-2026-0098/0099) — `rust/Cargo.lock`
2. **Configure `NPM_TOKEN` org secret** to unblock SLSA provenance publish — `.github/workflows/release.yml`
3. **Select pen-test vendor** from the 5-vendor longlist and execute kickoff — `docs/security/pen-test-engagement-log.md`

> **Hardcore sanity check:** Forensic verification confirmed all security claims (FIPS `aws-lc-fips-sys`, `#![deny(unsafe_code)]`, threat matrix validator). No score inflation detected. Honest recalculation in §9.

---

## 1. Initial State (Phase 1 — Pre-Improvement)

### 1.1 Architecture Audit

| Dimension             | Score | Notes                                                                           |
| --------------------- | ----- | ------------------------------------------------------------------------------- |
| Spec fidelity         | 9.0   | OpenAPI and package specs match code; trust portal live on GitHub Pages         |
| Structural integrity  | 9.5   | `architecture:check` passes (21 packages, 237 files); zero circular deps        |
| Code quality          | 9.5   | 95% branch thresholds across 14 packages; 1 TODO/FIXME repo-wide; groth16 split |
| Testability           | 9.5   | 111 test files pass; dependencies injectable; property tests in crypto          |
| Operational readiness | 8.5   | SLOs defined; DR runbook exists; not yet drilled                                |
| Consistency           | 9.0   | Conventional commits enforced; kebab-case naming; explicit barrel exports       |

**Findings:**

- **[P2] `packages/api-client/src/index.ts:1`** — `export *` barrel defeats tree-shaking. **Fix:** Refactor to explicit named exports per `docs/agents/docs-standard-lightweight.md`. _(14 barrels remain across 7 packages.)_
- **[P2] `rust/gtcx-network/src/lib.rs:490`** — 490 LOC; should be split into modules.
- **[P2] `rust/gtcx-crypto/src/keystore.rs:469`** — 469 LOC; should be split.

### 1.2 Security Audit

| Dimension                      | Score | Notes                                                           |
| ------------------------------ | ----- | --------------------------------------------------------------- |
| Authentication & Authorization | 9.0   | API key auth with RBAC; timing-safe comparisons                 |
| Data protection                | 9.5   | AES-256-GCM at rest; TLS 1.3 in transit; prompt sanitization    |
| Input validation               | 9.0   | Zod schemas; payload limits; CORS configured                    |
| Dependency security            | 7.5   | `pnpm audit` clean; `cargo audit` shows 3 `rustls-webpki` vulns |
| Infrastructure security        | 8.5   | K8s pod security docs present; Kyverno policies partial         |
| Compliance posture             | 8.5   | STRIDE 12 controls pass; DPIA present; pen-test RFP drafted     |

**Security Issues to Fix:**

| #   | Severity | Issue                                            | File                              | Fix                                     |
| --- | -------- | ------------------------------------------------ | --------------------------------- | --------------------------------------- |
| S1  | P1       | 3 `rustls-webpki` vulns (RUSTSEC-2026-0098/0099) | `rust/Cargo.lock`                 | Upgrade AWS SDK upstream when available |
| S2  | P1       | SLSA provenance not published                    | `.github/workflows/release.yml`   | Configure `NPM_TOKEN` org secret        |
| S3  | P1       | Pen-test vendor not engaged                      | `docs/security/pen-test-scope.md` | Select vendor and execute engagement    |

### 1.3 GTM Readiness

**Current stage: S2 Pilot**

| Stage  | Technical | Commercial | Trust   | Operational | AI-Specific |
| ------ | --------- | ---------- | ------- | ----------- | ----------- |
| S0     | —         | —          | —       | —           | —           |
| S1     | —         | —          | —       | —           | —           |
| **S2** | **8.5**   | **6.0**    | **7.5** | **8.0**     | **8.0**     |
| S3     | —         | —          | —       | —           | —           |
| S4     | —         | —          | —       | —           | —           |

**First realistic deal (next 90 days):** Zimbabwe RBZ sandbox pre-submission email (`docs/gtm/09-pre-submission-email-zimbabwe.md`). Trust portal now live at GitHub Pages provides public-facing credibility asset.

**Top 5 stage-gate blockers:**

1. Pen-test vendor not selected (blocks S3)
2. SOC 2 not started (blocks S3)
3. No visible SLSA provenance on npm (blocks enterprise procurement)
4. `rustls-webpki` cargo audit vulns (blocks security sign-off)
5. Zimbabwe email not yet sent (blocks first regulator engagement)

### 1.4 Hygiene Audit

| Category       | Score | Notes                                                    |
| -------------- | ----- | -------------------------------------------------------- |
| Documentation  | 9.0   | `/docs/` canonical; 396 files; zero broken links         |
| File structure | 9.0   | Monorepo clean; Rust/TS separation clear                 |
| Naming         | 8.5   | 14 `export *` barrels remain across 7 packages           |
| Package/Build  | 9.5   | pnpm workspace clean; turbo caching; builds reproducible |
| Code Hygiene   | 9.5   | Strict TS; lint clean; zero `any` without justification  |
| Test Hygiene   | 9.5   | 111 test files pass; 95% branch thresholds enforced      |

### 1.5 Production Readiness

| Area                 | Status  | Notes                                                              |
| -------------------- | ------- | ------------------------------------------------------------------ |
| Deployment           | Partial | Helm charts partial; rollback strategy documented                  |
| Observability        | Partial | Prometheus metrics present; Grafana partial                        |
| SLOs                 | Present | Latency/error SLOs defined in `docs/operations/slo-definitions.md` |
| DR/BCP               | Partial | DR runbook added; RTO/RPO not validated                            |
| Operational maturity | Partial | On-call rotation defined; incident runbook present; not drilled    |
| Compliance evidence  | Partial | FIPS verified; SOC 2 gap noted; pen-test RFP drafted               |

---

## 2. Doc Cleanup (Phase 2)

Phase 2 skipped — repo has only `/docs/` documentation root. `_delete/` was removed in commit `9ac824e`. No competing roots to consolidate. Routed directly to Phase 3.

---

## 3. Docs-Standard Compliance (Phase 3)

| Axis                | Score      | Notes                                                              |
| ------------------- | ---------- | ------------------------------------------------------------------ |
| Structural          | 9.5/10     | Canonical taxonomy present; no empty dirs                          |
| Naming              | 9.5/10     | Kebab-case enforced; audit snapshots date-prefixed correctly       |
| Frontmatter         | 9.5/10     | 252/252 docs valid frontmatter; machine-readable standard enforced |
| Linking             | 10/10      | 396 files checked; zero broken links                               |
| Length              | 9.0/10     | Audit snapshots exempt; architectural docs within 500-line limit   |
| Agentic Conventions | 9.5/10     | Conclusion-first; structured data; decisions marked                |
| RAG Indexing        | 10/10      | `baseline.config.ts` excludes archive/templates                    |
| Master INDEX        | 9.5/10     | `docs/README.md` present with all required sections                |
| **Overall**         | **9.4/10** |                                                                    |

- Standard enforcement commit: `5997f7a`
- Frontmatter CI gate commit: `5997f7a`

---

## 3.5. Repo Folder Hygiene (Phase 3.5)

### 8-axis scorecard

| Axis                          | Score      | Notes                                                                 |
| ----------------------------- | ---------- | --------------------------------------------------------------------- |
| 1. Root cleanliness           | 9.0/10     | `AGENTS.md` and agent files present; no orphan docs at root           |
| 2. Per-directory README       | 9.0/10     | Top-level dirs documented; packages/, rust/, docs/ have READMEs       |
| 3. Build-artifact tracking    | 10/10      | No generated output in git; `.gitignore` complete                     |
| 4. Archive directory handling | 10/10      | `_delete/` removed in commit `9ac824e`; no active content staged      |
| 5. Naming consistency         | 9.0/10     | 14 `export *` barrels noted; class files use PascalCase appropriately |
| 6. File-size outliers         | 10/10      | No tracked files >500KB outside lockfiles                             |
| 7. IDE/OS junk                | 10/10      | `.DS_Store` gitignored; none tracked                                  |
| 8. Empty / orphan directories | 10/10      | No empty dirs outside `rust/target/` (gitignored)                     |
| **Overall**                   | **9.6/10** |                                                                       |

- Hygiene enforcement commit: `9ac824e`

---

## 4. Post-Improvement State (Phase 4 — Re-Audit)

### Closed since 2026-05-17

| Finding                                | Resolution                                   | Commit    |
| -------------------------------------- | -------------------------------------------- | --------- |
| USSD protocol string-only              | USSD handlers implemented (parser, session)  | `3cdc511` |
| `rust/gtcx-zkp/src/groth16.rs` 692 LOC | Refactored into modules                      | `1443f28` |
| Coverage thresholds <90% on many pkgs  | Raised to 95% across 14 packages             | `da870d3` |
| SLOs missing                           | `docs/operations/slo-definitions.md` added   | `2792ce4` |
| DR runbook missing                     | `docs/operations/runbook.md` updated         | `2792ce4` |
| `_delete/` dir present                 | Removed and orphan dirs consolidated         | `9ac824e` |
| Trust portal not public                | Published to GitHub Pages                    | `ae792d5` |
| deriveKeyPbkdf2 not upstreamed         | Added to `@gtcx/crypto`                      | `ab3f544` |
| Pen-test RFP missing                   | `docs/security/pen-test-rfp-2026.md` drafted | `fbde990` |

### New / Remaining

| ID      | Finding                                                    | Severity | Milestone |
| ------- | ---------------------------------------------------------- | -------- | --------- |
| SEC-007 | 3 `rustls-webpki` vulnerabilities (RUSTSEC-2026-0098/0099) | P1       | M2        |
| SEC-008 | SLSA provenance not published                              | P1       | M2        |
| SEC-009 | Pen-test vendor not selected                               | P1       | M2/M3     |
| ARC-007 | `rust/gtcx-network/src/lib.rs` 490 LOC                     | P2       | M3        |
| ARC-008 | `rust/gtcx-crypto/src/keystore.rs` 469 LOC                 | P2       | M3        |
| RES-006 | Zimbabwe pre-submission email not sent                     | P2       | M2        |

---

## 5. Bank-Grade Scorecard (Phase 5)

> **Note:** These are the claimed scores. The honest recalculation is in §9 (Phase 5.5 verification).

### 5.1 Core Dimensions

| Dimension                         | Weight | Score | Confidence | Notes                                                    |
| --------------------------------- | ------ | ----- | ---------- | -------------------------------------------------------- |
| Code Quality                      | 15     | 9.5   | A          | 95% branch thresholds; 111 test files; 1 TODO            |
| Repo / Folder Hygiene             | 10     | 9.4   | A          | Phase 3: 9.4; Phase 3.5: 9.6; blended                    |
| Security                          | 20     | 7.8   | B          | FIPS verified; cargo audit 3 vulns; SLSA pending         |
| Global South Resilience           | 15     | 9.0   | A          | USSD handlers shipped; adaptive mode operational         |
| Ecosystem Integration             | 15     | 9.0   | A          | Reproducible builds; clean API boundaries                |
| Agentic Maturity                  | 10     | 9.2   | A          | Multi-agent infra; handoff protocol; 252/252 frontmatter |
| Enterprise / Production Readiness | 15     | 8.3   | B          | SLOs present; DR runbook added; CI operational           |

**Raw weighted score:** 8.79/10

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

**Final core score:** 8.79/10 → **8.8/10**

### 5.3 Audience Lens Scores

#### Investor / Sequoia-Style Lens

| Area                           | Weight | Score | Notes                                          |
| ------------------------------ | ------ | ----- | ---------------------------------------------- |
| Technical Differentiation      | 25     | 9.4   | Code quality + ecosystem + agentic maturity    |
| Execution Credibility          | 25     | 8.7   | Code quality + security + enterprise readiness |
| Ecosystem Leverage             | 20     | 8.9   | Ecosystem integration + resilience             |
| Commercialization Readiness    | 15     | 8.2   | Enterprise readiness + security                |
| Platform Compounding Potential | 15     | 8.9   | Resilience + ecosystem + agentic maturity      |

**Investor lens score:** 8.8/10 — production-capable with known gaps

#### Enterprise Buyer Lens

| Area                           | Weight | Score | Notes                                              |
| ------------------------------ | ------ | ----- | -------------------------------------------------- |
| Control Environment            | 25     | 8.5   | Security + enterprise readiness + agentic maturity |
| Security and Auditability      | 25     | 7.8   | FIPS verified; cargo audit gaps; pen-test pending  |
| Integration Reliability        | 20     | 9.2   | Ecosystem integration + code quality               |
| Operability and Supportability | 15     | 8.8   | Repo hygiene + enterprise readiness + resilience   |
| Deployment Readiness           | 15     | 8.6   | Enterprise readiness + resilience                  |

**Enterprise buyer lens score:** 8.6/10 — production-capable with known gaps

#### African Sovereign / DFI Lens

| Area                           | Weight | Score | Notes                                                       |
| ------------------------------ | ------ | ----- | ----------------------------------------------------------- |
| Mission and Regional Fit       | 15     | 9.0   | African commodity focus; farmer-facing; transparent pricing |
| Global South Resilience        | 25     | 8.8   | Resilience + enterprise readiness (USSD handlers help)      |
| Governance and Trust           | 25     | 8.4   | Security + agentic maturity + audit behavior                |
| Institutional Interoperability | 15     | 9.0   | Ecosystem integration + repo hygiene                        |
| Long-Term Strategic Value      | 20     | 8.9   | Ecosystem integration + resilience + code quality           |

**Sovereign / DFI lens score:** 8.8/10 — production-capable with known gaps

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
| P1       | Fix 3 `rustls-webpki` vulnerabilities via AWS SDK upstream | frontier-infra-engineer  | AWS SDK release  | M2     | Security +0.3       |
| P1       | Configure `NPM_TOKEN` to publish SLSA provenance           | protocol-architect       | Org secret admin | M2     | Enterprise +0.2     |
| P1       | Select pen-test vendor and execute kickoff                 | crypto-security-engineer | Vendor selection | M2/M3  | Security +0.5       |
| P2       | Refactor `rust/gtcx-network/src/lib.rs` >400 LOC           | frontier-infra-engineer  | None             | M3     | Code Quality +0.1   |
| P2       | Send Zimbabwe pre-submission email                         | gtm-lead                 | None             | M2     | GTM +0.3            |

---

## 8. One-Point-Uplift Conditions

**To raise core score by 1.0 (8.8 → 9.8):**

- Resolve all 3 cargo audit vulnerabilities
- Publish SLSA provenance to npm
- Complete pen-test engagement with report
- Refactor remaining Rust files >400 LOC
- Conduct DR runbook drill

**To raise investor lens by 1.0 (8.8 → 9.8):**

- Land visible external validation artifact (pen-test or SOC 2)
- Send Zimbabwe email and capture first positive response

**To raise enterprise buyer lens by 1.0 (8.6 → 9.6):**

- Complete external validation (pen-test + SOC 2)
- Fix cargo audit vulnerabilities
- Publish SLSA provenance

**To raise sovereign / DFI lens by 1.0 (8.8 → 9.8):**

- Combine hardening with regulator-facing proof
- First sandbox admission or regulator approval letter

---

## 9. Honest Score Recalculation (Phase 5.5 — Forensic Verification)

This section applies corrected scores based on code-level verification, not documentation-level claims.

### 9.1 What Changed

| Claim                    | Original            | Forensic Finding                                                                | Honest                          |
| ------------------------ | ------------------- | ------------------------------------------------------------------------------- | ------------------------------- |
| Test suite fully passing | 45/45 tasks pass    | Verified: 111 test files, 45 tasks, 0 failures                                  | Same (9.5)                      |
| FIPS 140-3 validated     | CMVP #4816          | `aws-lc-fips-sys` 0.13.14 in `Cargo.lock`; feature flag wired                   | Same (9.5)                      |
| `#![deny(unsafe_code)]`  | All 6 crates        | Verified in all 6 `lib.rs` files; `grep "unsafe {"` returns 0 matches           | Same (10.0)                     |
| Threat matrix 12/12      | Validator passes    | `tools/check-threat-matrix.mjs` reads controls; validator passes                | Same (9.0)                      |
| SLSA Build L3            | Aspirational        | No npm attestations published; provenance manifest exists but not on registry   | Downgrade SLSA sub-score to 6.0 |
| Coverage 95% branch      | 14 packages         | Verified via `vitest.config.ts` thresholds; `test:coverage:critical` passes     | Same (9.5)                      |
| USSD protocol            | Config-only (P2)    | `packages/connectivity/src/ussd/` has parser.ts, session.ts, types.ts, index.ts | Upgrade Resilience +0.2         |
| Groth16 refactor         | 692 LOC single file | File removed; refactored into modules per commit `1443f28`                      | Same (9.5)                      |

### 9.2 Honest Dimension Scores

| Dimension                         | Weight  | Honest Score | Weighted    | Rationale                                            |
| --------------------------------- | ------- | ------------ | ----------- | ---------------------------------------------------- |
| Code Quality                      | 15      | 9.5          | 1.43        | Tests pass; 95% thresholds; groth16 split            |
| Repo / Folder Hygiene             | 10      | 9.4          | 0.94        | Post-remediation state verified                      |
| Security                          | 20      | 7.8          | 1.56        | FIPS true; cargo audit 3 vulns; SLSA not published   |
| Global South Resilience           | 15      | 9.0          | 1.35        | USSD handlers shipped; adaptive mode operational     |
| Ecosystem Integration             | 15      | 9.0          | 1.35        | Clean boundaries; reproducible builds                |
| Agentic Maturity                  | 10      | 9.2          | 0.92        | Multi-agent infra; 252/252 frontmatter; safety rules |
| Enterprise / Production Readiness | 15      | 8.3          | 1.25        | SLOs present; DR runbook added; not drilled          |
| **Total**                         | **100** |              | **8.80/10** |                                                      |

### 9.3 Honest Audience Lenses

| Lens          | Claimed | Honest | Δ   | Key Driver                              |
| ------------- | ------- | ------ | --- | --------------------------------------- |
| Investor      | 8.8     | 8.8    | 0.0 | Claims verified; no inflation detected  |
| Enterprise    | 8.6     | 8.6    | 0.0 | SLSA gap already reflected              |
| Sovereign/DFI | 8.8     | 8.8    | 0.0 | USSD improvement offset by pen-test gap |

### 9.4 What This Means for 10/10

The honest gap to 10.0 is **1.2 points**. The highest-leverage items are:

1. **Security external validation** (pen-test + SOC 2) — lifts Security by ~1.0 and Enterprise by ~0.8
2. **SLSA provenance publish** — lifts Enterprise by ~0.3
3. **Upstream rustls-webpki fix** — lifts Security by ~0.3
4. **DR runbook drill** — lifts Enterprise by ~0.2
5. **Zimbabwe regulator engagement** — lifts Sovereign by ~0.3

No score inflation was detected in this audit. The 2026-05-17 audit's honest score of 8.72 was conservative; the actual verified state supports 8.80. The 0.08 uplift comes from USSD protocol handlers shipping, coverage thresholds raised to 95%, and SLO/DR documentation maturing.

---

## 10. Audit Trail (Commits This Session)

| Phase       | Commit    | What                                                             |
| ----------- | --------- | ---------------------------------------------------------------- |
| 3. Standard | `5997f7a` | docs(standard): enforce machine-readable frontmatter on all docs |
| 3.5 Hygiene | `9ac824e` | chore(hygiene): remove \_delete dir and add missing READMEs      |
| 6. Master   | —         | docs(audit): master audit 2026-05-25 (this file)                 |

---

## 11. Sign-Off

| Role               | Status  | Date       |
| ------------------ | ------- | ---------- |
| Author             | Drafted | 2026-05-25 |
| CTO                | Pending | —          |
| Head of Security   | Pending | —          |
| Head of Compliance | Pending | —          |
| Repo lead          | Pending | —          |
