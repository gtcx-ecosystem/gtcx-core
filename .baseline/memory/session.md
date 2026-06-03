---
session_id: '2026-06-04-dtf-5-4-1-circuit-registry'
agent: 'gtcx-core-agent'
focus: 'DTF-5.4.1 CircuitRegistry semver + deprecation'
---

# Session: DTF-5.4.1 complete

## Done

| Milestone | Evidence                                                                                    |
| --------- | ------------------------------------------------------------------------------------------- |
| DTF-5.4.1 | `@gtcx/crypto` `circuit-registry.ts` + manifest; Rust `resolve_profile`; NAPI uses registry |

## Protocol 22

`pnpm agent:next-work` → **DTF-5.4.2** (load test 1000 proofs/min + evidence JSON)

## Verification

| Command                                               | Result                  |
| ----------------------------------------------------- | ----------------------- |
| `pnpm --filter @gtcx/crypto test -- circuit-registry` | 4 passed                |
| `cargo test -p gtcx-zkp --lib lifecycle`              | 3 passed                |
| `pnpm typecheck`                                      | exit 0                  |
| `pnpm api:update-baseline`                            | crypto additive exports |
