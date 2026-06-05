[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/utils](../README.md) / safeJsonParse

# Function: safeJsonParse()

> **safeJsonParse**\<`T`\>(`json`, `fallback`, `schema?`): `T`

Defined in: [index.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/utils/03-platform/src/index.ts#L29)

Safely parse JSON with error handling.
When a Zod schema is provided, the parsed value is validated at runtime.
Without a schema, falls back to `as T` (type-only assertion).

## Type Parameters

### T

`T`

## Parameters

### json

`string`

### fallback

`T`

### schema?

`ZodType`\<`T`, `ZodTypeDef`, `T`\>

## Returns

`T`
