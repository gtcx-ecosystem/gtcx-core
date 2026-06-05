[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / safeValidateRegistrationData

# Function: safeValidateRegistrationData()

> **safeValidateRegistrationData**(`data`): `SafeParseReturnType`\<\{ `appVersion?`: `string`; `assetDetails?`: `Record`\<`string`, `unknown`\>; `commodityType`: `string`; `deviceId?`: `string`; `discoveryDate?`: `string`; `discoveryLocation`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `estimatedWeight`: `number`; `form?`: `string`; `notes?`: `string`; `photos`: `object`[]; `producerId`: `string`; `purity?`: `number`; `quality?`: `"low"` \| `"medium"` \| `"high"` \| `"unknown"`; `weightUnit`: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ton"`; \}, \{ `appVersion?`: `string`; `assetDetails?`: `Record`\<`string`, `unknown`\>; `commodityType`: `string`; `deviceId?`: `string`; `discoveryDate?`: `string`; `discoveryLocation`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `estimatedWeight`: `number`; `form?`: `string`; `notes?`: `string`; `photos`: `object`[]; `producerId`: `string`; `purity?`: `number`; `quality?`: `"low"` \| `"medium"` \| `"high"` \| `"unknown"`; `weightUnit`: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ton"`; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:318](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L318)

Safe validation that returns result instead of throwing

## Parameters

### data

`unknown`

## Returns

`SafeParseReturnType`\<\{ `appVersion?`: `string`; `assetDetails?`: `Record`\<`string`, `unknown`\>; `commodityType`: `string`; `deviceId?`: `string`; `discoveryDate?`: `string`; `discoveryLocation`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `estimatedWeight`: `number`; `form?`: `string`; `notes?`: `string`; `photos`: `object`[]; `producerId`: `string`; `purity?`: `number`; `quality?`: `"low"` \| `"medium"` \| `"high"` \| `"unknown"`; `weightUnit`: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ton"`; \}, \{ `appVersion?`: `string`; `assetDetails?`: `Record`\<`string`, `unknown`\>; `commodityType`: `string`; `deviceId?`: `string`; `discoveryDate?`: `string`; `discoveryLocation`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `estimatedWeight`: `number`; `form?`: `string`; `notes?`: `string`; `photos`: `object`[]; `producerId`: `string`; `purity?`: `number`; `quality?`: `"low"` \| `"medium"` \| `"high"` \| `"unknown"`; `weightUnit`: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ton"`; \}\>
