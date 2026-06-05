[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / RequestOptions

# Interface: RequestOptions

Defined in: [03-platform/packages/api-client/src/types.ts:143](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L143)

## Properties

### dedupeKey?

> `optional` **dedupeKey**: `string`

Defined in: [03-platform/packages/api-client/src/types.ts:150](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L150)

Key for request deduplication — in-flight requests with the same key share the same promise

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [03-platform/packages/api-client/src/types.ts:144](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L144)

***

### signal?

> `optional` **signal**: `AbortSignal`

Defined in: [03-platform/packages/api-client/src/types.ts:146](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L146)

***

### signer?

> `optional` **signer**: [`RequestSigner`](../type-aliases/RequestSigner.md)

Defined in: [03-platform/packages/api-client/src/types.ts:147](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L147)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [03-platform/packages/api-client/src/types.ts:145](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L145)

***

### unsigned?

> `optional` **unsigned**: `boolean`

Defined in: [03-platform/packages/api-client/src/types.ts:148](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L148)
