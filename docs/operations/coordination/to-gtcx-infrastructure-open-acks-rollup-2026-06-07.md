---
title: 'Outbound rollup — open infrastructure acks (OI-X02 + EXT-INF-002)'
status: current
date: 2026-06-07
owner: gtcx-core
role: protocol-architect
document_id: COORD-OUT-INFRA-ROLLUP-001
to: gtcx-infrastructure
from: gtcx-core
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'outbound', 'rollup', 'witness']
related:
  - to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md
  - to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md
---

# Outbound rollup — gtcx-infrastructure open acks

**From:** gtcx-core  
**To:** gtcx-infrastructure  
**Mode:** Witness (Class A) — core automatable work **done** for both items

---

## Open items (action required in owner repo)

| ID              | Topic                      | Outbound ticket                                                                                                                  | Core status        | Infra action                                            |
| --------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------- |
| **OI-X02**      | ER-1-08 hub ack            | [`to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md`](./to-gtcx-infrastructure-er-1-08-hub-ack-2026-06-03.md)                 | **done**           | Append hub log row; reply with smoke/validate exit code |
| **EXT-INF-002** | Pen-test vendor pack + SOW | [`to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md`](./to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md) | **outbound-filed** | Ack pack receipt; attach to SensePost SOW kickoff       |

---

## Cross-links (infra SoR)

| Infra artifact                                                                                                                                                                                 | Purpose                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [`pen-test-intake-evidence-2026-05-31.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/audit/pen-test-intake-evidence-2026-05-31.md)                                  | Live-stack intake (infra scope)           |
| [`ext-inf-human-gates-unblock-2026-06-06.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/operations/coordination/outbound/ext-inf-human-gates-unblock-2026-06-06.md) | Human gate register (EXT-INF-002 Class S) |

**gtcx-core library pack (22 artifacts):** [`vendor-pen-test-pack-manifest-latest.json`](../../audit/evidence/vendor-pen-test-pack-manifest-latest.json) on `main` — complements infra intake; does not replace live-stack test.

---

## Suggested infra replies

1. `from-gtcx-infrastructure-er-1-08-hub-ack-YYYY-MM-DD.md` — hub row + exit codes
2. `from-gtcx-infrastructure-ext-inf-002-ack-YYYY-MM-DD.md` — pack receipt + SOW status

---

## gtcx-core posture (P22)

- **Automatable exhausted** — Class S wall: DTF-5.5.4 (GTM), CORE-004-CEREMONY (custodian)
- **No further core code** for OI-X02 or EXT-INF-002 until infra acks

**Bridge:** [cross-repo-agent-bridge.md](./cross-repo-agent-bridge.md)
