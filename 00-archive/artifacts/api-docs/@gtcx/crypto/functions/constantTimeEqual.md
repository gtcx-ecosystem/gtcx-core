[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / constantTimeEqual

# Function: constantTimeEqual()

> **constantTimeEqual**(`a`, `b`): `boolean`

Defined in: [hashing.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/hashing.ts#L23)

Constant-time comparison for fixed-length strings (e.g. hex-encoded hashes).
Both strings are converted to Buffers and compared using crypto.timingSafeEqual.

NOTE: Early-returns `false` when lengths differ, which leaks length information.
This is acceptable for comparing hex-encoded hashes (always same length) but
must NOT be used for variable-length secrets. For variable-length constant-time
comparison, use `secureCompare` from `@gtcx/security/offline/tamper-detection`.

## Parameters

### a

`string`

### b

`string`

## Returns

`boolean`
