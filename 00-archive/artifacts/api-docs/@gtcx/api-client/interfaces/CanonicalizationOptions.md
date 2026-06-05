[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / CanonicalizationOptions

# Interface: CanonicalizationOptions

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L50)

Options that control canonicalization behavior.

## Extended by

- [`CanonicalSignerOptions`](CanonicalSignerOptions.md)

## Properties

### algorithm?

> `optional` **algorithm**: `"ed25519"`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:54](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L54)

Signing algorithm.

***

### clockSkewMs?

> `optional` **clockSkewMs**: `number`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:56](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L56)

Clock skew tolerance in milliseconds (default: 5 minutes).

***

### version?

> `optional` **version**: `"v1"`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:52](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L52)

Protocol version.
