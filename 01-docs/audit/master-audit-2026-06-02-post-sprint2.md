---
audit_type: master
target_repo: gtcx-core
audit_date: '2026-06-02'
composite: 8.5
composite_raw: 8.47
investor: 8.7
enterprise: 8.3
sov_dfi: 8.6
p0_count: 0
p1_count: 4
p2_count: 3
caps_fired: 0
---

# gtcx-core — Master Audit & Bank-Grade Certification (Post-Sprint 2)

**Date:** 2026-06-02
**Repo:** `gtcx-ecosystem/gtcx-core`
**Auditor:** Kimi Code CLI (k1.6)
**Methodology:** `gtcx-docs/03-platform/tools/audit/audit-framework/prompts/master/comprehensive-audit-prompt.md`
**Reference framework:** `gtcx-docs/03-platform/tools/audit/audit-framework/SCORING_FRAMEWORK.md`
**Prior master audit:** [master-audit-2026-06-02.md](./master-audit-2026-06-02.md) (composite 8.5, commit `bc24da0`)
**Current HEAD:** `c19cd19` (includes Sprint 2 + regression fixes)
**Sprint 2 commit:** `9dbd483` (commodity-agnostic ZKP refactor)

---

## Executive Summary

| Dimension                    |  Score | Rating Band                   |
| ---------------------------- | -----: | ----------------------------- |
| Core Weighted Score          | 8.5/10 | serious production candidate  |
| Investor Lens                | 8.7/10 | strong institutional platform |
| Enterprise Buyer Lens        | 8.3/10 | serious production candidate  |
| African Sovereign / DFI Lens | 8.6/10 | strong institutional platform |

**Verdict:** Production-capable cryptographic foundation. Sprint 2 delivers a well-designed commodity-agnostic ZKP circuit with backward-compatible diamond wrapper and Bulletproofs range proofs. However, Sprint 2 introduced a coverage regression in `03-platform/packages/crypto` (new ZKP wrapper files at 41-62% statements, below the 95% threshold), breaking the `test:coverage` gate. Pre-existing test regressions (network package `vi` undefined, empty provenance test suite) and 5 broken links were resolved during this audit session. External attestation (pen-test, SOC 2) remains the boundary between S2 Pilot and S3 Production.

**Top 3 priorities for next sprint:**

1. Close coverage gap on Sprint 2 ZKP wrappers — `03-platform/packages/crypto/src/zkp-commodity-origin.ts` (41.17% stmts) and `zkp-diamond-origin.ts` (62.5% stmts) must reach 95% threshold (`03-platform/packages/crypto/vitest.config.ts:12-15`)
2. Resolve `@gtcx/ai-eval` provenance publish (public repo visibility decision) or update trust portal to reflect unattested state
3. Batch-fix ~315 docs with frontmatter errors via scripted enforcement (`pnpm docs:check-frontmatter`)

> **Hardcore sanity check:** Forensic verification found the Sprint 2 commit message claimed "typecheck 42/42 pass" and "all tests pass," but a fresh checkout fails typecheck until `pnpm build` runs (stale dist/ artifacts), and `test:coverage` fails on the crypto package due to new ZKP wrapper files. Honest recalculation in §9.

**Cryptographic moat assessment (new):** See [`algorithmic-moat-sprint2-assessment.md`](./algorithmic-moat-sprint2-assessment.md) for feature-specific scoring of ZKP circuits (7.0/10) and [`moat-dimension-roadmap-10-10.md`](./moat-dimension-roadmap-10-10.md) for the per-dimension path to 10/10 defensibility.

---

## 1. Initial State (Phase 1 — Pre-Improvement)

Phase 1 baseline is commit `9dbd483` (Sprint 2 just landed, before regression fixes).

### 1.1 Architecture Audit

| Dimension             | Score | Top Issue Dragging Score Down                                                        |
| --------------------- | ----: | ------------------------------------------------------------------------------------ |
| Spec fidelity         |  6/10 | Sprint 2 commit claims "typecheck 42/42 pass" but fresh checkout fails (stale dist/) |
| Structural integrity  | 10/10 | `architecture:check` — 0 boundary violations (22 packages, 254 source files)         |
| Code quality          |  9/10 | Architecture line-count violation fixed (crypto-native 606→247 LOC + extraction)     |
| Testability           |  8/10 | DI in domain/api-client; 2 test regressions + 1 empty suite; coverage gate broken    |
| Operational readiness |  9/10 | 45+ CI steps; fuzz evidence on record; provenance manifest tracked                   |
| Consistency           |  8/10 | Duplicate YAML frontmatter blocks; 315 docs with frontmatter errors                  |

