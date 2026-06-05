[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / DecisionProvenance

# Interface: DecisionProvenance

Defined in: [03-platform/packages/types/src/common/provenance.ts:43](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L43)

Chain-of-custody record for a single decision in a multi-step
reasoning process.

## Properties

### actor

> **actor**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L51)

Identity of the actor (model, service, or human) that made the decision

***

### decisionId

> **decisionId**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L45)

Unique identifier for this decision step

***

### decisionType

> **decisionType**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L47)

Semantic type of the decision (e.g. 'anomaly_detection', 'risk_scoring')

***

### inputHash

> **inputHash**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:53](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L53)

Hash of the inputs that fed this decision step

***

### outputHash

> **outputHash**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:55](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L55)

Hash of the outputs produced by this decision step

***

### parentDecisionId?

> `optional` **parentDecisionId**: `string`

Defined in: [03-platform/packages/types/src/common/provenance.ts:57](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L57)

Parent decision in the chain, if any

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/types/src/common/provenance.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/provenance.ts#L49)

Unix timestamp (ms) when the decision was made
