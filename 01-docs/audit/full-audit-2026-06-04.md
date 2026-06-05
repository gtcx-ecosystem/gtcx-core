---
title: 'Full Audit — gtcx-core'
status: 'current'
date: '2026-06-04'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
agent_id: 'agent://gtcx-core/2026-06-04/full-audit'
trust_score: 85
autonomy_level: 'authorized'
tier: 'critical'
tags: ['audit', 'full-audit', 'roadmap', 'sprint-plan']
review_cycle: 'quarterly'
audit_type: full-audit
target_repo: gtcx-core
audit_date: '2026-06-04'
---

# Full Audit — gtcx-core

> **Five-lane model (since 2026-06-05):** Current readiness → [readiness-model.md](./readiness-model.md) · [latest.json](./latest.json). This 2026-06-04 report is lane-1 engineering + sprint context.

**Date:** 2026-06-04  
**Branch:** `main` (2 commits ahead of `origin/main` — verification integration + workplan)  
**Method:** Cursor `/full-audit` — 6-phase pipeline with in-session verification (Protocol 27)  
**Prior:** [full-audit-2026-06-01.md](./full-audit-2026-06-01.md) · [master-audit-2026-05-12.md](./master-audit-2026-05-12.md) · [moat-completion-reconciliation-2026-06-03.md](./moat-completion-reconciliation-2026-06-03.md)

**Repo lens:** Cryptographic/protocol **foundation library** (TypeScript + Rust). Not a deployable product surface. Sovereign pilot readiness is **ecosystem-wide** (infra + protocols + intelligence), not this repo alone.

### Live gates (this session)

| Command                                      | Result                                                                      |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| `pnpm ops:check`                             | **8 pass, 3 warn** (OPENAI_API_KEY, TURBO_TOKEN, TURBO_TEAM)                |
| `pnpm architecture:check`                    | **pass** (24 packages, 283 source files)                                    |
| `pnpm format:check`                          | **fail** — `.agent/credentials-pointer.md` only (unstaged agent-sync drift) |
| `pnpm typecheck` (root turbo)                | **fail** — turbo cycle `@gtcx/workproof` ↔ `@gtcx/verification` build       |
| `pnpm --filter @gtcx/verification typecheck` | **pass**                                                                    |
| `pnpm test:kat-cross-impl`                   | **pass** (5/5 KAT vectors)                                                  |
| `pnpm security:secret-scan`                  | **pass** (1252 files)                                                       |
| `pnpm agent:next-work`                       | **DTF-5.2.3** (diamond + range KATs)                                        |

---

## PHASE 1 — Architecture Audit

| Dimension             | Rating   | Top Issue                                                                |
| --------------------- | -------- | ------------------------------------------------------------------------ |
| Spec Fidelity         | **8/10** | Tier-5 progress in code ahead of some GTM/README “9.5 composite” wording |
| Structural Integrity  | **9/10** | New **workproof ↔ verification** turbo build cycle (DTF-5.2.2 devDep)    |
| Code Quality          | **9/10** | Profile-on-one-R1CS model sound; `exactOptionalPropertyTypes` enforced   |
| Testability           | **9/10** | 269 verification + 433 crypto + 20 `circuit_profiles` Rust tests         |
| Operational Readiness | **9/10** | 45+ CI steps; KAT cross-impl in `.github/workflows/ci.yml:104`           |
| Consistency           | **8/10** | Agent-sync unstaged files; package count still drifts in older docs      |

### Findings

- **[High] [Structural Integrity] — Turbo build cycle workproof ↔ verification**  
  **Evidence:** `pnpm typecheck` reports cycle: `@gtcx/workproof#build → @gtcx/verification#build → @gtcx/workproof#build`. `03-platform/packages/workproof/package.json:78` depends on `@gtcx/verification`; `03-platform/packages/verification/package.json` devDepends `@gtcx/workproof` (integration tests).  
  **Impact:** Root `pnpm typecheck` / `pnpm build` can fail in clean CI depending on turbo graph resolution.  
  **Fix:** Move cross-package integration test to `03-platform/packages/integration-tests` or `tests/integration/` with no published dep cycle; keep `CommodityOriginWitnessLike` in verification (no runtime workproof import).

