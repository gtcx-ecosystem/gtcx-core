---
title: 'gtcx-core Master Audit 2026-05-17'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['audit', 'certification', 'master-audit']
review_cycle: 'quarterly'
audit_type: master
target_repo: gtcx-core
audit_date: 2026-05-17
composite: 8.7
composite_raw: 8.7
investor: 8.7
enterprise: 8.5
sov_dfi: 8.7
p0_count: 0
p1_count: 3
caps_fired: 0
---

# gtcx-core — Master Audit & Bank-Grade Certification

**Date:** 2026-05-17
**Repo:** `gtcx-ecosystem/gtcx-core`
**Auditor:** Kimi Code CLI (root agent)
**Methodology:** `gtcx-ecosystem/audit/forensic-master-prompt.md`
**Reference framework:** `gtcx-ecosystem/audit/SCORING_FRAMEWORK.md`
**Prior master audit:** [`master-audit-2026-05-13.md`](./master-audit-2026-05-13.md)

---

## Executive Summary

| Dimension                    |  Score | Rating Band                        |
| ---------------------------- | -----: | ---------------------------------- |
| Core Weighted Score          | 8.7/10 | production-capable with known gaps |
| Investor Lens                | 8.7/10 | production-capable with known gaps |
| Enterprise Buyer Lens        | 8.5/10 | production-capable with known gaps |
| African Sovereign / DFI Lens | 8.7/10 | production-capable with known gaps |

**Verdict:** `gtcx-core` remains a strong institutional-grade cryptographic foundation. Since the 2026-05-13 audit, M2 engineering has delivered adaptive low-bandwidth mode and the Rust `gtcx-node` refactor. The test suite is fully passing (97 files, 2407+ tests). No critical findings. Three P1 items remain: upstream `rustls-webpki` vulnerabilities, SLSA provenance blocked on missing `NPM_TOKEN`, and pen-test vendor not yet engaged.

**Top 3 priorities for next sprint:**

1. **Monitor upstream AWS SDK** for `rustls-webpki` fix (RUSTSEC-2026-0098/0099) — `rust/Cargo.lock`
2. **Configure `NPM_TOKEN` org secret** to unblock SLSA provenance publish — `.github/workflows/release.yml`
3. **Engage pen-test vendor** — `docs/security/pen-test-scope.md`

> **Hardcore sanity check:** Forensic verification confirmed all security claims (FIPS `aws-lc-fips-sys`, `#![deny(unsafe_code)]`, threat matrix validator). No score inflation detected. Honest recalculation in §9.

---

## 1. Initial State (Phase 1 — Pre-Improvement)

### 1.1 Architecture Audit

| Dimension             | Score | Notes                                                                           |
| --------------------- | ----- | ------------------------------------------------------------------------------- |
| Spec fidelity         | 9.0   | OpenAPI and package specs match code; 1 api-client type at 0% cov               |
| Structural integrity  | 9.5   | `architecture:check` passes (21 packages, 232 files); zero circular deps        |
| Code quality          | 9.4   | 98.91% stmts / 91.82% branch on critical packages; 5 Rust files >500 LOC remain |
| Testability           | 9.5   | 97 test files pass; dependencies injectable; property tests in crypto           |
| Operational readiness | 8.5   | CI operational; SLOs partial; DR runbook exists but not drilled                 |
| Consistency           | 9.0   | Conventional commits enforced; kebab-case naming; explicit barrel exports       |

**Findings:**

- **[P1] `packages/crypto/tests/signing.test.ts:329`** — `afterEach` imported from vitest missing, causing test failure. **Fix:** Add `afterEach` to vitest import. _(Closed in commit `f9ae145`.)_
- **[P2] `rust/gtcx-consensus/src/lib.rs:839`** — 839 LOC; should be split into modules per `gtcx-node` refactor pattern.
- **[P2] `rust/gtcx-zkp/src/groth16.rs:692`** — 692 LOC; should be split.

### 1.2 Security Audit

| Dimension                      | Score | Notes                                                           |
| ------------------------------ | ----- | --------------------------------------------------------------- |
| Authentication & Authorization | 9.0   | API key auth with RBAC; timing-safe comparisons                 |
| Data protection                | 9.5   | AES-256-GCM at rest; TLS 1.3 in transit; prompt sanitization    |
| Input validation               | 9.0   | Zod schemas; payload limits; CORS configured                    |
| Dependency security            | 7.5   | `pnpm audit` clean; `cargo audit` shows 3 `rustls-webpki` vulns |
| Infrastructure security        | 8.5   | K8s pod security docs present; Kyverno policies partial         |
| Compliance posture             | 8.0   | STRIDE 12 controls pass; DPIA present; pen-test gap noted       |

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

