---
title: 'UAT Evidence Log — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'agile']
review_cycle: 'on-change'
---

---

title: 'Uat Evidence Log'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'testing']
review_cycle: 'on-change'

---

# UAT Evidence Log — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Tracks user acceptance testing (UAT) evidence for features and sprints. Updated at sprint close and before release.

---

## How to Use This Log

1. Add an entry for each feature or sprint that requires UAT evidence
2. Attach or reference the evidence artifact (test output, screenshot, QA sign-off)
3. Update status when UAT passes
4. This file is checked during release — missing UAT evidence blocks release

---

## Log Format

```markdown
### [YYYY-MM-DD] Sprint N — Feature or Story Name

**Type:** Sprint UAT / Feature UAT / Regression check
**Tested by:** [Role]
**Status:** Pass / Fail / Pending
**Evidence:** [path to artifact or description of evidence]
**Notes:** [any deviations or conditions]
```

---

## Active Log

### [2026-06-04] S-T5-3 — Minerals Board UAT (DTF-5.3.3, L0 lab)

**Type:** Sprint UAT / Tier-5 defensibility
**Tested by:** Automated integration + Rust profile negatives + KAT cross-impl
**Status:** Pass
**Evidence:**

- `01-docs/04-ops/minerals-board-uat-protocol.md`
- `01-docs/05-audit/evidence/minerals-board-uat-2026-06-04.json`
- `tests/integration/tier5-jurisdiction-proofs.test.ts` — 14 tests

**Notes:** L0 lab only; sovereign board sign-off (L2) remains external (DTF-5.5.4).

### [2026-05-06] Sprint 6 — Core12 Domain Population

**Type:** Feature UAT
**Tested by:** Automated test suite
**Status:** Pass
**Evidence:** `03-platform/packages/schemas/tests/core12.test.ts` — 46 tests, all 12 domains with 2 controls each
**Notes:** D01–D12 fully populated. No deviations.

### [2026-05-06] Sprint 6 — ZKP NAPI Hex Bug Fix

**Type:** Feature UAT
**Tested by:** Automated integration test suite
**Status:** Pass
**Evidence:** `03-platform/packages/crypto/tests/zkp-integration.test.ts` — 6 parity tests (JS engine vs native engine)
**Notes:** Odd-length hex inputs normalized to 32-byte SHA-256 digests before NAPI boundary. Verify path hardened against malformed input.

### [2026-05-06] Sprint 6 — Async Span Propagation (@gtcx/ai)

**Type:** Feature UAT
**Tested by:** Automated test suite
**Status:** Pass
**Evidence:** `03-platform/packages/ai/tests/tracing.test.ts` — 34 tests for AsyncLocalStorage-based trace context
**Notes:** `getCurrentTraceContext()`, `runWithTraceContext()`, and `traced()` wrappers verified. Parent span propagation confirmed.

### [2026-05-06] Sprint 6 — Logging Trace Integration (@gtcx/logging)

**Type:** Feature UAT
**Tested by:** Automated test suite
**Status:** Pass
**Evidence:** `03-platform/packages/logging/tests/logger.test.ts` — 34 tests for structured log enrichment
**Notes:** Logger auto-enriches entries with traceId/spanId when inside `@gtcx/ai` traced operations. Loose coupling via dynamic require verified.

### [2026-05-07] Sprint 6 — Canonical Signing Contract (@gtcx/api-client)

**Type:** Feature UAT
**Tested by:** Automated test suite
**Status:** Pass
**Evidence:** `03-platform/packages/api-client/03-platform/src/canonical/canonical.test.ts` — 29 tests covering sign+verify round-trip, nonce generation, DID/keyId formatting, canonical request construction
**Notes:** Mobile contract alignment verified. 9-line canonical format matches gtcx-mobile auth-token.ts. All 9 headers emitted and verified.

### [2026-05-07] Sprint 6 — Service Decomposition (registration + trading)

