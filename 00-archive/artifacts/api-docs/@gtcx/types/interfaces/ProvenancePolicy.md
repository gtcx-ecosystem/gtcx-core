[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ProvenancePolicy

# Interface: ProvenancePolicy

Defined in: [03-platform/packages/types/src/common/provenance.ts:175](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L175)

A policy that evaluates [AgenticProvenance](AgenticProvenance.md) records and
decides whether an AI-derived action may proceed.

## Properties

### defaultAction

> **defaultAction**: [`ProvenancePolicyAction`](../type-aliases/ProvenancePolicyAction.md)

Defined in: [03-platform/packages/types/src/common/provenance.ts:179](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L179)

Default action when no threshold fires

***

### thresholds

> **thresholds**: [`ReviewThreshold`](ReviewThreshold.md)[]

Defined in: [03-platform/packages/types/src/common/provenance.ts:177](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L177)

Thresholds evaluated in order
