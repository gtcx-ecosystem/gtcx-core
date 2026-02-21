# @gtcx/sync

Offline‑first sync engine that resolves conflicts and emits audit/metrics hooks. It is intentionally minimal and transport‑agnostic.

## Scope

- `createSyncEngine` with pluggable fetch/push hooks
- Built‑in conflict strategies
- Audit + metrics hooks for observability

## Key Exports

- `createSyncEngine`
- `SyncItem`, `SyncOptions`, `ConflictStrategy`, `SyncResult`
- `SyncAuditEvent`, `SyncMetrics`

## Conflict Strategies

- `last-write-wins`
- `server-wins`
- `highest-version`
- `append-only`
- `chain-validated`

## Example

```ts
import { createSyncEngine } from '@gtcx/sync';

const engine = createSyncEngine({
  fetchRemote: async (ids) => fetchRemoteItems(ids),
  pushLocal: async (items) => pushLocalItems(items),
  onAudit: (event) => console.log('audit', event.type),
});

await engine.sync(localItems, { strategy: 'last-write-wins' });
```

## References

- `packages/sync/src/types.ts`