**P0:** None.

**P1:**

- **[P1] Coverage regression from Sprint 2 ZKP wrappers** `03-platform/packages/crypto/src/zkp-commodity-origin.ts:56-134` (41.17% stmts), `03-platform/packages/crypto/src/zkp-diamond-origin.ts:82,106-119` (62.5% stmts) — new commodity-agnostic and diamond wrapper files fall well below the 95% threshold defined in `03-platform/packages/crypto/vitest.config.ts:12-15`. This causes `pnpm --filter @gtcx/crypto test:coverage` to fail. Fix: add unit tests that mock `loadNativeZkp()` to exercise validation paths and error branches without requiring the compiled NAPI binary; add integration tests under `GTCX_RUN_HEAVY_ZKP_TESTS` gate for end-to-end paths.

- **[P1] Stale dist/ artifacts break typecheck on fresh checkout** `03-platform/packages/crypto/dist/index.d.ts` — after Sprint 2, downstream packages (`identity`, `security`, `services`, `verification`) cannot resolve `@gtcx/crypto` types until `pnpm build` regenerates dist artifacts. The commit message claimed "typecheck 42/42 pass" but this is only true after a prior build. Fix: add a `prepare` or `pretypecheck` build step for `@gtcx/crypto` and `@gtcx/crypto-native`, or ensure dist is regenerated in CI before typecheck.

- **[P1] Package count drift across operational docs** `01-docs/specs/03-platform/packages/README.md:17`, `01-docs/devops/runbooks/quality-runbook.md:46-49`, `01-docs/stack/tech-stack.md:54` — claims 18, 21, or 22 packages inconsistently. Fix: scripted manifest from `pnpm-workspace.yaml`.

**P2:**

- **[P2] Verification templates.ts approaching LOC ceiling** `03-platform/packages/verification/src/certificates/templates.ts:468` — future growth triggers gate failure.
- **[P2] Offline queue ownership split** `03-platform/packages/sync/src/index.ts` vs `03-platform/packages/domain/src/internal/offline-queue.ts:36,205` — integrator confusion.
- **[P2] Rust P2P transport scaffolding only** `rust/gtcx-network/03-platform/src/lib.rs:15-18` — types only, integration planned Phase 2.

### 1.2 Security Audit

| Dimension                      | Score | Evidence                                                           |
| ------------------------------ | ----: | ------------------------------------------------------------------ |
| Authentication & Authorization |   N/A | Library has no auth surface; scoped in threat model                |
| Data protection                |  9/10 | `sanitizeSecrets` / `redactSecrets` present; AES-GCM offline paths |
| Input validation               |  9/10 | Zod across schemas/verification; `assertHex64` at NAPI boundary    |
| Dependency security            |  7/10 | `pnpm audit` clean TS; Rust 6 ignored RUSTSECs with justification  |
| Infrastructure security        |  8/10 | `#![deny(unsafe_code)]` verified; zero `unsafe` blocks             |
| Compliance posture             |  6/10 | Framework docs present; **external attestation not delivered**     |

**Sprint 2 Security Delta:**

The commodity-agnostic circuit design is architecturally sound:

- **Circuit consolidation** eliminates near-duplicate `DiamondOriginCircuit`, reducing trusted setup surface area from N circuits to 1 (`rust/gtcx-zkp/03-platform/src/groth16/mod.rs:306-536`).
- **R1CS constraints verified** — `CommodityOriginCircuit::generate_constraints` enforces: GPS bounds (4× `uint64_is_ge`), metric thresholds (2× `uint64_is_ge`), commitments (3× SHA-256), region hash (1× SHA-256), Merkle membership (`path.verify_membership`).
- **Certification flags moved to public input** (line 341: `_certification_flags = UInt64::new_input`) — correct design. KP policy is verified off-chain by the verifier, not constrained in R1CS. This preserves policy flexibility and simplifies the circuit.
- **NAPI bindings** validate bounds length (`bounds.len() != 4` → error at `rust/gtcx-node/03-platform/src/groth16.rs:138-142`) and decode hex inputs via `decode_32_bytes`.
- **TypeScript wrappers** validate hex lengths (`assertHex64`, `assertHexEven`) before passing to native layer (`03-platform/packages/crypto/src/zkp-commodity-origin.ts:46-58`).

