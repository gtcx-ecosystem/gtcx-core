[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ProvenanceEvaluation

# Interface: ProvenanceEvaluation

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:186](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L186)

Result of evaluating a [ProvenancePolicy](ProvenancePolicy.md) against an
[AgenticProvenance](AgenticProvenance.md) record.

## Properties

### action

> **action**: [`ProvenancePolicyAction`](../type-aliases/ProvenancePolicyAction.md)

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:188](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L188)

Action decided by the policy gate

***

### explanation

> **explanation**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:194](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L194)

Human-readable explanation of the decision

***

### reviewRequired

> **reviewRequired**: `boolean`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:192](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L192)

Whether human review is required before proceeding

***

### triggeredThresholds

> **triggeredThresholds**: [`ReviewThreshold`](ReviewThreshold.md)[]

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:190](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L190)

Thresholds that fired during evaluation
