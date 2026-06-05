[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / DIDResolutionMetadata

# Interface: DIDResolutionMetadata

Defined in: [03-platform/packages/identity/src/resolver.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L33)

## Extended by

- [`DIDResolverMetricsEvent`](DIDResolverMetricsEvent.md)

## Properties

### cache

> **cache**: `"hit"` \| `"miss"` \| `"bypass"`

Defined in: [03-platform/packages/identity/src/resolver.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L35)

***

### durationMs

> **durationMs**: `number`

Defined in: [03-platform/packages/identity/src/resolver.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L36)

***

### resolver

> **resolver**: `string`

Defined in: [03-platform/packages/identity/src/resolver.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L34)

***

### revocationStatus?

> `optional` **revocationStatus**: [`DIDRevocationStatus`](../type-aliases/DIDRevocationStatus.md)

Defined in: [03-platform/packages/identity/src/resolver.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/resolver.ts#L37)
