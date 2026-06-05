[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / DIDResolverAdapter

# Interface: DIDResolverAdapter

Defined in: [03-platform/packages/identity/src/resolver.ts:55](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L55)

## Properties

### name

> **name**: `string`

Defined in: [03-platform/packages/identity/src/resolver.ts:56](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L56)

## Methods

### resolve()

> **resolve**(`did`, `options?`): `Promise`\<[`DIDDocument`](DIDDocument.md) \| `null`\>

Defined in: [03-platform/packages/identity/src/resolver.ts:57](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L57)

#### Parameters

##### did

`string`

##### options?

[`DIDResolverOptions`](DIDResolverOptions.md)

#### Returns

`Promise`\<[`DIDDocument`](DIDDocument.md) \| `null`\>