**P1:**

- **[P1] Pen-test vendor not selected** `01-docs/09-security/pen-test-engagement-log.md:42-47` — enterprise/sovereign procurement gate.
- **[P1] SOC 2 Type 1 letter not received** `README.md:39-43` — bank-grade claims require third-party attestation.

**P2:**

- **[P2] Rust transitive advisories accepted** `rust/.cargo/audit.toml:11-41` — `derivative`, `paste`, `rustls-webpki` RUSTSECs. Track upstream migration.
- **[P2] ai-eval uses `execSync` for git diff** `03-platform/packages/ai-eval/src/safety.ts:35-38` — dev/CI tooling only; confined to eval CLI.

### 1.3 GTM Readiness

| Stage         | Technical | Commercial | Trust     | Operational | AI-Specific | Overall         |
| ------------- | --------- | ---------- | --------- | ----------- | ----------- | --------------- |
| S0 Prototype  | Ready     | Ready      | Ready     | Ready       | Ready       | Ready           |
| S1 MVP        | Ready     | Ready      | Ready     | Ready       | Ready       | Ready           |
| S2 Pilot      | Partially | Partially  | Partially | Partially   | Partially   | Partially Ready |
| S3 Production | Partially | Partially  | Not Ready | Partially   | Partially   | Partially Ready |
| S4 Scale      | Not Ready | Not Ready  | Not Ready | Not Ready   | Not Ready   | Not Ready       |
| S5 Defense    | Not Ready | Not Ready  | Not Ready | Not Ready   | Not Ready   | Not Ready       |

**Current stage: S2 Pilot → S3 Production boundary.**

**First realistic deal (90 days):** Zimbabwe or Ghana minerals-commission sandbox — regulator reviews trust portal + npm packages + sample verification flow.

**Top 5 stage-gate blockers:**

1. Pen-test vendor selection and report delivery
2. SOC 2 Type 1 attestation timeline
3. Publish `@gtcx/ai-eval` with provenance (0.1.1 on npm, **no attestation**)
4. Per-jurisdiction config E2E validation for 5 target states
5. README/trust-portal doc accuracy (regulator first impression)

**90-day copy test:**

- Copyable: Ed25519 + noble/arkworks stack
- NOT copyable: Sovereign engagement evidence, relationships, audit trail
- Moat: Integration depth + ops maturity + verifiable evidence chain

### 1.4 Hygiene Audit

| Category          | Score | Issues                                                              |
| ----------------- | ----: | ------------------------------------------------------------------- |
| Documentation     |  8/10 | 315 frontmatter errors; README blocker stale; 5 broken links        |
| File structure    | 10/10 | Clean root; 03-platform/packages/, rust/, 01-docs/ well partitioned |
| Naming            |  9/10 | Kebab-case docs; `@gtcx/*` consistent; 2 non-canonical doc names    |
| Package / Build   | 10/10 | Turbo pipeline; no tracked dist/; check:dist passes                 |
| Code hygiene      |  9/10 | No `@ts-ignore` in crypto src; 0 unsafe Rust; strict TS             |
| Test hygiene      |  7/10 | ≥95% branch gate claimed; crypto coverage now 94.51% (below)        |
| CI/CD             | 10/10 | ci.yml — lint, test, coverage, rust, CodeQL, provenance             |
| Dependency health |  8/10 | pnpm clean; Rust ignores documented                                 |
| Git hygiene       |  9/10 | Signed commits required; branch protection verified                 |
| Monorepo          |  9/10 | Boundaries enforced; minor doc count drift                          |

### 1.5 Production Readiness

