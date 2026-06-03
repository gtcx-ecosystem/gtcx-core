---
session_id: '2026-06-04-dtf-5-3-2-jurisdiction-fixtures'
agent: 'gtcx-core-agent'
focus: 'DTF-5.3.2 five-jurisdiction Tier-5 proof fixtures'
---

# Session: DTF-5.3.2 complete

## Done

| Milestone | Evidence                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| DTF-5.3.2 | `tests/integration/fixtures/tier5-jurisdiction-proof-fixtures.ts`, `tier5-jurisdiction-proofs.test.ts` (14 tests) |

## Protocol 22

`pnpm agent:next-work` → **DTF-5.3.3** (Minerals board UAT protocol template)

## Verification

| Command                                               | Result               |
| ----------------------------------------------------- | -------------------- |
| `pnpm test` (integration `tier5-jurisdiction-proofs`) | 14 passed            |
| `pnpm typecheck`                                      | pending this session |

## Fixture map

| Code       | Profile           | Notes                             |
| ---------- | ----------------- | --------------------------------- |
| ZW         | zw-diamond-origin | Kimberley claim                   |
| GH         | gh-gold-origin    | Gold buying license               |
| GH (cocoa) | gh-cocoa-origin   | Extra fixture in same file        |
| NA, CD     | commodity-origin  | Lab bounds until DTF-5.4 registry |
| BW         | zw-diamond-origin | Regional diamond pack             |