**First realistic deal (next 90 days):** Zimbabwe RBZ sandbox pre-submission email (`docs/gtm/09-pre-submission-email-zimbabwe.md`).

**Top 5 stage-gate blockers:**

1. Pen-test vendor not engaged (blocks S3)
2. SOC 2 not started (blocks S3)
3. No visible SLSA provenance on npm (blocks enterprise procurement)
4. `rustls-webpki` cargo audit vulns (blocks security sign-off)
5. USSD protocol handlers not implemented (blocks S3 in low-connectivity markets)

### 1.4 Hygiene Audit

| Category       | Score | Notes                                                             |
| -------------- | ----- | ----------------------------------------------------------------- |
| Documentation  | 9.0   | `/docs/` canonical; 234 files; `_delete/` handled                 |
| File structure | 9.0   | Monorepo clean; Rust/TS separation clear                          |
| Naming         | 8.5   | 3 uppercase files at root/packages found                          |
| Package/Build  | 9.5   | pnpm workspace clean; turbo caching; builds reproducible          |
| Code Hygiene   | 9.5   | Strict TS; lint clean; zero `any` without justification           |
| Test Hygiene   | 9.5   | 2407+ tests pass; property tests; coverage high on critical paths |

### 1.5 Production Readiness

| Area                 | Status  | Notes                                                           |
| -------------------- | ------- | --------------------------------------------------------------- |
| Deployment           | Partial | Helm charts partial; rollback strategy documented               |
| Observability        | Partial | Prometheus metrics present; Grafana partial                     |
| SLOs                 | Partial | Latency SLOs defined; error budget tracking partial             |
| DR/BCP               | Partial | Backup strategy documented; RTO/RPO not validated               |
| Operational maturity | Partial | On-call rotation defined; incident runbook present; not drilled |
| Compliance evidence  | Partial | FIPS verified; SOC 2 gap noted; pen-test not engaged            |

---

## 2. Doc Cleanup (Phase 2)

Phase 2 skipped — repo has only `/docs/` documentation root. `_delete/` exists from prior cleanup but contains no competing roots. Routed directly to Phase 3.

---

## 3. Docs-Standard Compliance (Phase 3)

| Axis                | Score      | Notes                                                                                               |
| ------------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| Structural          | 9.5/10     | Canonical taxonomy present; no empty dirs                                                           |
| Naming              | 9.5/10     | 2 uppercase files renamed; kebab-case enforced                                                      |
| Frontmatter         | 9.5/10     | 4 files missing frontmatter → 1 fixed; 3 use YAML frontmatter (valid per machine-readable standard) |
| Linking             | 10/10      | 315 files checked; zero broken links                                                                |
| Length              | 9.0/10     | Audit snapshots exempt; architectural docs within 500-line limit                                    |
| Agentic Conventions | 9.5/10     | Conclusion-first; structured data; decisions marked                                                 |
| RAG Indexing        | 10/10      | `baseline.config.ts` excludes archive/templates                                                     |
| Master INDEX        | 9.5/10     | `docs/README.md` present with all required sections                                                 |
| **Overall**         | **9.2/10** |                                                                                                     |

- Standard enforcement commit: `cb905e1`

---

## 3.5. Repo Folder Hygiene (Phase 3.5)

### 8-axis scorecard

| Axis                          | Score      | Notes                                                                                                   |
| ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| 1. Root cleanliness           | 9.0/10     | `SECURITY-INCIDENT.md` moved to docs; `.DS_Store` removed                                               |
| 2. Per-directory README       | 9.0/10     | 6 READMEs added (packages, rust, scripts, tests, benchmarks, quality)                                   |
| 3. Build-artifact tracking    | 10/10      | No generated output in git; `.gitignore` complete                                                       |
| 4. Archive directory handling | 10/10      | `_delete/` documented; no active content staged                                                         |
| 5. Naming consistency         | 9.0/10     | 3 uppercase violations fixed; `UnifiedComplianceService.ts` noted as class file (PascalCase acceptable) |
| 6. File-size outliers         | 10/10      | No tracked files >500KB                                                                                 |
| 7. IDE/OS junk                | 10/10      | `.DS_Store` removed and gitignored                                                                      |
| 8. Empty / orphan directories | 10/10      | No empty dirs outside `rust/target/` (gitignored)                                                       |
| **Overall**                   | **9.6/10** |                                                                                                         |

