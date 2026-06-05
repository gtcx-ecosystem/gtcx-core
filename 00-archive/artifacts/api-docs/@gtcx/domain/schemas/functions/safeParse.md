[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / safeParse

# Function: safeParse()

> **safeParse**\<`T`\>(`schema`, `data`): `SafeParseReturnType`\<`unknown`, `T`\>

Defined in: [03-platform/packages/domain/src/schemas.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/schemas.ts#L18)

Safe parse utility - wraps Zod safeParse with consistent typing

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

### data

`unknown`

## Returns

`SafeParseReturnType`\<`unknown`, `T`\>
