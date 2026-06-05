[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / DomainEvent

# Interface: DomainEvent\<T\>

Defined in: [types.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L45)

## Type Parameters

### T

`T` = `unknown`

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [types.ts:53](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L53)

Correlation ID for distributed tracing

***

### payload

> **payload**: `T`

Defined in: [types.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L49)

Event payload

***

### source

> **source**: `"registration"` \| `"trading"` \| `"compliance"`

Defined in: [types.ts:55](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L55)

Source service

***

### timestamp

> **timestamp**: `number`

Defined in: [types.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L51)

Unix timestamp (ms)

***

### type

> **type**: [`DomainEventType`](../type-aliases/DomainEventType.md)

Defined in: [types.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L47)

Event type

***

### version

> **version**: `number`

Defined in: [types.ts:57](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L57)

Schema version for evolution
