[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / isFipsMode

# Function: isFipsMode()

> **isFipsMode**(): `boolean`

Defined in: [fips.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/fips.ts#L27)

Check if FIPS mode is enabled.

Reads `GTCX_FIPS_MODE` environment variable on first call and caches the result.

## Returns

`boolean`
