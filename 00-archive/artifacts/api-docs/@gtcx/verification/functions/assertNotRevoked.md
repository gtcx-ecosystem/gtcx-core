[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / assertNotRevoked

# Function: assertNotRevoked()

> **assertNotRevoked**(`certificate`): `Promise`\<`void`\>

Defined in: [03-platform/packages/verification/src/certificates/revocation.ts:112](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/revocation.ts#L112)

Assert that a certificate is NOT revoked.

## Parameters

### certificate

[`Certificate`](../interfaces/Certificate.md)

## Returns

`Promise`\<`void`\>

## Throws

if certificate is revoked