| Area              | Rating           | Evidence                                                   |
| ----------------- | ---------------- | ---------------------------------------------------------- |
| Deployment        | Mostly Ready     | release.yml; 21/21 core on npm with provenance; changesets |
| Monitoring        | Gaps             | telemetry exists; no consumer SLO/runbook for integrators  |
| Incident Response | Mostly Ready     | incident-runbook.md — P0 crypto patch SLA 24h              |
| Disaster Recovery | N/A / Gaps       | Library repo — DR is downstream; no data plane             |
| Capacity          | Mostly Ready     | perf:check-budgets in CI; benchmark history                |
| Dependencies      | Production-Ready | Circuit breaker, bulkhead, adaptive retry in resilience    |

---

## 2. Doc Cleanup (Phase 2)

**State at audit start:** `/01-docs/`-only — no competing roots (`_sop/`, `_cannon/`, `wiki/`, `documentation/`).

Phase skipped — repo has only `/01-docs/` documentation root. The structure work that flat-`/01-docs/` repos sometimes need is performed in Phase 3 (docs-standard enforcement), not Phase 2 (cleanup is for consolidating competing roots).

No commit produced for this phase.

---

## 3. Docs-Standard Compliance (Phase 3)

| Axis                |      Score | Notes                                                                          |
| ------------------- | ---------: | ------------------------------------------------------------------------------ |
| Structural          |     9.0/10 | Canonical taxonomy present; 350+ docs across 35 subdirs                        |
| Naming              |     9.5/10 | 2 violations: `ROADMAP-2026-07-13.md`, `RUSTSEC-rustls-webpki-mitigation.md`   |
| Frontmatter         |     6.5/10 | ~315 substantive docs missing Status/Date/Owner header                         |
| Linking             |     9.0/10 | **5 broken links fixed during this session** (was 8.0)                         |
| Length              |     9.0/10 | No operational doc >300 lines; no architectural doc >500 lines                 |
| Agentic Conventions |     8.0/10 | Conclusion-first and structured data present; some docs lack negative scope    |
| RAG Indexing        |     9.5/10 | `baseline.config.ts` excludes archive/templates correctly                      |
| Master INDEX        |     8.5/10 | `01-docs/README.md` exists; some audit file bloat (many master-audit variants) |
| **Overall**         | **8.5/10** |                                                                                |

**Violations fixed (this session):**

| Violation                   | Files Affected                                                     | Resolution                                             |
| --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| Broken cross-repo link      | `.baseline/memory/README.md:23`                                    | Changed to backtick text reference                     |
| Broken cross-repo link      | `01-docs/05-audit/external-dependencies-register-2026-05-28.md:69` | Changed to plain text reference                        |
| Broken cross-repo link (×2) | `01-docs/05-audit/master-audit-2026-05-28.md:33-34`                | Changed to backtick text references                    |
| Broken internal link        | `01-docs/stack/README.md:25`                                       | Linked to `../release/versioning/versioning-policy.md` |

**Violations remaining:**

- `01-docs/roadmap/ROADMAP-2026-07-13.md` — non-canonical name (date prefix on permanent doc)
- `01-docs/09-security/RUSTSEC-rustls-webpki-mitigation.md` — non-canonical name (ALL_CAPS)
- ~315 docs missing frontmatter — deferred; batch fix recommended
- Multiple master-audit variants in `01-docs/05-audit/` — recommend moving experimental variants to `_historical/`

Commit: `c19cd19` (included in regression-fix commit)

---

## 4. Post-Improvement State (Phase 4 — Re-Audit)

Phase 4 reflects the repo state after commit `c19cd19` (test regressions and broken links resolved).

### Updated Architecture

- Structural integrity remains 10/10; `architecture:check` passes (22 packages, 254 source files).
- Spec fidelity improved to 7/10 after link fixes, but stale dist/ typecheck issue remains on fresh checkout.
- Architecture line-count violation **closed** — `03-platform/packages/crypto-native/src/index.ts` extracted from 606→247 LOC, `zkp-bindings.ts` created at 427 LOC.

### Updated Security

- FIPS feature flag verified in `Cargo.lock` (`aws-lc-fips-sys` present).
- SLSA Source L2 enforced (signed commits verified).
- SLSA Build L3: 21/21 core packages have npm provenance; `@gtcx/ai-eval@0.1.1` published **without** provenance.
- Sprint 2 circuit design reviewed: no new security issues introduced.

### Updated Hygiene

