[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / DIDResolverCache

# Interface: DIDResolverCache

Defined in: [03-platform/packages/identity/src/resolver.ts:65](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L65)

## Methods

### delete()

> **delete**(`did`): `void` \| `Promise`\<`void`\>

Defined in: [03-platform/packages/identity/src/resolver.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L68)

#### Parameters

##### did

`string`

#### Returns

`void` \| `Promise`\<`void`\>

***

### get()

> **get**(`did`): [`DIDResolverCacheEntry`](DIDResolverCacheEntry.md) \| `Promise`\<[`DIDResolverCacheEntry`](DIDResolverCacheEntry.md) \| `null`\> \| `null`

Defined in: [03-platform/packages/identity/src/resolver.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L66)

#### Parameters

##### did

`string`

#### Returns

[`DIDResolverCacheEntry`](DIDResolverCacheEntry.md) \| `Promise`\<[`DIDResolverCacheEntry`](DIDResolverCacheEntry.md) \| `null`\> \| `null`

***

### set()

> **set**(`did`, `entry`): `void` \| `Promise`\<`void`\>

Defined in: [03-platform/packages/identity/src/resolver.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L67)

#### Parameters

##### did

`string`

##### entry

[`DIDResolverCacheEntry`](DIDResolverCacheEntry.md)

#### Returns

`void` \| `Promise`\<`void`\>
