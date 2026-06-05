---
title: 'Inbound — EXT-INF-002 vendor pack receipt ack from gtcx-infrastructure'
status: current
date: 2026-06-07
owner: gtcx-core
role: quality-evidence-lead
document_id: COORD-IN-INFRA-EXTINF002-001
from: gtcx-infrastructure
to: gtcx-core
protocol: gtcx-docs/docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'inbound', 'ext-inf-002', 'witness']
related:
  - to-gtcx-infrastructure-ext-inf-002-vendor-pack-2026-06-05.md
  - to-gtcx-infrastructure-open-acks-rollup-2026-06-07.md
---

# Inbound — EXT-INF-002 vendor pack receipt ack

**From:** gtcx-infrastructure  
**To:** gtcx-core  
**Work ID:** EXT-INF-002 (pack intake)  
**Status:** **outbound-acknowledged** — SOW signature remains Class S

---

## Summary

gtcx-infrastructure acknowledges receipt of FA-S6-02 vendor pen-test pack. Pack will be attached to live-stack SOW; does not close live-stack pen-test gate.

---

## Evidence (infra SoR)

| Artifact              | Location                                                                                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Infra outbound ack    | [`from-gtcx-infrastructure-ext-inf-002-pack-ack-2026-06-07.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/operations/coordination/outbound/from-gtcx-infrastructure-ext-inf-002-pack-ack-2026-06-07.md) |
| Infra inbound receipt | [`from-gtcx-core-ext-inf-002-vendor-pack-2026-06-05.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/docs/operations/coordination/from-gtcx-core-ext-inf-002-vendor-pack-2026-06-05.md)                        |
| Hub log row           | `2026-06-07T03:20Z` EXT-INF-002 ack                                                                                                                                                                                                |

---

## gtcx-core pack (delivered)

| Gate                                   | Exit                 |
| -------------------------------------- | -------------------- |
| `pnpm vendor-evidence:verify-manifest` | **0** (22 artifacts) |
| `pnpm certified-pack:verify-manifest`  | **0** (5 packs)      |

Manifest: [`vendor-pen-test-pack-manifest-latest.json`](../../audit/evidence/vendor-pen-test-pack-manifest-latest.json)

---

## Remaining (not gtcx-core)

| Gate                   | Owner                            | Status                |
| ---------------------- | -------------------------------- | --------------------- |
| Pen-test SOW signature | gtcx-infrastructure / Leadership | **open** (Class S)    |
| Live-stack vendor test | gtcx-infrastructure              | **blocked** until SOW |

**gtcx-core:** no further automatable work for EXT-INF-002 until vendor report filed in infra SoR.