- No tracked build artifacts.
- Root cleanliness strong.
- **Broken links: 0** (was 5).
- **Test regressions: 0** (was 2 network failures + 1 empty suite).
- **Coverage gate: still broken** on crypto package due to Sprint 2 files.

---

## 5. Bank-Grade Scorecard (Phase 5)

> **Note:** These are the claimed scores. The honest recalculation is in §9 (Phase 5.5 verification).

### 5.1 Core Dimensions

| Dimension                         | Weight | Score | Confidence | Notes                                                                            |
| --------------------------------- | -----: | ----: | ---------- | -------------------------------------------------------------------------------- |
| Code Quality                      |     15 |   9.2 | A          | Critical crypto files 100% covered; property tests; architecture violation fixed |
| Repo / Folder Hygiene             |     10 |   8.1 | B          | Strong structure; 5 broken links fixed; frontmatter gaps remain                  |
| Security                          |     20 |   8.5 | A          | FIPS verified; SLSA L2 enforced; circuit consolidation improves posture          |
| Global South Resilience           |     15 |   8.5 | B          | Offline queue + connectivity detector; network flakiness fixed                   |
| Ecosystem Integration             |     15 |   8.8 | A          | 22 packages; downstream pinning; ai-eval provenance gap                          |
| Agentic Maturity                  |     10 |   8.5 | B          | ai-eval pipeline exists; not wired to CI gate; trust gating documented           |
| Enterprise / Production Readiness |     15 |   7.8 | B          | Release pipeline strong; provenance policy fragile; external attestation missing |

**Raw weighted score:** 8.47/10

### 5.2 Caps Applied

| Cap                                      | Triggered? | Triggering finding | New ceiling |
| ---------------------------------------- | ---------- | ------------------ | ----------- |
| Unresolved critical                      | N          | —                  | —           |
| 2+ unresolved high (consequential)       | N          | —                  | —           |
| Money/settlement in process memory       | N          | —                  | —           |
| Non-durable audit on consequential paths | N          | —                  | —           |
| Raw AI output approves consequential     | N          | —                  | —           |
| Local placeholder ecosystem authority    | N          | —                  | —           |
| No safe degraded-mode                    | N          | —                  | —           |

**Final core score:** 8.5/10

### 5.3 Audience Lens Scores

#### Investor / Sequoia-Style Lens

| Area                           | Weight | Score | Notes                                                                   |
| ------------------------------ | -----: | ----: | ----------------------------------------------------------------------- |
| Technical Differentiation      |     25 |   8.8 | Crypto primitives + ZKP circuits + provenance tooling                   |
| Execution Credibility          |     25 |   8.8 | Gates pass; audit trail strong; consistent shipping; coverage gap noted |
| Ecosystem Leverage             |     20 |   8.8 | Downstream pinning + shared primitives; compounding value               |
| Commercialization Readiness    |     15 |   7.8 | Library adoption is S1; sovereign pilot blockers are external           |
| Platform Compounding Potential |     15 |   8.8 | Trust portal + repeatable evidence + ecosystem integration              |

**Investor lens score:** 8.7/10 — strong institutional platform

#### Enterprise Buyer Lens

| Area                           | Weight | Score | Notes                                                                  |
| ------------------------------ | -----: | ----: | ---------------------------------------------------------------------- |
| Control Environment            |     25 |   8.2 | Strong controls; pen-test/SOC are external blockers; coverage gap      |
| Security and Auditability      |     25 |   8.5 | Threat matrix + evidence; open alerts mitigated but visible            |
| Integration Reliability        |     20 |   8.8 | Package boundaries enforced; downstream pinning policy clear           |
| Operability and Supportability |     15 |   7.8 | Library-only; operational posture lives downstream                     |
| Deployment Readiness           |     15 |   7.8 | CI/release strong; provenance requires public repo + OIDC; ai-eval gap |

**Enterprise buyer lens score:** 8.3/10 — serious production candidate

#### African Sovereign / DFI Lens

| Area                           | Weight | Score | Notes                                                                  |
| ------------------------------ | -----: | ----: | ---------------------------------------------------------------------- |
| Mission and Regional Fit       |     15 |   9.0 | Explicit Global South framing; offline resilience posture              |
| Global South Resilience        |     25 |   8.5 | Good primitives; live deployment evidence is downstream; network fixed |
| Governance and Trust           |     25 |   8.5 | Trust portal strong; provenance publish must remain public             |
| Institutional Interoperability |     15 |   8.5 | Evidence and compliance mappings exist; sandbox package is infra-owned |
| Long-Term Strategic Value      |     20 |   8.8 | Compounding trust layer with verifiable evidence                       |

