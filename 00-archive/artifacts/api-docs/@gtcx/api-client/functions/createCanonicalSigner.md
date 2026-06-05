[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / createCanonicalSigner

# Function: createCanonicalSigner()

> **createCanonicalSigner**(`keys`, `options?`): [`RequestSigner`](../type-aliases/RequestSigner.md)

Defined in: [03-platform/packages/api-client/src/canonical/signer.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/signer.ts#L74)

Create a canonical request signer matching the mobile contract.

Usage with `createApiClient`:
```ts
const signer = createCanonicalSigner({
  privateKeyHex: 'a1b2...',
  publicKeyHex: 'c3d4...',
  keyRef: 'primary',
});

const client = createApiClient({
  baseUrl: 'https://api.gtcx.trade',
  signer,
});
```

## Parameters

### keys

[`SigningKeyMaterial`](../interfaces/SigningKeyMaterial.md)

### options?

[`CanonicalSignerOptions`](../interfaces/CanonicalSignerOptions.md)

## Returns

[`RequestSigner`](../type-aliases/RequestSigner.md)
