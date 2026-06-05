[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / Claim

# Interface: Claim

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:8](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L8)

A claim is an assertion about a subject using a predicate

## Properties

### attestor

> **attestor**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L20)

Attestor who made the claim

***

### confidence

> **confidence**: `number`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L22)

Confidence score (0-1)

***

### evidence

> **evidence**: [`ClaimEvidence`](ClaimEvidence.md)[]

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L18)

Evidence supporting the claim

***

### id

> **id**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:10](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L10)

Unique claim identifier

***

### issuedAt

> **issuedAt**: `number`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L24)

When the claim was issued

***

### predicate

> **predicate**: `` `tradepass://${string}/${string}/${string}` ``

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L14)

Predicate URI

***

### proof

> **proof**: [`ClaimProof`](ClaimProof.md)

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L28)

Cryptographic proof

***

### subject

> **subject**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L12)

Subject of the claim (DID)

***

### validUntil?

> `optional` **validUntil**: `number`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L26)

When the claim expires

***

### value

> **value**: `unknown`

Defined in: [03-platform/packages/verification/src/types/definitions/claims.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/claims.ts#L16)

Value of the claim (matches predicate schema)
