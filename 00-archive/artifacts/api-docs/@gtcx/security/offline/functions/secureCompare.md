[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / secureCompare

# Function: secureCompare()

> **secureCompare**(`a`, `b`): `boolean`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:160](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L160)

Constant-time string comparison to prevent timing attacks.
When lengths differ, pads the shorter string and still performs
a full constant-time comparison to avoid leaking length information.

## Parameters

### a

`string`

### b

`string`

## Returns

`boolean`
