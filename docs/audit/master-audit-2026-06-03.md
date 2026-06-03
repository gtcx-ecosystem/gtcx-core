---
audit_type: master
target_repo: gtcx-core
audit_date: '2026-06-03'
composite: 8.6
composite_raw: 8.57
investor: 8.8
enterprise: 8.4
sov_dfi: 8.7
p0_count: 0
p1_count: 2
p2_count: 6
caps_fired: 0
status: current
owner: quality-evidence-lead
role: quality-evidence-lead
tier: critical
tags: ['audit', 'master-audit', 'fresh-evidence']
review_cycle: quarterly
---

# gtcx-core — Master Audit (Fresh Evidence)

**Date:** 2026-06-03  
**Branch:** `main` @ `6127da5` (1 unstaged: `.baseline/memory/session.md`)  
**Method:** GTCX `master-audit` framework — live gates + code inspection; **not** prior audit doc scores  
**Baseline for delta:** [master-audit-2026-06-02.md](./master-audit-2026-06-02.md) (composite 8.5), [full-audit-2026-06-01.md](./full-audit-2026-06-01.md)

---

## Executive Summary

| Metric                       |      Score | Band                                              |
| ---------------------------- | ---------: | ------------------------------------------------- |
| **Core weighted**            | **8.6/10** | Production-capable foundation                     |
| Investor lens                |     8.8/10 | Strong platform asset                             |
| Enterprise buyer lens        |     8.4/10 | Serious library; external attestation gap         |
| African sovereign / DFI lens |     8.7/10 | Strong crypto posture; live pilot proof elsewhere |

**Verdict:** `gtcx-core` is a **credible, gate-enforced cryptographic foundation** with **22/22 npm Sigstore provenance**, **public** source, and **heavy ZKP test depth** (81 Rust ZKP lib tests passing in-session). It is **not** a deployable sovereign product: revenue-grade readiness still depends on **private** `gtcx-protocols` / `gtcx-infrastructure` and external clearance (pen-test, pilot owner, live testnet).

**Top 3 live signals (good):**

1. `pnpm provenance:check-npm:strict` → **22/22** attestations (including `@gtcx/ai-eval@0.1.4`)
2. `cargo test -p gtcx-zkp --lib` → **81 passed**, 5 ignored (~136s); CI runs differential + KAT cross-impl
3. `pnpm test` (turbo) → **51 tasks successful**; `pnpm audit --audit-level=high` → clean

**Top 3 live signals (gap):**

1. **No third-party crypto / stack pen-test report** in this repo (external; blocks sovereign S2+ procurement narrative)
2. **README / marketing claims lag live state** (provenance 21/21 wording; composite 9.5 citation from May)
3. **Competitive framing in GTM docs is stale** — algorithmic layer is no longer “90-day copyable” at prior assessment’s implied depth

---

## Evidence Reviewed (Session)

### Commands run (exit codes)

| Step | Command                                    |                                                        Exit |
| ---- | ------------------------------------------ | ----------------------------------------------------------: |
| V1   | `git status`, `git log -5`, `HEAD=6127da5` |                                                           0 |
| V2   | `pnpm format:check`                        |                                                           0 |
| V2   | `pnpm lint`                                |                                                           0 |
| V2   | `pnpm typecheck`                           |                                                           0 |
| V2   | `pnpm architecture:check`                  |                   0 — **24 packages**, **268** source files |
| V3   | `pnpm test`                                |                                   0 — turbo **51/51** tasks |
| V3   | `cargo test -p gtcx-zkp --lib`             |                                0 — **81 passed**, 5 ignored |
| V3   | `cargo test -p gtcx-crypto --lib`          | 0 — **63 passed** (1st run: 1 fail env bleed; see findings) |
| V4   | `pnpm docs:check-links`                    |                                               0 — 470 files |
| V4   | `pnpm docs:check-frontmatter`              |                                       0 — **259/259** valid |
| V5   | `pnpm quality:governance:check`            |                                                           0 |
| V5   | `pnpm provenance:check-npm:strict`         |                                               0 — **22/22** |
| V5   | `pnpm ops:check`                           |                          0 — **8 pass**, **3 warn**, 0 fail |
| V5   | `pnpm audit --audit-level=high`            |                                          0 — no known vulns |

### Runtime / org

| Check                              | Result                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------- |
| GitHub visibility                  | **PUBLIC** (`gh repo view`, 2026-06-03)                                |
| `NPM_TOKEN` org secret             | Present (`ops:check`)                                                  |
| Branch protection + signed commits | Enabled                                                                |
| Downstream pin (spot)              | `gtcx-protocols` → `@gtcx/crypto@^3.1.4`, `@gtcx/zkp-kat-vectors` link |

### Code / artifact spot checks

