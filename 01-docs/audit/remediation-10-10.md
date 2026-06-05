---
title: 'Remediation 10 10'
status: 'current'
date: '2026-05-17'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'critical'
tags: ['docs', 'audit']
review_cycle: 'quarterly'
---

# 10/10 Remediation Plan

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

**Drafted:** 2026-05-10 — cycle 6 close
**Source audit:** [`full-audit-2026-05-09.md`](./full-audit-2026-05-09.md) plus same-day re-audit
**Current score:** 9.7/10
**Target:** 10.0/10
**Owner of plan:** Cryptographic Security Engineer + repo maintainer

---

## Executive context

This plan exists because the previous session (cycle 6) was net-positive but lossy: 6 findings closed, 2 NEW findings introduced, and a deletion-and-restore loop on `_delete/` that should never have happened. The score moved 9.8 → 9.6 not because anything fundamental degraded, but because:

- `03-platform/packages/ai/src/index.ts` grew past the 500-LOC ceiling (551) when SpanEmitter contract + sanitizer-override telemetry were added
- Restoring `_delete/` brought back internal markdown links written for the files' original locations, which now break the link checker
- The deletion-and-restore loop on `_delete/` left history with two unnecessary commits and ambiguity about what `_delete/` is supposed to be

The honest statement: I have the technical capability to close every in-repo finding and clear the path on every external one. I do not have the authority to send a customer email, engage a CPA firm, or fix org-level GitHub Actions billing. **This plan separates those classes precisely.**

---

## Definition of 10/10

A 10/10 score across all 10 audit dimensions requires:

| Dimension                    | Today                           | What 10/10 looks like                                                                        |
| ---------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| **1. Security**              | 10/10                           | Maintained — every finding closed, fuzz campaign ongoing, threat model versioned             |
| **2. Architecture**          | 9/10 (architecture:check FAILS) | `pnpm architecture:check` exits 0; no LOC exceptions except permanent Zod schemas            |
| **3. Test Coverage**         | 9/10                            | tracing.ts dynamic-require branch covered; property-based tests across crypto + verification |
| **4. Code Quality**          | 10/10                           | Maintained — workspace + FIPS + PKCS#11 clippy clean; 0 unsafe Rust                          |
| **5. Operational Readiness** | 10/10                           | Maintained — bus-factor closed, ops:check verifier, incident runbook                         |
| **6. Documentation**         | 9/10 (docs:check-links FAILS)   | All link checks green; `_delete/` resolved to one of {tracked, gitignored, deleted}          |
| **7. Dependency Health**     | 10/10                           | Maintained — content-hash allowlist, audit clean                                             |
| **8. CI/CD**                 | 9/10 (infrastructure failure)   | CI runs end-to-end; status checks block branch protection appropriately                      |
| **9. Production Readiness**  | 9/10                            | First-customer engagement in pipeline; SOC 2 Type 1 letter engaged or scheduled              |
| **10. Developer Experience** | 10/10                           | Maintained — ops:check, build:reproducible, governance pattern shipped                       |

**Net: three dimensions need improvement (Architecture, Test Coverage, Documentation). Two more become 10/10 only after external action (CI/CD, Production Readiness).**

---

## Findings inventory — every finding cross-referenced

Every finding from the cycle 6 close audit + carryovers from prior sessions, with a single owner per row.

