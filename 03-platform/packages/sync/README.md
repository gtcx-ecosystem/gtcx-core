# @gtcx/sync

Sync engine with conflict resolution strategies.

## Installation

```bash
pnpm add @gtcx/sync
```

## Quick Start

```typescript
import { createSyncEngine } from '@gtcx/sync';

const engine = createSyncEngine({
  fetchRemote: async () => [],
  pushLocal: async () => {},
  onConflict: ({ id }) => {
    console.log(`Conflict for ${id}`);
  },
  resolveConflict: async ({ local, remote }) => {
    return remote ?? local[0] ?? null;
  },
});

const result = await engine.sync([], { strategy: 'last-write-wins' });
```

## API

| Export                     | Description              |
| -------------------------- | ------------------------ |
| `createSyncEngine(config)` | Create sync engine       |
| `ConflictStrategy`         | Resolution strategy type |
| `SyncOptions`              | Sync configuration       |
| `SyncEngineConfig`         | Engine configuration     |

### SyncEngineConfig

- `fetchRemote(ids)` fetches current remote state for ids.
- `pushLocal(items)` uploads resolved local winners.
- `onResolved(items)` applies remote winners locally.
- `onConflict(conflict)` hook for conflict telemetry.
- `resolveConflict(conflict)` custom resolver when built-in strategy cannot decide.
- `onAudit(event)` audit trail callback for sync lifecycle events.
- `onMetrics(metrics)` metrics callback for sync completion.

## License

MIT
