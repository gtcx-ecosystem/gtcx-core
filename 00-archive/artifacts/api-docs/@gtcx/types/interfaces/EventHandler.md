[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / EventHandler

# Interface: EventHandler\<T\>

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:207](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L207)

## Type Parameters

### T

`T` = `unknown`

## Properties

### eventType

> **eventType**: [`EventType`](../type-aliases/EventType.md) \| [`EventType`](../type-aliases/EventType.md)[]

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:208](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L208)

## Methods

### handle()

> **handle**(`event`): `Promise`\<`void`\>

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:209](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L209)

#### Parameters

##### event

[`DomainEvent`](DomainEvent.md)\<`T`\>

#### Returns

`Promise`\<`void`\>
