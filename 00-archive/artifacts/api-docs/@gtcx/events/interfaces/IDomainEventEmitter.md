[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / IDomainEventEmitter

# Interface: IDomainEventEmitter

Defined in: [types.ts:221](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L221)

## Methods

### emit()

> **emit**(`event`): `void`

Defined in: [types.ts:225](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L225)

Emit a domain event

#### Parameters

##### event

[`DomainEvent`](DomainEvent.md)

#### Returns

`void`

***

### on()

> **on**(`type`, `handler`): () => `void`

Defined in: [types.ts:230](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L230)

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

***

### onAny()

> **onAny**(`handler`): () => `void`

Defined in: [types.ts:235](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L235)

Subscribe to all events

#### Parameters

##### handler

(`event`) => `void`

#### Returns

> (): `void`

##### Returns

`void`
