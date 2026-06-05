[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / DIDResolverMetricsEvent

# Interface: DIDResolverMetricsEvent

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L40)

## Extends

- [`DIDResolutionMetadata`](DIDResolutionMetadata.md)

## Properties

### cache

> **cache**: `"hit"` \| `"miss"` \| `"bypass"`

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L35)

#### Inherited from

[`DIDResolutionMetadata`](DIDResolutionMetadata.md).[`cache`](DIDResolutionMetadata.md#cache)

***

### did

> **did**: `string`

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L41)

***

### durationMs

> **durationMs**: `number`

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L36)

#### Inherited from

[`DIDResolutionMetadata`](DIDResolutionMetadata.md).[`durationMs`](DIDResolutionMetadata.md#durationms)

***

### errorCode?

> `optional` **errorCode**: [`DIDResolverErrorCode`](../type-aliases/DIDResolverErrorCode.md)

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L42)

***

### resolver

> **resolver**: `string`

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L34)

#### Inherited from

[`DIDResolutionMetadata`](DIDResolutionMetadata.md).[`resolver`](DIDResolutionMetadata.md#resolver)

***

### revocationStatus?

> `optional` **revocationStatus**: [`DIDRevocationStatus`](../type-aliases/DIDRevocationStatus.md)

Defined in: [03-platform/packages/identity/03-platform/src/resolver.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/resolver.ts#L37)

#### Inherited from

[`DIDResolutionMetadata`](DIDResolutionMetadata.md).[`revocationStatus`](DIDResolutionMetadata.md#revocationstatus)