| Artifact            | Live state                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| KAT vectors         | **6** files under `artifacts/kat/`                                                             |
| Public npm list     | **22** dirs in `tools/public-packages.mjs`                                                     |
| ZKP circuits (Rust) | GciThreshold, CommodityOrigin, AssetOwnership, LocationRegion + Bulletproofs variants          |
| P2P transport       | `rust/gtcx-network` — types + routing; **libp2p Phase 2** documented in crate header           |
| TS ZKP dev path     | `packages/crypto/src/zkp.ts` — **PLACEHOLDER** gated (SA-002); production path via native/Rust |

---

## Phase 1 — Six-Phase Forensic Audit

### 1.1 Architecture (internal 6-dim)

| Dimension             |     Score | Confidence | Evidence                                                                                                                                |
| --------------------- | --------: | :--------: | --------------------------------------------------------------------------------------------------------------------------------------- |
| Spec fidelity         |  **7/10** |     B      | README provenance line still “21/21 core”; arch check reports **24** packages; matrix says libp2p transport but Rust crate says Phase 2 |
| Structural integrity  | **10/10** |     A      | `architecture:check` zero violations                                                                                                    |
| Code quality          |  **9/10** |     A      | Typed packages, vitest breadth (122 package test files + 11 integration), property tests on crypto                                      |
| Testability           |  **9/10** |     A      | DI/offline-queue tests; ZKP negative + proptest + differential in CI                                                                    |
| Operational readiness |  **9/10** |     A      | CI: audit, threat matrix, fuzz hooks, perf budgets, Rust matrix                                                                         |
| Consistency           |  **8/10** |     B      | Duplicate YAML blocks in some docs (e.g. `p1-free-tracking.md`); sync vs domain offline split                                           |

### 1.2 Security

| Area                    | Status         | Evidence                                                                                 |
| ----------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| Auth surface            | N/A (library)  | Correct for threat model                                                                 |
| Crypto correctness      | **Strong**     | `#![deny(unsafe_code)]` in Rust crates; no custom primitives; FIPS strict rejects BLAKE3 |
| Supply chain            | **Strong**     | `pnpm audit` clean; `security:crypto-deps` in CI; `@noble/*` overrides                   |
| ZKP production boundary | **Controlled** | TS placeholder default-deny; Rust `gtcx-zkp` is authoritative                            |
| External attestation    | **Missing**    | No delivered pen-test / SOC 2 letter in repo                                             |
| Secret handling         | **Strong**     | `sanitizeSecrets` / redaction paths exercised in integration tests                       |

**Security phase score:** **8.9/10** (mechanical); **procurement trust** capped until EXT-INF-002 closes in infra.

### 1.3 GTM (live, not doc-only)

| Stage              | Assessment                | Evidence                                                             |
| ------------------ | ------------------------- | -------------------------------------------------------------------- |
| S0 Prototype       | Ready                     | install + test green                                                 |
| S1 Developer MVP   | **Ready**                 | 22 npm packages + provenance strict pass                             |
| S2 Sovereign pilot | **Not ready** (ecosystem) | No pen-test report, pilot owner, live testnet proof in **this** repo |
| S3 GA              | Not ready                 | No library MSA/billing                                               |

**First realistic deal:** Still **ZWCMP design partner** via **protocols + infrastructure**, not npm license — aligned with prior GTM, **confirmed unchanged** by external blocker register (not re-audited in infra this session).

### 1.4 Hygiene

| Category           | Score | Notes                              |
| ------------------ | ----: | ---------------------------------- |
| Root cleanliness   |  9/10 | Standard monorepo                  |
| Docs placement     |  9/10 | `/docs/` only; no `_sop`/`_cannon` |
| Package boundaries | 10/10 | Enforced in CI                     |
| Build artifacts    |  9/10 | `check:dist` in CI                 |
| Naming             |  8/10 | Minor package-count drift in prose |
| Discoverability    |  8/10 | README stale vs trust portal       |

**Hygiene composite:** **8.7/10**

### 1.5 Production readiness (library)

| Area                 | Status                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| CI gates             | **Present** — format, lint, typecheck, test, arch, governance, threat matrix, ZKP KAT/differential |
| npm provenance       | **Present** — 22/22 strict                                                                         |
| Hosted SLA / on-call | **Missing** (expected for library)                                                                 |
| DR / deploy          | **N/A** in core                                                                                    |
| External validation  | **Partial** — internal fuzz evidence; **no** third-party crypto audit report                       |
| P1-free window       | **Tracking** since 2026-05-19 → target 2026-08-17                                                  |

### 1.6 Defensibility tiers (DTF-001)

**Canonical framework:** [Defensibility Tiers 1–5 (DTF-001)](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/frameworks/defensibility-tiers/v1.0.0) — [`path-to-tier-5.md`](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/frameworks/defensibility-tiers/v1.0.0/path-to-tier-5.md).

