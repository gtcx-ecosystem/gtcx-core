[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / validateRegistrationData

# Function: validateRegistrationData()

> **validateRegistrationData**(`data`): `object`

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:295](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L295)

Validate and sanitize input data

## Parameters

### data

`unknown`

## Returns

`object`

### appVersion?

> `optional` **appVersion**: `string`

### assetDetails?

> `optional` **assetDetails**: `Record`\<`string`, `unknown`\>

### commodityType

> **commodityType**: `string` = `CommodityTypeSchema`

### deviceId?

> `optional` **deviceId**: `string`

### discoveryDate?

> `optional` **discoveryDate**: `string`

### discoveryLocation

> **discoveryLocation**: `object` = `LocationSchema`

#### discoveryLocation.accuracy

> **accuracy**: `number`

#### discoveryLocation.altitude?

> `optional` **altitude**: `number`

#### discoveryLocation.latitude

> **latitude**: `number`

#### discoveryLocation.longitude

> **longitude**: `number`

#### discoveryLocation.source?

> `optional` **source**: `"gps"` \| `"network"` \| `"manual"`

#### discoveryLocation.timestamp

> **timestamp**: `number`

### estimatedWeight

> **estimatedWeight**: `number`

### form?

> `optional` **form**: `string`

### notes?

> `optional` **notes**: `string`

### photos

> **photos**: `object`[] = `PhotoEvidenceArraySchema`

### producerId

> **producerId**: `string` = `UuidSchema`

### purity?

> `optional` **purity**: `number`

### quality?

> `optional` **quality**: `"low"` \| `"medium"` \| `"high"` \| `"unknown"`

### weightUnit

> **weightUnit**: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ton"`

## Throws

ZodError if validation fails
