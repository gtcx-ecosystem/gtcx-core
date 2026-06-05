[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / DomainEvent

# Interface: DomainEvent\<T\>

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L67)

## Type Parameters

### T

`T` = `unknown`

## Properties

### actor?

> `optional` **actor**: `object`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L75)

#### id

> **id**: `string`

#### type

> **type**: `string`

***

### causationId?

> `optional` **causationId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L74)

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:73](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L73)

***

### data

> **data**: `T`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L83)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L68)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:84](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L84)

***

### source

> **source**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L72)

***

### subject?

> `optional` **subject**: `object`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L79)

#### id

> **id**: `string`

#### type

> **type**: `string`

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L70)

***

### type

> **type**: [`EventType`](../type-aliases/EventType.md)

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L69)

***

### version

> **version**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/events.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/events.ts#L71)
