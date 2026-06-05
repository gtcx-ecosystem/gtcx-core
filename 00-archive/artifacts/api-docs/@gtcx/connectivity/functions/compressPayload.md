[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / compressPayload

# Function: compressPayload()

> **compressPayload**(`data`): `Promise`\<[`CompressedPayload`](../interfaces/CompressedPayload.md)\>

Defined in: [03-platform/packages/connectivity/03-platform/src/compression.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/compression.ts#L67)

Compress a payload for low-bandwidth transmission.

Uses native CompressionStream when available (gzip). Falls back to
JSON + base64 for environments where CompressionStream is missing
(e.g. legacy USSD gateways).

## Parameters

### data

`unknown`

## Returns

`Promise`\<[`CompressedPayload`](../interfaces/CompressedPayload.md)\>
