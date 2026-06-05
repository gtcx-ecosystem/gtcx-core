[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / InMemoryEventEmitter

# Class: InMemoryEventEmitter

Defined in: 03-platform/packages/events/dist/index.d.ts:186

## Implements

- [`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md)

## Constructors

### Constructor

> **new InMemoryEventEmitter**(): `InMemoryEventEmitter`

#### Returns

`InMemoryEventEmitter`

## Methods

### clear()

> **clear**(): `void`

Defined in: 03-platform/packages/events/dist/index.d.ts:204

Clear all events (for testing)

#### Returns

`void`

***

### emit()

> **emit**(`event`): `void`

Defined in: 03-platform/packages/events/dist/index.d.ts:190

Emit a domain event

#### Parameters

##### event

[`DomainEvent`](../interfaces/DomainEvent.md)

#### Returns

`void`

#### Implementation of

[`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md).[`emit`](../interfaces/IDomainEventEmitter.md#emit)

***

### getEvents()

> **getEvents**(): [`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

Defined in: 03-platform/packages/events/dist/index.d.ts:196

Get all emitted events (for testing)

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

***

### getEventsByType()

> **getEventsByType**(`type`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

Defined in: 03-platform/packages/events/dist/index.d.ts:200

Get events by type (for testing)

#### Parameters

##### type

[`DomainEventType`](../type-aliases/DomainEventType.md)

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

***

### on()

> **on**(`type`, `handler`): () => `void`

Defined in: 03-platform/packages/events/dist/index.d.ts:191

Subscribe to events by type

#### Parameters

##### type

[`DomainEventType`](../type-aliases/DomainEventType.md)

##### handler

(`event`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

#### Implementation of

[`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md).[`on`](../interfaces/IDomainEventEmitter.md#on)

***

### onAny()

> **onAny**(`handler`): () => `void`

Defined in: 03-platform/packages/events/dist/index.d.ts:192

Subscribe to all events

#### Parameters

##### handler

(`event`) => `void`

#### Returns

> (): `void`

##### Returns

`void`

#### Implementation of

[`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md).[`onAny`](../interfaces/IDomainEventEmitter.md#onany)
