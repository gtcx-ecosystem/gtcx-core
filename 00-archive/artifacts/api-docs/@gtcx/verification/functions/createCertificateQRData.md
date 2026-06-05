[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createCertificateQRData

# Function: createCertificateQRData()

> **createCertificateQRData**(`certificateData`, `proofHash`, `config?`): [`QRCodeData`](../interfaces/QRCodeData.md)

Defined in: [03-platform/packages/verification/03-platform/src/qr/generator.ts:170](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/qr/generator.ts#L170)

Create QR code data structure for a certificate - COMMODITY-AGNOSTIC

## Parameters

### certificateData

#### assetLotData?

\{ `commodityType?`: [`CommodityType`](../type-aliases/CommodityType.md); `estimatedWeight?`: `number`; `operatorRole?`: [`OperatorRole`](../type-aliases/OperatorRole.md); `producerId?`: `string`; `purity?`: `number`; `unit?`: [`MeasurementUnit`](../type-aliases/MeasurementUnit.md); \}

Primary: commodity-agnostic asset lot data

#### assetLotData.commodityType?

[`CommodityType`](../type-aliases/CommodityType.md)

#### assetLotData.estimatedWeight?

`number`

#### assetLotData.operatorRole?

[`OperatorRole`](../type-aliases/OperatorRole.md)

#### assetLotData.producerId?

`string`

#### assetLotData.purity?

`number`

#### assetLotData.unit?

[`MeasurementUnit`](../type-aliases/MeasurementUnit.md)

#### certificateId

`string`

#### goldLotData?

\{ `estimatedWeight?`: `number`; `miner?`: `string`; `purity?`: `number`; \}

**Deprecated**

Use assetLotData instead

#### goldLotData.estimatedWeight?

`number`

#### goldLotData.miner?

`string`

#### goldLotData.purity?

`number`

#### issuedAt

`number`

#### location?

\{ `latitude`: `number`; `longitude`: `number`; \}

#### location.latitude

`number`

#### location.longitude

`number`

### proofHash

`string`

### config?

`Partial`\<[`QRCodeConfig`](../interfaces/QRCodeConfig.md)\> = `{}`

## Returns

[`QRCodeData`](../interfaces/QRCodeData.md)