**Sovereign / DFI lens score:** 8.6/10 — strong institutional platform

---

## 6. Sprint Plan (Phase 4 / 6 Synthesis)

### Sprint 1: Close Sprint 2 coverage gap (1 week)

**Goal:** Bring crypto package coverage back above 95% threshold.

**Deliverables:**

- Add mock-based unit tests for `zkp-commodity-origin.ts` validation paths (lines 56-134) without requiring native NAPI binary
- Add mock-based unit tests for `zkp-diamond-origin.ts` wrapper logic (lines 82, 106-119)
- Verify `pnpm --filter @gtcx/crypto test:coverage` passes with 0 threshold violations

**Acceptance:** Coverage report shows ≥95% stmts/branch/funcs/lines for crypto package.

**Risk:** Low — mechanical testing; mock `loadNativeZkp()` to throw and exercise error branches.

### Sprint 2: Publish substrate + provenance (1 week)

**Goal:** 21/21 core + ai-eval on npm with provenance evidence populated.

**Deliverables:**

- Publish `@gtcx/ai-eval` with provenance (requires public repo visibility)
- Populate trust-portal provenance column
- Run `release:ga:evidence:check` post-publish

**Acceptance:** All packages on npm with attestations; trust portal table complete.

**Risk:** Medium — blocked by repo visibility policy decision.

### Sprint 3: Sovereign pilot hardening (1 week)

**Goal:** Five target jurisdictions have validated config paths.

**Deliverables:**

- E2E jurisdiction fixtures ZW/GH/NA/BW/CD
- Document offline canonical path (domain vs sync)
- Split verification templates if >500 LOC

**Acceptance:** Jurisdiction tests green; integration test demonstrates replay ordering.

**Risk:** Medium — requires fixture data.

### Sprint 4: External trust (1 week)

**Goal:** Pen-test kicked off; sandbox emails sent.

**Deliverables:**

- Select pen-test vendor + sign SoW
- Send sandbox intro (ZW or GH)
- SOC 2 CPA kickoff

**Acceptance:** Pen-test log shows vendor + kickoff date.

**Risk:** High — external calendar dependency.

### Sprint 5: Build artifact hygiene + doc standard (1 week)

**Goal:** Fresh checkout passes all gates without manual `pnpm build`.

**Deliverables:**

- Add turbo dependency graph so `pnpm typecheck` auto-builds crypto/crypto-native first
- Batch-fix frontmatter on ~315 docs using scripted enforcement
- Normalize remaining non-canonical doc names

**Acceptance:** `git clone && pnpm install && pnpm typecheck && pnpm test` passes on clean machine.

**Risk:** Low — tooling changes.

### Sprint 6: Evidence automation (1 week)

**Goal:** Every release ships machine-readable trust evidence.

**Deliverables:**

- Wire `pnpm ai:evaluate` into CI (non-blocking)
- Published fuzz summary per release

**Acceptance:** Trust compounding per release.

---

## 7. Top 5 Remediation Items

| Priority | Item                                                                                       | Owner                    | Dependency                  | Target    | Expected Score Lift     |
| -------- | ------------------------------------------------------------------------------------------ | ------------------------ | --------------------------- | --------- | ----------------------- |
| P1       | Close crypto coverage gap: mock-test `zkp-commodity-origin.ts` and `zkp-diamond-origin.ts` | developer                | None                        | 3 days    | +0.2 Code Quality       |
| P1       | Fix stale dist/ typecheck issue (auto-build before typecheck)                              | developer                | None                        | 2 days    | +0.1 Code Quality       |
| P1       | Resolve `@gtcx/ai-eval` provenance publish or update trust portal                          | platform / release owner | GitHub visibility policy    | 1 week    | +0.2 Security/Ecosystem |
| P2       | Batch-fix 315 docs with frontmatter errors                                                 | quality-evidence-lead    | None                        | 1 week    | +0.3 Repo Hygiene       |
| P2       | Resolve `rustls-webpki` high alert by upgrading transitive AWS SDK chain                   | crypto-security-engineer | Upstream dependency release | 2–6 weeks | +0.1 Security           |

