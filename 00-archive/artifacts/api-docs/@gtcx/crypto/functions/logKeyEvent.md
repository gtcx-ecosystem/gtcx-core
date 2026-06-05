[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / logKeyEvent

# Function: logKeyEvent()

> **logKeyEvent**(`event`): `void`

Defined in: [traced-keys.ts:149](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/traced-keys.ts#L149)

Log a key lifecycle event for audit purposes

## Parameters

### event

#### algorithm

[`KeyAlgorithm`](../type-aliases/KeyAlgorithm.md)

#### context?

`string`

#### keyId

`string`

#### type

`"generated"` \| `"imported"` \| `"rotated"` \| `"revoked"` \| `"expired"`

## Returns

`void`