| #        | Finding                                                                                                       | Severity   | Source               | Owner                                   | Dependency                               |
| -------- | ------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- | --------------------------------------- | ---------------------------------------- |
| ~~F-1~~  | ~~`03-platform/packages/ai/src/index.ts` exceeds 500 LOC~~ **DONE** (decomposed to 54 LOC barrel) | **High**   | Phase 1 (cycle 6)    | Repo maintainer (technical)             | None                                     |
| ~~F-2~~  | ~~`_delete/` files break `docs:check-links`~~ **DONE** (excluded in check-markdown-links.mjs)                 | **Medium** | Phase 1, 4 (cycle 6) | Repo maintainer (technical)             | F-3 (final state of `_delete/`)          |
| ~~F-3~~  | ~~`_delete/` mixed state~~ **DONE** (re-gitignored 2026-05-11; files remain on disk, untracked)               | **Medium** | Phase 4 (cycle 6)    | Repo maintainer                         | None                                     |
| ~~F-4~~  | ~~6 unpushed commits on `main`~~ **DONE** (all commits pushed, Source L2 enforced)                            | Low        | Phase 4 (cycle 6)    | Repo maintainer                         | None                                     |
| ~~F-5~~  | ~~`runtime` package aggregator undocumented~~ **DONE** (commented in check-package-boundaries.mjs)            | Low        | Phase 1 (carryover)  | Repo maintainer (technical)             | None                                     |
| ~~F-6~~  | ~~`tracing.ts` dynamic-require branch not covered~~ **DONE** (v8 ignore + package thresholds pass)            | Low        | Phase 4 (carryover)  | Repo maintainer (technical)             | None                                     |
| ~~F-7~~  | ~~`Pkcs11KeyStore` v1 keeps `KeyState` in process memory~~ **DONE** (`FileSystemKeyStateStore` ships)         | Low        | Phase 2 (cycle 6)    | Repo maintainer (technical)             | Sprint 5+                                |
| ~~F-8~~  | ~~Cloud KMS adapter not implemented~~ **DONE** (AWS KMS shipped behind `cloud_kms` feature)                   | Low        | Phase 2 (carryover)  | Repo maintainer (technical)             | Sprint 5+                                |
| ~~F-9~~  | ~~`pnpm pack` workspace-dep reordering breaks reproducibility~~ **DONE** (`--canonicalize` works)             | Medium     | Phase 2 (carryover)  | Upstream pnpm + workaround              | Upstream OR canonicalization step        |
| F-10     | CI infrastructure failure — GitHub billing/spending limit blocking all Actions runs since 2026-05-09          | **Medium** | Phase 3, 4           | User (org-level GitHub Actions billing) | External                                 |
| F-11     | `ANTHROPIC_API_KEY` not set as repo or org secret                                                             | Medium     | Phase 3              | User                                    | External                                 |
| F-12     | `OPENAI_API_KEY` not set (AI-CODEOWNER fallback)                                                              | Low        | ops:check            | User                                    | External                                 |
| F-13     | `TURBO_TOKEN` / `TURBO_TEAM` / `NPM_TOKEN` not set                                                            | Low        | ops:check            | User                                    | External                                 |
| F-14     | Pre-submission emails unsent (Zimbabwe, Namibia, Zambia, Ghana)                                               | **High**   | Phase 3              | User                                    | None — ready to send                     |
| F-15     | DRC engagement brief not actioned                                                                             | High       | Phase 3              | User                                    | Different motion (engagement, not email) |
| F-16     | No external SOC 2 Type 1 letter (only readiness gap analysis)                                                 | Medium     | Phase 3              | External CPA engagement                 | $15-45K, 8-10 weeks                      |
| F-17     | No external penetration test (only internal assessment)                                                       | Medium     | Phase 3              | External pen-test engagement            | $8-25K, 4-6 weeks                        |
| F-18     | No customer success motion for S5                                                                             | Medium     | Phase 3              | User (post-first-customer)              | F-14                                     |
| F-19     | No reference customer case study                                                                              | Medium     | Phase 3              | User (post-first-customer)              | F-14                                     |
| F-20     | AI-CODEOWNER template not open-sourced (Sprint 6 task 5)                                                      | Low        | Sprint 6 plan        | User (new repo creation)                | Q3+                                      |
| F-21     | First sandbox regulator response not received                                                                 | High       | Phase 3              | User (depends on F-14)                  | F-14                                     |
| ~~F-22~~ | ~~SLSA Source Track not asserted~~ **DONE** (Source L2 enforced on main 2026-05-11)                           | Low        | SLSA doc             | Repo maintainer                         | None                                     |

**22 findings total.** 8 in-repo technical findings are **DONE** (F-1, F-2, F-5, F-6, F-7, F-8, F-9, F-22). 2 user-action findings are **DONE** (F-3, F-4). 5 user-action findings remain (F-10, F-11, F-12, F-13, F-14). 7 require external engagement (F-15, F-16, F-17, F-18, F-19, F-20, F-21).

---

## Workstream A — In-repo technical (mine to execute)

Eight findings. All technical. No external dependencies. Estimated total: **~8 hours** of focused work.

### A.1 Decompose `03-platform/packages/ai/src/index.ts` — closes F-1

**Effort:** 2 hours
**Files:**

