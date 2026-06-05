[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/domain

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

## When to use `@gtcx/domain` vs `@gtcx/types`

- **`@gtcx/domain`** — Business-domain types and runtime services for application layers. Import from here when building registration, trading, or compliance workflows. Provides: `AssetLot`, `Transaction`, `Trader`, `ComplianceRecord`, Zod schemas, event system, metrics, offline queue, and AI integration hooks.

- **`@gtcx/types`** — Protocol-level types with zero runtime code. Import from there when working directly with the six verification protocols (`TradePass`, `GeoTag`, `GCI`, `VaultMark`, `PvP`) or identity primitives.

Both can be used together. Protocol types flow into domain types at the service boundary.

## Module Map

| Concern                                    | Canonical package             | Domain re-export?      |
| ------------------------------------------ | ----------------------------- | ---------------------- |
| Types, schemas, versioning, migrations     | `@gtcx/domain`                | n/a (owned here)       |
| Events (types, payloads, factory, emitter) | `@gtcx/events`                | Yes — backwards compat |
| Metrics                                    | `@gtcx/domain/metrics`        | n/a (owned here)       |
| AI logging                                 | `@gtcx/domain/ai-logging`     | n/a (owned here)       |
| AI integration                             | `@gtcx/domain/ai-integration` | n/a (owned here)       |
| Offline queue                              | `@gtcx/domain/offline`        | n/a (owned here)       |

New code should import events directly from `@gtcx/events`. The re-exports from
`@gtcx/domain` and `@gtcx/domain/events` remain for backwards compatibility.

## Sub-exports

| Path                          | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `@gtcx/domain/schemas`        | Zod validation schemas                              |
| `@gtcx/domain/events`         | Event factory and emitter (re-exports @gtcx/events) |
| `@gtcx/domain/offline`        | Offline queue and storage                           |
| `@gtcx/domain/metrics`        | Metrics collection                                  |
| `@gtcx/domain/migrations`     | Schema migrations                                   |
| `@gtcx/domain/versioning`     | API versioning                                      |
| `@gtcx/domain/ai-logging`     | AI operation logging                                |
| `@gtcx/domain/ai-integration` | AI integration hooks                                |

## Related

- [ADR-004: Commodity-Agnostic Domain](../../_media/004-commodity-agnostic-domain.md)
- [ADR-007: Offline-First Architecture](../../_media/007-offline-first-architecture.md)

## License

MIT

## Modules

- [](README.md)
- [ai-integration](ai-integration/README.md)
- [ai-logging](ai-logging/README.md)
- [events](events/README.md)
- [metrics](metrics/README.md)
- [migrations](migrations/README.md)
- [offline](offline/README.md)
- [schemas](schemas/README.md)
- [versioning](versioning/README.md)
