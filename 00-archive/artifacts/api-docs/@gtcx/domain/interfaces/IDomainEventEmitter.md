[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / IDomainEventEmitter

# Interface: IDomainEventEmitter

Defined in: 03-platform/packages/events/dist/index.d.ts:154

## Methods

### emit()

> **emit**(`event`): `void`

Defined in: 03-platform/packages/events/dist/index.d.ts:158

Emit a domain event

#### Parameters

##### event

[`DomainEvent`](DomainEvent.md)

#### Returns

`void`

***

### on()

> **on**(`type`, `handler`): () => `void`

Defined in: 03-platform/packages/events/dist/index.d.ts:162

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

Defined in: 03-platform/packages/events/dist/index.d.ts:166

Subscribe to all events

#### Parameters

##### handler

(`event`) => `void`

#### Returns

> (): `void`

##### Returns

`void`
