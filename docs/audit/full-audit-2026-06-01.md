---
title: 'Full Audit — gtcx-core'
status: 'current'
date: '2026-06-01'
owner: 'gtcx-core'
role: 'quality-evidence-lead'
agent_id: 'agent://gtcx-core/2026-06-01/full-audit'
trust_score: 85
autonomy_level: 'authorized'
tier: 'critical'
tags: ['audit', 'full-audit', 'roadmap']
review_cycle: 'quarterly'
audit_type: full-audit
target_repo: gtcx-core
audit_date: '2026-06-01'
---

# Full Audit — gtcx-core

**Date:** 2026-06-01  
**Branch:** `main` @ `7dceb91` (1 commit ahead of origin)  
**Method:** Cursor `/full-audit` — 6-phase pipeline with live verification  
**Prior audits:** [master-audit-2026-05-27](./master-audit-2026-05-27.md) (8.9/10), [full-audit-2026-05-09](./full-audit-2026-05-09.md) (superseded)

**Live gates (session):** `pnpm ops:check` 8 pass / 3 warn · `pnpm architecture:check` pass (22 packages, 249 source files) · `pnpm audit` clean

---

## PHASE 1 — Architecture Audit

| Dimension             | Rating    | Top Issue                                                                                                 |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| Spec Fidelity         | **6/10**  | README and runbooks still claim open odd-length-hex bug; package counts vary (18 vs 21 vs 22) across docs |
| Structural Integrity  | **10/10** | `architecture:check` — 0 boundary violations                                                              |
| Code Quality          | **9/10**  | Near-500 LOC files in `verification`; Rust P2P transport not wired                                        |
| Testability           | **9/10**  | DI in `domain`, injectable `fetcher` in `runtime` / `api-client`; 2,360+ tests                            |
| Operational Readiness | **9/10**  | 45+ CI steps; provenance, threat matrix, fuzz evidence on record                                          |
| Consistency           | **8/10**  | Duplicate YAML frontmatter blocks in multiple docs; `sync` vs `domain` offline split                      |

### Findings

- **[Medium] [Spec Fidelity] — README blocker stale after crypto-native 0.4.0 fix**  
  **Evidence:** `README.md:47,81` lists odd-length-hex as Sprint 2 blocker; `packages/crypto-native/CHANGELOG.md:17-35` documents fix in 0.4.0; `packages/crypto-native/tests/hex-validation.test.ts:143-271` property-tests rejection.  
  **Impact:** Regulators and downstream teams treat a closed defect as open.  
  **Fix:** Remove blocker lines from README; align Package Readiness Matrix note.

- **[Medium] [Spec Fidelity] — Package count drift across operational docs**  
  **Evidence:** `pnpm architecture:check` reports **22** packages; `docs/specs/packages/README.md:17` says 21; `docs/devops/runbooks/quality-runbook.md:46-49` says 18; `docs/stack/tech-stack.md:54` says "18 public + 3 config". New `@gtcx/ai-eval` not reflected everywhere.  
  **Impact:** Onboarding and audit evidence disagree with CI truth.  
  **Fix:** Single source of truth in `docs/roadmap.md` + `pnpm ops:check --emit-doc` or scripted package manifest.

- **[Low] [Consistency] — Verification sources approach LOC policy ceiling**  
  **Evidence:** `packages/verification/src/certificates/templates.ts` (468 LOC), `generator.ts` (455 LOC) per `wc -l`.  
  **Impact:** Future growth triggers boundary/LOC gate failures.  
  **Fix:** Split template registry from generator orchestration.

- **[Low] [Structural Integrity] — Offline sync logic split across packages**  
  **Evidence:** `packages/sync/src/index.ts` implements conflict strategies; `packages/domain/src/internal/offline-queue.ts:36,205` owns logical-sequence replay (tests at `packages/domain/tests/offline-queue.test.ts:114`).  
  **Impact:** Integrators must know two surfaces; spec in `docs/specs/packages/sync.md` may overstate `sync` ownership.  
  **Fix:** Document canonical import path in sync spec; consider re-export from `@gtcx/sync`.

