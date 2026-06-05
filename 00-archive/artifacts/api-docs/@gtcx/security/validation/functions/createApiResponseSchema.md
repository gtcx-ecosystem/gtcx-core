[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / createApiResponseSchema

# Function: createApiResponseSchema()

> **createApiResponseSchema**\<`T`\>(`dataSchema`): `ZodObject`\<\{ `data`: `T`; `meta`: `ZodOptional`\<`ZodObject`\<\{ `requestId`: `ZodString`; `timestamp`: `ZodString`; `version`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `requestId`: `string`; `timestamp`: `string`; `version`: `string`; \}, \{ `requestId`: `string`; `timestamp`: `string`; `version`: `string`; \}\>\>; `success`: `ZodLiteral`\<`true`\>; \}, `"strip"`, `ZodTypeAny`, \{ \[k in "success" \| "data" \| "meta"\]: addQuestionMarks\<baseObjectOutputType\<\{ data: T; meta: ZodOptional\<ZodObject\<\{ requestId: ZodString; timestamp: ZodString; version: ZodString \}, "strip", ZodTypeAny, \{ requestId: string; timestamp: string; version: string \}, \{ requestId: string; timestamp: string; version: string \}\>\>; success: ZodLiteral\<true\> \}\>, any\>\[k\] \}, \{ \[k in "success" \| "data" \| "meta"\]: baseObjectInputType\<\{ data: T; meta: ZodOptional\<ZodObject\<\{ requestId: ZodString; timestamp: ZodString; version: ZodString \}, "strip", ZodTypeAny, \{ requestId: string; timestamp: string; version: string \}, \{ requestId: string; timestamp: string; version: string \}\>\>; success: ZodLiteral\<true\> \}\>\[k\] \}\>

Defined in: [03-platform/packages/security/03-platform/src/validation/schemas.ts:289](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/schemas.ts#L289)

Create an API response schema with standard envelope

## Type Parameters

### T

`T` *extends* `ZodType`\<`any`, `ZodTypeDef`, `any`\>

## Parameters

### dataSchema

`T`

## Returns

`ZodObject`\<\{ `data`: `T`; `meta`: `ZodOptional`\<`ZodObject`\<\{ `requestId`: `ZodString`; `timestamp`: `ZodString`; `version`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `requestId`: `string`; `timestamp`: `string`; `version`: `string`; \}, \{ `requestId`: `string`; `timestamp`: `string`; `version`: `string`; \}\>\>; `success`: `ZodLiteral`\<`true`\>; \}, `"strip"`, `ZodTypeAny`, \{ \[k in "success" \| "data" \| "meta"\]: addQuestionMarks\<baseObjectOutputType\<\{ data: T; meta: ZodOptional\<ZodObject\<\{ requestId: ZodString; timestamp: ZodString; version: ZodString \}, "strip", ZodTypeAny, \{ requestId: string; timestamp: string; version: string \}, \{ requestId: string; timestamp: string; version: string \}\>\>; success: ZodLiteral\<true\> \}\>, any\>\[k\] \}, \{ \[k in "success" \| "data" \| "meta"\]: baseObjectInputType\<\{ data: T; meta: ZodOptional\<ZodObject\<\{ requestId: ZodString; timestamp: ZodString; version: ZodString \}, "strip", ZodTypeAny, \{ requestId: string; timestamp: string; version: string \}, \{ requestId: string; timestamp: string; version: string \}\>\>; success: ZodLiteral\<true\> \}\>\[k\] \}\>