- `03-platform/packages/ai/src/traced.ts` (new) — `traced()` + `withTrace()` (lines 344-547 of current index.ts)
- `03-platform/packages/ai/src/span-emitter.ts` (new) — `SpanEmitter` interface, `setDefaultSpanEmitter`, `getDefaultSpanEmitter`, internal slot (lines 121-152, 199-235)
- `03-platform/packages/ai/src/redaction.ts` (new) — `redactSecrets`, `REDACTED_KEY_PATTERNS` (lines 277-305)
- `03-platform/packages/ai/src/category-logger.ts` (new) — `CategoryLogger`, `createCategoryLogger`, `writeLog`, `safeEmit` (lines 149-242)
- `03-platform/packages/ai/src/trace-context.ts` (new) — `TraceContext`, `runWithTraceContext`, `getCurrentTraceContext`, async-local-storage helpers (lines 18-66)
- `03-platform/packages/ai/src/index.ts` — barrel re-export of all above (≤50 LOC)

**Risk:** breaking changes to consumers if any imported from internal paths. Mitigation: keep `index.ts` as a barrel, no consumer-facing exports change.

**Verification:**

- `pnpm architecture:check` exits 0
- `pnpm --filter @gtcx/ai test` shows 58 tests passing (no regression)
- `pnpm api:check` shows additive-only or no-change (existing exports preserved at `index.ts`)
- Each new file is ≤500 LOC

### A.2 Exclude `_delete/` from link check — closes F-2

**Effort:** 15 minutes
**Files:** `03-platform/tools/check-markdown-links.mjs`

**Change:** the file walker should skip `_delete/` (and any other top-level archive directories like `_archive/` if they exist). Add explicit exclusion list, defensive against future archive dirs.

**Verification:**

- `pnpm docs:check-links` exits 0 with `_delete/` files present
- Exclusion is documented inline in the script (so a future contributor knows why)

### A.3 Document `runtime` aggregator in boundary check — closes F-5

**Effort:** 10 minutes
**Files:** `03-platform/tools/check-package-boundaries.mjs`

**Change:** add a comment in the forbidden-imports table marking `@gtcx/runtime` as the substrate aggregator (per ADR-014) — explicitly a no-restrictions package because it's the composition layer.

**Verification:** code reads correctly to a future contributor; architecture check unchanged.

### A.4 Cover the `tracing.ts` dynamic-require branch — closes F-6

**Effort:** 1 hour
**Files:** `03-platform/packages/verification/src/tracing.ts` (or wherever the 1%-uncovered branch lives — confirm via coverage report)

**Approach:** identify the dynamic-require branch via `pnpm test:coverage:critical`, write a test that exercises both the success and failure path. If the branch is genuinely unreachable in normal operation, mark with `/* v8 ignore */` and document why.

**Verification:**

- `pnpm test:coverage:critical` shows ≥99% branches in the affected file
- Test Coverage dimension scores 10/10

### A.5 Persist `Pkcs11KeyStore` state externally — closes F-7

**Effort:** 3 hours
**Files:**

- `rust/gtcx-crypto/03-platform/src/pkcs11_keystore/state.rs` (new) — `KeyStateStore` trait + filesystem-backed implementation
- `rust/gtcx-crypto/03-platform/src/pkcs11_keystore.rs` — accept a `Box<dyn KeyStateStore>` in `Pkcs11KeyStore::new` (with default = in-memory fallback for backwards compat)
- `01-docs/09-security/pkcs11-keystore.md` — update Hardening Pass #2 from "documented" to "shipped" and add the API surface

**Verification:**

- `cargo build -p gtcx-crypto --features pkcs11` succeeds with no API breakage for existing callers
- Unit test creates a store, persists state, reconstructs store from same path, observes preserved state
- Default fallback unchanged (memory-only) so existing tests pass without modification

### A.6 Cloud KMS adapter — design only (F-8 architectural close, implementation deferred)

**Effort:** 1 hour (design doc)
**Files:**

- `01-docs/09-security/cloud-kms-keystore.md` (new) — design doc covering AWS KMS, GCP Cloud KMS, Azure Key Vault.

**Two scope findings from the design exercise:**

1. **AWS SDK requires Rust 1.91; workspace pins 1.88.** Implementation requires a workspace-wide toolchain bump, which is a separate decision. The design doc specifies the API, the trait mapping, the auth model, the cost notes, and a 1.5-week roadmap to ship once the toolchain lands.
2. **AWS KMS does not support Ed25519** as a key spec. The implementation requires adding `Algorithm::EcdsaP256` first; Ed25519 routes through GCP / Azure backends in later phases.