- **[Low] [Spec Fidelity] — Rust P2P transport explicitly Phase 2**  
  **Evidence:** `rust/gtcx-network/src/lib.rs:15-18` — types only; libp2p integration planned.  
  **Impact:** README "Production-hardened" for `@gtcx/network` overstates transport readiness.  
  **Fix:** Maturity badge already partially added per crypto-native CHANGELOG pattern; extend to network crate docs.

---

## PHASE 2 — Security Audit

| Area                           | Status                             | Evidence                                                                                                                                             |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication & Authorization | **N/A (correct)**                  | Library has no auth surface; scoped in threat model                                                                                                  |
| Data Protection                | **Strong**                         | `sanitizeSecrets` / `redactSecrets` (`packages/security/src/index.ts:58`, `packages/ai/src/traced.ts:12`); AES-GCM offline paths in security package |
| Input Validation               | **Strong**                         | Zod across schemas/verification; `assertHex` at NAPI (`packages/crypto-native/src/index.ts:74-80`)                                                   |
| Dependency Security            | **Strong (TS) / Mitigated (Rust)** | `pnpm audit` clean; `rust/.cargo/audit.toml` documents 6 ignored advisories with justification                                                       |
| Cryptographic Correctness      | **Strong**                         | No custom primitives; `#![deny(unsafe_code)]` in Rust; SA-002 placeholder ZKP gated (`packages/crypto/src/zkp.ts:109-121`)                           |
| Compliance Posture             | **Partial**                        | Framework docs present; **external attestation not delivered**                                                                                       |

### Findings

- **[High] [Compliance] — External penetration test not engaged**  
  **Evidence:** `docs/security/pen-test-engagement-log.md:42-47` — vendor not selected, SoW unsigned.  
  **Impact:** Enterprise/sovereign procurement gate.  
  **Fix:** Execute Sprint 4 vendor selection per `docs/internal/vendor-outreach-pen-test.md`.

- **[High] [Compliance] — SOC 2 Type 1 letter not received**  
  **Evidence:** `README.md:39-43`, engagement roadmap issue #11.  
  **Impact:** Bank-grade claims require third-party attestation.  
  **Fix:** CPA engagement per budget plan.

- **[Medium] [Dependency] — Rust transitive advisories accepted via ignore list**  
  **Evidence:** `rust/.cargo/audit.toml:11-41` — `derivative`, `paste`, `rustls-webpki` RUSTSECs.  
  **Impact:** Supply-chain scanner noise; real risk low for direct usage but requires monitoring.  
  **Fix:** Track arkworks 0.5 migration; remove webpki ignores when AWS SDK upgrades.

- **[Low] [Operational] — `ai-eval` uses `execSync` for git diff**  
  **Evidence:** `packages/ai-eval/src/safety.ts:35-38` — dev/CI tooling only, not runtime library surface.  
  **Impact:** Minimal; confined to eval CLI.  
  **Fix:** None required; document as trusted CI context only.