---

## 8. One-Point-Uplift Conditions

**To raise core score by 1.0:** Close crypto coverage gap (≥95% all metrics), fix stale dist typecheck, publish ai-eval with provenance, resolve rustls-webpki upstream, deliver pen-test report + SOC 2 Type 1 evidence.

**To raise investor lens by 1.0:** Demonstrate sovereign pilot closure (infra XC) + ai-eval publish completion + automated evidence pipeline per release.

**To raise enterprise buyer lens by 1.0:** Deliver third-party pen-test report + SOC 2 Type 1 (or equivalent) + demonstrate stable release provenance without policy toggles + zero open high-severity dependency alerts.

**To raise sovereign / DFI lens by 1.0:** Complete infrastructure-run live testnet evidence package + submit first sandbox pack with regulator responses + keep provenance and evidence chain verifiable without special access.

---

## 9. Honest Score Recalculation (Phase 5.5 — Forensic Verification)

This section applies corrected scores based on code-level verification, not documentation-level claims.

### 9.1 What Changed

| Claim                       | Original (Sprint 2 commit)       | Forensic Finding                                                                                            | Honest                               |
| --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| "typecheck 42/42 pass"      | Claimed in commit `9dbd483`      | Fails on fresh checkout (4 packages: identity, security, services, verification) until `pnpm build`         | Passes only after build; dist/ stale |
| "all tests pass"            | Claimed in commit `9dbd483`      | 2 network test failures (`vi` undefined) + 1 empty test suite (`npm-provenance-utils.test.mjs`)             | Fixed in `c19cd19`; now all pass     |
| Crypto coverage             | "100% statements" (prior audit)  | Package-level: 94.51% stmts, 96% branch, 94.59% funcs, 94.25% lines (below 95% threshold)                   | Critical files 100%; package 94.51%  |
| Sprint 2 ZKP coverage       | Not claimed                      | `zkp-commodity-origin.ts` 41.17% stmts; `zkp-diamond-origin.ts` 62.5% stmts; `zkp-commodity-range.ts` 93.1% | Below threshold; gate fails          |
| Security coverage           | "≥95% branch gate" (prior audit) | 97.37% stmts, 97.08% branch (@gtcx/security)                                                                | Confirmed                            |
| FIPS 140-3                  | "Verified (CMVP #4816)"          | `aws-lc-fips-sys` present in `Cargo.lock`                                                                   | Confirmed                            |
| SLSA Build L3               | "Aspirational"                   | `@gtcx/crypto@3.1.4` has SLSA provenance attestation                                                        | Partial — 21/22                      |
| Zero unsafe Rust            | Claimed                          | `grep -rn "unsafe {"` returns zero hits                                                                     | Confirmed                            |
| Architecture boundary check | "Pass"                           | `pnpm architecture:check` passes (22 pkgs, 254 files)                                                       | Confirmed                            |
| Bundle budgets              | "Pass"                           | `pnpm bundle:check-budgets` passes (21 packages)                                                            | Confirmed                            |

### 9.2 Coverage Deep Dive

**@gtcx/crypto coverage (post-Sprint 2):**

| File                      |   % Stmts | % Branch | Notes                           |
| ------------------------- | --------: | -------: | ------------------------------- |
| `fips-backend.ts`         |       100 |      100 | Critical path — 100%            |
| `fips.ts`                 |       100 |      100 | Critical path — 100%            |
| `hashing.ts`              |       100 |      100 | Critical path — 100%            |
| `keys.ts`                 |       100 |      100 | Critical path — 100%            |
| `signing.ts`              |       100 |      100 | Critical path — 100%            |
| `zkp.ts`                  |       100 |      100 | Core ZKP engine — 100%          |
| `zkp-commodity-origin.ts` |     41.17 |    58.33 | **Sprint 2 — below threshold**  |
| `zkp-diamond-origin.ts`   |      62.5 |       75 | **Sprint 2 — below threshold**  |
| `zkp-commodity-range.ts`  |      93.1 |    66.66 | Sprint 2 — close, branch gap    |
| **Package total**         | **94.51** |   **96** | **Below 95% stmts/funcs/lines** |

