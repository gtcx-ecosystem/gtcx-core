[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / createQRCodeStructure

# Function: createQRCodeStructure()

> **createQRCodeStructure**(`data`, `size?`): `Omit`\<[`GeneratedQRCode`](../interfaces/GeneratedQRCode.md), `"qrCodeUri"`\>

Defined in: [03-platform/packages/verification/03-platform/src/qr/generator.ts:352](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/qr/generator.ts#L352)

Create a GeneratedQRCode structure (without image - platform adapter adds that)

## Parameters

### data

[`QRCodeData`](../interfaces/QRCodeData.md)

### size?

`number` = `DEFAULT_CONFIG.defaultSize`

## Returns

`Omit`\<[`GeneratedQRCode`](../interfaces/GeneratedQRCode.md), `"qrCodeUri"`\>