- **[Closed] [Cryptographic] — Hash-commitment placeholder ZKP**  
  **Evidence:** `generate()` throws unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1` (`packages/crypto/src/zkp.ts:109-121`).

---

## PHASE 3 — GTM Readiness

**Stages assessed:** S0 Prototype → S6 Defense

| Stage             | Technical | Commercial | Trust     | Operational | AI-Specific | Overall             |
| ----------------- | --------- | ---------- | --------- | ----------- | ----------- | ------------------- |
| **S0 Prototype**  | Ready     | Ready      | Ready     | Ready       | Ready       | **Ready**           |
| **S1 MVP**        | Ready     | Ready      | Ready     | Ready       | Ready       | **Ready**           |
| **S2 Pilot**      | Partially | Partially  | Partially | Partially   | Partially   | **Partially Ready** |
| **S3 Production** | Partially | Partially  | Not Ready | Partially   | Partially   | **Partially Ready** |
| **S4 Scale**      | Not Ready | Not Ready  | Not Ready | Not Ready   | Not Ready   | **Not Ready**       |
| **S5 Defense**    | Not Ready | Not Ready  | Not Ready | Not Ready   | Not Ready   | **Not Ready**       |

_Stopped after two consecutive **Not Ready** (S4, S5)._

### Current GTM stage: **S2 Pilot → S3 Production boundary**

**Justification:** 18/21 `@gtcx/*` packages on npm (`docs/governance/trust-portal.md:72-96`); FIPS path documented; fuzz campaign zero crashes; sovereign engagement roadmap active. Blocked from full S3 by missing pen-test report, SOC 2 letter, and 3 unpublished substrate packages (`resilience`, `telemetry`, `runtime`).

### First realistic deal (next 90 days)

**Zimbabwe or Ghana minerals-commission sandbox** — regulator reviews trust portal + npm packages + sample verification flow. Staged email templates exist (`docs/gtm/09-pre-submission-email-zimbabwe.md`, `13-pre-submission-email-ghana.md`).

### Top 5 stage gate blockers

1. Pen-test vendor selection and report delivery (`pen-test-engagement-log.md`)
2. SOC 2 Type 1 attestation timeline
3. Publish `@gtcx/resilience`, `@gtcx/telemetry`, `@gtcx/runtime` with provenance
4. Per-jurisdiction config E2E validation for 5 target states (roadmap issue #14)
5. README/trust-portal doc accuracy (regulator first impression)

### AI trust gaps

- `SR-002` human-in-loop enforced in `docs/agents/safety-rules.json:16-24`
- New `@gtcx/ai-eval` scorecard (`feat(ai-eval)` commits) — good for evidence, not yet wired to CI gate
- No runtime "AI approves trade" surface in core (correct for a library)

### Competitive reality (90-day copy test)

| Asset                           | Copyable in 90 days?                                       |
| ------------------------------- | ---------------------------------------------------------- |
| Ed25519 + noble/arkworks stack  | **Yes**                                                    |
| Offline logical-sequence replay | **Partially** — pattern copyable; integration depth harder |
| Core12 + WorkProof schemas      | **Partially** — specs public, domain knowledge is not      |
| FIPS + HSM keystore story       | **Partially** — config and docs, not relationships         |
| Sovereign engagement evidence   | **No** — relationships and audit trail                     |

---

## PHASE 4 — Hygiene Audit

| Category          | Score /10 | Issues                                                                                                              |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| Documentation     | **8**     | Duplicate frontmatter in `orientation.md`, `quality-runbook.md`, `pen-test-engagement-log.md`; README blocker stale |
| File Structure    | **10**    | Clean root; `packages/`, `rust/`, `docs/` well partitioned                                                          |
| Naming            | **9**     | Kebab-case docs; `@gtcx/*` consistent                                                                               |
| Package / Build   | **10**    | Turbo pipeline; `check:dist` passes; no tracked `dist/`                                                             |
| Code Hygiene      | **9**     | No `@ts-ignore` in crypto src; 0 unsafe Rust                                                                        |
| Test Hygiene      | **9**     | ≥95% branch gate; property tests on hex boundary                                                                    |
| CI/CD             | **10**    | `ci.yml` — lint, test, coverage, rust, CodeQL path, provenance                                                      |
| Dependency Health | **8**     | pnpm clean; Rust ignores documented                                                                                 |
| Git Hygiene       | **9**     | Signed commits required; branch protection pass                                                                     |
| Monorepo          | **9**     | Boundaries enforced; minor doc count drift                                                                          |

**Failures / partials:** Documentation (README), Dependency Health (Rust ignores), Monorepo (22 vs 18 vs 21 package claims).

---

## PHASE 5 — Production Readiness

| Area                  | Rating               | Evidence                                                                                     |
| --------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| **Deployment**        | **Mostly Ready**     | `.github/workflows/release.yml`; 18/21 on npm; changesets + provenance manifest              |
| **Monitoring**        | **Gaps**             | `@gtcx/telemetry` exists; no consumer SLO/runbook for library integrators                    |
| **Incident Response** | **Mostly Ready**     | `docs/devops/runbooks/incident-runbook.md` — P0 crypto patch SLA 24h                         |
| **Disaster Recovery** | **N/A / Gaps**       | Library repo — DR is downstream; no data plane                                               |
| **Capacity**          | **Mostly Ready**     | `pnpm perf:check-budgets` in CI; benchmark history                                           |
| **Dependencies**      | **Production-Ready** | Circuit breaker, bulkhead, adaptive retry in `@gtcx/resilience`; wired in `runtime.ts:17-21` |

---

## PHASE 6 — Sprint Plan (Synthesis)

### 6.1 Intelligence Synthesis

| #   | Finding                                        | Source          | Severity | Status |
| --- | ---------------------------------------------- | --------------- | -------- | ------ |
| 1   | README odd-length-hex blocker stale            | P1              | Medium   | Open   |
| 2   | Package count 18/21/22 drift                   | P1, P4          | Medium   | Open   |
| 3   | Pen-test vendor not selected                   | P2, P3          | High     | Open   |
| 4   | SOC 2 Type 1 not delivered                     | P2, P3          | High     | Open   |
| 5   | 3 npm packages unpublished                     | P3, P5          | High     | Open   |
| 6   | Rust P2P transport scaffolding                 | P1              | Low      | Open   |
| 7   | TURBO_TOKEN / TURBO_TEAM missing               | ops:check       | Medium   | Open   |
| 8   | OPENAI_API_KEY missing (AI codeowner fallback) | ops:check       | Medium   | Open   |
| 9   | Jurisdiction config not E2E for 5 states       | P3              | High     | Open   |
| 10  | `ai-eval` not in CI quality gate               | P4              | Low      | Open   |
| 11  | Verification LOC near ceiling                  | P1              | Low      | Open   |
| 12  | Trust portal provenance column empty           | trust-portal.md | Medium   | Open   |

### 6.2 Innovation Scan

**Refactoring:** Consolidate offline-queue documentation; split `verification` templates file before LOC gate fires.

**Moat (90-day copy test — survives):**

- **Logical-sequence offline replay** integrated with conflict strategies — ship reference mobile integration kit
- **Jurisdiction-config + Core12** validated bundles per sovereign — not just schemas
- **ai-eval scorecard** as published evidence artifact per release (competitors rarely ship eval harnesses with crypto libs)

**AI-native:** Wire `pnpm ai:evaluate` into release evidence check; extend scorecard to flag spec drift (package count, README blockers) automatically.

### 6.3 Sprint Architecture

## Sprint 1: Front-door truth (1 week)

**Layer mix:** Remediation 4 | Evolution 1 | Innovation 0

### Goals

Accurate regulator-facing docs; closed false blockers; ops warnings cleared.

### Tasks

| #   | Task                                             | Layer       | Files                                                                 | Effort | Why It Matters                        |
| --- | ------------------------------------------------ | ----------- | --------------------------------------------------------------------- | ------ | ------------------------------------- |
| 1   | Remove odd-length-hex from README blockers       | Remediation | `README.md`                                                           | XS     | Stops false P2 in regulator review    |
| 2   | Align package counts to 22 (21 public + ai-eval) | Remediation | `quality-runbook.md`, `tech-stack.md`, `qa-process.md`                | S      | Single truth for audits               |
| 3   | Set TURBO_TOKEN, TURBO_TEAM, OPENAI_API_KEY      | Remediation | gh org secrets                                                        | XS     | CI velocity + AI codeowner resilience |
| 4   | Add ai-eval to architecture manifest             | Evolution   | `tools/check-package-boundaries.mjs`, `docs/specs/packages/README.md` | S      | New package formally tracked          |

### Definition of Done

`pnpm ops:check` 0 warnings; README blockers match CHANGELOG; docs:check-links pass.

### Commit Plan

`docs(readme): close odd-length-hex blocker` · `docs(devops): align package counts to 22` · `chore(ops): document turbo and openai secrets`

### Sprint Value Statement

Regulators see accurate status on first clone.

---

## Sprint 2: Publish substrate + provenance (1 week)

**Layer mix:** Remediation 3 | Evolution 1 | Innovation 1

### Goals

21/21 packages on npm with provenance evidence populated.

### Tasks

| #   | Task                                               | Layer       | Files                                           | Effort | Why It Matters                           |
| --- | -------------------------------------------------- | ----------- | ----------------------------------------------- | ------ | ---------------------------------------- |
| 1   | Changeset + publish resilience, telemetry, runtime | Remediation | `.changeset/*`, `release.yml`                   | M      | Downstream can pin substrate             |
| 2   | Populate trust-portal provenance column            | Remediation | `docs/governance/trust-portal.md`               | S      | Vendor risk teams need attestation links |
| 3   | Run `release:ga:evidence:check` post-publish       | Remediation | `quality/`, `artifacts/`                        | S      | GA evidence chain complete               |
| 4   | Wire `pnpm ai:evaluate` in CI (non-blocking)       | Innovation  | `.github/workflows/ci.yml`, `packages/ai-eval/` | M      | Automated spec-drift detection           |

### Definition of Done

All 21 packages on npm; trust portal table complete; ai-eval artifact uploaded in CI.

### Commit Plan

`chore(release): publish runtime substrate packages` · `docs(trust-portal): add provenance links` · `ci(ai-eval): add scorecard artifact step`

### Sprint Value Statement

Downstream repos consume released substrate, not workspace links.

---

## Sprint 3: Sovereign pilot hardening (1 week)

**Layer mix:** Remediation 2 | Evolution 2 | Innovation 1

### Goals

Five target jurisdictions have validated config paths; offline story documented.

### Tasks

| #   | Task                                             | Layer       | Files                                      | Effort | Why It Matters                         |
| --- | ------------------------------------------------ | ----------- | ------------------------------------------ | ------ | -------------------------------------- |
| 1   | E2E jurisdiction fixtures ZW/GH/NA/BW/CD         | Remediation | `packages/config/jurisdiction/`, tests     | L      | Engagement roadmap #14                 |
| 2   | Document offline canonical path (domain vs sync) | Evolution   | `docs/specs/packages/sync.md`, `domain.md` | S      | Integrator confusion removed           |
| 3   | Split verification templates if >500 LOC         | Evolution   | `packages/verification/src/certificates/`  | M      | Prevents LOC gate failure              |
| 4   | Reference integration: runtime + offline queue   | Innovation  | `tests/integration/`                       | L      | Moat — copyable code, hard integration |

### Definition of Done

Jurisdiction tests green; integration test demonstrates replay ordering.

### Commit Plan

`test(jurisdiction): add five-state validation fixtures` · `docs(sync): clarify offline ownership` · `test(integration): runtime offline replay scenario`

### Sprint Value Statement

Pilot countries see their configs exercised, not just defined.

---

## Sprint 4: External trust (1 week)

**Layer mix:** Remediation 3 | Evolution 0 | Innovation 0

### Goals

Pen-test kicked off; Zimbabwe/Ghana sandbox emails sent with accurate evidence pack.

### Tasks

| #   | Task                              | Layer       | Files                         | Effort | Why It Matters  |
| --- | --------------------------------- | ----------- | ----------------------------- | ------ | --------------- |
| 1   | Select pen-test vendor + sign SoW | Remediation | `pen-test-engagement-log.md`  | M      | S3 gate         |
| 2   | Send sandbox intro (ZW or GH)     | Remediation | `docs/gtm/09-*.md`, `13-*.md` | S      | Revenue trigger |
| 3   | SOC 2 CPA kickoff                 | Remediation | compliance docs               | M      | Enterprise gate |

### Definition of Done

Pen-test log shows vendor + kickoff date; sent email logged in engagement dashboard.

### Sprint Value Statement

External attestation clock starts; sovereign engagement unblocked.

---

## Sprint 5: Transport honesty + Rust debt (1 week)

**Layer mix:** Remediation 1 | Evolution 2 | Innovation 1

### Goals

Maturity labels match code; arkworks migration plan executed or scheduled.

### Tasks

| #   | Task                                               | Layer       | Files                           | Effort | Why It Matters     |
| --- | -------------------------------------------------- | ----------- | ------------------------------- | ------ | ------------------ |
| 1   | Maturity badges on network, consensus, edge crates | Remediation | `rust/*/README.md`, root README | S      | Stops oversell     |
| 2   | libp2p integration spike or ADR deferral           | Evolution   | `rust/gtcx-network/`            | L      | Honest roadmap     |
| 3   | arkworks 0.5 migration tracker → issues            | Evolution   | `rust/.cargo/audit.toml`, ADR   | M      | Reduce ignore list |

### Sprint Value Statement

Technical narrative matches implementation depth.

---

## Sprint 6: Moat — evidence automation (1 week)

**Layer mix:** Remediation 0 | Evolution 1 | Innovation 3

### Goals

Every release ships machine-readable trust evidence.

### Tasks

| #   | Task                                        | Layer      | Files                             | Effort | Why It Matters               |
| --- | ------------------------------------------- | ---------- | --------------------------------- | ------ | ---------------------------- |
| 1   | ai-eval gates README/spec drift             | Innovation | `packages/ai-eval/src/`           | M      | 90-day copy test — automated |
| 2   | Published fuzz summary per release          | Innovation | `tools/`, `docs/audit/`           | S      | Regulator-ready artifact     |
| 3   | Signed trust-portal snapshot (external URL) | Innovation | `docs/governance/trust-portal.md` | L      | Moat — operational evidence  |

### Sprint Value Statement

Trust compounds per release, not per sales cycle.

---

### 6.4 Roadmap Visualization

| Dimension             | Before     | After S1 | After S2 | After S4              | After S6 |
| --------------------- | ---------- | -------- | -------- | --------------------- | -------- |
| Security              | 8.5        | 8.5      | 8.6      | 9.0 (pen-test active) | 9.2      |
| Operational readiness | 8.0        | 8.5      | 9.0      | 9.0                   | 9.2      |
| GTM stage             | S2 partial | S2       | S2+      | S3 partial            | S3       |
| Developer experience  | 8.5        | 9.0      | 9.2      | 9.2                   | 9.5      |
| Competitive moat      | 7.0        | 7.0      | 7.5      | 8.0                   | 8.5      |
| AI maturity           | 6.5        | 6.5      | 7.5      | 7.5                   | 8.5      |

### 6.5 Meta-Learning

- **What this codebase teaches:** Bank-grade discipline is achievable in a monorepo when gates are mechanical (architecture, threat matrix, coverage, fuzz) — but **documentation drift** is the remaining enemy; code outran README.
- **Constraining decisions:** Library-only scope (correct); strict layering (correct); arkworks 0.4 pins create long-tail Rust advisory debt.
- **6-month radar:** Pen-test + SOC 2 delivery; libp2p Phase 2 or explicit deferral ADR; jurisdiction-config as productized sovereign packs.
- **From scratch:** Would generate package manifest from `pnpm-workspace.yaml` into docs on every CI run — never hand-count packages again.

---

## OUTPUT SUMMARY

**Current State:** Production-capable cryptographic foundation (8.9/10 bank-grade) with excellent mechanical quality gates, but **regulator-facing docs lag code** and **external attestation (pen test, SOC 2) is not yet delivered**.

**Target State:** S3 production boundary — 21/21 npm packages with provenance, accurate trust surfaces, pen-test in flight, five jurisdictions validated, automated evidence per release.

**Critical Path:**

1. Doc truth (README blockers, package counts) — gates regulator trust on day 1
2. Publish `resilience` / `telemetry` / `runtime` — gates downstream substrate adoption
3. Pen-test vendor + SoW — gates enterprise/sovereign procurement

**Timeline:** 6 weeks (6 one-week sprints) to S3 boundary; pen-test **report** adds 4–6 weeks external calendar time beyond Sprint 4 kickoff.

**Biggest Risk:** Sovereign engagement proceeds against stale README blockers and missing pen-test report — pilot converts to "wait and see."

**Biggest Opportunity:** **`@gtcx/ai-eval` + automated trust evidence** — turn this repo into the only commodity-crypto foundation that ships a machine-readable trust scorecard every release. Hard to copy quickly because it encodes GTCX-specific safety rules and gate semantics.

**Tracked in:** [docs/roadmap.md §4.10](../roadmap.md#410-gtcxai-eval--machine-readable-trust-scorecards-strategic-moat) · [engagement roadmap Phase 6](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md#phase-6--trust-automation-moat-post-engagement-q2q3-2026) · [trust portal](../governance/trust-portal.md#machine-readable-trust-artifacts-roadmap)