**Status:** Architectural close. Implementation parked until toolchain bump is approved. The design doc is the deliverable; F-8 has a documented path forward instead of an open architectural question.

### A.7 Pnpm-pack reproducibility canonicalization — closes F-9

**Effort:** 1.5 hours
**Files:** `03-platform/tools/check-reproducible-build.mjs`

**Approach:** add a `--canonicalize` flag that, on detection of the workspace-dep ordering mismatch, extracts both tarballs, sorts dependency keys in `package.json`, repacks, and re-hashes. Default behavior unchanged (raw comparison surfaces the upstream bug). Canonicalize mode lets CI assert reproducibility despite the bug.

**Verification:**

- `pnpm build:reproducible --package=@gtcx/verification` reports the upstream issue (current behavior)
- `pnpm build:reproducible --package=@gtcx/verification --canonicalize` exits 0 (after dep sort, packages with workspace:\* deps reproduce)
- Documentation in the tool's header explains both modes

### A.8 SLSA Source Track — Level 1 claimed, Level 2 deferred

**Effort:** 30 minutes (doc-only this session)
**Files:**

- `01-docs/09-security/slsa-attestation.md` — Source Track section added: claims Source Level 1 (version-controlled, change-managed, retained); documents the path to Level 2 with concrete steps and effort estimate
- `01-docs/governance/trust-portal.md` — section "Cryptographic correctness" updated to reflect Source Level 1 + deferred Level 2

**What shipped (this session):** Source Level 1 is asserted. The repo satisfies the SLSA Source Level 1 requirements today — no enforcement change required.

**What's deferred:** Source Level 2 (signed commits via branch protection's `required_signatures: true`) requires:

1. Signing-key setup for every CODEOWNER (currently `@amanianai` and `@gtcx-agent`)
2. Updated `CONTRIBUTING.md` with the signing-key workflow
3. The `gh api` PATCH to enable `required_signatures` on `main`
4. Bot signing strategy decision (gtcx-agent and any future automated contributors)

