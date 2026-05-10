# gtcx-core — Master Audit & Bank-Grade Certification

**Date:** 2026-05-10
**Repo:** `gtcx-ecosystem/gtcx-core`
**Auditor:** Codex GPT-5
**Methodology:** `gtcx-ecosystem/audit/forensic-master-prompt.md`
**Reference framework:** `gtcx-ecosystem/audit/SCORING_FRAMEWORK.md`
**Prior master audit:** none found

---

## Executive Summary

| Dimension                    |  Score | Rating Band                   |
| ---------------------------- | -----: | ----------------------------- |
| Core Weighted Score          | 9.1/10 | strong institutional platform |
| Investor Lens                | 9.2/10 | strong institutional platform |
| Enterprise Buyer Lens        | 8.9/10 | strong institutional platform |
| African Sovereign / DFI Lens | 9.1/10 | strong institutional platform |

**Verdict:** `gtcx-core` is a strong institutional-grade foundation repo with real cryptographic depth, strong test and build discipline, and materially improved documentation hygiene after this session. It is suitable as a bank-grade shared library base for pilot and pre-production institutional use. The remaining gaps are not basic engineering failures; they are hardening and credibility gaps around cloud-managed key custody, source-history verification, and external validation.

**Top 3 priorities for next sprint:**

- Implement the deferred cloud-managed `KeyStore` backend path after the Rust toolchain bump documented in `rust/gtcx-crypto/src/keystore.rs:3-6` and `docs/security/cloud-kms-keystore.md:3-20`.
- Enforce signed-commit provenance and move from Source Level 1 to Source Level 2 as documented in `docs/security/slsa-attestation.md:124-150`.
- Close the remaining structural debt in `packages/verification/src/types/schemas.ts:1` (605 LOC) and continue reducing legacy docs taxonomy drift called out in `docs/audit/docs-standard-compliance-2026-05-10.md:14-21`.

---

## 1. Initial State (Phase 1 — Pre-Improvement)

The initial state baseline is the existing full audit plus the documentation drift observed at session start.

### 1.1 Architecture Audit

| Dimension             | Pre-Improvement Score | Evidence                                    |
| --------------------- | --------------------: | ------------------------------------------- |
| Spec fidelity         |                7.0/10 | `docs/audit/full-audit-2026-05-09.md:15-32` |
| Structural integrity  |               10.0/10 | `docs/audit/full-audit-2026-05-09.md:18-18` |
| Code quality          |               10.0/10 | `docs/audit/full-audit-2026-05-09.md:19-19` |
| Testability           |                9.0/10 | `docs/audit/full-audit-2026-05-09.md:20-20` |
| Operational readiness |               10.0/10 | `docs/audit/full-audit-2026-05-09.md:21-21` |
| Consistency           |                9.0/10 | `docs/audit/full-audit-2026-05-09.md:22-32` |

**Findings**

- **[P1] Spec Fidelity — pre-session docs drift** `docs/audit/full-audit-2026-05-09.md:26-32`
  Pre-existing audit evidence already showed stale package and ADR counts before this session's docs-standard pass. This was a credibility issue more than a runtime risk.
  **Fix:** standardize the docs tree and rewrite the master INDEX.

- **[P1] Documentation structure — non-canonical audit/trust/ops layout** `docs/audit/docs-standard-compliance-2026-05-10.md:24-34`
  The repo entered the session with a split between `docs/audits/`, `docs/trust/`, `docs/ops/`, and a large generated `docs/api/` artifact tree. That violated the ecosystem standard and made the docs source of truth noisier than it needed to be.
  **Fix:** move to canonical `docs/audit/`, `docs/governance/`, `docs/operations/`, add entrypoints, and stop tracking generated API output inside `docs/`.

### 1.2 Security Audit

