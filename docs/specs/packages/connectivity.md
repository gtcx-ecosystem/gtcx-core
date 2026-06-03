---
title: 'Package Spec — `@gtcx/connectivity`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Connectivity'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/connectivity`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Network connectivity detection and profile classification for field environments. Detects online/offline state, classifies the quality of available connectivity into one of six profiles (`offline`, `ussd-only`, `edge`, `degraded`, `standard`, `satellite`), and emits state-change events. Used by `@gtcx/sync` to determine when and how aggressively to sync, and by offline-capable services to switch between local and remote operation.

---

## Public API

### Connectivity Detector

| Export                        | Description                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `ConnectivityDetector`        | Class: polls connectivity and emits state changes                                                                               |
| `ConnectivityDetectorOptions` | Interface: `checkIntervalMs`, `checkUrl`, `offlineThresholdMs`, `checkFn`                                                       |
| `ConnectivityCheckFn`         | Type: `() => Promise<ConnectivityCheckResult>` — pluggable check                                                                |
| `ConnectivityCheckResult`     | Interface: `{ online: boolean; latencyMs?: number; bandwidthKbps?: number }`                                                    |
| `ConnectivityListener`        | Type: `(state: ConnectivityState) => void` — callback invoked on state change                                                   |
| `ConnectivityState`           | Interface: `{ online: boolean; profile: ConnectivityProfile; lastChecked: number; latencyMs?: number; bandwidthKbps?: number }` |

### Profile Classification

| Export                                      | Description                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `classifyProfile(bandwidthKbps, latencyMs)` | Classify bandwidth (Kbps) and latency (ms) into a connectivity profile                |
| `ConnectivityProfile`                       | Type: `'offline' \| 'ussd-only' \| 'edge' \| 'degraded' \| 'standard' \| 'satellite'` |

---

## ConnectivityDetector Methods

| Method                                     | Description                                                         |
| ------------------------------------------ | ------------------------------------------------------------------- |
| `getState(): ConnectivityState`            | Return a copy of the current connectivity state                     |
| `onStateChange(listener): () => void`      | Subscribe to state changes; returns an unsubscribe function         |
| `start(): void`                            | Begin periodic connectivity checks                                  |
| `stop(): void`                             | Stop periodic connectivity checks                                   |
| `forceCheck(): Promise<ConnectivityState>` | Trigger an immediate connectivity check                             |
| `setOnline(online: boolean): void`         | Manually set online/offline state (useful for testing)              |
| `destroy(): void`                          | Clean up timers and listeners; detector cannot be reused after this |

---

## Connectivity Profiles

| Profile     | Criteria                                                               |
| ----------- | ---------------------------------------------------------------------- |
| `offline`   | Bandwidth <= 0 Kbps                                                    |
| `ussd-only` | Bandwidth < 1 Kbps                                                     |
| `satellite` | Bandwidth < 512 Kbps and latency > 500ms                               |
| `edge`      | Bandwidth < 200 Kbps (not satellite)                                   |
| `standard`  | Bandwidth > 5 Mbps and latency < 200ms                                 |
| `degraded`  | Everything else (moderate bandwidth, or high bandwidth + high latency) |

Classification order matters: `offline` -> `ussd-only` -> `satellite` -> `edge` -> `standard` -> `degraded` (fallthrough).

---

## ConnectivityDetectorOptions

| Field                | Type                   | Default            | Description                                       |
| -------------------- | ---------------------- | ------------------ | ------------------------------------------------- |
| `checkIntervalMs`    | `number?`              | `30000`            | Polling interval in milliseconds                  |
| `checkUrl`           | `string?`              | —                  | URL to ping for connectivity check                |
| `offlineThresholdMs` | `number?`              | `60000`            | After this long without success, consider offline |
| `checkFn`            | `ConnectivityCheckFn?` | always-online stub | Pluggable check function                          |

---

## Dependencies

No `@gtcx/*` dependencies. This is a standalone utility with no production npm dependencies.

---

## Non-Goals

- Does not manage sync scheduling — `@gtcx/sync` uses profiles to determine sync strategy
- Does not buffer or queue messages when offline — `@gtcx/events` handles offline buffering
- Does not manage network transport — `@gtcx/network`

---

## Implementation

`packages/connectivity/src/`

---

## Reference

- [`docs/specs/packages/sync.md`](./sync.md) — primary consumer
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview and operational SLOs
