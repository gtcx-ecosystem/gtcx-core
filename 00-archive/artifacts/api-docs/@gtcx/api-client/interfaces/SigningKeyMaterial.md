[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / SigningKeyMaterial

# Interface: SigningKeyMaterial

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:60](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L60)

Key material required for canonical request signing.

## Properties

### keyRef?

> `optional` **keyRef**: `string`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L66)

Optional key reference for keyId derivation (e.g. 'primary', 'device-01').

***

### privateKeyHex

> **privateKeyHex**: `string`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:62](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L62)

Private key in hex format.

***

### publicKeyHex

> **publicKeyHex**: `string`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:64](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L64)

Public key in hex format (used to derive the DID).