| Dimension                      | Pre-Improvement Score | Evidence                                    |
| ------------------------------ | --------------------: | ------------------------------------------- |
| Authentication & authorization |                9.0/10 | `docs/audit/full-audit-2026-05-09.md:40-47` |
| Data protection                |                9.5/10 | `docs/audit/full-audit-2026-05-09.md:40-47` |
| Input validation               |                9.5/10 | `docs/audit/full-audit-2026-05-09.md:40-47` |
| Dependency security            |                9.5/10 | `docs/audit/full-audit-2026-05-09.md:38-60` |
| Infrastructure security        |                8.8/10 | `docs/security/slsa-attestation.md:124-150` |
| Compliance posture             |                9.0/10 | `docs/governance/trust-portal.md:59-63`     |

**Findings**

- **[P1] Security Hardening — cloud-managed key custody is still design-only** `rust/gtcx-crypto/src/keystore.rs:3-6`, `docs/security/cloud-kms-keystore.md:3-20`
  The trait boundary anticipates `CloudKmsKeyStore`, but the implementation is explicitly deferred. That is acceptable for a shared library today, but it keeps institutional cloud custody one hardening step away rather than done.
  **Fix:** bump the Rust toolchain, add the required algorithm extension, and land the backend with integration tests.

- **[P1] Supply Chain Trust — Source Level 2 is documented but not enforced** `docs/security/slsa-attestation.md:124-150`
  Build provenance is strong, but source-history verification is still at Level 1 because signed commits and contributor key provisioning are not yet enforced on `main`.
  **Fix:** enable `required_signatures`, provision signing keys for the human and bot reviewers, and document the contributor flow.

### 1.3 GTM Readiness

| Area                 | Assessment                                                                                                                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Current GTM stage    | S3 moving toward S4                                                                                                                    |
| First realistic deal | Regulator or design-partner pilot for commodity-verification infrastructure using the current GTM packet                               |
| 90-day copy test     | Core cryptographic primitives are copyable; the moat is the integration depth, offline-first posture, audit trail, and ecosystem reuse |

**Top blockers**

1. External penetration test and attestation engagement remain open: `docs/governance/trust-portal.md:59-63`.
2. Cloud-managed key custody is not yet shipped: `docs/security/cloud-kms-keystore.md:3-20`.
3. Signed-commit enforcement is still deferred: `docs/security/slsa-attestation.md:124-150`.
4. First external case study is still pending: `docs/governance/trust-portal.md:176-178`.
5. Some legacy docs taxonomy remains intentionally carried forward: `docs/audit/docs-standard-compliance-2026-05-10.md:38-41`.

### 1.4 Hygiene Audit

| Category        | Pre-Improvement Score | Evidence                                                          |
| --------------- | --------------------: | ----------------------------------------------------------------- |
| Documentation   |                7.5/10 | `docs/audit/docs-standard-compliance-2026-05-10.md:24-34`         |
| File structure  |                8.0/10 | `docs/audit/docs-standard-compliance-2026-05-10.md:14-21`         |
| Naming          |                6.5/10 | generated `docs/api/` violated the naming standard before removal |
| Package / build |                9.5/10 | 2026-05-10 gate rerun passed after dependency install             |
| Code hygiene    |                9.4/10 | `docs/audit/full-audit-2026-05-09.md:18-21`                       |
| Test hygiene    |                9.2/10 | 2026-05-10 gate rerun: `pnpm test` passed                         |

### 1.5 Production Readiness

| Area                 | Pre-Improvement Status | Evidence                                                                         |
| -------------------- | ---------------------- | -------------------------------------------------------------------------------- |
| Deployment           | Partial                | library repo; release posture documented, no runtime deployment plane            |
| Observability        | Present                | traced ops, SpanEmitter, ops runbooks                                            |
| SLOs                 | Partial                | repo quality gates strong; service-style runtime SLOs largely downstream         |
| DR / BCP             | Partial                | incident process present, but no service restore plane because this is a library |
| Operational maturity | Present                | runbooks, gates, release evidence, branch controls                               |
| Compliance evidence  | Partial                | strong self-evidence; external validation still open                             |

---

## 2. Doc Cleanup (Phase 2)

**State at audit start:** `docs/` plus `_delete/` only; no competing roots.