- **[Medium] [Spec Fidelity] — README composite 9.5 vs Tier-5 in progress**  
  **Evidence:** `README.md:21` claims composite 9.5; `01-docs/04-ops/tier-5-workplan-2026-06.md:26` — Tier 5 technical **in progress** (DTF-5.2.3 next).  
  **Impact:** External readers conflate npm library maturity with jurisdiction-profile moat completion.  
  **Fix:** README “Current State” — split **library readiness** vs **DTF Tier 5** with link to workplan.

- **[Medium] [Code Quality] — Verification LOC near policy ceiling**  
  **Evidence:** `03-platform/packages/verification/03-platform/src/certificates/templates.ts` ~468 LOC (per prior audit); new `commodity-origin-zk.ts` adds bridge layer.  
  **Impact:** 500 LOC gate risk on next sprint.  
  **Fix:** Extract template registry table to `templates/registry.ts` when touching certificates.

- **[Low] [Consistency] — `export *` barrels resolved in crypto**  
  **Evidence:** Prior master audit P1; `03-platform/packages/crypto/03-platform/src/index.ts` uses explicit exports (grep: no `export *`).  
  **Impact:** Closed for crypto; verify `domain`/`security` if still flagged elsewhere.

- **[Low] [Operational Readiness] — Rust P2P transport Phase 2**  
  **Evidence:** `rust/gtcx-network/03-platform/src/lib.rs` — types only; libp2p deferred.  
  **Impact:** `@gtcx/network` README must not imply live mesh transport.  
  **Fix:** Maturity badge in crate README (unchanged from 2026-06-01 finding).

**Architecture scorecard average: 8.7/10**

---

## PHASE 2 — Security Audit

| Area                           | Status                              | Evidence                                                                                                                                  |
| ------------------------------ | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication & Authorization | **N/A (correct)**                   | Library; no session surface; threat model scoped                                                                                          |
| Data Protection                | **Strong**                          | `rust/gtcx-crypto/03-platform/src/fips.rs:32-36` — `GTCX_FIPS_STRICT=1` rejects non-FIPS algos; `sanitizeSecrets` in security/ai packages |
| Input Validation               | **Strong**                          | Zod in verification schemas (`ProofBundleSchema` + `CommodityOriginZkProofRefSchema`); NAPI hex asserts in `@gtcx/crypto`                 |
| Dependency Security            | **Strong (TS) / Mitigated (Rust)**  | `pnpm audit` in CI; `rust/.cargo/audit.toml` for ark-\* advisories                                                                        |
| Infrastructure Security        | **Out of repo**                     | Deploy/network policies live in `gtcx-infrastructure`                                                                                     |
| Compliance Posture             | **Strong claims, partial evidence** | FIPS CMVP #4816; **no external pen-test report** on live stack                                                                            |

### Findings

- **[High] [Compliance] — No third-party penetration test on deployed stack**  
  **Evidence:** `01-docs/08-gtm/gtm-reality-check-2026-06-02.md:60` — EXT-INF-002 open; internal fuzz 500K+ iterations (`01-docs/05-audit/fuzz-campaign-evidence-2026-05-21.md`).  
  **Impact:** Sovereign examiner blocker for S2+ deals.  
  **Fix:** Infra-owned vendor SOW; gtcx-core supplies KAT + threat matrix + fuzz evidence pack only.

- **[Medium] [Data Protection] — Profile cert masks enforced pre-prove, not in-circuit**  
  **Evidence:** `rust/gtcx-zkp/03-platform/src/circuit_profiles/validate.rs:64-83`; `01-docs/specs/03-platform/packages/zkp-circuit-profiles.md` — by design.  
  **Impact:** Verifiers must call policy gate; document in trust portal “off-circuit policy” section.  
  **Fix:** Trust portal column (DTF-5.4.3) — already scheduled.

- **[Low] [Dependency] — arkworks transitive unmaintained crates**  
  **Evidence:** README + `rust/.cargo/audit.toml` — `derivative`, `paste` ignored pending ark 0.5.  
  **Impact:** Supply-chain narrative for regulators.  
  **Fix:** Track upstream; no local fork.

