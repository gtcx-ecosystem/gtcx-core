[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / Transaction

# Interface: Transaction

Defined in: [03-platform/packages/domain/src/types.ts:189](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L189)

Transaction record

## Properties

### assetLotId

> **assetLotId**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:191](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L191)

***

### cryptoSignature

> **cryptoSignature**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:200](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L200)

***

### currency

> **currency**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:197](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L197)

***

### fromTraderId

> **fromTraderId**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:192](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L192)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:190](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L190)

***

### location

> **location**: [`Location`](Location.md)

Defined in: [03-platform/packages/domain/src/types.ts:199](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L199)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/domain/src/types.ts:202](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L202)

***

### price

> **price**: `number`

Defined in: [03-platform/packages/domain/src/types.ts:196](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L196)

***

### quantity

> **quantity**: `number`

Defined in: [03-platform/packages/domain/src/types.ts:194](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L194)

***

### quantityUnit

> **quantityUnit**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:195](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L195)

***

### status

> **status**: `"pending"` \| `"confirmed"` \| `"completed"` \| `"disputed"` \| `"cancelled"`

Defined in: [03-platform/packages/domain/src/types.ts:201](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L201)

***

### timestamp

> **timestamp**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:198](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L198)

***

### toTraderId

> **toTraderId**: `string`

Defined in: [03-platform/packages/domain/src/types.ts:193](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L193)
