[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / buildCanonicalRequest

# Function: buildCanonicalRequest()

> **buildCanonicalRequest**(`context`, `did`, `keyId`, `timestamp`, `nonce`, `audience`): [`CanonicalRequestString`](../interfaces/CanonicalRequestString.md)

Defined in: [03-platform/packages/api-client/src/canonical/hash.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/hash.ts#L26)

Build the canonical request string and its hash.

## Parameters

### context

[`CanonicalRequestContext`](../interfaces/CanonicalRequestContext.md)

### did

`string`

### keyId

`string`

### timestamp

`string`

### nonce

`string`

### audience

`string`

## Returns

[`CanonicalRequestString`](../interfaces/CanonicalRequestString.md)