- **[Low] [Operational] — Optional CI secrets (bus-factor)**  
  **Evidence:** `pnpm ops:check` — OPENAI*API_KEY, TURBO*\* warn.  
  **Impact:** Cold turbo cache; AI CODEOWNER fallback if Anthropic down.  
  **Fix:** Org-level `gh secret set` per ops:check hints.

**Security posture: 8.8/10** (library); **6.5/10** (sovereign stack including external gates)

---

## PHASE 3 — GTM Readiness

Stages assessed per `01-docs/08-gtm/gtm-reality-check-2026-06-02.md` (foundation library lens).

| Stage              | Verdict                                                        | Evidence                                                        |
| ------------------ | -------------------------------------------------------------- | --------------------------------------------------------------- |
| **S0 Prototype**   | **Ready**                                                      | `pnpm test` / 2,400+ tests; integration substrate               |
| **S1 MVP**         | **Ready**                                                      | 21+ `@gtcx/*` npm; provenance strict; trust portal              |
| **S2 Pilot Ready** | **Partially Ready** (library) / **Not Ready** (sovereign deal) | No live pen-test; pilot = infra + protocols deploy              |
| **S3 Production**  | **Not Ready**                                                  | Stops here — S3+ require live DR, on-call, regional ops (infra) |

**Current GTM stage (library):** **S1–S2 boundary** — developers can integrate; regulators cannot sign off on national pilot from this repo alone.

**First realistic deal (90 days):** Zimbabwe sandbox / Ghana minerals technical evaluation — **blocked on** infra testnet + pen-test + hub coordination (ER-1-08 infra ack, INT-S8-04 baseline-os router).

### Top 5 stage gate blockers

1. External pen-test on live stack (EXT-INF-002) — **gtcx-infrastructure**
2. Testnet deploy + DR proof — **gtcx-infrastructure**
3. ZWCMP pilot DPA + owner (EXT-INF-013–015) — **GTM / Legal**
4. ER-1-08 hub closure — **gtcx-infrastructure** hub log row pending
5. Trusted-setup ceremony transcript (CORE-004 / D3 M3.2) — release-gated

### AI trust gaps

- AI-native traced APIs exist (`03-platform/packages/verification/03-platform/src/traced.ts`) but **commodity-origin ZK path is not yet traced** — only structural + optional crypto verify.
- `ai-eval` scorecard WARN non-blocking in CI — examiners may ask for hard gate on pilot branches.

### Competitive reality (90-day copy test)

- **Copyable in 90d:** npm crypto wrappers, generic Groth16 commodity circuit, CI gates pattern.
- **Not copyable in 90d without this repo:** KAT corpus + cross-impl verifier, FIPS aws-lc-rs integration, profile registry on one R1CS, WorkProof→witness→verification bundle bridge, 22-package provenance train.
- **Tier 5 moat (DTF-001):** jurisdiction **policy packs** + evidence chain — **in progress** (gh-gold + zw-diamond done; cocoa + registry pending).

---

## PHASE 4 — Hygiene Audit

| Category          | Score /10 | Issues                                                                     |
| ----------------- | --------- | -------------------------------------------------------------------------- |
| Documentation     | **8**     | Tier-5 workplan current; some audit docs pre-6/03 scores stale             |
| File Structure    | **9**     | `03-platform/packages/*`, `rust/*`, `01-docs/05-audit/` well partitioned   |
| Naming            | **9**     | Conventional commits; profile IDs registry-stable                          |
| Package/Build     | **7**     | **Turbo cycle** workproof/verification; format:check agent drift           |
| Code Hygiene      | **9**     | Lint passes on touched packages; husky + commitlint                        |
| Test Hygiene      | **9**     | Integration tests colocated; heavy ZKP gated by `GTCX_RUN_HEAVY_ZKP_TESTS` |
| CI/CD             | **9**     | `.github/workflows/ci.yml` — KAT, differential, agent:next-work smoke      |
| Dependency Health | **8**     | pnpm lockfile; Rust audit.toml documented                                  |
| Git Hygiene       | **8**     | 2 commits ahead origin; unstaged agent-sync files                          |
| Monorepo          | **8**     | turbo + pnpm workspace; cycle is regression                                |

