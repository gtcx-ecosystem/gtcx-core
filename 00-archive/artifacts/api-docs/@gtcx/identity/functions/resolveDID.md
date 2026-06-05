[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / resolveDID

# Function: resolveDID()

> **resolveDID**(`did`, `resolver?`, `options?`): `Promise`\<[`DIDDocument`](../interfaces/DIDDocument.md) \| `null`\>

Defined in: [03-platform/packages/identity/03-platform/src/did.ts:132](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/did.ts#L132)

Resolve a GTCX DID.

When no resolver is provided, uses an in-memory resolver that only knows
DIDs registered via createStaticDIDResolverAdapter. For production use,
provide a resolver configured with appropriate adapters.

## Parameters

### did

`string`

### resolver?

[`DIDResolver`](../interfaces/DIDResolver.md) | (`did`) => `Promise`\<[`DIDDocument`](../interfaces/DIDDocument.md) \| `null`\>

### options?

[`DIDResolverOptions`](../interfaces/DIDResolverOptions.md)

## Returns

`Promise`\<[`DIDDocument`](../interfaces/DIDDocument.md) \| `null`\>