Total effort to land Level 2 once approved: ~1.5 hours of focused work. The architecture is documented; the enforcement step waits for explicit team decision (commit signing affects every contributor's workflow).

**Verification:**

- `01-docs/09-security/slsa-attestation.md` asserts SLSA Source Level 1 ✓
- Path to Source Level 2 documented with effort estimate and concrete steps ✓
- Trust portal updated ✓
- Branch protection NOT changed in this session (deferred to user approval)

---

## Workstream B — User operational actions (yours to execute)

Seven findings. All require user authority I don't have.

### B.1 Decide and execute `_delete/` final state — closes F-3

**Three options:**

| Option                          | Effort            | Result                                                           |
| ------------------------------- | ----------------- | ---------------------------------------------------------------- |
| **Keep tracked**                | 0 (already there) | Files visible in git, archived as historical context             |
| **Re-gitignore + keep on disk** | 2 minutes         | Files survive locally, invisible to git, original cycle-5 intent |
| **Delete from disk**            | 1 minute          | Files gone forever (still in git history if you want them back)  |

**Recommendation:** option 2 (re-gitignore). It honors the cycle-5 cleanup intent without forcing a destructive action. Plan:

```
git rm --cached -r _delete/
echo "_delete/" >> .gitignore
git add .gitignore
git commit -m "chore(repo): re-gitignore _delete/ archive directory"
```

**Verification:** `pnpm docs:check-links` exits 0 (independent of A.2); `git status` shows `_delete/` as untracked-but-ignored.

### B.2 Push 6 commits — closes F-4

**Effort:** 30 seconds
**Action:** `git push origin main`

**Verification:** `git log origin/main..HEAD` is empty; `git status` shows up-to-date.

### B.3 Investigate / fix CI infrastructure — closes F-10

**Effort:** 30 minutes investigation + variable fix time
**Action:**

1. Visit `https://github.com/organizations/gtcx-ecosystem/settings/billing` — check Actions usage limits
2. Visit `https://github.com/gtcx-ecosystem/gtcx-core/actions/runs/<latest>` — check the actual error message
3. Most likely fixes: increase spending limit, enable additional minute pack, or set monthly limit

**Verification:** next push triggers CI; jobs run for >30 seconds; status checks complete.

### B.4 Set ANTHROPIC_API_KEY at org level — closes F-11

**Effort:** 5 minutes
**Action:**

```
gh secret set ANTHROPIC_API_KEY --org gtcx-ecosystem --visibility all
# (paste API key from console.anthropic.com when prompted)
```

**Verification:** `pnpm ops:check` shows `anthropic-api-key` as PASS; AI CODEOWNER action runs on next PR.

### B.5 Set OPENAI_API_KEY at org level — closes F-12

**Effort:** 5 minutes
**Action:** same as B.4 with `OPENAI_API_KEY`

**Verification:** `pnpm ops:check` shows `openai-api-key` as PASS; bus-factor on AI CODEOWNER closed at the operational layer.

### B.6 Set TURBO + NPM tokens at org level — closes F-13

**Effort:** 10 minutes
**Action:**

```
gh secret set TURBO_TOKEN --org gtcx-ecosystem
gh variable set TURBO_TEAM --org gtcx-ecosystem --body "<your-vercel-team-slug>"
gh secret set NPM_TOKEN --org gtcx-ecosystem
```

**Verification:** `pnpm ops:check` shows all warnings cleared (4 warn → 0 warn).

### B.7 Send Zimbabwe pre-submission email — closes F-14

**Effort:** 5 minutes
**Action:** open `01-docs/08-gtm/09-pre-submission-email-zimbabwe.md`, copy to email client, send to the Zimbabwe sandbox regulator listed in the doc.

**Verification:** sent email captured in `01-docs/08-gtm/responses/zimbabwe-2026-05-XX.md` (timestamped); regulator response tracked when it arrives.

---

## Workstream C — GTM execution (post-Workstream B)

### C.1 Send remaining market emails — closes F-15

**Effort:** 30 minutes
**Action:** send Namibia, Zambia, Ghana per `01-docs/08-gtm/{10,11,13}-*`. Initiate DRC engagement per `01-docs/08-gtm/12-engagement-brief-drc.md`.

### C.2 Track responses

**Effort:** ongoing
**Files:** `01-docs/08-gtm/responses/<market>-<date>.md` per response

### C.3 First reference customer case study — closes F-19, F-21

**Effort:** 1 day after first regulator engagement
**Files:** `01-docs/08-gtm/14-first-deal-case-study.md`

### C.4 Customer success motion — closes F-18

**Effort:** undefined; emerges post-first-customer
**Output:** SLA, support tier, pricing — currently absent from 01-docs/08-gtm/, gated on first commercial conversation

---

## Workstream D — External engagements (paid)

### D.1 SOC 2 Type 1 attestation — closes F-16

**Effort:** 8-10 weeks elapsed; ~$15-45K
**Sequence:**

1. Close the 7 documented gaps in `01-docs/10-compliance/soc2-readiness.md` (~6 weeks parallelizable with CPA engagement)
2. Engage CPA firm (Schellman, A-LIGN, Coalfire, or local equivalent)
3. Auditor walkthrough + evidence collection
4. Letter issuance

**Decision criterion:** initiate D.1 only after first sandbox regulator engagement (C.1) reveals whether they require formal SOC 2 or accept the readiness gap analysis. If they accept readiness, defer D.1 until a tier-1 customer requires the formal letter.

### D.2 External penetration test — closes F-17

**Effort:** 4-6 weeks elapsed; ~$8-25K
**Approach:** scope to crypto primitives + verification flow + identity layer. Deliverable: pen-test report with findings + remediation status. Provide as evidence to sandbox regulators / first customer.

**Decision criterion:** parallelizable with D.1. If budget allows, schedule both simultaneously. Pen-test reports tend to be a bigger procurement-tier signal than SOC 2 readiness analyses; if forced to pick one, this is sometimes higher leverage.

### D.3 Open-source AI-CODEOWNER template — closes F-20

**Effort:** ~1 day for repo extraction + 1 week to publish + ~1 day to write a launch blog post
**Sequence:** wait until 30+ real PRs have run through the AI CODEOWNER action (so the template has track record). Then extract `.github/03-platform/scripts/codeowner-review/` + `01-docs/01-agents/governance/` to a new public repo `gtcx-ecosystem/ai-native-governance-template`. Distribute via HN / X / conference talk.

**Decision criterion:** moat-amplifier. Defer until first customer is engaged so the template carries credibility (it's been used in production on a regulated codebase).

---

## Phased execution plan

### Phase A: Restore Green (next 4 hours, in-repo technical)

**Critical path:**

1. A.1 — decompose `ai/03-platform/src/index.ts` (2h)
2. A.2 — exclude `_delete/` from link check (15m)
3. A.5 — Pkcs11KeyStore persistent state (3h)

**Parallel:** 4. A.3 — runtime aggregator comment (10m) 5. A.4 — tracing.ts coverage (1h) 6. A.6 — Cloud KMS skeleton + design doc (2h) 7. A.7 — pnpm-pack canonicalization (1.5h) 8. A.8 — SLSA Source Track + signed commits (1h)

**Phase A DoD:**

- `pnpm architecture:check` exits 0
- `pnpm docs:check-links` exits 0
- `pnpm test:coverage:critical` shows tracing.ts ≥99% branches
- `cargo build -p gtcx-crypto --features cloud_kms` succeeds
- `pnpm build:reproducible --package=@gtcx/verification --canonicalize` exits 0
- All commits signed going forward

### Phase B: Operational Cleanup (next session, user actions)

**Sequence (B.1 → B.7):**

- B.1: decide `_delete/` final state
- B.2: push the 6 commits
- B.3: investigate CI infrastructure failure (web UI)
- B.4-B.6: set the four secrets at org level
- B.7: send Zimbabwe email (kicks off Workstream C)

**Phase B DoD:**

- `pnpm ops:check`: 9 pass, 0 fail, 0 warn, 0 skip
- CI runs end-to-end on next push
- Zimbabwe email sent and logged

### Phase C: GTM Execution (1-4 weeks elapsed)

C.1 (send 4 more emails) → C.2 (track responses) → C.3 (case study after first response) → C.4 (motion emerges from conversations)

**Phase C DoD:** ≥1 sandbox regulator response captured in `01-docs/08-gtm/responses/`; first case study skeleton drafted.

### Phase D: External Attestations (8-10 weeks elapsed, ~$25-50K)

D.1 (SOC 2) and D.2 (pen test) parallelizable. Decision criterion: only initiate after Phase C reveals first-customer requirements. Don't pre-pay for attestations the first customer doesn't ask for.

### Phase E: Moat Amplifiers (post-first-customer)

D.3 (open-source AI-CODEOWNER template) — 30+ real PRs of track record, then extract.

---

## Verification matrix — every finding has a verifiable closure

| Finding  | Closure verification                                                                                                           | Owner                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| F-1      | `pnpm architecture:check` exits 0                                                                                              | Repo                       |
| F-2      | `pnpm docs:check-links` exits 0                                                                                                | Repo                       |
| F-3      | `git status` matches user's chosen state                                                                                       | User                       |
| F-4      | `git log origin/main..HEAD` empty                                                                                              | User                       |
| F-5      | `03-platform/tools/check-package-boundaries.mjs` has documenting comment for runtime                                           | Repo                       |
| F-6      | `pnpm test:coverage:critical` shows tracing.ts ≥99% branches                                                                   | Repo                       |
| F-7      | Test creates Pkcs11KeyStore, persists state, reconstructs, asserts preservation                                                | Repo                       |
| F-8      | `cargo build --features cloud_kms` succeeds; design doc complete                                                               | Repo                       |
| F-9      | `pnpm build:reproducible --canonicalize` exits 0 on workspace-dep packages                                                     | Repo                       |
| F-10     | Next push runs CI for >30 seconds                                                                                              | User                       |
| F-11     | `ops:check` shows anthropic-api-key PASS                                                                                       | User                       |
| F-12     | `ops:check` shows openai-api-key PASS                                                                                          | User                       |
| F-13     | `ops:check` shows zero WARN                                                                                                    | User                       |
| F-14     | `01-docs/08-gtm/responses/zimbabwe-*.md` exists                                                                                | User                       |
| F-15     | `01-docs/08-gtm/responses/{namibia,zambia,ghana,drc}-*.md` exist                                                               | User                       |
| F-16     | SOC 2 Type 1 letter received and committed to `quality/release-evidence/`                                                      | External CPA               |
| F-17     | Pen test report received and summarized in `01-docs/09-security/external-pentest-2026.md`                                      | External pen-test firm     |
| F-18     | `01-docs/08-gtm/customer-success-motion.md` documents SLA, pricing, support                                                    | User (post-customer)       |
| F-19     | `01-docs/08-gtm/14-first-deal-case-study.md` published                                                                         | User (post-customer)       |
| F-20     | `gtcx-ecosystem/ai-native-governance-template` repo public                                                                     | User (post-customer)       |
| F-21     | First regulator response captured                                                                                              | User (post-Zimbabwe email) |
| ~~F-22~~ | ~~`01-docs/09-security/slsa-attestation.md` asserts Source L2; branch protection requires signed commits~~ **DONE 2026-05-10** | Repo                       |

---

## Risk register

| Risk                                                       | Likelihood | Impact   | Mitigation                                                                                                               |
| ---------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| A.1 decomposition breaks downstream consumers              | Low        | High     | Keep `index.ts` as barrel re-export; run full test suite + integration tests before commit                               |
| A.5 persistent state implementation has serialization bugs | Medium     | Medium   | Use serde + JSON; round-trip test in unit tests                                                                          |
| B.3 CI billing fix exceeds available org budget            | Medium     | High     | If runners stay broken, consider self-hosted runners for core CI; document the fallback                                  |
| C.1 sandbox regulator response is "no"                     | Medium     | Medium   | Multi-market strategy mitigates — 5 markets in pipeline; first response can be no                                        |
| D.1 CPA finds gaps not in our readiness analysis           | Medium     | Medium   | The readiness analysis is honest; if a CPA disagrees on an assertion (e.g., "library not service org" framing), we adapt |
| D.2 pen test finds critical vulnerabilities                | Low        | Critical | This is what we're paying for — the budget IS the mitigation. Have incident-response runbook ready (already shipped)     |
| F-22 commit signing breaks contributor flow                | Medium     | Medium   | Document migration path before enforcement; add allow-list of existing unsigned commits                                  |

---

## Out of scope (and why)

These are deliberately not in this plan:

- **Replacing the dual-AI CODEOWNER pattern** — it's working as designed; multi-provider fallback closes the bus-factor concern.
- **Adding more crypto primitives** — Ed25519 + secp256k1 + SHA-256/512/BLAKE3 + Groth16/Bulletproofs/Schnorr ZKP is the supported set. Adding Falcon, ML-DSA, etc. is post-quantum work for Q4+.
- **Multi-region deployment** — this is library infrastructure; "multi-region" applies to the consumer, not to gtcx-core itself.
- **Full PKCS#11 v3.1 attribute coverage** — current implementation supports the attributes we use; full coverage is endless and not what consumers are asking for.

---

## Success criteria

The repo reaches 10/10 when:

- **Today (Phase A complete):** all in-repo gates green; `pnpm architecture:check`, `pnpm docs:check-links`, `pnpm test:coverage:critical` all exit 0
- **Next session (Phase B complete):** `pnpm ops:check` shows 9/9 pass; CI runs end-to-end; Zimbabwe email sent
- **Within 4 weeks (Phase C complete):** first sandbox regulator response captured; case study drafted; commercial motion emerging from conversations
- **Within 10 weeks (Phase D complete):** SOC 2 Type 1 letter or external pen test report (or both) committed as evidence
- **Within 6 months (Phase E complete):** AI-CODEOWNER template open-sourced; first reference customer named in a public case study; SLSA Source Track L2 asserted

**Critical insight:** the 10/10 score is structurally gated. Phase A gets us to 9.8. Phase B + C gets us to 9.9. Phase D is what makes the last 0.1 — and that requires money + external engagements. The plan is honest about this.

---

## Cross-references

- [Full audit — cycle 6 close](./full-audit-2026-05-09.md)
- [Auto-dev state](./auto-dev-state.md)
- [Trust portal](../governance/trust-portal.md)
- [SOC 2 readiness](../compliance/soc2-readiness.md)
- [SLSA attestation](../security/slsa-attestation.md)
- [PKCS#11 keystore](../security/pkcs11-keystore.md)

## Changelog

- **1.0.0** (2026-05-10) — Initial 10/10 remediation plan. 22 findings cataloged across 4 workstreams (in-repo technical, user operational, GTM execution, external engagements). Phased execution plan A-E with concrete DoD per phase.
