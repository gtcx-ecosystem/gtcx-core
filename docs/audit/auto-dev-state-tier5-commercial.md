---
updated: 2026-06-04
owner: gtcx-core
status: launch-focus-implement
---

# Auto-dev state — launch / GTM (machine-generated)

**Do not hand-edit** — run `pnpm agent:reconcile-launch`.

## North star

- **Outcome:** Finish foundation evidence and coordination so downstream apps (markets, intelligence, infrastructure) can launch — GTM closes GR-T2+ sovereign deals.
- **GTM library:** GR-T1 · **Sovereign:** below-GR-T2

## Session mode: **IMPLEMENT**

| Bucket    | Count |
| --------- | ----- |
| implement | 1     |
| plan      | 5     |
| human     | 1     |

## Implement queue

- **CORE-004** — Trusted-setup transcript publish + KAT pin closeout

## Plan queue (when implement empty)

- **LAUNCH-PLAN-01** — Reconcile machine launch state (auto-dev + launch-focus) (`pnpm agent:reconcile-launch`)
- **LAUNCH-PLAN-02** — Refresh execution-roadmap open items + executive summary
- **LAUNCH-PLAN-03** — Update cross-repo bridge Latest row (GTM critical path)
- **LAUNCH-PLAN-04** — File or refresh infra outbound OI-X02 (ER-1-08 hub ack)
- **LAUNCH-PLAN-05** — Probe readiness lanes + fix index drift blocking GTM claims (`pnpm readiness:lanes:check`)

## Human gates

- **EXT-INF-002** — Live-stack pen-test (vendor) — infrastructure owner (gtcx-infrastructure)
