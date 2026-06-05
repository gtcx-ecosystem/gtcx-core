[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / DIDResolverConfig

# Interface: DIDResolverConfig

Defined in: [03-platform/packages/identity/src/resolver.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L76)

## Properties

### adapters

> **adapters**: [`DIDResolverAdapter`](DIDResolverAdapter.md)[]

Defined in: [03-platform/packages/identity/src/resolver.ts:77](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L77)

***

### cache?

> `optional` **cache**: [`DIDResolverCache`](DIDResolverCache.md)

Defined in: [03-platform/packages/identity/src/resolver.ts:78](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L78)

***

### cacheNullResults?

> `optional` **cacheNullResults**: `boolean`

Defined in: [03-platform/packages/identity/src/resolver.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L80)

***

### cacheTtlMs?

> `optional` **cacheTtlMs**: `number`

Defined in: [03-platform/packages/identity/src/resolver.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L79)

***

### metrics()?

> `optional` **metrics**: (`event`) => `void`

Defined in: [03-platform/packages/identity/src/resolver.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L83)

#### Parameters

##### event

[`DIDResolverMetricsEvent`](DIDResolverMetricsEvent.md)

#### Returns

`void`

***

### revocationChecker?

> `optional` **revocationChecker**: [`DIDRevocationChecker`](../type-aliases/DIDRevocationChecker.md)

Defined in: [03-platform/packages/identity/src/resolver.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L81)

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [03-platform/packages/identity/src/resolver.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L82)
