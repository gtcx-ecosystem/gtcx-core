[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / createProvenanceLogger

# Function: createProvenanceLogger()

> **createProvenanceLogger**(`category`): [`ProvenanceLogger`](../interfaces/ProvenanceLogger.md)

Defined in: [provenance.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/provenance.ts#L75)

Create a category-scoped provenance logger.

Outputs JSON lines to stderr with level `info` for provenance records
and level `warn` for evaluations that require review.

## Parameters

### category

`string`

## Returns

[`ProvenanceLogger`](../interfaces/ProvenanceLogger.md)
