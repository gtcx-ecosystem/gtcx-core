[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / AIServiceHooks

# Interface: AIServiceHooks

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:283](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L283)

AI hooks that can be injected into services

## Properties

### onAfterRegistration()?

> `optional` **onAfterRegistration**: (`assetLot`) => `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:292](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L292)

Called after registration

#### Parameters

##### assetLot

[`AssetLot`](../../interfaces/AssetLot.md)

#### Returns

`Promise`\<`void`\>

***

### onAfterTrade()?

> `optional` **onAfterTrade**: (`transaction`) => `Promise`\<`void`\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:302](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L302)

Called after trade execution

#### Parameters

##### transaction

[`Transaction`](../../interfaces/Transaction.md)

#### Returns

`Promise`\<`void`\>

***

### onAnalysisCycle()?

> `optional` **onAnalysisCycle**: () => `Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<`unknown`\>[]\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:311](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L311)

Called periodically for pattern analysis

#### Returns

`Promise`\<[`AIAnalysisResult`](AIAnalysisResult.md)\<`unknown`\>[]\>

***

### onBeforeRegistration()?

> `optional` **onBeforeRegistration**: (`data`) => `Promise`\<\{ `modifications?`: `Record`\<`string`, `unknown`\>; `proceed`: `boolean`; `warnings?`: `string`[]; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:285](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L285)

Called before registration

#### Parameters

##### data

`unknown`

#### Returns

`Promise`\<\{ `modifications?`: `Record`\<`string`, `unknown`\>; `proceed`: `boolean`; `warnings?`: `string`[]; \}\>

***

### onBeforeTrade()?

> `optional` **onBeforeTrade**: (`request`) => `Promise`\<\{ `proceed`: `boolean`; `riskLevel?`: `"low"` \| `"medium"` \| `"high"`; `warnings?`: `string`[]; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:295](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L295)

Called before trade execution

#### Parameters

##### request

`unknown`

#### Returns

`Promise`\<\{ `proceed`: `boolean`; `riskLevel?`: `"low"` \| `"medium"` \| `"high"`; `warnings?`: `string`[]; \}\>

***

### onComplianceViolation()?

> `optional` **onComplianceViolation**: (`record`) => `Promise`\<\{ `alertRecipients?`: `string`[]; `escalate`: `boolean`; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:305](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L305)

Called when compliance violation detected

#### Parameters

##### record

[`ComplianceRecord`](../../interfaces/ComplianceRecord.md)

#### Returns

`Promise`\<\{ `alertRecipients?`: `string`[]; `escalate`: `boolean`; \}\>
