[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / checkRevocationStatus

# Function: checkRevocationStatus()

> **checkRevocationStatus**(`certificate`): `Promise`\<[`RevocationStatus`](../interfaces/RevocationStatus.md)\>

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:90](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L90)

Check if a certificate has been revoked.

Proxies to the RevocationRegistry.

## Parameters

### certificate

[`Certificate`](../interfaces/Certificate.md)

Certificate to check

## Returns

`Promise`\<[`RevocationStatus`](../interfaces/RevocationStatus.md)\>

Revocation status
