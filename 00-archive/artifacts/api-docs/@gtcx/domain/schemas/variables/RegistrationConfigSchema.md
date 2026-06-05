[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / RegistrationConfigSchema

# Variable: RegistrationConfigSchema

> `const` **RegistrationConfigSchema**: `ZodObject`\<\{ `maxDiscoveryAgeDays`: `ZodOptional`\<`ZodDefault`\<`ZodNumber`\>\>; `maxPhotos`: `ZodOptional`\<`ZodDefault`\<`ZodNumber`\>\>; `minGpsAccuracy`: `ZodOptional`\<`ZodDefault`\<`ZodNumber`\>\>; `minPhotos`: `ZodOptional`\<`ZodDefault`\<`ZodNumber`\>\>; `requiredPhotoCategories`: `ZodOptional`\<`ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>\>; `workflowSteps`: `ZodOptional`\<`ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `id`: `ZodString`; `required`: `ZodBoolean`; `title`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `id`: `string`; `required`: `boolean`; `title`: `string`; \}, \{ `id`: `string`; `required`: `boolean`; `title`: `string`; \}\>, `"many"`\>\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `maxDiscoveryAgeDays?`: `number`; `maxPhotos?`: `number`; `minGpsAccuracy?`: `number`; `minPhotos?`: `number`; `requiredPhotoCategories?`: `string`[]; `workflowSteps?`: `object`[]; \}, \{ `maxDiscoveryAgeDays?`: `number`; `maxPhotos?`: `number`; `minGpsAccuracy?`: `number`; `minPhotos?`: `number`; `requiredPhotoCategories?`: `string`[]; `workflowSteps?`: `object`[]; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:231](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L231)