- Edge-case cleanup branch executed.
- Files migrated to `/docs/`: 0 from competing roots.
- Files staged in `_delete/`: 12 retained.
- Files rescued in Pass 2/3: 0.
- Cleanup commit: `415d786`
- Detailed manifests:
  - `docs/audit/doc-reorganization-2026-05-10.md`
  - `docs/audit/doc-reorganization-pass-2-3-2026-05-10.md`

**Outcome:** skipped for consolidation purposes; no competing documentation roots required rescue or merge. Cleanup was therefore a verification phase rather than a migration phase. `_delete/` remains intentional staged-delete inventory and should not be removed without owner review.

**Acceptance note:** substantive cleanup invariants passed, but the canonical cleanup checker currently contains a brittle `set -o pipefail` plus `grep -q` pipeline on `git log --oneline -10` that false-fails when a matching cleanup commit appears before EOF. The underlying invariant is satisfied by `415d786` (`docs: verify staged cleanup state and canonicalize audit path`).

---

## 3. Docs-Standard Compliance (Phase 3)

| Axis                |      Score | Notes                                                                          |
| ------------------- | ---------: | ------------------------------------------------------------------------------ |
| Structural          |     8.4/10 | Canonical entrypoints added; some legacy top-level dirs intentionally retained |
| Naming              |    10.0/10 | No prohibited markdown names remain                                            |
| Frontmatter         |    10.0/10 | Standard headers added across substantive docs                                 |
| Linking             |     8.8/10 | Canonical path rewrites applied; acceptance checker passes                     |
| Length              |     9.2/10 | No new operational sprawl introduced                                           |
| Agentic Conventions |     8.7/10 | Entry docs improved; some historical prose density remains                     |
| RAG Indexing        |    10.0/10 | `baseline.config.ts:1-15` added                                                |
| Master INDEX        |     9.4/10 | `docs/README.md:1-80` rewritten to the required section model                  |
| **Overall**         | **9.1/10** |                                                                                |

- Standard enforcement commit: `aa49d8e`
- Detailed compliance: `docs/audit/docs-standard-compliance-2026-05-10.md`

---

## 4. Post-Improvement State (Phase 4 — Re-Audit)

### 4.1 Architecture

The code architecture remains strong and unchanged; the major improvement in this session was closing documentation drift that previously obscured repo structure.

### 4.2 Security

No new code-path regressions were introduced. Remaining open items are still the cloud-KMS backend and signed-commit enforcement.

### 4.3 GTM

Stage remains S3 toward S4. The story is stronger because external reviewers now have a cleaner trust portal, canonical audit trail, and canonical runbook entrypoints.

### 4.4 Hygiene

Hygiene improved materially:

- canonical `docs/audit/` path restored,
- generated API docs removed from the tracked docs source-of-truth path,
- master INDEX rewritten,
- frontmatter normalized,
- RAG contract added.

### 4.5 Production Readiness

2026-05-10 gate rerun results:

- `pnpm install --frozen-lockfile` passed
- `pnpm typecheck` passed
- `pnpm lint` passed
- `pnpm test` passed
- `pnpm build` passed

Net result: no code regressions were introduced during the docs-standard work, and the repo exits this session with a clean tree and passing docs-standard acceptance.

---

## 5. Bank-Grade Scorecard (Phase 5)

### 5.1 Core Dimensions

| Dimension                         | Weight | Score | Confidence | Notes                                                                                     |
| --------------------------------- | -----: | ----: | ---------- | ----------------------------------------------------------------------------------------- |
| Code Quality                      |     15 |   9.2 | A          | Strong baseline from prior full audit plus clean 2026-05-10 gate rerun                    |
| Repo / Folder Hygiene             |     10 |   9.0 | A          | Major docs cleanup and standardization complete; some legacy taxonomy retained            |
| Security                          |     20 |   8.9 | B          | Strong cryptographic posture, but cloud KMS and signed-commit enforcement remain open     |
| Global South Resilience           |     15 |   9.0 | A          | Offline-first design and resilience claims are baked into the architecture and GTM packet |
| Ecosystem Integration             |     15 |   9.4 | A          | This repo is the shared base layer and the docs now reflect that clearly                  |
| Agentic Maturity                  |     10 |   9.1 | A          | AI governance, playbooks, and trust constraints are explicit and documented               |
| Enterprise / Production Readiness |     15 |   8.8 | B          | Release/process posture is strong; external validation and cloud custody remain open      |

