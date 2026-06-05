[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / PhotoMetadataSchema

# Variable: PhotoMetadataSchema

> `const` **PhotoMetadataSchema**: `ZodObject`\<\{ `category`: `ZodOptional`\<`ZodString`\>; `description`: `ZodOptional`\<`ZodString`\>; `hash`: `ZodOptional`\<`ZodString`\>; `location`: `ZodOptional`\<`ZodObject`\<\{ `accuracy`: `ZodNumber`; `altitude`: `ZodOptional`\<`ZodNumber`\>; `latitude`: `ZodNumber`; `longitude`: `ZodNumber`; `source`: `ZodOptional`\<`ZodEnum`\<\[`"gps"`, `"network"`, `"manual"`\]\>\>; `timestamp`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}, \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}\>\>; `timestamp`: `ZodNumber`; `uri`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `category?`: `string`; `description?`: `string`; `hash?`: `string`; `location?`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `timestamp`: `number`; `uri`: `string`; \}, \{ `category?`: `string`; `description?`: `string`; `hash?`: `string`; `location?`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `timestamp`: `number`; `uri`: `string`; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L76)
