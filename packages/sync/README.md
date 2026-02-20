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

## License

MIT
