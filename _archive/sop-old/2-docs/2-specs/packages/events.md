# @gtcx/events

Typed event bus and offline buffering built on domain events from `@gtcx/domain`.

## Scope

- `TypedEventBus` implementing `IDomainEventEmitter`
- Offline event buffering and replay for offline-first flows
- Event history tracking

## Key Exports (`packages/events/src/index.ts`)

| Export               | Description                                 |
| -------------------- | ------------------------------------------- |
| `TypedEventBus`      | Typed event bus with on/onAny/emit handlers |
| `OfflineEventBuffer` | Persistent queue for offline scenarios      |
| `EventHandler`       | Handler function type                       |
| `EventBusOptions`    | Configuration type                          |

Domain event types and payloads are re-exported from `@gtcx/domain`.

## Notes

- Offline buffering is enabled by default; disable via `EventBusOptions`.
- Event type definitions live in `@gtcx/domain` — this package wraps the bus and buffer only.

## References

- `../../../specs/eventcore.md`
- `domain.md`
