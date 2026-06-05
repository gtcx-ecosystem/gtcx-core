[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / IAIProvider

# Interface: IAIProvider

Defined in: [03-platform/packages/domain/src/ai-integration.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L121)

Interface for AI analysis providers
Implement this to integrate with your AI backend

## Methods

### analyzeCompliance()

> **analyzeCompliance**(`records`, `context?`): `Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `recommendations`: `string`[]; `riskAreas`: `string`[]; `trendDirection`: `"improving"` \| `"declining"` \| `"stable"`; \}\>\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:153](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L153)

Analyze compliance patterns

#### Parameters

##### records

[`ComplianceRecord`](../../interfaces/ComplianceRecord.md)[]

##### context?

[`AIAnalysisContext`](AIAnalysisContext.md)

#### Returns

`Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `recommendations`: `string`[]; `riskAreas`: `string`[]; `trendDirection`: `"improving"` \| `"declining"` \| `"stable"`; \}\>\>

***

### analyzeRegistration()

> **analyzeRegistration**(`assetLot`, `context?`): `Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `priceEstimate`: \{ `expected`: `number`; `max`: `number`; `min`: `number`; \}; `qualityAssessment`: `"low"` \| `"medium"` \| `"high"`; `riskFactors`: `string`[]; \}\>\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:125](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L125)

Analyze registration data for anomalies

#### Parameters

##### assetLot

[`AssetLot`](../../interfaces/AssetLot.md)

##### context?

[`AIAnalysisContext`](AIAnalysisContext.md)

#### Returns

`Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `priceEstimate`: \{ `expected`: `number`; `max`: `number`; `min`: `number`; \}; `qualityAssessment`: `"low"` \| `"medium"` \| `"high"`; `riskFactors`: `string`[]; \}\>\>

***

### analyzeTrade()

> **analyzeTrade**(`opportunity`, `context?`): `Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `fairPriceRange`: \{ `max`: `number`; `min`: `number`; \}; `recommendation`: `"buy"` \| `"sell"` \| `"hold"` \| `"avoid"`; `riskLevel`: `"low"` \| `"medium"` \| `"high"`; \}\>\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:139](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L139)

Analyze trading opportunity

#### Parameters

##### opportunity

[`TradingOpportunity`](../../interfaces/TradingOpportunity.md)

##### context?

[`AIAnalysisContext`](AIAnalysisContext.md)

#### Returns

`Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `fairPriceRange`: \{ `max`: `number`; `min`: `number`; \}; `recommendation`: `"buy"` \| `"sell"` \| `"hold"` \| `"avoid"`; `riskLevel`: `"low"` \| `"medium"` \| `"high"`; \}\>\>

***

### detectFraud()

> **detectFraud**(`transactions`, `context?`): `Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `patterns`: `string`[]; `riskScore`: `number`; `suspiciousTransactions`: `string`[]; \}\>\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:167](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L167)

Detect fraud patterns

#### Parameters

##### transactions

[`Transaction`](../../interfaces/Transaction.md)[]

##### context?

[`AIAnalysisContext`](AIAnalysisContext.md)

#### Returns

`Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `patterns`: `string`[]; `riskScore`: `number`; `suspiciousTransactions`: `string`[]; \}\>\>

***

### generateInsights()

> **generateInsights**(`operations`, `context?`): `Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `alertConditions`: `string`[]; `optimizationSuggestions`: `string`[]; `performanceInsights`: `string`[]; \}\>\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:181](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L181)

Generate insights from operations

#### Parameters

##### operations

[`OperationLogEntry`](../../ai-logging/interfaces/OperationLogEntry.md)[]

##### context?

[`AIAnalysisContext`](AIAnalysisContext.md)

#### Returns

`Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<\{ `alertConditions`: `string`[]; `optimizationSuggestions`: `string`[]; `performanceInsights`: `string`[]; \}\>\>
