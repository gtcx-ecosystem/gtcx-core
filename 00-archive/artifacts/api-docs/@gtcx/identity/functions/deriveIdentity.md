[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / deriveIdentity

# Function: deriveIdentity()

> **deriveIdentity**(`parentIdentity`, `context`, `options?`): `Promise`\<[`IdentityCreationResult`](../interfaces/IdentityCreationResult.md)\>

Defined in: [03-platform/packages/identity/src/identity.ts:280](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/src/identity.ts#L280)

Create a derived identity from existing identity
Useful for creating role-specific or context-specific identities

## Parameters

### parentIdentity

`DigitalIdentity`

### context

`string`

### options?

`Partial`\<[`CreateIdentityOptions`](../interfaces/CreateIdentityOptions.md)\> = `{}`

## Returns

`Promise`\<[`IdentityCreationResult`](../interfaces/IdentityCreationResult.md)\>
