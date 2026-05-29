---
title: "gtcx-core — Master Audit & Bank-Grade Certification"
status: "current"
date: "2026-05-28"
owner: "gtcx-core"
role: "quality-evidence-lead"
agent_id: "agent://gtcx-core/2026-05-28/foundation-audit"
trust_score: 60
autonomy_level: "permissioned"
tier: "critical"
tags: ["audit", "certification", "master-audit"]
review_cycle: "quarterly"
audit_type: master
target_repo: gtcx-core
audit_date: "2026-05-28"
composite: 8.9
composite_raw: 8.93
investor: 9.0
enterprise: 8.7
sov_dfi: 9.0
p0_count: 0
p1_count: 1
p2_count: 5
caps_fired: 0
---

# gtcx-core — Master Audit & Bank-Grade Certification

**Date:** 2026-05-28 (delta audit)
**Repo:** `gtcx-ecosystem/gtcx-core`
**Auditor:** Cursor Agent (foundation audit session)
**Methodology:** [forensic-master-prompt.md](../../gtcx-docs/docs/audit/prompts/forensic-master-prompt.md)
**Reference framework:** [SCORING_FRAMEWORK.md](../../gtcx-docs/tools/audit/audit-framework/SCORING_FRAMEWORK.md)
**Prior master audit:** [master-audit-2026-05-27.md](master-audit-2026-05-27.md) (8.9/10, commit `54903f3`)
**Current HEAD:** `86b3974`
**Working tree:** **Not clean** — extensive uncommitted doc/agent/baseline memory changes (docs-standard migration, `.baseline/` institutional memory). Verification commands run against committed tree at HEAD; WIP doc edits excluded from scoring evidence.

---

## Executive Summary

| Dimension                    |  Score | Rating Band                        |
| ---------------------------- | -----: | ---------------------------------- |
| Core Weighted Score          | 8.9/10 | production-capable with known gaps |
| Core Raw Score               | 8.93/10 | production-capable with known gaps |
| Investor Lens                | 9.0/10 | strong institutional platform      |
| Enterprise Buyer Lens        | 8.7/10 | production-capable with known gaps |
| African Sovereign / DFI Lens | 9.0/10 | strong institutional platform      |

**Verdict:** `gtcx-core` remains at **8.9/10** with no score inflation. Since the 2026-05-27 baseline (~20 commits), the repo gained BaselineOS institutional memory, canonical `gtcx-docs` protocol references, expanded agent credential documentation, and S46 sprint/audit remediation work. **`@gtcx/ai` is confirmed non-stub** (structured tracing with `AsyncLocalStorage`). **`@gtcx/workproof` gained a downstream consumer** in `gtcx-protocols` TradePass predicate bridge. All executable verification gates pass at HEAD.

**Top 3 priorities:**

1. Select pen-test vendor and execute kickoff — `docs/security/pen-test-engagement-log.md`
2. Commit or stash the large doc/baseline WIP tree before release tagging
3. Trigger SLSA provenance publish during operational window

---

## Evidence Reviewed

| Area | Evidence |
|------|----------|
| Prior audit | `master-audit-2026-05-27.md` (composite 8.9) |
| Git delta | `54903f3..86b3974` (~20 commits: baseline memory, docs-standard migration, S46 remediation, agent docs) |
| Source | 21 packages, 241 source files (architecture check) |
| Runtime checks | `pnpm typecheck`, `lint`, `test`, `build`, `architecture:check`, `quality:governance:check`, `test:coverage:critical` |

---

## Verification Commands

| Command | Result | Notes |
|---------|--------|-------|
| `pnpm typecheck` | Pass | 40/40 tasks |
| `pnpm lint` | Pass | 40/40 tasks |
| `pnpm test` | Pass | 45/45 tasks |
| `pnpm build` | Pass | 22/22 tasks |
| `pnpm architecture:check` | Pass | 21 packages, 241 source files |
| `pnpm quality:governance:check` | Pass | 14 scripts, 8 CODEOWNERS, 2 workflows |
| `pnpm test:coverage:critical` | Pass | Statements 97.64%, Branches 95.23%, Functions 95.69%, Lines 98.66% |
| `git status --short` | Dirty | Hundreds of uncommitted doc files — pre-release hygiene item |

---

## Findings

### Critical

None.

### High

**[P1] Pen-test vendor not selected** `docs/security/pen-test-engagement-log.md`, `docs/security/pen-test-vendor-shortlist.md`

Outreach and shortlist exist; external validation not yet scheduled. Blocks Security dimension uplift above 8.0 and Enterprise lens above ~8.7.

**Status:** Unchanged from 2026-05-27.

### Medium

**[P2] Large uncommitted doc/baseline working tree** repo root

