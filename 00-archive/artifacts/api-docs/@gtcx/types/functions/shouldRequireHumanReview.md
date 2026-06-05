[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / shouldRequireHumanReview

# Function: shouldRequireHumanReview()

> **shouldRequireHumanReview**(`provenance`, `thresholds?`): `boolean`

Defined in: [03-platform/packages/types/src/common/provenance.ts:253](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L253)

Determine whether an [AgenticProvenance](../interfaces/AgenticProvenance.md) record should
require human review given a set of review thresholds.

## Parameters

### provenance

[`AgenticProvenance`](../interfaces/AgenticProvenance.md)

### thresholds?

[`ReviewThreshold`](../interfaces/ReviewThreshold.md)[] = `DefaultReviewThresholds`

## Returns

`boolean`
