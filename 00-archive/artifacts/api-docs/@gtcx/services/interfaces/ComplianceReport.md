[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / ComplianceReport

# Interface: ComplianceReport

Defined in: [03-platform/packages/services/src/compliance/types.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/compliance/types.ts#L69)

## Properties

### metadata

> **metadata**: `object`

Defined in: [03-platform/packages/services/src/compliance/types.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/compliance/types.ts#L76)

#### complianceScore

> **complianceScore**: `number`

#### criticalIssues

> **criticalIssues**: `number`

#### generatedAt

> **generatedAt**: `string`

#### recordCount

> **recordCount**: `number`

***

### report

> **report**: `object`

Defined in: [03-platform/packages/services/src/compliance/types.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/compliance/types.ts#L70)

#### actionItems

> **actionItems**: `unknown`[]

#### breakdown

> **breakdown**: `Record`\<`string`, `unknown`\>

#### recommendations

> **recommendations**: `string`[]

#### summary

> **summary**: [`ComplianceReportSummary`](ComplianceReportSummary.md)
