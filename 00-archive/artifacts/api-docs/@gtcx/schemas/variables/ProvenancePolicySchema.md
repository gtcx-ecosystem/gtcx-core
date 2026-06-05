[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/schemas](../README.md) / [](../README.md) / ProvenancePolicySchema

# Variable: ProvenancePolicySchema

> `const` **ProvenancePolicySchema**: `ZodObject`\<\{ `defaultAction`: `ZodEnum`\<\[`"allow"`, `"block"`, `"escalate"`, `"audit"`\]\>; `thresholds`: `ZodArray`\<`ZodObject`\<\{ `condition`: `ZodEnum`\<\[`"high_impact_compliance"`, `"model_uncertainty"`, `"stale_or_partial_evidence"`, `"jurisdictional_edge_case"`\]\>; `description`: `ZodOptional`\<`ZodString`\>; `escalationLevel`: `ZodEnum`\<\[`"none"`, `"review"`, `"approval"`, `"urgent"`\]\>; `minConfidence`: `ZodNumber`; `requiredReviewerRole`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `condition`: `"high_impact_compliance"` \| `"model_uncertainty"` \| `"stale_or_partial_evidence"` \| `"jurisdictional_edge_case"`; `description?`: `string`; `escalationLevel`: `"none"` \| `"review"` \| `"approval"` \| `"urgent"`; `minConfidence`: `number`; `requiredReviewerRole`: `string`; \}, \{ `condition`: `"high_impact_compliance"` \| `"model_uncertainty"` \| `"stale_or_partial_evidence"` \| `"jurisdictional_edge_case"`; `description?`: `string`; `escalationLevel`: `"none"` \| `"review"` \| `"approval"` \| `"urgent"`; `minConfidence`: `number`; `requiredReviewerRole`: `string`; \}\>, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `defaultAction`: `"audit"` \| `"allow"` \| `"block"` \| `"escalate"`; `thresholds`: `object`[]; \}, \{ `defaultAction`: `"audit"` \| `"allow"` \| `"block"` \| `"escalate"`; `thresholds`: `object`[]; \}\>

Defined in: [provenance.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/schemas/src/provenance.ts#L75)