`git status` shows extensive modified docs and `.baseline/memory/` files. Does not affect HEAD verification but blocks clean certification tagging and confuses delta audits.

**Fix:** Commit docs-standard migration in focused PRs or stash before next release.

**[P2] `rustls-webpki` RUSTSEC exceptions** `rust/.cargo/audit.toml`

Three documented exceptions (0098, 0099, 0104); upstream AWS SDK fix pending.

**[P2] SLSA provenance not yet published** `docs/security/slsa-attestation.md`

Workflow ready; publish trigger pending operational window.

**[P2] `@gtcx/sync` limited downstream adoption** ecosystem grep

`@gtcx/sync` consumed in `gtcx-core/tests/integration/sync-convergence.test.ts` only; `@gtcx/connectivity` used in `gtcx-core/packages/runtime` and `gtcx-mobile/packages/connectivity`.

**[P2] ZKP production backends interface-only** `packages/crypto`, `rust/gtcx-zkp`

Groth16/PLONK interfaces present; hash-commitment proof functional only.

### Low

**[P3] `export *` barrels** `packages/api-client/src/index.ts`

Tree-shaking limitation; tracked in barrel-export docs.

---

## Resolved / Improved Since 2026-05-27

| Item | Resolution |
|------|------------|
| `@gtcx/ai` silent no-op concern | **Resolved** — `packages/ai/src/` implements `traced()`, `withTrace()`, `AsyncLocalStorage` trace propagation, provenance helpers; tests in `packages/ai/tests/` |
| `@gtcx/workproof` zero consumers | **Partially resolved** — `gtcx-protocols/protocols/tradepass/src/predicate-bridge.ts` imports `WORKPROOF_PREDICATES` from `@gtcx/workproof` |
| BaselineOS coordination | **Improved** — `.baseline/` institutional memory initialized; `AGENTS.md` credential access docs expanded |

---

## Core Scorecard

| Dimension                         | Weight | Score | Confidence | Notes |
| --------------------------------- | -----: | ----: | ---------- | ----- |
| Code Quality                      |     15 |  9.5  | A          | All CI tasks pass; critical coverage ≥95% |
| Repo / Folder Hygiene             |     10 |  9.3  | B          | Strong structure; dirty WIP tree lowers confidence |
| Security                          |     20 |  8.0  | B          | FIPS wired; pen-test pending; RUSTSEC exceptions documented |
| Global South Resilience           |     15 |  9.0  | A          | USSD, connectivity profiles, offline sync engine |
| Ecosystem Integration             |     15 |  9.4  | A          | workproof → protocols bridge; ADR-012 Stage 0 |
| Agentic Maturity                  |     10 |  9.2  | A          | Agent docs, baseline memory, governance checks |
| Enterprise / Production Readiness |     15 |  8.5  | B          | SLOs, DR runbook; SLSA publish pending |

**Raw weighted score:** 8.93/10  
**Caps fired:** 0  
**Final core score:** **8.9/10**

---

## Lens Scores

| Lens | Score | Band |
|------|------:|------|
| Investor | 9.0 | strong institutional platform |
| Enterprise Buyer | 8.7 | production-capable with known gaps |
| African Sovereign / DFI | 9.0 | strong institutional platform |

---

## Top 5 Remediation Items

| Priority | Item | Owner | Target |
| -------- | ---- | ----- | ------ |
| P1 | Select pen-test vendor; execute kickoff | crypto-security-engineer | M2/M3 |
| P2 | Commit or stash doc/baseline WIP before release | quality-evidence-lead | S47 |
| P2 | Trigger SLSA provenance publish | frontier-infra-engineer | M2 |
| P2 | Expand `@gtcx/sync` adoption in mobile/platforms | protocol-architect | M3 |
| P2 | Monitor AWS SDK for rustls-webpki upstream fix | crypto-security-engineer | M2 |

---

## One-Point-Uplift Conditions

- **Core 8.9 → 9.9:** Pen-test report + SOC 2 Type 1 evidence + SLSA publish + DR drill
- **Investor 9.0 → 10.0:** External validation artifact (pen-test or SOC 2) + first regulator response
- **Enterprise 8.7 → 9.7:** Pen-test + SLSA + resolve RUSTSEC upstream
- **Sovereign 9.0 → 10.0:** Regulator-facing proof + sandbox admission letter

---

## Phase Notes

| Phase | Status |
|-------|--------|
| 1 — 6-phase forensic audit | Complete (delta against 2026-05-27) |
| 2 — Doc cleanup | Skipped (single `docs/` root) |
| 3 — Docs standard | WIP in working tree; HEAD structure compliant |
| 3.5 — Repo hygiene | P2 dirty tree noted |
| 5.5 — Verification | All HEAD gates pass |
| 5 — Bank-grade scoring | Complete |
