[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / CanonicalSignerOptions

# Interface: CanonicalSignerOptions

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:92](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L92)

Options for creating a canonical signer.

## Extends

- [`CanonicalizationOptions`](CanonicalizationOptions.md)

## Properties

### algorithm?

> `optional` **algorithm**: `"ed25519"`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:54](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L54)

Signing algorithm.

#### Inherited from

[`CanonicalizationOptions`](CanonicalizationOptions.md).[`algorithm`](CanonicalizationOptions.md#algorithm)

***

### audience?

> `optional` **audience**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L96)

Audience URL or origin. Defaults to request URL origin.

***

### authScheme?

> `optional` **authScheme**: [`AuthScheme`](../type-aliases/AuthScheme.md)

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:94](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L94)

Authentication scheme to advertise.

***

### clockSkewMs?

> `optional` **clockSkewMs**: `number`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:56](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L56)

Clock skew tolerance in milliseconds (default: 5 minutes).

#### Inherited from

[`CanonicalizationOptions`](CanonicalizationOptions.md).[`clockSkewMs`](CanonicalizationOptions.md#clockskewms)

***

### tokenTtlMs?

> `optional` **tokenTtlMs**: `number`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L98)

Token TTL in milliseconds (default: 5 minutes).

***

### version?

> `optional` **version**: `"v1"`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:52](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L52)

Protocol version.

#### Inherited from

[`CanonicalizationOptions`](CanonicalizationOptions.md).[`version`](CanonicalizationOptions.md#version)
