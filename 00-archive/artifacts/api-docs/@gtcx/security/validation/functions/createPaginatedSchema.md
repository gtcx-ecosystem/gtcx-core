[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / createPaginatedSchema

# Function: createPaginatedSchema()

> **createPaginatedSchema**\<`T`\>(`itemSchema`): `ZodObject`\<\{ `hasMore`: `ZodBoolean`; `items`: `ZodArray`\<`T`, `"many"`\>; `page`: `ZodNumber`; `pageSize`: `ZodNumber`; `total`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `hasMore`: `boolean`; `items`: `T`\[`"_output"`\][]; `page`: `number`; `pageSize`: `number`; `total`: `number`; \}, \{ `hasMore`: `boolean`; `items`: `T`\[`"_input"`\][]; `page`: `number`; `pageSize`: `number`; `total`: `number`; \}\>

Defined in: [03-platform/packages/security/03-platform/src/validation/schemas.ts:276](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/schemas.ts#L276)

Create a paginated response schema

## Type Parameters

### T

`T` *extends* `ZodType`\<`any`, `ZodTypeDef`, `any`\>

## Parameters

### itemSchema

`T`

## Returns

`ZodObject`\<\{ `hasMore`: `ZodBoolean`; `items`: `ZodArray`\<`T`, `"many"`\>; `page`: `ZodNumber`; `pageSize`: `ZodNumber`; `total`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `hasMore`: `boolean`; `items`: `T`\[`"_output"`\][]; `page`: `number`; `pageSize`: `number`; `total`: `number`; \}, \{ `hasMore`: `boolean`; `items`: `T`\[`"_input"`\][]; `page`: `number`; `pageSize`: `number`; `total`: `number`; \}\>
