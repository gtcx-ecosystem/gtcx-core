[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/events

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

- [ADR-006: Hash-Chain Audit Trail](../../_media/006-hash-chain-audit-trail.md)

## License

MIT

@gtcx/events

Core event bus for the GTCX architecture.
Canonical source for domain event types, payloads, and infrastructure.
Provides a typed EventEmitter with offline buffering and replay.

## Classes

- [DomainEventFactory](classes/DomainEventFactory.md)
- [InMemoryEventEmitter](classes/InMemoryEventEmitter.md)
- [OfflineEventBuffer](classes/OfflineEventBuffer.md)
- [TypedEventBus](classes/TypedEventBus.md)

## Interfaces

- [BufferedEvent](interfaces/BufferedEvent.md)
- [ComplianceCheckCompletedPayload](interfaces/ComplianceCheckCompletedPayload.md)
- [ComplianceCheckStartedPayload](interfaces/ComplianceCheckStartedPayload.md)
- [DomainEvent](interfaces/DomainEvent.md)
- [EventBusOptions](interfaces/EventBusOptions.md)
- [EventSubscription](interfaces/EventSubscription.md)
- [IDomainEventEmitter](interfaces/IDomainEventEmitter.md)
- [OfflineBufferOptions](interfaces/OfflineBufferOptions.md)
- [OpportunityFoundPayload](interfaces/OpportunityFoundPayload.md)
- [PriceCalculatedPayload](interfaces/PriceCalculatedPayload.md)
- [RegistrationCompletedPayload](interfaces/RegistrationCompletedPayload.md)
- [RegistrationFailedPayload](interfaces/RegistrationFailedPayload.md)
- [RegistrationProgressPayload](interfaces/RegistrationProgressPayload.md)
- [RegistrationStartedPayload](interfaces/RegistrationStartedPayload.md)
- [RegistrationValidatedPayload](interfaces/RegistrationValidatedPayload.md)
- [ReportGeneratedPayload](interfaces/ReportGeneratedPayload.md)
- [TradeExecutedPayload](interfaces/TradeExecutedPayload.md)
- [TradeFailedPayload](interfaces/TradeFailedPayload.md)
- [TradeInitiatedPayload](interfaces/TradeInitiatedPayload.md)
- [ViolationDetectedPayload](interfaces/ViolationDetectedPayload.md)
- [WarningIssuedPayload](interfaces/WarningIssuedPayload.md)

## Type Aliases

- [DomainEventType](type-aliases/DomainEventType.md)
- [EventHandler](type-aliases/EventHandler.md)

## Variables

- [nullEventEmitter](variables/nullEventEmitter.md)
