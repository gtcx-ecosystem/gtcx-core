# @gtcx/sync

Offline-first sync engine with pluggable conflict resolution strategies and observability hooks.

## Scope

- `createSyncEngine` with pluggable fetch/push hooks
- Five built-in conflict resolution strategies
- Audit and metrics hooks for observability

## Key Exports

| Export             | Description                                |
| ------------------ | ------------------------------------------ |
| `createSyncEngine` | Factory — returns a sync engine instance   |
| `SyncItem`         | Item shape for sync operations             |
| `SyncOptions`      | Configuration including strategy selection |
| `ConflictStrategy` | Strategy type union                        |
| `SyncResult`       | Result shape with resolved items and stats |
| `SyncAuditEvent`   | Audit event emitted during sync            |
| `SyncMetrics`      | Metrics collected during a sync run        |

## Conflict Strategies

| Strategy          | Behavior                                |
| ----------------- | --------------------------------------- |
| `last-write-wins` | Higher timestamp wins                   |
| `server-wins`     | Remote always wins                      |
| `highest-version` | Higher version number wins              |
| `append-only`     | Items are never deleted, only added     |
| `chain-validated` | Hash-chain integrity required to accept |

## Usage

```ts
import { createSyncEngine } from '@gtcx/sync';

const engine = createSyncEngine({
  fetchRemote: async (ids) => fetchRemoteItems(ids),
  pushLocal: async (items) => pushLocalItems(items),
  onAudit: (event) => console.log(event.type),
});

await engine.sync(localItems, { strategy: 'last-write-wins' });
```

## References

- `packages/sync/src/types.ts`
