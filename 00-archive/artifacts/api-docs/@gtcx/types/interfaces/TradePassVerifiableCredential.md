[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / TradePassVerifiableCredential

# Interface: TradePassVerifiableCredential

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L20)

Verifiable Credential structure

## Properties

### @context

> **@context**: `string`[]

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L21)

***

### credentialSubject

> **credentialSubject**: `object`

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L27)

#### Index Signature

\[`key`: `string`\]: `unknown`

#### id

> **id**: `string`

***

### expirationDate?

> `optional` **expirationDate**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L26)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L22)

***

### issuanceDate

> **issuanceDate**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L25)

***

### issuer

> **issuer**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L24)

***

### proof

> **proof**: [`TradePassCredentialProof`](TradePassCredentialProof.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L31)

***

### type

> **type**: `string`[]

Defined in: [03-platform/packages/types/03-platform/src/protocols/tradepass.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/tradepass.ts#L23)
