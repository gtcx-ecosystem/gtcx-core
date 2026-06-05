[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / CreateCertificateInput

# Interface: CreateCertificateInput

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L59)

Input for creating a certificate - COMMODITY-AGNOSTIC

## Properties

### assetLotData?

> `optional` **assetLotData**: [`AssetLotData`](AssetLotData.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:65](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L65)

Primary: commodity-agnostic asset lot data

***

### commodityType?

> `optional` **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L69)

Commodity type (optional, can be inferred from assetLotData)

***

### complianceData?

> `optional` **complianceData**: [`ComplianceData`](ComplianceData.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:73](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L73)

***

### custodyData?

> `optional` **custodyData**: [`CustodyEntry`](CustodyEntry.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L74)

***

### deviceId

> **deviceId**: `string`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:63](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L63)

***

### environmentalFactors?

> `optional` **environmentalFactors**: [`EnvironmentalFactors`](EnvironmentalFactors.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L80)

***

### expiresAt?

> `optional` **expiresAt**: `number`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L82)

***

### ~~geologicalContext?~~

> `optional` **geologicalContext**: [`GeologicalContext`](GeologicalContext.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L79)

#### Deprecated

Use resourceContext instead

***

### ~~goldLotData?~~

> `optional` **goldLotData**: [`GoldLotData`](GoldLotData.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L67)

#### Deprecated

Use assetLotData instead

***

### location

> **location**: [`CertificateLocation`](CertificateLocation.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:61](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L61)

***

### photoEvidence?

> `optional` **photoEvidence**: [`PhotoEvidenceRef`](PhotoEvidenceRef.md)[]

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L71)

***

### photoHash?

> `optional` **photoHash**: `string`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L70)

***

### resourceContext?

> `optional` **resourceContext**: [`ResourceContext`](ResourceContext.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:77](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L77)

Primary: commodity-agnostic resource context

***

### settlementData?

> `optional` **settlementData**: [`SettlementRecord`](SettlementRecord.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L75)

***

### templateId

> **templateId**: `string`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:60](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L60)

***

### userRole

> **userRole**: `string`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:62](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L62)

***

### validationMetrics?

> `optional` **validationMetrics**: [`ValidationMetrics`](ValidationMetrics.md)

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L81)

***

### workflowContext?

> `optional` **workflowContext**: `string`

Defined in: [03-platform/packages/verification/src/certificates/generator.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/generator.ts#L72)
