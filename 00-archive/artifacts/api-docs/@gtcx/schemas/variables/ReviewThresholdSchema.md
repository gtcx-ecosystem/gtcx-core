[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/schemas](../README.md) / [](../README.md) / ReviewThresholdSchema

# Variable: ReviewThresholdSchema

> `const` **ReviewThresholdSchema**: `ZodObject`\<\{ `condition`: `ZodEnum`\<\[`"high_impact_compliance"`, `"model_uncertainty"`, `"stale_or_partial_evidence"`, `"jurisdictional_edge_case"`\]\>; `description`: `ZodOptional`\<`ZodString`\>; `escalationLevel`: `ZodEnum`\<\[`"none"`, `"review"`, `"approval"`, `"urgent"`\]\>; `minConfidence`: `ZodNumber`; `requiredReviewerRole`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `condition`: `"high_impact_compliance"` \| `"model_uncertainty"` \| `"stale_or_partial_evidence"` \| `"jurisdictional_edge_case"`; `description?`: `string`; `escalationLevel`: `"none"` \| `"review"` \| `"approval"` \| `"urgent"`; `minConfidence`: `number`; `requiredReviewerRole`: `string`; \}, \{ `condition`: `"high_impact_compliance"` \| `"model_uncertainty"` \| `"stale_or_partial_evidence"` \| `"jurisdictional_edge_case"`; `description?`: `string`; `escalationLevel`: `"none"` \| `"review"` \| `"approval"` \| `"urgent"`; `minConfidence`: `number`; `requiredReviewerRole`: `string`; \}\>

Defined in: [provenance.ts:65](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/schemas/src/provenance.ts#L65)