**Root cause:** The new ZKP wrapper files (`zkp-commodity-origin.ts`, `zkp-diamond-origin.ts`) contain `loadNativeZkp()` calls that throw when the NAPI binary is unavailable. Most code paths (key generation, proving, verifying) are only exercised when the native module is present. The existing tests mock/spy at the engine level (`zkp.test.ts`) but do not unit-test the wrapper files in isolation.

**Fix direction:** Mock `require('@gtcx/crypto-native')` at the module level to exercise validation branches, error handling, and input sanitization without the binary.

### 9.3 Honest Dimension Scores

| Dimension                         | Weight  | Honest Score | Weighted             | Rationale                                                                        |
| --------------------------------- | ------- | ------------ | -------------------- | -------------------------------------------------------------------------------- |
| Code Quality                      | 15      | 9.0          | 135.0                | Critical files 100%; package coverage below threshold drags from 9.2             |
| Repo / Folder Hygiene             | 10      | 8.1          | 81.0                 | Links fixed; frontmatter gaps real; non-canonical names remain                   |
| Security                          | 20      | 8.5          | 170.0                | FIPS confirmed; SLSA 21/22 (ai-eval gap); open rustls-webpki alert               |
| Global South Resilience           | 15      | 8.5          | 127.5                | OfflineQueue + ConnectivityDetector confirmed; network flakiness fixed           |
| Ecosystem Integration             | 15      | 8.8          | 132.0                | 22 packages confirmed; ai-eval provenance gap                                    |
| Agentic Maturity                  | 10      | 8.5          | 85.0                 | ai-eval exists; not in CI gate; trust gating documented                          |
| Enterprise / Production Readiness | 15      | 7.8          | 117.0                | Release pipeline strong; provenance policy fragile; external attestation missing |
| **Total**                         | **100** |              | **847.5/100 = 8.47** |                                                                                  |

**Honest core score:** 8.5/10

### 9.4 Honest Audience Lenses

| Lens          | Claimed | Honest | Δ    | Key Driver                            |
| ------------- | ------- | ------ | ---- | ------------------------------------- |
| Investor      | 8.9     | 8.7    | −0.2 | Coverage gap + ai-eval provenance gap |
| Enterprise    | 8.4     | 8.3    | −0.1 | Coverage gap noted; provenance gap    |
| Sovereign/DFI | 8.8     | 8.6    | −0.2 | Coverage gap + ai-eval provenance     |

### 9.5 What This Means for 10/10

The real gap to 10.0 is **external attestation + test perfection + doc standard completeness + coverage gate enforcement**. The codebase is institutionally strong — critical crypto files at 100% coverage, zero unsafe Rust, signed commits, provenance on 21/22 packages, architecture boundaries enforced. But a reference-grade repo cannot have:

1. Coverage below threshold on any package (currently crypto at 94.51%)
2. Test regressions (now fixed, but must stay fixed)
3. Missing doc frontmatter (~315 docs)
4. Broken links (now fixed)
5. Unpublished provenance (ai-eval)
6. Missing external attestation (pen-test, SOC 2)

The path to 9.5+ is: close the crypto coverage gap (Sprint 1), fix stale dist typecheck (Sprint 5), deliver pen-test + SOC 2 (Sprint 4), enforce docs-standard via CI gate, and maintain zero test regressions.

---

## 10. Audit Trail (Commits This Session)

| Phase            | Commit  | What                                                                                                  |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| 2. Cleanup       | —       | Skipped — no competing roots                                                                          |
| 3. Standard      | c19cd19 | fix: resolve pre-existing test regressions and broken links (5 links fixed, network tests stabilized) |
| 3.5 Hygiene      | c19cd19 | Included in above — test suite converted to vitest, globals removed, gitignore updated                |
| 5.5 Verification | —       | Forensic verification results captured in §9                                                          |
| 6. Master        | —       | docs(audit): master forensic certification post-Sprint 2 (this document)                              |

---

## 11. Sign-Off

| Role               | Status  | Date       |
| ------------------ | ------- | ---------- |
| Author             | Drafted | 2026-06-02 |
| CTO                | Pending | —          |
| Head of Security   | Pending | —          |
| Head of Compliance | Pending | —          |
| Repo lead          | Pending | —          |
