# UAT Evidence Log — GTCX Core Full-Spec

**Updated**: 2026-02-21  
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
  - Result: `10 passed` (2026-02-20 21:48)
- Auth error classification:
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/api-client test`
  - Result: `10 passed` (2026-02-20 21:48)
- mTLS handshake verification:
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/api-client test -- -t "mTLS"`
  - Result: `1 passed` (2026-02-21 14:06)

## Sprint 4 — P2P Networking Transport

- In-memory mesh delivery + rate limiting:
  - Status: ✅ Implemented + executed
  - Evidence: `pnpm --filter @gtcx/network test`
  - Result: `7 passed` (2026-02-20 22:27)
- libp2p mesh demo (TCP):
  - Status: ✅ Executed
  - Evidence: `GTCX_P2P_TRANSPORT=tcp pnpm --filter @gtcx/network build && pnpm network:mesh:demo`
  - Result: `mesh publish + restart + ACL + rate limit` (2026-02-21)
- libp2p mesh demo (QUIC):
  - Status: ✅ Executed
  - Evidence: `GTCX_P2P_TRANSPORT=quic pnpm --filter @gtcx/network build && pnpm network:mesh:demo`
  - Result: `mesh publish + restart + ACL + rate limit` (2026-02-21)

## Sprint 5 — ZKP System

- ZKP acceptance/rejection (compliance flow):
  - Status: ✅ Implemented + executed
  - Evidence: `node tools/uat/zkp-uat.mjs`
  - Result: `valid proof violations 0; invalid proof violations 1` (2026-02-21 15:12)
- Groth16 + Bulletproofs + Schnorr circuit tests (Rust: GCI threshold, asset ownership, location region, amount range, identity attribute):
  - Status: ✅ Implemented + executed
  - Evidence: `cargo test -p gtcx-zkp`
  - Result: `38 passed, 2 ignored (asset ownership + location region Groth16 proofs)` (2026-02-21)
- ZKP performance budgets (CI strict trend):
  - Status: ✅ Executed
  - Evidence: `PERF_ENFORCE_TREND=true pnpm perf:check-budgets`
  - Result: `Performance budget check passed (7 metrics, trend checked 7 metrics)` (2026-02-21)
- Groth16 asset ownership proof (Rust, heavy):
  - Status: ✅ Executed
  - Evidence: `cargo test -p gtcx-zkp --release -- --ignored`
  - Result: `2 passed (asset ownership + location region Groth16 proofs), 164.33s` (2026-02-21)
- Groth16 location region proof (Rust, heavy):
  - Status: ✅ Executed
  - Evidence: `cargo test -p gtcx-zkp --release -- --ignored`
  - Result: `2 passed (asset ownership + location region Groth16 proofs), 164.33s` (2026-02-21)

## Sprint 6 — secp256k1 Interop

- secp256k1 interop test vectors:
  - Status: ✅ Implemented + executed
  - Evidence: `cargo test -p gtcx-crypto secp256k1`
  - Result: `7 passed` (2026-02-21 15:20)