**Hygiene average: 8.4/10**

### Failures

- **✗ Package/Build** — turbo dependency cycle (see Phase 1).
- **~ Documentation** — duplicate frontmatter on historical audits merged (OPS-AUDIT-FM); Tier 5 evidence index at `01-docs/05-audit/evidence/README.md` (DTF-5.5.5).
- **~ Git** — `.agent/credentials-pointer.md`, `AGENTS.md` drift unstaged (do not commit secrets).

---

## PHASE 5 — Production Readiness

| Area              | Rating                  | Evidence                                                                   |
| ----------------- | ----------------------- | -------------------------------------------------------------------------- |
| Deployment        | **Gaps** (library)      | Published via `release.yml`; consumers deploy elsewhere                    |
| Monitoring        | **Mostly Ready**        | Structured logging, sanitizer overrides; no SLOs for library itself        |
| Incident Response | **Gaps**                | No on-call for npm package — ecosystem ops in infra                        |
| Disaster Recovery | **Not Ready** (product) | Library DR = republish; pilot DR = infra                                   |
| Capacity          | **Mostly Ready**        | Perf budgets in CI (`perf:check-budgets`); ZKP prove CPU-heavy, documented |
| Dependencies      | **Mostly Ready**        | Circuit breaker patterns in services; native module preflight              |

**Production readiness (as npm foundation):** **Mostly Ready**  
**Production readiness (sovereign pilot):** **Not Ready** — external gates dominate.

---

## PHASE 6 — Sprint Plan (Synthesis)

### 6.1 Intelligence synthesis

| #   | Finding                                           | Source            | Severity   | Status                    |
| --- | ------------------------------------------------- | ----------------- | ---------- | ------------------------- |
| 1   | Turbo build cycle workproof ↔ verification        | P1 Architecture   | **High**   | **Open**                  |
| 2   | Root `pnpm typecheck` blocked by cycle            | Live gate         | **High**   | **Open**                  |
| 3   | DTF-5.2.3 diamond + range KATs next               | P22               | **Medium** | **Pending**               |
| 4   | ER-1-08 infra hub ack                             | Ecosystem         | **Medium** | **External**              |
| 5   | No pen-test on live stack                         | P2 Security / GTM | **High**   | **External**              |
| 6   | INT-S8-04 baseline-os cost-router v1.1            | Ecosystem         | **Low**    | **External**              |
| 7   | Trusted-setup M3.2 release-gated                  | Moat D3           | **Medium** | **Blocked** ceremony      |
| 8   | README 9.5 vs Tier-5 in progress                  | P1 Spec           | **Low**    | **Open**                  |
| 9   | format:check agent-sync drift                     | P4 Hygiene        | **Low**    | **Open**                  |
| 10  | Verification integration shipped (5.2.2)          | Code              | —          | **Done** `6c313ea`        |
| 11  | gh-gold + zw-diamond profiles + KAT (5.1.x–5.2.1) | Code              | —          | **Done**                  |
| 12  | Formal verification D8 / pen-test D9              | Moat              | **High**   | **External** CORE-005/006 |

### 6.2 Innovation scan

**Refactoring**

- Break turbo cycle without losing cross-package integration coverage (dedicated integration package).
- Split `verification/templates.ts` before 500 LOC enforcement bites.

**Moat (90-day copy test — fails for copiers)**

- Complete Tier-5 profile set (cocoa + five-jurisdiction fixtures) on **one R1CS**.
- `CircuitRegistry` semver + deprecation (DTF-5.4.1) — registry is policy SoR, not just code.
- KAT per profile with CI cross-impl — already proven pattern for gh-gold; extend to zw-diamond KAT in 5.2.3.

**AI-native**

- Traced `tracedVerifyCommodityOriginZk` wrapping bundle + crypto verify with redacted logs.
- Agentic `agent:next-work` already in CI — expose milestone completion in machine-readable `01-docs/05-audit/auto-dev-state.json` for hub.

### 6.3 Sprint architecture (6 × 1 week)

## Sprint 1: Build graph + doc truth (1 week)

**Layer mix:** Remediation 3 · Evolution 1 · Innovation 0

### Goals

