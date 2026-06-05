[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createGoldLotQRData

# ~~Function: createGoldLotQRData()~~

> **createGoldLotQRData**(`certificateId`, `goldLotData`, `hash`, `config?`): [`QRCodeData`](../interfaces/QRCodeData.md)

Defined in: [03-platform/packages/verification/03-platform/src/qr/generator.ts:139](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/qr/generator.ts#L139)

## Parameters

### certificateId

`string`

### goldLotData

#### location

\{ `latitude`: `number`; `longitude`: `number`; \}

#### location.latitude

`number`

#### location.longitude

`number`

#### miner

`string`

#### purity

`number`

#### weight

`number`

### hash

`string`

### config?

`Partial`\<[`QRCodeConfig`](../interfaces/QRCodeConfig.md)\> = `{}`

## Returns

[`QRCodeData`](../interfaces/QRCodeData.md)

## Deprecated

Use createAssetLotQRData instead
Legacy function for gold-specific lot QR codes
