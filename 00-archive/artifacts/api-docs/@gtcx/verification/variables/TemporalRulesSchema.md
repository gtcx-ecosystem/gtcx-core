[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / TemporalRulesSchema

# Variable: TemporalRulesSchema

> `const` **TemporalRulesSchema**: `ZodObject`\<\{ `monitoringType`: `ZodOptional`\<`ZodEnum`\<\[`"continuous"`, `"periodic"`, `"event_triggered"`\]\>\>; `renewalRequired`: `ZodBoolean`; `triggers`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `validDuration`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `monitoringType?`: `"continuous"` \| `"periodic"` \| `"event_triggered"`; `renewalRequired`: `boolean`; `triggers?`: `string`[]; `validDuration`: `string`; \}, \{ `monitoringType?`: `"continuous"` \| `"periodic"` \| `"event_triggered"`; `renewalRequired`: `boolean`; `triggers?`: `string`[]; `validDuration`: `string`; \}\>

Defined in: [03-platform/packages/verification/src/types/schemas/entities.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/schemas/entities.ts#L66)
