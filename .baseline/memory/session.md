---
session_id: '2026-06-03-dtf-5-4-4-protocols-e2e'
agent: 'gtcx-core-agent'
focus: 'DTF-5.4.4 gtcx-protocols circuit profile E2E (cross-repo)'
---

# Session: DTF-5.4.4 complete

## Done

| Milestone   | Evidence                                                                                                                                                       |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DTF-5.4.4   | `gtcx-protocols/tests/cross-repo/zkp-circuit-profile-e2e.test.ts` — registry resolve + KAT verify per `gh-gold-origin`, `zw-diamond-origin`, `gh-cocoa-origin` |
| Core helper | `@gtcx/crypto` `verifyGroth16CommodityOriginKat` — `packages/crypto/src/groth16-kat-verify.ts`                                                                 |

## Protocol 22

`pnpm agent:next-work` → **DTF-5.5.1** (jurisdiction pack Zod CI — S-T5-5)

## Verification

| Command                                                                   | Result              |
| ------------------------------------------------------------------------- | ------------------- |
| `pnpm --filter @gtcx/crypto build`                                        | exit 0              |
| `pnpm --filter @gtcx/crypto test`                                         | exit 0 (439 passed) |
| `pnpm exec vitest run … zkp-circuit-profile-e2e.test.ts` (gtcx-protocols) | exit 0 (7 passed)   |