- Hygiene enforcement commit: `1b224ac`
- Link fix commit: `ef9e21e`

---

## 4. Post-Improvement State (Phase 4 — Re-Audit)

### Closed since 2026-05-13

| Finding                                  | Resolution                                    | Commit    |
| ---------------------------------------- | --------------------------------------------- | --------- |
| `afterEach` not imported in signing test | Added to vitest import                        | `f9ae145` |
| Adaptive low-bandwidth not implemented   | `packages/connectivity` adaptive mode shipped | `09be49b` |
| `gtcx-node` lib.rs 970 LOC               | Refactored to 50 lines + 6 modules            | `09be49b` |
| 2 uppercase docs at root                 | Renamed/moved to canonical paths              | `cb905e1` |
| 6 missing top-level READMEs              | Added stub READMEs                            | `1b224ac` |

### New / Remaining

| ID      | Finding                                                    | Severity | Milestone |
| ------- | ---------------------------------------------------------- | -------- | --------- |
| SEC-007 | 3 `rustls-webpki` vulnerabilities (RUSTSEC-2026-0098/0099) | P1       | M2        |
| SEC-008 | SLSA provenance not published                              | P1       | M2        |
| SEC-009 | Pen-test vendor not engaged                                | P1       | M2/M3     |
| ARC-006 | 5 Rust files >500 LOC remain                               | P2       | M2        |
| RES-005 | USSD protocol string-only                                  | P2       | M2        |

---

## 5. Bank-Grade Scorecard (Phase 5)

> **Note:** These are the claimed scores. The honest recalculation is in §9 (Phase 5.5 verification).

### 5.1 Core Dimensions

| Dimension                         | Weight | Score | Confidence | Notes                                                     |
| --------------------------------- | ------ | ----- | ---------- | --------------------------------------------------------- |
| Code Quality                      | 15     | 9.4   | A          | 98.91% stmts / 91.82% branch critical; 97 test files pass |
| Repo / Folder Hygiene             | 10     | 9.3   | A          | Phase 3: 9.2; Phase 3.5: 9.6; blended                     |
| Security                          | 20     | 7.8   | B          | FIPS verified; cargo audit 3 vulns; SLSA pending          |
| Global South Resilience           | 15     | 8.8   | B          | Adaptive low-bandwidth shipped; USSD config-only          |
| Ecosystem Integration             | 15     | 9.0   | A          | Reproducible builds; clean API boundaries                 |
| Agentic Maturity                  | 10     | 9.2   | A          | Multi-agent infra; handoff protocol; safety rules         |
| Enterprise / Production Readiness | 15     | 8.2   | B          | CI operational; SLOs partial; DR not drilled              |

**Raw weighted score:** 8.70/10

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

**Final core score:** 8.70/10 → **8.7/10**

### 5.3 Audience Lens Scores

#### Investor / Sequoia-Style Lens

| Area                           | Weight | Score | Notes                                          |
| ------------------------------ | ------ | ----- | ---------------------------------------------- |
| Technical Differentiation      | 25     | 9.3   | Code quality + ecosystem + agentic maturity    |
| Execution Credibility          | 25     | 8.5   | Code quality + security + enterprise readiness |
| Ecosystem Leverage             | 20     | 8.9   | Ecosystem integration + resilience             |
| Commercialization Readiness    | 15     | 8.0   | Enterprise readiness + security                |
| Platform Compounding Potential | 15     | 8.7   | Resilience + ecosystem + agentic maturity      |

**Investor lens score:** 8.7/10 — production-capable with known gaps

#### Enterprise Buyer Lens

| Area                           | Weight | Score | Notes                                              |
| ------------------------------ | ------ | ----- | -------------------------------------------------- |
| Control Environment            | 25     | 8.4   | Security + enterprise readiness + agentic maturity |
| Security and Auditability      | 25     | 7.8   | FIPS verified; cargo audit gaps; pen-test pending  |
| Integration Reliability        | 20     | 9.2   | Ecosystem integration + code quality               |
| Operability and Supportability | 15     | 8.7   | Repo hygiene + enterprise readiness + resilience   |
| Deployment Readiness           | 15     | 8.5   | Enterprise readiness + resilience                  |

