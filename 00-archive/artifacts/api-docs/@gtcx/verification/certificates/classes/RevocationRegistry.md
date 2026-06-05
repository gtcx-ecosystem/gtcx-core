[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/verification](../../README.md) / [certificates](../README.md) / RevocationRegistry

# Class: RevocationRegistry

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L31)

Revocation Registry Implementation

In a production environment, this would interface with a
distributed ledger or a secure central registry.

## Methods

### check()

> **check**(`certificateId`): [`RevocationStatus`](../../interfaces/RevocationStatus.md)

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:61](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L61)

Check if a certificate is revoked

#### Parameters

##### certificateId

`string`

#### Returns

[`RevocationStatus`](../../interfaces/RevocationStatus.md)

***

### clear()

> **clear**(): `void`

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:77](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L77)

Clear the registry (useful for tests)

#### Returns

`void`

***

### revoke()

> **revoke**(`certificateId`, `reason`): `void`

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L47)

Mark a certificate as revoked

#### Parameters

##### certificateId

`string`

##### reason

`string`

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): `RevocationRegistry`

Defined in: [03-platform/packages/verification/03-platform/src/certificates/revocation.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/certificates/revocation.ts#L37)

#### Returns

`RevocationRegistry`
