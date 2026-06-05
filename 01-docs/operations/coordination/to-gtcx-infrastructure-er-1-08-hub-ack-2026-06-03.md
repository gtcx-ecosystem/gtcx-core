---
title: 'Outbound — ER-1-08 hub log row (OI-X02)'
status: current
date: 2026-06-03
owner: gtcx-core
role: protocol-architect
document_id: COORD-OUT-INFRA-ER108
to: gtcx-infrastructure
from: gtcx-core
protocol: gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'outbound', 'er-1-08', 'eap', 'infrastructure']
related:
  - from-gtcx-agentic-er-1-08-inbound-ack-2026-06-03.md
  - to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md
---

# Outbound — ER-1-08 hub log row (OI-X02)

**From:** gtcx-core  
**To:** gtcx-infrastructure  
**Topic:** Append ER-1-08 ecosystem exit row to hub coordination log  
**Work ID:** OI-X02  
**Priority:** P1  
**Status:** gtcx-core done → awaiting infrastructure hub ack (witness — not blocking LAUNCH-PLAN bout)

**Note (2026-06-04):** Hub #17 terminal W2 key alignment is **gtcx-infrastructure** Class A/S (ESO/AWS SM) — separate from ER-1-08 EAP ack.

---

## Context

ER-1-08 (EAP Phase B staging proof) owner work in **gtcx-core** is **complete**:

| Artifact           | Path                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Inbound ack        | [from-gtcx-agentic-er-1-08-inbound-ack-2026-06-03.md](./from-gtcx-agentic-er-1-08-inbound-ack-2026-06-03.md)   |
| Issuance evidence  | `01-docs/05-audit/evidence/eap-issuance-2026-06-03-*`                                                          |
| ESO refresh thread | [to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md](./to-gtcx-infrastructure-eap-eso-refresh-2026-06-03.md) |

**gtcx-protocols** hub log row appended `2026-06-04T23:45Z` (`cross-repo-agent-log.md`).

**Remaining ecosystem exit:** **gtcx-infrastructure** hub log row only (per ER-1-08 checklist §Hub log).

---

## Requested action (gtcx-infrastructure)

1. Append one row to the infrastructure coordination witness (hub log or equivalent SoR) confirming:
   - ESO force-refresh / `af-south-1` mirror converged after core `pnpm eap:sync-bundle`
   - Staging AUTH smoke path unblocked for gtcx-intelligence (`INT-S3-08`)
2. Reply on this thread with **command + exit code** from any smoke or validate gate run.
3. Mirror ack path: `01-docs/04-ops/coordination/from-gtcx-infrastructure-er-1-08-hub-ack-YYYY-MM-DD.md` (or link to infra repo equivalent).

**Suggested hub log row:**

| Timestamp (UTC) | Repo                | Work ID          | Status | Summary                                                        | Evidence                                |
| --------------- | ------------------- | ---------------- | ------ | -------------------------------------------------------------- | --------------------------------------- |
| TBD             | gtcx-infrastructure | ER-1-08 / OI-X02 | done   | ESO refresh + staging AUTH path verified post core bundle sync | link to smoke exit code + this outbound |

---

## gtcx-core posture

No further automatable implementation in gtcx-core for ER-1-08. **CORE-004** (XR-402 ceremony) is the next blocked P22 item — release-gated.

**Bridge:** [cross-repo-agent-bridge.md](./cross-repo-agent-bridge.md)
