# UAT Evidence Log — gtcx-core Full-Spec

**Purpose**: Sprint-level UAT evidence artifacts and links.

## Sprint 2 — Offline Sync Engine

| Scenario                          | Status                 | Evidence                                                                 | Result                |
| --------------------------------- | ---------------------- | ------------------------------------------------------------------------ | --------------------- |
| Offline → online convergence      | Implemented + executed | `tests/integration/sync-convergence.test.ts`                             | 1 passed (2026-02-20) |
| Deterministic conflict resolution | Implemented + executed | `tests/integration/sync-convergence.test.ts` (runs twice, state matches) | Pass                  |
| Audit/metrics hook verification   | Implemented + executed | `pnpm --filter @gtcx/sync test -- -t "audit"`                            | 1 passed (2026-02-20) |

## Sprint 3 — API Client Enterprise Hardening

| Scenario                        | Status                 | Evidence                                           | Result                 |
| ------------------------------- | ---------------------- | -------------------------------------------------- | ---------------------- |
| Signed request header injection | Implemented + executed | `pnpm --filter @gtcx/api-client test`              | 10 passed (2026-02-20) |
| Auth error classification       | Implemented + executed | `pnpm --filter @gtcx/api-client test`              | 10 passed (2026-02-20) |
| mTLS handshake verification     | Implemented + executed | `pnpm --filter @gtcx/api-client test -- -t "mTLS"` | 1 passed (2026-02-21)  |

## Sprint 4 — P2P Networking Transport

| Scenario                                | Status                 | Evidence                                         | Result                                                 |
| --------------------------------------- | ---------------------- | ------------------------------------------------ | ------------------------------------------------------ |
| In-memory mesh delivery + rate limiting | Implemented + executed | `pnpm --filter @gtcx/network test`               | 7 passed (2026-02-20)                                  |
| libp2p mesh demo (TCP)                  | Executed               | `GTCX_P2P_TRANSPORT=tcp pnpm network:mesh:demo`  | mesh publish + restart + ACL + rate limit (2026-02-21) |
| libp2p mesh demo (QUIC)                 | Executed               | `GTCX_P2P_TRANSPORT=quic pnpm network:mesh:demo` | mesh publish + restart + ACL + rate limit (2026-02-21) |

## Sprint 5 — ZKP System

| Scenario                                       | Status                 | Evidence                                          | Result                                                            |
| ---------------------------------------------- | ---------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| ZKP acceptance/rejection (compliance flow)     | Implemented + executed | `node tools/uat/zkp-uat.mjs`                      | valid proof violations 0; invalid proof violations 1 (2026-02-21) |
| Groth16 + Bulletproofs + Schnorr circuit tests | Implemented + executed | `cargo test -p gtcx-zkp`                          | 38 passed, 2 ignored (2026-02-21)                                 |
| ZKP performance budgets (strict trend)         | Executed               | `PERF_ENFORCE_TREND=true pnpm perf:check-budgets` | 7 metrics, trend passed (2026-02-21)                              |
| Groth16 asset ownership proof (heavy)          | Executed               | `cargo test -p gtcx-zkp --release -- --ignored`   | 2 passed, 164.33s (2026-02-21)                                    |
| Groth16 location region proof (heavy)          | Executed               | `cargo test -p gtcx-zkp --release -- --ignored`   | 2 passed, 164.33s (2026-02-21)                                    |

## Sprint 6 — secp256k1 Interop

| Scenario                       | Status                 | Evidence                              | Result                |
| ------------------------------ | ---------------------- | ------------------------------------- | --------------------- |
| secp256k1 interop test vectors | Implemented + executed | `cargo test -p gtcx-crypto secp256k1` | 7 passed (2026-02-21) |