**Definition:** **Defensibility Tier (1–5)** = how hard work is to replicate, measured by **replication time** (**higher tier = more defensible**). “90-day moat” described **Tier 1 only**.

| Defensibility tier | Replication horizon | GTCX status (2026-06-03)                       |
| -----------------: | ------------------- | ---------------------------------------------- |
|              **1** | ~90 days            | Achieved                                       |
|              **2** | 6–12 months         | Achieved — ZKP + KAT + differential CI         |
|              **3** | 6–9 months          | Achieved — 22-package platform                 |
|              **4** | 6+ months           | Achieved — 22/22 provenance                    |
|              **5** | 12–18+ months       | **Not achieved** — named jurisdiction circuits |

**Moat conclusion (fresh):** Public source does not collapse Tier 3–5. Sovereign **deal** evidence (pen-test, testnet) is required for revenue in addition to Tier 5 — see DTF tiers.md § commercial gate.

---

## Findings

### Critical (P0)

- None identified in live code/gates this session.

### High (P1)

| ID    | Finding                                                                          | Evidence                                                     | Remediation                                                                           |
| ----- | -------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| P1-01 | **No third-party crypto / full-stack pen-test report** consumable from this repo | GTM + audit scope; no PDF/path in tree                       | Execute EXT-INF-002 via `gtcx-infrastructure`; attach appendix from core trust portal |
| P1-02 | **Sovereign S2 deal blockers remain external**                                   | Cannot verify pilot owner / testnet / DPA in gtcx-core alone | Track in infra XC register; core supplies evidence pack only                          |

### Medium (P2)

| ID    | Finding                                                                                                     | Evidence                                                                                                           |
| ----- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| P2-01 | README claims **21/21** provenance on 3.1.4 train; live strict check is **22/22** including `ai-eval@0.1.4` | `README.md:31-32` vs `pnpm provenance:check-npm:strict` session output                                             |
| P2-02 | README **composite 9.5/10** cites May 2026 internal audit; fresh core score **8.6** under ecosystem rubric  | This report                                                                                                        |
| P2-03 | Package count prose drift (**18 / 21 / 22 / 24**)                                                           | `architecture:check` → 24; `public-packages.mjs` → 22 npm                                                          |
| P2-04 | `gtcx-crypto` FIPS env tests can **flake** if `GTCX_FIPS_STRICT` leaks between tests                        | 1st `cargo test -p gtcx-crypto --lib`: 62 pass / **1 fail** `test_fips_permissive_allows_blake3`; 2nd run: 63 pass |
| P2-05 | `@gtcx/network` README/matrix implies production transport; Rust crate documents **Phase 2 libp2p**         | `rust/gtcx-network/src/lib.rs:15-18`, README matrix                                                                |
| P2-06 | GTM “90-day replicate = noble + zod” **understates** ZKP replication cost post–AM-1                         | Live ZKP test time + KAT + CI features vs `gtm-reality-check-2026-06-02.md:121-125`                                |

### Low (P3)

| ID    | Finding                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------- |
| P3-01 | `ops:check` warns: `OPENAI_API_KEY`, `TURBO_TOKEN`, `TURBO_TEAM` missing at org scope (CI still passes; cold cache) |
| P3-02 | `pnpm test` turbo run fully cached (166ms) — fresh machine CI is authoritative for uncached timing                  |

---

## Core Scorecard (SCORING_FRAMEWORK.md)

| Dimension                         | Weight |   Score | Confidence | Notes                                                  |
| --------------------------------- | -----: | ------: | :--------: | ------------------------------------------------------ |
| Code Quality                      |     15 | **9.2** |     A      | Gates green; ZKP depth; integration tests              |
| Repo / Folder Hygiene             |     10 | **8.7** |     A      | Clean structure; doc/marketing drift                   |
| Security                          |     20 | **9.0** |   A / B    | Strong mechanical; external audit absent               |
| Global South Resilience           |     15 | **9.2** |     A      | Offline queue, connectivity/USSD tests, sync           |
| Ecosystem Integration             |     15 | **9.0** |     A      | Upstream authority; protocols on 3.1.4 + KAT link      |
| Agentic Maturity                  |     10 | **8.7** |     A      | ai-eval, safety rules, governance scripts              |
| Enterprise / Production Readiness |     15 | **8.0** |   A / C    | CI/provenance excellent; no SLA/pen-test/SOC2 artifact |

**Raw weighted:** (9.2×15 + 8.7×10 + 9.0×20 + 9.2×15 + 9.0×15 + 8.7×10 + 8.0×15) / 100 = **8.57**  
**Caps fired:** 0 (no unresolved critical/high on consequential code paths)  
**Final core composite:** **8.6/10** (rounded)

