[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / ApiErrorSchema

# Variable: ApiErrorSchema

> `const` **ApiErrorSchema**: `ZodObject`\<\{ `error`: `ZodObject`\<\{ `code`: `ZodString`; `details`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnknown`\>\>; `message`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `code`: `string`; `details?`: `Record`\<`string`, `unknown`\>; `message`: `string`; \}, \{ `code`: `string`; `details?`: `Record`\<`string`, `unknown`\>; `message`: `string`; \}\>; `meta`: `ZodOptional`\<`ZodObject`\<\{ `requestId`: `ZodString`; `timestamp`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `requestId`: `string`; `timestamp`: `string`; \}, \{ `requestId`: `string`; `timestamp`: `string`; \}\>\>; `success`: `ZodLiteral`\<`false`\>; \}, `"strip"`, `ZodTypeAny`, \{ `error`: \{ `code`: `string`; `details?`: `Record`\<`string`, `unknown`\>; `message`: `string`; \}; `meta?`: \{ `requestId`: `string`; `timestamp`: `string`; \}; `success`: `false`; \}, \{ `error`: \{ `code`: `string`; `details?`: `Record`\<`string`, `unknown`\>; `message`: `string`; \}; `meta?`: \{ `requestId`: `string`; `timestamp`: `string`; \}; `success`: `false`; \}\>

Defined in: [03-platform/packages/security/src/validation/schemas.ts:306](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/schemas.ts#L306)

Create an API error response schema
