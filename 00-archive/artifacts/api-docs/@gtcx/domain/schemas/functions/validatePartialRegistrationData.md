[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / validatePartialRegistrationData

# Function: validatePartialRegistrationData()

> **validatePartialRegistrationData**(`data`): `object`

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:299](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L299)

## Parameters

### data

`unknown`

## Returns

`object`

### appVersion?

> `optional` **appVersion**: `string`

### assetDetails?

> `optional` **assetDetails**: `Record`\<`string`, `unknown`\>

### commodityType?

> `optional` **commodityType**: `string` = `CommodityTypeSchema`

### deviceId?

> `optional` **deviceId**: `string`

### discoveryDate?

> `optional` **discoveryDate**: `string`

### discoveryLocation?

> `optional` **discoveryLocation**: `object` = `LocationSchema`

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

### estimatedWeight?

> `optional` **estimatedWeight**: `number`

### form?

> `optional` **form**: `string`

### notes?

> `optional` **notes**: `string`

### photos?

> `optional` **photos**: `object`[] = `PhotoEvidenceArraySchema`

### producerId?

> `optional` **producerId**: `string` = `UuidSchema`

### purity?

> `optional` **purity**: `number`

### quality?

> `optional` **quality**: `"low"` \| `"medium"` \| `"high"` \| `"unknown"`

### weightUnit?

> `optional` **weightUnit**: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ton"`
