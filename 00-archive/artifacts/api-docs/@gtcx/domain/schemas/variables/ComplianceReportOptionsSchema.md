[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / ComplianceReportOptionsSchema

# Variable: ComplianceReportOptionsSchema

> `const` **ComplianceReportOptionsSchema**: `ZodObject`\<\{ `apps`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `categories`: `ZodOptional`\<`ZodArray`\<`ZodEnum`\<\[`"licensing"`, `"environmental"`, `"financial"`, `"operational"`, `"export"`, `"labor"`, `"safety"`\]\>, `"many"`\>\>; `dateRange`: `ZodEffects`\<`ZodObject`\<\{ `end`: `ZodString`; `start`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `end`: `string`; `start`: `string`; \}, \{ `end`: `string`; `start`: `string`; \}\>, \{ `end`: `string`; `start`: `string`; \}, \{ `end`: `string`; `start`: `string`; \}\>; `format`: `ZodEnum`\<\[`"summary"`, `"detailed"`, `"export"`\]\>; `severity`: `ZodOptional`\<`ZodArray`\<`ZodEnum`\<\[`"critical"`, `"high"`, `"medium"`, `"low"`\]\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `apps?`: `string`[]; `categories?`: (`"licensing"` \| `"environmental"` \| `"financial"` \| `"operational"` \| `"export"` \| `"labor"` \| `"safety"`)[]; `dateRange`: \{ `end`: `string`; `start`: `string`; \}; `format`: `"export"` \| `"summary"` \| `"detailed"`; `severity?`: (`"low"` \| `"medium"` \| `"high"` \| `"critical"`)[]; \}, \{ `apps?`: `string`[]; `categories?`: (`"licensing"` \| `"environmental"` \| `"financial"` \| `"operational"` \| `"export"` \| `"labor"` \| `"safety"`)[]; `dateRange`: \{ `end`: `string`; `start`: `string`; \}; `format`: `"export"` \| `"summary"` \| `"detailed"`; `severity?`: (`"low"` \| `"medium"` \| `"high"` \| `"critical"`)[]; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:212](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L212)
