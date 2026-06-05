[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / LocationSchema

# Variable: LocationSchema

> `const` **LocationSchema**: `ZodObject`\<\{ `accuracy`: `ZodNumber`; `altitude`: `ZodOptional`\<`ZodNumber`\>; `latitude`: `ZodNumber`; `longitude`: `ZodNumber`; `source`: `ZodOptional`\<`ZodEnum`\<\[`"gps"`, `"network"`, `"manual"`\]\>\>; `timestamp`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}, \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}\>

Defined in: [03-platform/packages/domain/src/schemas.ts:63](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/schemas.ts#L63)
