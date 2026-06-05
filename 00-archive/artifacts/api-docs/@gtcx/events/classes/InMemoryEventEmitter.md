[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / InMemoryEventEmitter

# Class: InMemoryEventEmitter

Defined in: [types.ts:322](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L322)

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

Defined in: [types.ts:375](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L375)

Clear all events (for testing)

#### Returns

`void`

***

### emit()

> **emit**(`event`): `void`

Defined in: [types.ts:327](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L327)

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

Defined in: [types.ts:361](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L361)

Get all emitted events (for testing)

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

***

### getEventsByType()

> **getEventsByType**(`type`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

Defined in: [types.ts:368](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L368)

Get events by type (for testing)

#### Parameters

##### type

[`DomainEventType`](../type-aliases/DomainEventType.md)

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

***

### on()

> **on**(`type`, `handler`): () => `void`

Defined in: [types.ts:340](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L340)

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

Defined in: [types.ts:351](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L351)

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
