# @gtcx/events

Event bus with offline buffering support.

## Installation

```bash
pnpm add @gtcx/events
```

## Quick Start

```typescript
import { TypedEventBus, OfflineEventBuffer } from '@gtcx/events';

const bus = new TypedEventBus();
bus.on('registration.started', (e) => console.log(e));
```

## API

| Export               | Description                |
| -------------------- | -------------------------- |
| `TypedEventBus`      | Type-safe event bus        |
| `OfflineEventBuffer` | Buffer events when offline |

## Related

- [ADR-006: Hash-Chain Audit Trail](../../_sop/2-docs/3-engineering/6-decisions/006-hash-chain-audit-trail.md)

## License

MIT
