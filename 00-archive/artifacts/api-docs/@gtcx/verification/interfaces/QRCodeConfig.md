[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / QRCodeConfig

# Interface: QRCodeConfig

Defined in: [03-platform/packages/verification/src/qr/generator.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L27)

Configuration for QR code generation

## Properties

### certificateIdPattern

> **certificateIdPattern**: `RegExp`

Defined in: [03-platform/packages/verification/src/qr/generator.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L33)

Certificate ID pattern for validation

***

### defaultSize

> **defaultSize**: `number`

Defined in: [03-platform/packages/verification/src/qr/generator.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L31)

Default QR code size in pixels

***

### maxCertificateAge

> **maxCertificateAge**: `number`

Defined in: [03-platform/packages/verification/src/qr/generator.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L35)

Maximum age for valid certificates (ms)

***

### verifyBaseUrl

> **verifyBaseUrl**: `string`

Defined in: [03-platform/packages/verification/src/qr/generator.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/qr/generator.ts#L29)

Base URL for verification endpoint
