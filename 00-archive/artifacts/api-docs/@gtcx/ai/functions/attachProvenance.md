[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/ai](../README.md) / attachProvenance

# Function: attachProvenance()

> **attachProvenance**\<`T`\>(`data`, `provenance`): `object`

Defined in: [provenance.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/ai/03-platform/src/provenance.ts#L47)

Wrap raw output data with an AgenticProvenance envelope.

## Type Parameters

### T

`T`

## Parameters

### data

`T`

### provenance

`AgenticProvenance`

## Returns

`object`

### data

> **data**: `T`

### provenance

> **provenance**: `AgenticProvenance`

## Example

```typescript
const result = attachProvenance(
  { anomalies: [...] },
  buildProvenance({ trustLevel: 'verified', confidence: 0.92, ... })
);
// result = { data: { anomalies: [...] }, provenance: { ... } }
```
