[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / evaluateProvenancePolicy

# Function: evaluateProvenancePolicy()

> **evaluateProvenancePolicy**(`provenance`, `policy`): [`ProvenanceEvaluation`](../interfaces/ProvenanceEvaluation.md)

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:208](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L208)

Evaluate a provenance record against a policy.

Thresholds are tested in order. The first threshold whose condition
is met determines the action (`escalate`). If no threshold fires,
the [ProvenancePolicy.defaultAction](../interfaces/ProvenancePolicy.md#defaultaction) is returned.

## Parameters

### provenance

[`AgenticProvenance`](../interfaces/AgenticProvenance.md)

### policy

[`ProvenancePolicy`](../interfaces/ProvenancePolicy.md)

## Returns

[`ProvenanceEvaluation`](../interfaces/ProvenanceEvaluation.md)