Restore root `pnpm typecheck`/`build`; align README with Tier-5 status.

### Tasks

| #   | Task                                                                      | Layer       | Files                                                                                                                                              | Effort | Why It Matters     |
| --- | ------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------ |
| 1   | Extract verification↔workproof integration test to break turbo cycle      | Remediation | `03-platform/packages/verification/package.json`, new `tests/integration/commodity-origin-zk.test.ts` or `03-platform/packages/integration-tests/` | M      | Unblocks CI graph  |
| 2   | Remove `@gtcx/workproof` devDep from verification if test moved           | Remediation | `03-platform/packages/verification/package.json`                                                                                                   | S      | Closes cycle       |
| 3   | README: split library 9.x vs DTF Tier 5                                   | Remediation | `README.md`                                                                                                                                        | S      | Spec fidelity      |
| 4   | Reconcile package count in `01-docs/specs/03-platform/packages/README.md` | Remediation | docs                                                                                                                                               | S      | Onboarding truth   |
| 5   | `pnpm agent:sync` or gitignore agent drift from format:check              | Evolution   | `.agent/`, `package.json` format ignore                                                                                                            | S      | Hygiene gate green |

### Definition of Done

- `pnpm typecheck` and `pnpm build` exit 0 at repo root.
- `pnpm format:check` exit 0 (or agent paths excluded intentionally).
- README states Tier-5 status with link to `tier-5-workplan-2026-06.md`.

### Commit Plan

- `fix(build): break workproof verification turbo cycle`
- `docs(readme): separate library readiness from dtf tier 5`

### Sprint Value Statement

Restores the monorepo’s single-command truth before more Tier-5 code lands.

---

## Sprint 2: DTF-5.2.3 — Diamond + range KATs (1 week)

**Layer mix:** Remediation 0 · Evolution 2 · Innovation 1

### Goals

Ship zw-diamond KAT vector; bulletproofs range KAT if in scope; CI green on `test:kat-cross-impl`.

### Tasks

| #   | Task                                                          | Layer      | Files                                                                                                          | Effort | Why It Matters        |
| --- | ------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- | ------ | --------------------- |
| 1   | Generate `groth16-zw-diamond-origin.kat.json`                 | Innovation | `artifacts/kat/`, `03-platform/packages/zkp-kat-vectors/`, `rust/gtcx-zkp/03-platform/src/bin/generate-kat.rs` | M      | D6 evidence           |
| 2   | Add to `kat-cross-impl-verify.rs` `--all` list                | Evolution  | `rust/gtcx-zkp/03-platform/src/bin/kat-cross-impl-verify.rs:28-34`                                             | S      | Portable proofs       |
| 3   | Mark DTF-5.2.3 done in workplan                               | Evolution  | `01-docs/04-ops/tier-5-workplan-2026-06.md`                                                                    | S      | P22 truth             |
| 4   | Range circuit KAT (if bulletproofs-commodity in sprint scope) | Innovation | `artifacts/kat/`                                                                                               | M      | Sprint 2 moat program |

### Definition of Done

- `pnpm test:kat-cross-impl` — 6+ vectors PASS.
- Workplan row DTF-5.2.3 = **done**.

### Commit Plan

- `feat(zkp): add zw-diamond-origin kat and cross-impl verify`
- `docs(ops): mark dtf-5.2.3 done`

### Sprint Value Statement

Extends interop evidence from 5 to 6+ vectors — examiner-ready portability proof.

---

## Sprint 3: DTF-5.3 — Cocoa profile + jurisdiction fixtures (1 week)

**Layer mix:** Remediation 0 · Evolution 2 · Innovation 2

### Goals

`gh-cocoa-origin` profile + redacted five-jurisdiction integration fixtures.

### Tasks

| #   | Task                                               | Layer      | Files                                                                                | Effort | Why It Matters      |
| --- | -------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------ | ------ | ------------------- |
| 1   | `gh-cocoa-origin` profile config + negative tests  | Innovation | `rust/gtcx-zkp/03-platform/src/circuit_profiles/`, `03-platform/packages/workproof/` | M      | Tier-5 breadth      |
| 2   | TS `proveGhCocoaOrigin` + verification bundle test | Evolution  | `03-platform/packages/crypto/`, `03-platform/packages/verification/tests/`           | M      | End-to-end          |
| 3   | Five-jurisdiction redacted fixtures                | Innovation | `03-platform/packages/workproof/tests/` or `01-docs/05-audit/evidence/`              | M      | Regulator narrative |
| 4   | UAT protocol template (5.3.3 ops-docs)             | Evolution  | `01-docs/04-ops/`                                                                    | S      | Commercial path     |

