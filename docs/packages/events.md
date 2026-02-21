# @gtcx/events

Typed event bus and offline buffering built on domain events from `@gtcx/domain`.

## Scope

- `TypedEventBus` implementing `IDomainEventEmitter`
- Offline buffering + replay for offline-first flows
- Simple event history tracking

## Key Exports

From `packages/events/src/index.ts`:

- `TypedEventBus`
- `OfflineEventBuffer`
- Event handler types and options (`EventHandler`, `EventBusOptions`)
- Domain event types re‑exported from `@gtcx/domain`

## Notes

- Event types and payloads are defined in `@gtcx/domain`.
- Offline buffering is enabled by default and can be disabled via options.

## References

- `docs/specs/eventcore.md`
- `docs/packages/domain.md`
