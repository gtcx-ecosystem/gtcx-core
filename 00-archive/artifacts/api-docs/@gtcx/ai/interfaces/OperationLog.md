[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / OperationLog

# Interface: OperationLog\<TInput, TOutput\>

Defined in: [traced.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L21)

## Type Parameters

### TInput

`TInput` = `unknown`

### TOutput

`TOutput` = `unknown`

## Properties

### category?

> `optional` **category**: `string`

Defined in: [traced.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L24)

***

### duration?

> `optional` **duration**: `number`

Defined in: [traced.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L27)

***

### durationMs?

> `optional` **durationMs**: `number` \| `null`

Defined in: [traced.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L28)

***

### error?

> `optional` **error**: `object`

Defined in: [traced.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L31)

#### message

> **message**: `string`

#### name

> **name**: `string`

#### stack?

> `optional` **stack**: `string`

***

### input?

> `optional` **input**: `TInput`

Defined in: [traced.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L25)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [traced.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L32)

***

### operationName

> **operationName**: `string`

Defined in: [traced.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L22)

***

### output?

> `optional` **output**: `TOutput`

Defined in: [traced.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L26)

***

### success?

> `optional` **success**: `boolean`

Defined in: [traced.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L30)

***

### timestamp

> **timestamp**: `number`

Defined in: [traced.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L29)

***

### type

> **type**: `string`

Defined in: [traced.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/traced.ts#L23)