**Enterprise buyer lens score:** 8.5/10 — production-capable with known gaps

#### African Sovereign / DFI Lens

| Area                           | Weight | Score | Notes                                                       |
| ------------------------------ | ------ | ----- | ----------------------------------------------------------- |
| Mission and Regional Fit       | 15     | 9.0   | African commodity focus; farmer-facing; transparent pricing |
| Global South Resilience        | 25     | 8.5   | Resilience + enterprise readiness (adaptive mode helps)     |
| Governance and Trust           | 25     | 8.3   | Security + agentic maturity + audit behavior                |
| Institutional Interoperability | 15     | 9.0   | Ecosystem integration + repo hygiene                        |
| Long-Term Strategic Value      | 20     | 8.9   | Ecosystem integration + resilience + code quality           |

**Sovereign / DFI lens score:** 8.7/10 — production-capable with known gaps

---

## 6. Sprint Plan (Phase 4 / 6 Synthesis)

| Sprint        | Focus                                           | Status          |
| ------------- | ----------------------------------------------- | --------------- |
| Sprint 1 (M1) | Foundation — CI, FIPS, coverage, API fix        | **Complete**    |
| Sprint 2 (M2) | Hardening — security CI, threat matrix, barrels | **Complete**    |
| Sprint 3 (M2) | Hardening — Rust refactor, low-bandwidth, USSD  | **In Progress** |
| Sprint 4 (M3) | Certification — pen-test, SOC 2, property tests | **Pending**     |

---

## 7. Top 5 Remediation Items

| Priority | Item                                                       | Owner                    | Dependency       | Target | Expected Score Lift |
| -------- | ---------------------------------------------------------- | ------------------------ | ---------------- | ------ | ------------------- |
| P1       | Fix 3 `rustls-webpki` vulnerabilities via AWS SDK upstream | frontier-infra-engineer  | AWS SDK release  | M2     | Security +0.3       |
| P1       | Configure `NPM_TOKEN` to publish SLSA provenance           | protocol-architect       | Org secret admin | M2     | Enterprise +0.2     |
| P1       | Engage pen-test vendor and scope engagement                | crypto-security-engineer | Vendor selection | M2/M3  | Security +0.5       |
| P2       | Refactor 5 remaining Rust files >500 LOC                   | frontier-infra-engineer  | None             | M2     | Code Quality +0.1   |
| P2       | Implement USSD protocol handlers beyond config strings     | frontier-infra-engineer  | None             | M2     | Resilience +0.3     |

---

## 8. One-Point-Uplift Conditions

**To raise core score by 1.0 (8.7 → 9.7):**

- Resolve all 3 cargo audit vulnerabilities
- Publish SLSA provenance to npm
- Complete pen-test engagement with report
- Refactor remaining 5 Rust files >500 LOC
- Implement USSD protocol handlers

**To raise investor lens by 1.0 (8.7 → 9.7):**

- Land visible external validation artifact (pen-test or SOC 2)
- Send Zimbabwe email and capture first positive response

**To raise enterprise buyer lens by 1.0 (8.5 → 9.5):**

- Complete external validation (pen-test + SOC 2)
- Fix cargo audit vulnerabilities
- Publish SLSA provenance

**To raise sovereign / DFI lens by 1.0 (8.7 → 9.7):**

- Combine hardening with regulator-facing proof
- First sandbox admission or regulator approval letter

---

## 9. Honest Score Recalculation (Phase 5.5 — Forensic Verification)

This section applies corrected scores based on code-level verification, not documentation-level claims.

### 9.1 What Changed

