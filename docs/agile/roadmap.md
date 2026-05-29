---
title: "GTCX Core — Roadmap 2026"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agile"]
review_cycle: "on-change"
---

---
id: ROADMAP-CORE
title: 'GTCX Core — Roadmap 2026'
version: '1.0'
date: '2026-05-27'
status: current
owner: protocol-architect
role: protocol-architect
tier: strategic
tags:
  - agile
  - roadmap
  - planning
review_cycle: monthly
---

# GTCX Core — Roadmap 2026

> **North Star:** The shared foundation of the GTCX ecosystem — types, crypto primitives, event schemas, and SDKs that every repo depends on.  
> **Horizon:** Q2–Q4 2026 (6 months)  
> **Last Updated:** 2026-05-27  
> **Owner:** @amanianai

## Timeline Overview

```
         Jun 2026        Jul 2026        Aug 2026        Sep 2026        Oct 2026        Nov 2026
Types    [====P1====]
Crypto   [====P1====]
Events           [====P1====]
SDK                      [====P2====]
SLSA                             [====P2====]
PvP                                      [====P3====]
```

## Quarterly Milestones

### Q2 2026 (Jun) — Shared Types & Crypto

**Goal:** All repos consume shared types from `@gtcx/types`. Crypto primitives (Ed25519, SHA-256) are standardized. No more type drift between Prisma and TypeScript.

| Epic                                   | Priority | Status         | Effort | Owner      | Dependencies      |
| -------------------------------------- | -------- | -------------- | ------ | ---------- | ----------------- |
| Fix type drift (Prisma ↔ TS Deal type) | P1       | 🚧 In Progress | M      | @amanianai | gtcx-markets      |
| Standardize `@gtcx/crypto` package     | P1       | 📋 Planned     | M      | @amanianai | —                 |
| Publish `@gtcx/types` v1.0             | P1       | 📋 Planned     | M      | @amanianai | —                 |
| SLSA provenance spec for builds        | P2       | 📋 Planned     | L      | @amanianai | gtcx-intelligence |

### Q3 2026 (Jul–Sep) — Event Bus & SDK

**Goal:** Cross-repo event bus is operational. `@gtcx/sdk` provides sub-clients for all 6 protocols. Runtime integration with terminal-os and griot-ai.

| Epic                                   | Priority | Status     | Effort | Owner      | Dependencies   |
| -------------------------------------- | -------- | ---------- | ------ | ---------- | -------------- |
| Cross-repo event bus (typed events)    | P1       | 📋 Planned | XL     | @amanianai | all repos      |
| `@gtcx/sdk` v1.0 with protocol clients | P2       | 📋 Planned | XL     | @amanianai | gtcx-protocols |
| Runtime integration with terminal-os   | P2       | 📋 Planned | L      | @amanianai | terminal-os    |
| Runtime integration with griot-ai      | P2       | 📋 Planned | L      | @amanianai | griot-ai       |
| OpenAPI spec validation                | P2       | 📋 Planned | M      | @amanianai | —              |

### Q4 2026 (Oct–Nov) — Settlement & Maturity

**Goal:** PvP atomic settlement is operational. SDK covers all platform APIs. Ecosystem integration score rises to 8.0+.

| Epic                                | Priority | Status    | Effort | Owner      | Dependencies   |
| ----------------------------------- | -------- | --------- | ------ | ---------- | -------------- |
| PvP atomic settlement protocol      | P3       | 🧊 Icebox | XL     | @amanianai | gtcx-protocols |
| SDK coverage: 100% of platform APIs | P3       | 🧊 Icebox | L      | @amanianai | gtcx-platforms |
| Ecosystem integration score 8.0+    | P3       | 🧊 Icebox | M      | @amanianai | all repos      |

## Key Metrics

| Metric                    | Current | Target (Q2) | Target (Q3) | Target (Q4) |
| ------------------------- | ------- | ----------- | ----------- | ----------- |
| Repos using `@gtcx/types` | 3       | 10          | 15          | 21          |
| Type drift instances      | 5       | 0           | 0           | 0           |
| Event types defined       | 0       | 5           | 15          | 25          |
| SDK protocol coverage     | 0%      | 20%         | 60%         | 100%        |
| Runtime integrations      | 1       | 3           | 6           | 10          |

## Dependencies

| This Repo Needs   | From Repo         | Blocking? | ETA |
| ----------------- | ----------------- | --------- | --- |
| Protocol specs    | gtcx-protocols    | No        | Q3  |
| SLSA requirements | gtcx-intelligence | No        | Q2  |

| Repo            | What They Need    | Blocking? | ETA |
| --------------- | ----------------- | --------- | --- |
| baseline-os     | Crypto, types     | No        | Q2  |
| gtcx-markets    | Types, SDK        | No        | Q3  |
| terminal-os     | SDK, event bus    | Yes       | Q3  |
| griot-ai        | Crypto, event bus | No        | Q3  |
| gtcx-operations | Event bus         | Yes       | Q4  |

---

_This roadmap is the canonical source of truth. ClickUp is a read-only mirror._