### Delta vs 2026-06-02 master audit

| Area            | Δ        | Driver                                                 |
| --------------- | -------- | ------------------------------------------------------ |
| Core            | +0.1     | 22/22 provenance verified live; ZKP tests confirmed    |
| Honesty         | Improved | README/GTM drift called out; competitive tiers updated |
| Enterprise lens | Flat     | External attestation still missing                     |

---

## Lens Scores

### Investor (8.8/10)

| Area                        | Weight | Score |
| --------------------------- | -----: | ----: |
| Technical differentiation   |     25 |   9.0 |
| Execution credibility       |     25 |   8.8 |
| Ecosystem leverage          |     20 |   9.0 |
| Commercialization readiness |     15 |   7.5 |
| Platform compounding        |     15 |   9.0 |

**Narrative:** Public foundation + provenance train increases platform credibility; monetization still downstream.

### Enterprise buyer (8.4/10)

| Area                    | Weight | Score |
| ----------------------- | -----: | ----: |
| Control environment     |     25 |   8.5 |
| Security & auditability |     25 |   8.8 |
| Integration reliability |     20 |   9.0 |
| Operability             |     15 |   8.0 |
| Deployment readiness    |     15 |   7.0 |

**Narrative:** Safe to integrate as **library**; not safe to treat as **finished regulated deployment** without infra evidence.

### African sovereign / DFI (8.7/10)

| Area                        | Weight | Score |
| --------------------------- | -----: | ----: |
| Local verifiability         |     25 |   9.0 |
| Open primitive transparency |     20 |   9.0 |
| Resilience                  |     20 |   9.2 |
| Regulatory evidence         |     20 |   7.5 |
| Sovereign deploy proof      |     15 |   6.5 |

**Narrative:** Crypto and offline story strong; regulator-grade proof package not complete in-repo.

---

## Phase 2 — Doc cleanup

**Skipped** — only `docs/` exists; no `_sop` / `_cannon` / `wiki` roots.

## Phase 3 — Docs standard

| Axis        | Result                                              |
| ----------- | --------------------------------------------------- |
| Frontmatter | **259/259** pass (`pnpm docs:check-frontmatter`)    |
| Links       | **470** files pass (`pnpm docs:check-links`)        |
| Taxonomy    | Mature under `docs/`                                |
| Drift       | README + some GTM competitive bullets stale vs live |

## Phase 5.5 — Verification summary

All applicable Protocol 27 gates run in-session (see table above). **Rust workspace `--lib` in CI** includes `gtcx-crypto` FIPS feature matrix; local dev should run `cargo test -p gtcx-crypto --lib` after ZKP runs if `GTCX_FIPS_STRICT` was set.

---

## Top 5 Remediation (ordered)

| #   | Action                                                                                     | Owner                    | Impact                                     |
| --- | ------------------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------ |
| 1   | Refresh **README** provenance (22/22), package count, composite citation → link this audit | protocol-architect       | Spec fidelity / buyer trust                |
| 2   | Update **GTM competitive reality** to DTF Tier 1–5 (defensibility vs replication time)     | GTM                      | Done in framework + gtm-reality-check link |
| 3   | Isolate **FIPS env tests** (`GTCX_FIPS_STRICT` reset in `gtcx-crypto` test harness)        | crypto-security-engineer | CI/local flake                             |
| 4   | Close **EXT-INF-002** pen-test in infra; link report from trust portal                     | GTM + infra              | S2 sovereign                               |
| 5   | **`@gtcx/network` maturity badge** in README matrix (types-only transport)                 | frontier-infra-engineer  | Spec fidelity                              |

---

## One-point uplift (per lens)

| Lens              | Condition                                                                        |
| ----------------- | -------------------------------------------------------------------------------- |
| Core → 8.7+       | README/trust portal aligned to live 22/22 + fix FIPS test isolation              |
| Core → 9.0+       | Delivered third-party ZKP/crypto audit report (D9) + formal partial (D8 minimum) |
| Investor → 9.0+   | Named pilot + downstream validation report referencing core provenance           |
| Enterprise → 9.0+ | Pen-test on deployed stack + SOC 2 Type I letter linked                          |
| Sovereign → 9.0+  | Live testnet DR evidence + regulator submission from infra package               |

---

## Agent Context Attestation

- [x] Phase 1: Baseline — SCORING_FRAMEWORK + comprehensive-audit prompt read
- [x] Phase 2: Repo context — live gates, not prior audit scores
- [x] Phase 3: Git `6127da5`, public repo confirmed
- [x] Phase 4: Persona — quality-evidence-lead / development frame
- [x] Phase 5.7: Verification ladder executed in-session (commands + exit codes recorded)

---

_Next audit: 2026-09-01 or on material release (ceremony, pen-test, pilot close)._
