[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ReviewThreshold

# Interface: ReviewThreshold

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:113](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L113)

A single review threshold that policy gates evaluate against an
[AgenticProvenance](AgenticProvenance.md) record.

## Properties

### condition

> **condition**: [`ReviewThresholdCondition`](../type-aliases/ReviewThresholdCondition.md)

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:115](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L115)

Named condition identifier

***

### description?

> `optional` **description**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:123](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L123)

Optional human-readable explanation

***

### escalationLevel

> **escalationLevel**: `"none"` \| `"urgent"` \| `"review"` \| `"approval"`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L121)

Escalation level when this threshold fires

***

### minConfidence

> **minConfidence**: `number`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:117](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L117)

Minimum confidence required to avoid triggering this threshold

***

### requiredReviewerRole

> **requiredReviewerRole**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:119](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L119)

Role required to clear a review triggered by this threshold
