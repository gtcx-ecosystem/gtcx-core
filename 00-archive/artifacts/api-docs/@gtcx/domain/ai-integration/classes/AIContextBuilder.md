[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / AIContextBuilder

# Class: AIContextBuilder

Defined in: [03-platform/packages/domain/src/ai-integration.ts:340](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L340)

Helper to build AI analysis context

## Constructors

### Constructor

> **new AIContextBuilder**(): `AIContextBuilder`

#### Returns

`AIContextBuilder`

## Methods

### build()

> **build**(): [`AIAnalysisContext`](../interfaces/AIAnalysisContext.md)

Defined in: [03-platform/packages/domain/src/ai-integration.ts:384](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L384)

#### Returns

[`AIAnalysisContext`](../interfaces/AIAnalysisContext.md)

***

### operation()

> **operation**(`op`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:343](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L343)

#### Parameters

##### op

`string`

#### Returns

`this`

***

### withAssetLots()

> **withAssetLots**(`lots`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:348](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L348)

#### Parameters

##### lots

[`AssetLot`](../../interfaces/AssetLot.md)[]

#### Returns

`this`

***

### withComplianceRecords()

> **withComplianceRecords**(`records`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:358](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L358)

#### Parameters

##### records

[`ComplianceRecord`](../../interfaces/ComplianceRecord.md)[]

#### Returns

`this`

***

### withHistory()

> **withHistory**(`events`, `operations`, `days?`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:373](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L373)

#### Parameters

##### events

[`DomainEvent`](../../interfaces/DomainEvent.md)\<`unknown`\>[]

##### operations

[`OperationLogEntry`](../../ai-logging/interfaces/OperationLogEntry.md)[]

##### days?

`number` = `7`

#### Returns

`this`

***

### withMarket()

> **withMarket**(`market`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:363](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L363)

#### Parameters

##### market

\{ `commodityType`: `string`; `currentPrice`: `number`; `priceHistory`: `object`[]; `volatility?`: `number`; \} | `undefined`

#### Returns

`this`

***

### withTransactions()

> **withTransactions**(`txs`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:353](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L353)

#### Parameters

##### txs

[`Transaction`](../../interfaces/Transaction.md)[]

#### Returns

`this`

***

### withUser()

> **withUser**(`user`): `this`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:368](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L368)

#### Parameters

##### user

\{ `id`: `string`; `preferences?`: `Record`\<`string`, `unknown`\>; `role`: `string`; \} | `undefined`

#### Returns

`this`
