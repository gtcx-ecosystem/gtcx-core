---
title: 'Outbound ack — DTF-5.4.4 protocols witness (S-T5-4)'
status: current
date: 2026-06-05
owner: gtcx-core
role: protocol-architect
document_id: COORD-OUT-PROTO-544
from: gtcx-core
to: gtcx-protocols
reply_to: DTF-5.4.4
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: critical
tags: ['coordination', 'outbound-ack', 'zkp', 'dtf-5-4', 'tier-5', 's-t5-4']
---

# Outbound ack — DTF-5.4.4 (gtcx-core accepts protocols witness)

**From:** gtcx-core  
**To:** gtcx-protocols  
**Status:** S-T5-4 in-repo slice **closed**; Tier-5 technical handoff to cross-repo commercial track (5.5.2+ external)

---

## Witness

| Field                          | Value                                                                                                                                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Protocols commit               | [`73eaff2b`](https://github.com/gtcx-ecosystem/gtcx-protocols/commit/73eaff2b) — inbound handoff + P22 cross-repo slice                                                                    |
| Protocols inbound (owner repo) | [`from-gtcx-core-dtf-5-4-4-inbound-2026-06-05.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/from-gtcx-core-dtf-5-4-4-inbound-2026-06-05.md) |
| Protocols hub log row          | [`cross-repo-agent-log.md`](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/cross-repo-agent-log.md) (2026-06-05T03:00Z)                           |
| gtcx-core hub row              | [`cross-repo-agent-bridge.md`](./cross-repo-agent-bridge.md) (2026-06-05)                                                                                                                  |
| Upstream crypto helper         | `fc041a6` — `verifyGroth16CommodityOriginKat` in `@gtcx/crypto`                                                                                                                            |

---

## Scope accepted

Circuit profile E2E per trust-portal ID (`gh-gold-origin`, `zw-diamond-origin`, `gh-cocoa-origin`, `commodity-origin`; deprecated `gh-gold-origin-preview` rejected).

**Test (protocols):** `tests/cross-repo/dtf-5-4-4-circuit-profile-e2e.test.ts`

---

## gtcx-core closure artifacts

| Artifact             | Path                                                                               |
| -------------------- | ---------------------------------------------------------------------------------- |
| Tier-5 workplan      | [`tier-5-workplan-2026-06.md`](../tier-5-workplan-2026-06.md) — DTF-5.4.4 **done** |
| Execution roadmap    | [`execution-roadmap.md`](../../audit/execution-roadmap.md)                         |
| Agent work selection | [`agent-work-selection.md`](../agent-work-selection.md)                            |

**Protocols P22:** `backlogClear` unchanged; blocked items unchanged (**P22-EVID-03**, S11-03, H-03).

| Blocker class                           | Protocols    | Intelligence (witness mirror `5142ff8`) |
| --------------------------------------- | ------------ | --------------------------------------- |
| Staging credentialed smoke / auth vault | P22-EVID-03  | **INT-S9-01** / OI-B08 (Wire #2)        |
| Other P22 carry                         | S11-03, H-03 | —                                       |

Intelligence: no DTF-5.4.4 code; INT-S9-02–05 done; next P22 item **INT-S9-06** (eval publish on staging) unless operator reprioritizes.

---

## Next (gtcx-core)

Automatable Tier-5 remainder: **DTF-5.5.1** done; **DTF-5.5.2+** external (Legal / GTM). **CORE-004** blocked on XR-402 ceremony.
