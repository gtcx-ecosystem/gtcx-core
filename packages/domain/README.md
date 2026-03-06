# @gtcx/domain

Domain models, event system, offline queue, and schema migrations.

## Installation

```bash
pnpm add @gtcx/domain
```

## Quick Start

```typescript
import { DomainEventFactory, InMemoryEventEmitter } from '@gtcx/domain';
import { OfflineQueue, InMemoryQueueStorage } from '@gtcx/domain';

const factory = new DomainEventFactory('corr-1');
const emitter = new InMemoryEventEmitter();
emitter.onAny((e) => console.log(e.type));

const event = factory.registration('registration.started', { sessionId: 's1' });
emitter.emit(event);

const queue = new OfflineQueue(new InMemoryQueueStorage());
await queue.enqueue('registration', { lotId: 'lot-001' });
```

## Sub-exports

| Path                          | Description               |
| ----------------------------- | ------------------------- |
| `@gtcx/domain/schemas`        | Zod validation schemas    |
| `@gtcx/domain/events`         | Event factory and emitter |
| `@gtcx/domain/offline`        | Offline queue and storage |
| `@gtcx/domain/metrics`        | Metrics collection        |
| `@gtcx/domain/migrations`     | Schema migrations         |
| `@gtcx/domain/versioning`     | API versioning            |
| `@gtcx/domain/ai-logging`     | AI operation logging      |
| `@gtcx/domain/ai-integration` | AI integration hooks      |

## Related

- [ADR-004: Commodity-Agnostic Domain](../../SOP/2-docs/1-architecture/decisions/004-commodity-agnostic-domain.md)
- [ADR-007: Offline-First Architecture](../../SOP/2-docs/1-architecture/decisions/007-offline-first-architecture.md)

## License

MIT
