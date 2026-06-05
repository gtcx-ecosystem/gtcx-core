[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/utils](../README.md) / retry

# Function: retry()

> **retry**\<`T`\>(`fn`, `options?`): `Promise`\<`T`\>

Defined in: [index.ts:122](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/utils/03-platform/src/index.ts#L122)

Retry a function with exponential backoff

## Type Parameters

### T

`T`

## Parameters

### fn

() => `Promise`\<`T`\>

### options?

#### backoffMultiplier?

`number`

#### initialDelay?

`number`

#### maxAttempts?

`number`

#### maxDelay?

`number`

## Returns

`Promise`\<`T`\>