**Type:** Regression check
**Tested by:** Automated test suite
**Status:** Pass
**Evidence:** `03-platform/packages/services/tests/registration.test.ts` (45 tests) + `03-platform/packages/services/tests/trading.test.ts` (52 tests)
**Notes:** Zero test regressions. registration.ts 599→364 LOC, trading.ts 728→411 LOC. Architecture boundary exceptions removed.

### [2026-05-08] Sprint 6 — File-Size Exception Resolution

**Type:** Regression check
**Tested by:** Automated test suite + architecture boundary check
**Status:** Pass
**Evidence:** `node 03-platform/tools/check-package-boundaries.mjs` — 198 files, 0 violations, 0 exceptions
**Notes:** All 6 documented exceptions resolved:

- `workproof/03-platform/src/predicates/registry.ts` 987→111 LOC (8 category definition files)
- `verification/03-platform/src/traced.ts` 641→33 LOC (7 operation submodules)
- `security/03-platform/src/offline/secure-storage.ts` 553→355 LOC (errors/config/types extracted)
- `verification/03-platform/src/types/index.ts` 1,235→28 LOC (8 domain type files)
- `services/03-platform/src/registration.ts` 599→364 LOC (6 submodules)
- `services/03-platform/src/trading.ts` 728→411 LOC (6 submodules)

### [2026-05-08] Sprint 6 — Coverage Improvement (identity + connectivity)

**Type:** Regression check
**Tested by:** Automated test suite + coverage report
**Status:** Pass
**Evidence:**

- `03-platform/packages/identity/tests/` — 78 tests, coverage: 94.05% stmts / 86.12% branch / 91.17% funcs / 94.81% lines
- `03-platform/packages/connectivity/tests/` — 32 tests, coverage: 97.36% stmts / 86.95% branch / 93.75% funcs / 100% lines
  **Notes:** Added targeted tests for error paths, defensive checks, and default behavior. Both packages now exceed 85% threshold across all dimensions.

### [2026-05-08] Phase 5 — Agentic Maturity (Trust/Provenance/Review)

**Type:** Feature integration
**Tested by:** Automated test suites across 3 repos
**Status:** Pass
**Evidence:**

- **gtcx-core** `@gtcx/types` — 12 provenance tests, `@gtcx/schemas` — 10 provenance schema tests, `@gtcx/ai` — 4 provenance tracing tests
- **gtcx-intelligence** `@gtcx/intelligence` — 11 provenance integration tests (374 total tests pass), auto-provenance attached to all `IntelligenceResult<T>` outputs, `provenancePolicyRule()` added to policy engine
- **gtcx-protocols** `@gtcx/agent` — 6 provenance gate tests (14 total), `@gtcx/auth` — 9 provenance policy tests (171 total)
  **Notes:**
- Canonical `AgenticProvenance` type defined in `@gtcx/types` with `trustLevel`, `confidence`, `evidenceRefs`, `methodologyVersion`, `requiresHumanReview`, `decisionProvenance`
- 4 default review thresholds: `high_impact_compliance` (0.9), `model_uncertainty` (0.6 + 2 evidence refs), `stale_or_partial_evidence` (24h / 0.8 coverage), `jurisdictional_edge_case` (0.85 + 3+ sources)
- `evaluateProvenancePolicy()` and `shouldRequireHumanReview()` helpers in all 3 repos
- `GTCXAgentSDK.gateDecision()` enforces acceptance criterion: consequential AI-derived decisions without provenance are blocked
- Policy enforcement in `@gtcx/auth` adds 3 provenance-aware operators: `provenance_trust_level`, `provenance_confidence`, `provenance_requires_review`

---

## Reference

- [`01-docs/05-audit/agile/sprints/gtcx-core-definition-of-done.md`](../sprints/gtcx-core-definition-of-done.md) — sprint and release DoD
- [`01-docs/01-agents/workflows/tasks/cut-release.md`](../../agents/workflows/tasks/cut-release.md) — release workflow that requires this log
