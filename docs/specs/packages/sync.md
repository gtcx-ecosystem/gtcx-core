---
title: "Package Spec — `@gtcx/sync`"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "specs"]
review_cycle: "on-change"
---

---
title: 'Sync'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/sync`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Offline-first data synchronization engine for the GTCX protocol. Manages bi-directional sync of protocol data between field agents and the network, with conflict resolution, batched retry, and audit event emission. Designed for GPRS-class connectivity environments where connections are intermittent.

---

## Public API

### Sync Engine Factory

| Export                         | Description                                                                                                                             |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `createSyncEngine<T>(config?)` | Factory: creates an `ISyncEngine` with injected data access hooks                                                                       |
| `ISyncEngine`                  | Interface: `{ sync(items, options), getStatus(), cancel() }`                                                                            |
| `SyncEngineConfig<T>`          | Interface: engine configuration — data access hooks and event callbacks                                                                 |
| `SyncItem<T>`                  | Interface: a syncable data item with `id`, `data`, `version`, `updatedAt`, `syncedAt?`                                                  |
| `SyncResult`                   | Interface: outcome of a sync run — `uploaded`, `downloaded`, `conflicts`, `resolved`, `errors`, `durationMs`                            |
| `SyncStatus`                   | Type: `'idle' \| 'syncing' \| 'error' \| 'cancelled'`                                                                                   |
| `SyncMetrics`                  | Interface: detailed counters emitted via `onMetrics` callback                                                                           |
| `SyncConflict<T>`              | Interface: `{ id, local: SyncItem<T>[], remote?: SyncItem<T> }`                                                                         |
| `SyncAuditEvent<T>`            | Interface: structured audit event with `type`, `timestamp`, `strategy`, and optional fields                                             |
| `SyncAuditEventType`           | Type: `'sync.start' \| 'sync.conflict' \| 'sync.resolved' \| 'sync.unresolved' \| 'sync.complete' \| 'sync.failed' \| 'sync.cancelled'` |
| `SyncOptions`                  | Interface: per-run options — `strategy`, `batchSize?`, `retryAttempts?`, `retryDelayMs?`                                                |
| `ConflictStrategy`             | Type: the five conflict resolution strategies (see below)                                                                               |

### SyncEngineConfig<T> Hooks

| Hook              | Type                                                          | Description                                                  |
| ----------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| `fetchRemote`     | `(ids: string[]) => Promise<SyncItem<T>[]>`                   | Fetch remote items by ID                                     |
| `pushLocal`       | `(items: SyncItem<T>[]) => Promise<void>`                     | Push resolved items to the remote                            |
| `onResolved`      | `(items: SyncItem<T>[]) => Promise<void> \| void`             | Called with items that should be saved locally (remote wins) |
| `onConflict`      | `(conflict: SyncConflict<T>) => Promise<void> \| void`        | Notification when a conflict is detected                     |
| `resolveConflict` | `(conflict: SyncConflict<T>) => Promise<SyncItem<T> \| null>` | Custom conflict resolver for unresolved conflicts            |
| `onAudit`         | `(event: SyncAuditEvent<T>) => Promise<void> \| void`         | Audit event callback                                         |
| `onMetrics`       | `(metrics: SyncMetrics) => Promise<void> \| void`             | Metrics callback emitted after each sync run                 |

### Conflict Strategies

| Strategy          | Behavior                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `last-write-wins` | The item with the most recent `updatedAt` wins (ties broken by `version`)                            |
| `server-wins`     | Remote version always takes precedence                                                               |
| `highest-version` | The item with the highest `version` wins (ties broken by `updatedAt`)                                |
| `append-only`     | Newest item wins; nothing is deleted                                                                 |
| `chain-validated` | Prefer the highest-version item that has `data.previousHash`; unresolved if none have chain metadata |

### Configuration Defaults

| Parameter       | Default                     |
| --------------- | --------------------------- |
| `batchSize`     | 50 items per sync batch     |
| `retryAttempts` | 3                           |
| `retryDelayMs`  | 1,000ms with linear backoff |

---

## Dependencies

No direct `@gtcx/*` package dependencies (pure sync protocol logic). Consumers inject the data access and network adapters via `SyncEngineConfig`.

---

## Operational Context

The sync engine is designed for:

- GPRS field agent connectivity (100-200kbps, high latency, frequent drops)
- Validator nodes (high throughput, stable connectivity)
- Government registry endpoints (batch sync, compliance audit trail required)

SLOs for GPRS environment: sync completion within 30 seconds for a 50-item batch over a 200kbps link.

---

## Non-Goals

- Does not define what data is synced — consumers provide item collections
- Does not implement network transport — that is `@gtcx/network`
- Does not persist sync state between process restarts — callers manage state persistence

---

## Implementation

`packages/sync/src/`

---

## Reference

- [`docs/specs/packages/network.md`](./network.md) — network transport layer
- [`docs/specs/packages/connectivity.md`](./connectivity.md) — connectivity detection used to trigger sync
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview and operational SLOs
