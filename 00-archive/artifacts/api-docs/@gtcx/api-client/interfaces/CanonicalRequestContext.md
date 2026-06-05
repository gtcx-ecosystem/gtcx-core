[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / CanonicalRequestContext

# Interface: CanonicalRequestContext

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L38)

Context for building a canonical request string.

## Properties

### body

> **body**: `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| `null`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L46)

Request body (string, Uint8Array, or null).

***

### headers

> **headers**: `Record`\<`string`, `string`\>

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L44)

Headers already set on the request (case-insensitive keys).

***

### method

> **method**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L40)

HTTP method in uppercase.

***

### url

> **url**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L42)

Full request URL.
