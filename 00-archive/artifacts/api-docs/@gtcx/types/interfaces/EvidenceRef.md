[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / EvidenceRef

# Interface: EvidenceRef

Defined in: [03-platform/packages/types/src/common/provenance.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L24)

Reference to a single piece of evidence that contributed to an
AI-derived output.

## Properties

### evidenceId

> **evidenceId**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L26)

Unique identifier for this evidence item

***

### evidenceType

> **evidenceType**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L28)

Classification of evidence (e.g. 'sensor', 'document', 'oracle', 'human')

***

### relevanceScore

> **relevanceScore**: `number`

Defined in: [03-platform/packages/types/src/common/provenance.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L34)

Relevance score (0–1) computed by the inference system

***

### source

> **source**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L30)

Source system or authority that provided the evidence

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/types/src/common/provenance.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L32)

Unix timestamp (ms) when the evidence was captured/attested

***

### uri?

> `optional` **uri**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L36)

Optional URI for retrieving the full evidence record
