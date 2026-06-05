[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ComplianceEvaluation

# Interface: ComplianceEvaluation

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L74)

Compliance evaluation result

## Properties

### attestation?

> `optional` **attestation**: [`ComplianceAttestation`](ComplianceAttestation.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L83)

***

### evaluatedAt

> **evaluatedAt**: `number`

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L80)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L75)

***

### policyId

> **policyId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:78](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L78)

***

### policyVersion

> **policyVersion**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L79)

***

### ruleResults

> **ruleResults**: [`RuleResult`](RuleResult.md)[]

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L82)

***

### score

> **score**: [`ComplianceScore`](ComplianceScore.md)

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L81)

***

### subjectId

> **subjectId**: `string`

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L76)

***

### subjectType

> **subjectType**: `"site"` \| `"tradepass"` \| `"lot"` \| `"transaction"`

Defined in: [03-platform/packages/types/03-platform/src/protocols/gci.ts:77](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/protocols/gci.ts#L77)
