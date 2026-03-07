# Package Spec — `@gtcx/sync`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Offline-first data synchronization engine for the GTCX protocol. Manages bi-directional sync of protocol data between field agents and the network, with conflict resolution, batched retry, and audit event emission. Designed for GPRS-class connectivity environments where connections are intermittent.

---

## Public API

### Sync Engine

| Export             | Description                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `ISyncEngine`      | Interface: sync engine contract (dependency-injection friendly)          |
| `SyncEngineConfig` | Type: engine configuration — batch size, retry policy, conflict strategy |
| `SyncItem<T>`      | Type: a syncable data item with version and timestamps                   |
| `SyncResult`       | Type: outcome of a sync run                                              |
| `SyncStatus`       | Type: current engine status (idle/syncing/error)                         |
| `SyncMetrics`      | Type: counters — items synced, conflicts, retries, failures              |
| `SyncConflict<T>`  | Type: a detected conflict with local and remote versions                 |
| `SyncAuditEvent`   | Type: structured audit event emitted per sync operation                  |
| `SyncOptions`      | Type: per-run options — strategy, filters, dry-run                       |

### Conflict Strategies

| Strategy          | Behavior                                            |
| ----------------- | --------------------------------------------------- |
| `last-write-wins` | The item with the most recent timestamp wins        |
| `server-wins`     | Remote version always takes precedence              |
| `client-wins`     | Local version always takes precedence               |
| `manual`          | Conflicts are surfaced to the caller for resolution |

### Configuration Defaults

| Parameter       | Default                          |
| --------------- | -------------------------------- |
| `batchSize`     | 50 items per sync batch          |
| `retryAttempts` | 3                                |
| `retryDelayMs`  | 1,000ms with exponential backoff |

---

## Dependencies

No direct `@gtcx/*` package dependencies (pure sync protocol logic). Consumers inject the data access and network adapters.

---

## Operational Context

The sync engine is designed for:

- GPRS field agent connectivity (100–200kbps, high latency, frequent drops)
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

- [`_sop/2-docs/5-specs/4-backend/packages/network.md`](./network.md) — network transport layer
- [`_sop/2-docs/5-specs/4-backend/packages/connectivity.md`](./connectivity.md) — connectivity detection used to trigger sync
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview and operational SLOs