**Raw weighted score:** 9.1/10

### 5.2 Caps Applied

| Cap                                      | Triggered? | Triggering finding | New ceiling               |
| ---------------------------------------- | ---------- | ------------------ | ------------------------- |
| Unresolved critical                      | N          | —                  | 5.9 overall               |
| 2+ unresolved high (consequential)       | N          | —                  | 6.9 overall               |
| Money/settlement in process memory       | N          | —                  | 4.5 Enterprise            |
| Non-durable audit on consequential paths | N          | —                  | 5.0 Security/Enterprise   |
| Raw AI output approves consequential     | N          | —                  | 4.5 Agentic/Security      |
| Local placeholder ecosystem authority    | N          | —                  | 5.5 Ecosystem Integration |
| No safe degraded-mode                    | N          | —                  | 4.5 Resilience            |

**Final core score:** 9.1/10

### 5.3 Audience Lens Scores

#### Investor / Sequoia-Style Lens

| Area                           | Weight | Score | Notes                                                                    |
| ------------------------------ | -----: | ----: | ------------------------------------------------------------------------ |
| Technical Differentiation      |     25 |   9.4 | Strong crypto, offline-first, and ecosystem leverage                     |
| Execution Credibility          |     25 |   8.9 | Strong gates; external validation still pending                          |
| Ecosystem Leverage             |     20 |   9.4 | This repo compounds value across the stack                               |
| Commercialization Readiness    |     15 |   8.8 | GTM packet is strong, but external proof points are still open           |
| Platform Compounding Potential |     15 |   9.2 | Shared primitives and agentic governance continue to compound downstream |

**Investor lens score:** 9.2/10 — strong institutional platform

#### Enterprise Buyer Lens

| Area                           | Weight | Score | Notes                                                                   |
| ------------------------------ | -----: | ----: | ----------------------------------------------------------------------- |
| Control Environment            |     25 |   8.8 | Branch controls and audit posture strong; signed commits still deferred |
| Security and Auditability      |     25 |   8.9 | Strong evidence trail; external validation still open                   |
| Integration Reliability        |     20 |   9.3 | Shared foundation with strong package/test discipline                   |
| Operability and Supportability |     15 |   8.9 | Runbooks and release artifacts are strong for a library repo            |
| Deployment Readiness           |     15 |   8.7 | Cloud-managed key custody remains design-only                           |

**Enterprise buyer lens score:** 8.9/10 — strong institutional platform

#### African Sovereign / DFI Lens

| Area                           | Weight | Score | Notes                                                                              |
| ------------------------------ | -----: | ----: | ---------------------------------------------------------------------------------- |
| Mission and Regional Fit       |     15 |   9.1 | GTM materials are explicitly built around African regulatory and offline realities |
| Global South Resilience        |     25 |   9.0 | Offline-first posture remains a core differentiator                                |
| Governance and Trust           |     25 |   8.9 | Strong evidence trail; signed-commit and external validation gaps still matter     |
| Institutional Interoperability |     15 |   9.2 | Cleaner docs, audit path, and specs improve cross-institution use                  |
| Long-Term Strategic Value      |     20 |   9.3 | Shared base layer with clear ecosystem leverage                                    |

**Sovereign / DFI lens score:** 9.1/10 — strong institutional platform

---

## 6. Sprint Plan (Phase 4 / 6 Synthesis)

### Sprint 1

**Goal:** close the two highest-trust hardening gaps without changing product scope.

