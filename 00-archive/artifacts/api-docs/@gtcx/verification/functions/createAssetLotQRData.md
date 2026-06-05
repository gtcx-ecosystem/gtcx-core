[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createAssetLotQRData

# Function: createAssetLotQRData()

> **createAssetLotQRData**(`certificateId`, `assetLotData`, `hash`, `config?`): [`QRCodeData`](../interfaces/QRCodeData.md)

Defined in: [03-platform/packages/verification/src/qr/generator.ts:101](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L101)

Create QR code data structure for an asset lot - COMMODITY-AGNOSTIC
Works for gold, silver, cocoa, coffee, or any other commodity

## Parameters

### certificateId

`string`

### assetLotData

#### commodityType

[`CommodityType`](../type-aliases/CommodityType.md)

#### location

\{ `latitude`: `number`; `longitude`: `number`; \}

#### location.latitude

`number`

#### location.longitude

`number`

#### operatorRole?

[`OperatorRole`](../type-aliases/OperatorRole.md)

#### producerId?

`string`

#### purity?

`number`

#### unit?

[`MeasurementUnit`](../type-aliases/MeasurementUnit.md)

#### weight

`number`

### hash

`string`

### config?

`Partial`\<[`QRCodeConfig`](../interfaces/QRCodeConfig.md)\> = `{}`

## Returns

[`QRCodeData`](../interfaces/QRCodeData.md)
