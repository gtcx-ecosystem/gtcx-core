[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / VerificationOperationLog

# Interface: VerificationOperationLog\<TInput, TOutput\>

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L14)

## Type Parameters

### TInput

`TInput` = `unknown`

### TOutput

`TOutput` = `unknown`

## Properties

### category?

> `optional` **category**: `string`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L17)

***

### duration?

> `optional` **duration**: `number`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L20)

***

### durationMs?

> `optional` **durationMs**: `number` \| `null`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L21)

***

### error?

> `optional` **error**: `object`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L24)

#### message

> **message**: `string`

#### name

> **name**: `string`

#### stack?

> `optional` **stack**: `string`

***

### input?

> `optional` **input**: `TInput`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L18)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L25)

***

### operationName

> **operationName**: `string`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:15](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L15)

***

### output?

> `optional` **output**: `TOutput`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L19)

***

### success?

> `optional` **success**: `boolean`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L23)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L22)

***

### type

> **type**: `string`

Defined in: [03-platform/packages/verification/src/traced/analytics.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/traced/analytics.ts#L16)
