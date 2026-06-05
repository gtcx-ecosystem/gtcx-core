[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / VerifiableCredential

# Interface: VerifiableCredential

Defined in: [03-platform/packages/types/src/protocols/identity.ts:101](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L101)

Verifiable credential structure

## Properties

### @context

> **@context**: `string`[]

Defined in: [03-platform/packages/types/src/protocols/identity.ts:102](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L102)

***

### credentialSubject

> **credentialSubject**: [`CredentialSubject`](CredentialSubject.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:107](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L107)

***

### expirationDate?

> `optional` **expirationDate**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:106](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L106)

***

### issuanceDate

> **issuanceDate**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:105](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L105)

***

### issuer

> **issuer**: `string` \| [`CredentialIssuer`](CredentialIssuer.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:104](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L104)

***

### proof?

> `optional` **proof**: [`CredentialProof`](CredentialProof.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:108](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L108)

***

### type

> **type**: `string`[]

Defined in: [03-platform/packages/types/src/protocols/identity.ts:103](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L103)
