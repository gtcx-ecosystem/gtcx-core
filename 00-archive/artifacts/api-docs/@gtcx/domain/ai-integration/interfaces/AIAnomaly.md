[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / AIAnomaly

# Interface: AIAnomaly

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L98)

AI-detected anomaly

## Properties

### confidence

> **confidence**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:110](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L110)

Confidence score

***

### description

> **description**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:106](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L106)

Description

***

### evidence

> **evidence**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:108](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L108)

Evidence

***

### id

> **id**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L100)

Anomaly identifier

***

### severity

> **severity**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:104](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L104)

Severity (1-10)

***

### type

> **type**: `"compliance"` \| `"price"` \| `"location"` \| `"pattern"` \| `"fraud"` \| `"quality"`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:102](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L102)

Anomaly type
