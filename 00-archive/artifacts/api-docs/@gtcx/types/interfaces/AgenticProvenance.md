[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / AgenticProvenance

# Interface: AgenticProvenance

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L79)

Core provenance envelope attached to every AI-derived output.

This structure is intentionally serializable and hashable so that
downstream policy gates can evaluate it without re-running inference.

## Properties

### confidence

> **confidence**: `number`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L83)

Confidence score (0–1)

***

### decisionProvenance

> **decisionProvenance**: [`DecisionProvenance`](DecisionProvenance.md)

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:91](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L91)

Chain of decisions that led to this output

***

### evidenceRefs

> **evidenceRefs**: [`EvidenceRef`](EvidenceRef.md)[]

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:85](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L85)

References to evidence that contributed to this output

***

### methodologyVersion

> **methodologyVersion**: [`MethodologyVersion`](MethodologyVersion.md)

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:87](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L87)

Methodology that produced this output

***

### requiresHumanReview

> **requiresHumanReview**: `boolean`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:89](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L89)

Whether human review is required before acting on this output

***

### reviewedAt?

> `optional` **reviewedAt**: `number`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:95](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L95)

Unix timestamp (ms) when the human review occurred

***

### reviewedBy?

> `optional` **reviewedBy**: `string`

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:93](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L93)

Identity of the human reviewer, if already reviewed

***

### trustLevel

> **trustLevel**: [`TrustLevel`](../type-aliases/TrustLevel.md)

Defined in: [03-platform/packages/types/03-platform/src/common/provenance.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/common/provenance.ts#L81)

Computed trust level for this output