### Definition of Done

- `cargo test -p gtcx-zkp circuit_profiles` includes cocoa negatives.
- Fixtures run in CI without PII.

### Sprint Value Statement

Moves Tier-5 from two jurisdictions to multi-jurisdiction **policy packs** on one circuit.

---

## Sprint 4: Ecosystem closure + coordination (1 week)

**Layer mix:** Remediation 2 · Evolution 0 · Innovation 0

### Goals

Close hub-visible blockers; file handoffs with evidence links only.

### Tasks

| #   | Task                                                         | Layer       | Files                                                             | Effort | Why It Matters |
| --- | ------------------------------------------------------------ | ----------- | ----------------------------------------------------------------- | ------ | -------------- |
| 1   | Push + confirm protocols hub row for core ER-1-08            | Remediation | gtcx-protocols `cross-repo-agent-log.md`                          | S      | OI-X01         |
| 2   | Outbound ticket to gtcx-infrastructure for hub ack           | Remediation | `01-docs/04-ops/coordination/to-gtcx-infrastructure-er-1-08-*.md` | S      | OI-X02         |
| 3   | Update `remaining-cross-repo-work-2026-06-02.md`             | Evolution   | `01-docs/04-ops/coordination/`                                    | S      | Protocol 24    |
| 4   | DTF-5.4.4 handoff doc to gtcx-protocols (when S-T5-4 starts) | Remediation | inbound ticket template                                           | S      | Owner repo     |

### Definition of Done

- Intelligence open-items register shows core **done**, infra **done** or ticket filed.
- No chat-only blockers.

### Sprint Value Statement

Unblocks ecosystem auditors without duplicating normative protocol text in core.

---

## Sprint 5: Circuit registry + performance evidence (1 week)

**Layer mix:** Remediation 0 · Evolution 2 · Innovation 2

### Goals

DTF-5.4.1 registry semver; load-test evidence JSON (5.4.2).

### Tasks

| #   | Task                                             | Layer      | Files                                                                                  | Effort | Why It Matters |
| --- | ------------------------------------------------ | ---------- | -------------------------------------------------------------------------------------- | ------ | -------------- |
| 1   | `CircuitRegistry` with semver + deprecation      | Innovation | new `03-platform/packages/crypto/03-platform/src/circuit-registry.ts` or rust registry | L      | Tier-5.4       |
| 2   | Load test 1000 proofs/min script + evidence JSON | Innovation | `03-platform/tools/` or `benchmarks/`                                                  | M      | Trust portal   |
| 3   | Trust portal circuit ID column doc (5.4.3)       | Evolution  | `01-docs/governance/trust-portal.md`                                                   | S      | Verifier UX    |

### Definition of Done

- Registry rejects unknown profile IDs with structured error.
- Evidence JSON committed under `01-docs/05-audit/evidence/`.

### Sprint Value Statement

Ships the **registry moat** — policy IDs become versioned contracts.

---

## Sprint 6: Commercial gate prep + external parallel (1 week)

**Layer mix:** Remediation 1 · Evolution 1 · Innovation 0

### Goals

Prepare evidence packs for pen-test vendor and regulator; no fake “done” on external items.

### Tasks

| #   | Task                                                        | Layer       | Files                                    | Effort | Why It Matters    |
| --- | ----------------------------------------------------------- | ----------- | ---------------------------------------- | ------ | ----------------- |
| 1   | Evidence index entry for Tier-5 technical exit (5.5.5)      | Evolution   | `01-docs/05-audit/evidence/`             | S      | Bank-grade track  |
| 2   | Package fuzz + KAT + threat matrix into vendor zip manifest | Remediation | `01-docs/09-security/`, `artifacts/kat/` | M      | EXT-INF-002 input |
| 3   | Zimbabwe sandbox email + LOI tracker (human gate)           | Remediation | `01-docs/08-gtm/`                        | S      | GTM               |
| 4   | Track CORE-004 ceremony unblock for D3 M3.2                 | Evolution   | `.baseline/memory/dependencies.md`       | S      | Moat D3           |

