[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createLocationQRData

# Function: createLocationQRData()

> **createLocationQRData**(`certificateId`, `location`, `hash`, `config?`): [`QRCodeData`](../interfaces/QRCodeData.md)

Defined in: [03-platform/packages/verification/src/qr/generator.ts:58](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L58)

Create QR code data structure for a location

## Parameters

### certificateId

`string`

### location

#### latitude

`number`

#### longitude

`number`

### hash

`string`

### config?

`Partial`\<[`QRCodeConfig`](../interfaces/QRCodeConfig.md)\> = `{}`

## Returns

[`QRCodeData`](../interfaces/QRCodeData.md)