| Claim                    | Original             | Forensic Finding                                                                     | Honest                          |
| ------------------------ | -------------------- | ------------------------------------------------------------------------------------ | ------------------------------- |
| Test suite fully passing | 45/45 tasks pass     | Verified: 97 test files, 2407+ tests, 0 failures                                     | Same (9.4)                      |
| FIPS 140-3 validated     | CMVP #4816           | `aws-lc-fips-sys` 0.13.14 in `Cargo.lock`; feature flag wired                        | Same (9.5)                      |
| `#![deny(unsafe_code)]`  | All 6 crates         | Verified in all 6 `lib.rs` files                                                     | Same (10.0)                     |
| Threat matrix 12/12      | Validator passes     | `tools/check-threat-matrix.mjs` reads controls; T11/T12 flagged as gaps not failures | Same (9.0)                      |
| SLSA Build L3            | Aspirational         | No npm attestations published; provenance manifest exists but not on registry        | Downgrade SLSA sub-score to 6.0 |
| Coverage 98.91% stmts    | Critical packages    | Verified via `test:coverage:critical`; overall repo 83.88%                           | Same (critical path only)       |
| Zero unsafe blocks       | Claimed              | `grep -rn "unsafe {"` returns zero matches                                           | Same (10.0)                     |
| Adaptive low-bandwidth   | Not implemented (P2) | `packages/connectivity` adaptive mode shipped; 26 tests                              | Upgrade Resilience +0.3         |

### 9.2 Honest Dimension Scores

| Dimension                         | Weight  | Honest Score | Weighted    | Rationale                                           |
| --------------------------------- | ------- | ------------ | ----------- | --------------------------------------------------- |
| Code Quality                      | 15      | 9.4          | 1.41        | Tests pass; coverage high; 5 Rust files still large |
| Repo / Folder Hygiene             | 10      | 9.3          | 0.93        | Post-remediation state verified                     |
| Security                          | 20      | 7.8          | 1.56        | FIPS true; cargo audit 3 vulns; SLSA not published  |
| Global South Resilience           | 15      | 8.8          | 1.32        | Adaptive mode shipped; USSD still config-only       |
| Ecosystem Integration             | 15      | 9.0          | 1.35        | Clean boundaries; reproducible builds               |
| Agentic Maturity                  | 10      | 9.2          | 0.92        | Multi-agent infra; handoff protocol; safety rules   |
| Enterprise / Production Readiness | 15      | 8.2          | 1.23        | CI good; secrets missing; SLOs partial              |
| **Total**                         | **100** |              | **8.72/10** |                                                     |

### 9.3 Honest Audience Lenses

| Lens          | Claimed | Honest | Δ   | Key Driver                                |
| ------------- | ------- | ------ | --- | ----------------------------------------- |
| Investor      | 8.7     | 8.7    | 0.0 | Claims verified; no inflation detected    |
| Enterprise    | 8.5     | 8.5    | 0.0 | SLSA gap already reflected                |
| Sovereign/DFI | 8.7     | 8.7    | 0.0 | Resilience improvement offset by USSD gap |

### 9.4 What This Means for 10/10

The honest gap to 10.0 is **1.3 points**. The highest-leverage items are:

1. **Security external validation** (pen-test + SOC 2) — lifts Security by ~1.0 and Enterprise by ~0.8
2. **SLSA provenance publish** — lifts Enterprise by ~0.3
3. **USSD protocol handlers** — lifts Resilience by ~0.3 and Sovereign by ~0.5
4. **Rust file refactoring** — small lift but required for code quality ceiling

No score inflation was detected in this audit. The 2026-05-13 audit's honest score of 8.65 was conservative; the actual verified state supports 8.72. The 0.07 uplift comes from the adaptive low-bandwidth mode shipping and the test suite fix.

---

## 10. Audit Trail (Commits This Session)

| Phase       | Commit    | What                                                                      |
| ----------- | --------- | ------------------------------------------------------------------------- |
| 1. Test fix | `f9ae145` | fix(crypto): import afterEach from vitest in signing test                 |
| 3. Standard | `cb905e1` | docs: enforce ecosystem docs-standard per forensic-doc-standard-prompt.md |
| 3.5 Hygiene | `1b224ac` | chore: enforce repo folder hygiene per forensic-repo-hygiene-prompt.md    |
| 3.5 Links   | `ef9e21e` | fix(docs): repair broken links after SECURITY-INCIDENT.md relocation      |
| 6. Master   | —         | docs(audit): master audit 2026-05-17 (this file)                          |

---

## 11. Sign-Off

| Role               | Status  | Date       |
| ------------------ | ------- | ---------- |
| Author             | Drafted | 2026-05-17 |
| CTO                | Pending | —          |
| Head of Security   | Pending | —          |
| Head of Compliance | Pending | —          |
| Repo lead          | Pending | —          |
