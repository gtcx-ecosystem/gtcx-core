[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / BufferedEvent

# Interface: BufferedEvent\<T\>

Defined in: [types.ts:414](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L414)

Wrapper around a domain event with buffering metadata.

## Type Parameters

### T

`T` = `unknown`

## Properties

### bufferedAt

> **bufferedAt**: `number`

Defined in: [types.ts:418](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L418)

Timestamp when the event was buffered

***

### event

> **event**: [`DomainEvent`](DomainEvent.md)\<`T`\>

Defined in: [types.ts:416](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L416)

The original domain event

***

### id

> **id**: `string`

Defined in: [types.ts:422](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L422)

Unique buffer entry ID

***

### retryCount

> **retryCount**: `number`

Defined in: [types.ts:420](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/types.ts#L420)

Number of times flush has been attempted for this event
