[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/identity](../README.md) / createIdentity

# Function: createIdentity()

> **createIdentity**(`options?`): `Promise`\<[`IdentityCreationResult`](../interfaces/IdentityCreationResult.md)\>

Defined in: [03-platform/packages/identity/03-platform/src/identity.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/identity/03-platform/src/identity.ts#L80)

Create a standard digital identity

## Parameters

### options?

[`CreateIdentityOptions`](../interfaces/CreateIdentityOptions.md) = `{}`

## Returns

`Promise`\<[`IdentityCreationResult`](../interfaces/IdentityCreationResult.md)\>

## Example

```typescript
const { identity, privateKey } = await createIdentity({
  securityLevel: 'standard',
  metadata: { userRole: 'miner', deviceId: 'abc123' }
});
// Store privateKey in secure storage immediately
await secureStore.set(identity.privateKeyRef, privateKey);
```
