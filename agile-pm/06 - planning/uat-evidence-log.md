# UAT Evidence Log — GTCX Core Full-Spec

**Updated**: 2026-02-20  
**Purpose**: Capture sprint-level UAT evidence artifacts and links.

## Sprint 2 — Offline Sync Engine

- Offline → online convergence integration test:
  - Test: `tests/integration/sync-convergence.test.ts`
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/integration-tests test -- -t "sync convergence"`
  - Result: `1 passed` (2026-02-20 20:22)
- Deterministic conflict resolution:
  - Status: ✅ Implemented + executed
  - Evidence: `tests/integration/sync-convergence.test.ts` runs twice with identical inputs; state results match.
- Audit/metrics hook verification:
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/sync test -- -t "audit"`
  - Result: `1 passed` (2026-02-20 20:23)

## Sprint 3 — API Client Enterprise Hardening

- Signed request header injection:
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/api-client test`
  - Result: `9 passed` (2026-02-20 21:44)
- Auth error classification:
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/api-client test`
  - Result: `9 passed` (2026-02-20 21:44)
- mTLS handshake verification:
  - Status: ⏳ Pending evidence run (node env)
  - Note: Local sandbox blocks `https.createServer` bind (EPERM). Run in unrestricted node env.
