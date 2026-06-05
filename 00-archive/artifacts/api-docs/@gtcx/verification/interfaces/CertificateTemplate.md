[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / CertificateTemplate

# Interface: CertificateTemplate

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L21)

Certificate template definition

## Properties

### description

> **description**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L24)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L22)

***

### name

> **name**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:23](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L23)

***

### optionalFields

> **optionalFields**: `string`[]

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L28)

***

### requiredFields

> **requiredFields**: `string`[]

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L27)

***

### requiredPredicates?

> `optional` **requiredPredicates**: `` `tradepass://${string}/${string}/${string}` ``[]

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L31)

Predicates that must be satisfied for this certificate

***

### securityLevel

> **securityLevel**: [`CertificateSecurityLevel`](../type-aliases/CertificateSecurityLevel.md)

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L26)

***

### type

> **type**: [`CertificateType`](../type-aliases/CertificateType.md)

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L25)

***

### validationRules

> **validationRules**: [`ValidationRule`](ValidationRule.md)[]

Defined in: [03-platform/packages/verification/src/types/definitions/templates.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/templates.ts#L29)