- Enforce signed-commit Source Level 2 path from `docs/security/slsa-attestation.md:124-150`.
- Draft the contributor signing-key setup doc and wire required signatures on `main`.
- Acceptance: unsigned commits are rejected; contributor flow documented; no gate regressions.

### Sprint 2

**Goal:** unblock cloud-managed key custody.

- Approve the Rust toolchain bump described in `docs/security/cloud-kms-keystore.md:20-35`.
- Extend the algorithm surface and start the `CloudKmsKeyStore` implementation.
- Acceptance: toolchain upgraded, cargo-deny revalidated, backend scaffold compiling.

### Sprint 3

**Goal:** land and test the cloud-managed backend.

- Implement AWS-first `CloudKmsKeyStore`.
- Add integration tests and document operating assumptions.
- Acceptance: feature-flagged backend builds, tests pass, docs updated.

### Sprint 4

**Goal:** strengthen external credibility.

- Engage external penetration testing and map outcomes back into the trust portal.
- Prepare the SOC 2 Type 1 evidence handoff.
- Acceptance: vendor selected or scheduled; trust portal updated with evidence status.

### Sprint 5

**Goal:** reduce maintainability hotspots.

- Decompose `packages/verification/src/types/schemas.ts:1` into smaller modules.
- Acceptance: file length falls below the repo threshold or is formally exception-documented with rationale.

### Sprint 6

**Goal:** finish docs and market-signal polish.

- Decide whether to retain or further collapse the remaining legacy docs taxonomy noted in `docs/audit/docs-standard-compliance-2026-05-10.md:38-41`.
- Refresh the trust portal and master docs index after the hardening work lands.
- Acceptance: next quarterly docs-standard pass requires only incremental drift fixes.

---

## 7. Top 5 Remediation Items

| Priority | Item                                                                     | Owner                           | Dependency                   | Target     | Expected Score Lift         |
| -------- | ------------------------------------------------------------------------ | ------------------------------- | ---------------------------- | ---------- | --------------------------- |
| P1       | Ship `CloudKmsKeyStore` and required toolchain / algorithm work          | Cryptographic Security Engineer | Rust 1.91+ adoption          | 2026-06-15 | +0.3 core / +0.4 enterprise |
| P1       | Enforce signed commits on `main` and document contributor signing flow   | Repo maintainer                 | Human + bot key provisioning | 2026-05-24 | +0.2 core / +0.3 enterprise |
| P1       | Engage external pen test and surface status in trust portal              | Repo lead                       | External vendor scheduling   | 2026-06-30 | +0.2 core / +0.4 enterprise |
| P2       | Split `packages/verification/src/types/schemas.ts` or formally exempt it | Verification owner              | None                         | 2026-05-31 | +0.1 core / +0.1 investor   |
| P2       | Rationalize remaining legacy docs top-level dirs                         | Protocol Architect              | Downstream link review       | 2026-08-10 | +0.1 core / +0.1 sovereign  |

---

## 8. One-Point-Uplift Conditions

**To raise core score by 1.0:** ship the cloud-managed key-custody backend, enforce signed commits, complete an external pen test, and retire the remaining legacy docs taxonomy exceptions.

**To raise investor lens by 1.0:** add cloud-managed custody, land a visible external validation artifact, and turn the current GTM packet into a live external reference deployment.

**To raise enterprise buyer lens by 1.0:** complete external validation, enforce signed commits, and prove cloud-managed key custody with reproducible integration tests and operating guidance.

**To raise sovereign / DFI lens by 1.0:** combine the hardening above with regulator-facing proof that the stack operates under intermittent-connectivity and key-governance constraints in a live pilot context.

---

## 9. Audit Trail (Commits This Session)

| Phase            | Commit                     | What                                                          |
| ---------------- | -------------------------- | ------------------------------------------------------------- |
| 2. Cleanup       | `415d786`                  | docs: verify staged cleanup state and canonicalize audit path |
| 3. Docs standard | `aa49d8e`                  | docs: enforce ecosystem docs-standard                         |
| 6. Master audit  | current local phase commit | master audit synthesis and scorecard                          |
