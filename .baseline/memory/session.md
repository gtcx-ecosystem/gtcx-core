---
session_id: '2026-06-04-dtf-5-3-1-gh-cocoa'
agent: 'gtcx-core-agent'
focus: 'DTF-5.3.1 gh-cocoa-origin profile on CommodityOrigin R1CS'
---

# Session: DTF-5.3.1 complete

## Done

| Milestone | Evidence                                                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------- |
| DTF-5.3.1 | `gh-cocoa-origin` profile — Rust registry, workproof witness, `@gtcx/crypto` prove/verify, negative tests |

## Protocol 22

`pnpm agent:next-work` → **DTF-5.3.2** (five-jurisdiction integration fixtures)

## Verification

| Command                                           | Result                                                    |
| ------------------------------------------------- | --------------------------------------------------------- |
| `cargo test -p gtcx-zkp circuit_profiles`         | 26 passed                                                 |
| `pnpm --filter @gtcx/workproof test`              | 390 passed                                                |
| `pnpm --filter @gtcx/crypto test -- zkp-gh-cocoa` | 2 passed                                                  |
| `pnpm typecheck`                                  | exit 0                                                    |
| `pnpm api:update-baseline`                        | crypto additive; workproof/verification signature updates |

## Profile summary

- **ID:** `gh-cocoa-origin` · commodity_type `2` · GH bbox · grade + grams · OriginAuthenticated cert mask