### Definition of Done

- `01-docs/05-audit/evidence/` index lists all KAT + fuzz + CI confirmation paths.
- External items remain **open** with owner + date — no score inflation.

### Sprint Value Statement

Converts engineering strength into **auditor-consumable** bundles without claiming external work complete.

---

### 6.4 Roadmap visualization

| Dimension              | Before (2026-06-04) | After S1   | After S2   | After S3   | After S4   | After S5 | After S6                  |
| ---------------------- | ------------------- | ---------- | ---------- | ---------- | ---------- | -------- | ------------------------- |
| Security               | 8.8                 | 8.8        | 8.9        | 8.9        | 8.9        | 9.0      | 9.0 (+ external pen-test) |
| Operational readiness  | 8.5                 | **9.0**    | 9.0        | 9.0        | 9.2        | 9.3      | 9.3                       |
| GTM stage (library)    | S1–S2               | S2 partial | S2 partial | S2 partial | S2 partial | S2+      | S2+                       |
| Developer experience   | 8.0                 | **9.0**    | 9.0        | 9.0        | 9.0        | 9.0      | 9.0                       |
| Competitive moat (DTF) | Tier 5 ~40%         | 40%        | **55%**    | **70%**    | 70%        | **85%**  | 85%                       |
| AI maturity            | 7.5                 | 7.5        | 7.5        | 7.8        | 7.8        | 8.0      | 8.0                       |

### 6.5 Meta-learning

- **What this codebase teaches:** Foundation repos win by **evidence density** (KAT, fuzz, FIPS, provenance) — not feature count.
- **Constraining decisions:** Single `CommodityOrigin` R1CS with profile packs is correct — avoids jurisdiction fork explosion.
- **6-month radar:** Tier-5 technical exit Q3 2026; commercial gate (5.5.4 LOI) parallel; D8/D9 only via baseline-os vendors.
- **From scratch:** Would isolate cross-package integration tests on day one to avoid turbo cycles.

---

## OUTPUT SUMMARY — Executive Summary

**Current State:** `gtcx-core` is a **production-grade cryptographic foundation** (FIPS, KAT, 2,400+ tests, npm provenance) with **Tier-5 jurisdiction profiles ~40% complete** (gh-gold, zw-diamond, verification bridge done) and a **new monorepo build-cycle defect** that must be fixed before the next merge train.

**Target State:** After six weeks: **root gates green**, **6+ KAT vectors**, **three commodity profiles**, **circuit registry + perf evidence**, **ecosystem hub tickets closed**, **vendor-ready evidence pack** — Tier-5 technical path ~85% without claiming external pen-test or ceremony complete.

**Critical Path:**

1. **Break workproof ↔ verification turbo cycle** (Sprint 1) — gates everything.
2. **DTF-5.2.3 KATs** (Sprint 2) — moat interop evidence.
3. **Infra pen-test + hub ER-1-08** (Sprint 4 + external) — sovereign deal unlock.

**Timeline:** 6 weeks for in-repo sprints; **sovereign pilot** additionally requires 4–6 weeks pen-test and infra deploy (not compressible in core alone).

**Biggest Risk:** Treating npm library maturity as pilot readiness — regulators will ask for **live stack** evidence this repo cannot produce alone.

**Biggest Opportunity:** **Profile registry + KAT portability** on one R1CS — a copier gets Groth16 in 90 days but not the policy pack + WorkProof→verification evidence chain without re-deriving the full GTCX witness and attestation model.

---

## Agent Context Attestation

- [x] Phase 1–5: Full audit phases executed with file evidence
- [x] Phase 6: Sprint plan synthesized (6 sprints)
- [x] Protocol 27: `architecture:check`, `test:kat-cross-impl`, `secret-scan`, `ops:check`, scoped `verification typecheck` executed in-session
- [x] Protocol 22: `agent:next-work` → DTF-5.2.3 recorded
