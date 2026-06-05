[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / AIAnalysisResult

# Interface: AIAnalysisResult\<T\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:60](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L60)

AI analysis result

## Type Parameters

### T

`T` = `unknown`

## Properties

### anomalies?

> `optional` **anomalies**: [`AIAnomaly`](AIAnomaly.md)[]

Defined in: [03-platform/packages/domain/src/ai-integration.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L72)

Anomalies detected

***

### confidence

> **confidence**: `number`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:64](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L64)

Confidence score (0-1)

***

### reasoning?

> `optional` **reasoning**: `string`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L68)

Reasoning/explanation

***

### result

> **result**: `T`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L66)

Analysis result

***

### suggestedActions?

> `optional` **suggestedActions**: [`AIAction`](AIAction.md)[]

Defined in: [03-platform/packages/domain/src/ai-integration.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L70)

Suggested actions

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L74)

Timestamp

***

### type

> **type**: `string`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:62](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L62)

Analysis type
