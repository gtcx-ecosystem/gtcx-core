[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / ProvenanceLogger

# Interface: ProvenanceLogger

Defined in: [provenance.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/provenance.ts#L59)

Logger that emits structured provenance records to stderr.

Useful for audit trails and downstream policy-gate consumption.

## Methods

### logEvaluation()

> **logEvaluation**(`provenance`, `action`, `reason`, `context?`): `void`

Defined in: [provenance.ts:61](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/provenance.ts#L61)

#### Parameters

##### provenance

`AgenticProvenance`

##### action

`string`

##### reason

`string`

##### context?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### logProvenance()

> **logProvenance**(`provenance`, `context?`): `void`

Defined in: [provenance.ts:60](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/provenance.ts#L60)

#### Parameters

##### provenance

`AgenticProvenance`

##### context?

`Record`\<`string`, `unknown`\>

#### Returns

`void`
