# @gtcx/sync

Sync engine with conflict resolution strategies.

## Installation

```bash
pnpm add @gtcx/sync
```

## Quick Start

```typescript
import { createSyncEngine } from '@gtcx/sync';

const engine = createSyncEngine({ strategy: 'last-write-wins' });
```

## API

| Export                   | Description              |
| ------------------------ | ------------------------ |
| `createSyncEngine(opts)` | Create sync engine       |
| `ConflictStrategy`       | Resolution strategy type |
| `SyncOptions`            | Configuration options    |

## License

MIT
