[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createPhotoQRData

# Function: createPhotoQRData()

> **createPhotoQRData**(`certificateId`, `photoHash`, `location?`, `config?`): [`QRCodeData`](../interfaces/QRCodeData.md)

Defined in: [03-platform/packages/verification/src/qr/generator.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L79)

Create QR code data structure for a photo

## Parameters

### certificateId

`string`

### photoHash

`string`

### location?

#### latitude

`number`

#### longitude

`number`

### config?

`Partial`\<[`QRCodeConfig`](../interfaces/QRCodeConfig.md)\> = `{}`

## Returns

[`QRCodeData`](../interfaces/QRCodeData.md)
