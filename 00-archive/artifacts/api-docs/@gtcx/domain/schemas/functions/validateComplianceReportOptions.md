[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / validateComplianceReportOptions

# Function: validateComplianceReportOptions()

> **validateComplianceReportOptions**(`data`): `object`

Defined in: [03-platform/packages/domain/src/schemas.ts:311](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/schemas.ts#L311)

## Parameters

### data

`unknown`

## Returns

`object`

### apps?

> `optional` **apps**: `string`[]

### categories?

> `optional` **categories**: (`"licensing"` \| `"environmental"` \| `"financial"` \| `"operational"` \| `"export"` \| `"labor"` \| `"safety"`)[]

### dateRange

> **dateRange**: `object`

#### dateRange.end

> **end**: `string` = `IsoDateSchema`

#### dateRange.start

> **start**: `string` = `IsoDateSchema`

### format

> **format**: `"export"` \| `"summary"` \| `"detailed"`

### severity?

> `optional` **severity**: (`"low"` \| `"medium"` \| `"high"` \| `"critical"`)[]
