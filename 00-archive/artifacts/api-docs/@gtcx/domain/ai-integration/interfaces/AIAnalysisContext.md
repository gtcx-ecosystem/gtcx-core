[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / AIAnalysisContext

# Interface: AIAnalysisContext

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L20)

Context provided to AI for analysis

## Properties

### entities

> **entities**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L24)

Relevant entities

#### assetLots?

> `optional` **assetLots**: [`AssetLot`](../../interfaces/AssetLot.md)[]

#### complianceRecords?

> `optional` **complianceRecords**: [`ComplianceRecord`](../../interfaces/ComplianceRecord.md)[]

#### opportunities?

> `optional` **opportunities**: [`TradingOpportunity`](../../interfaces/TradingOpportunity.md)[]

#### transactions?

> `optional` **transactions**: [`Transaction`](../../interfaces/Transaction.md)[]

***

### history?

> `optional` **history**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L31)

Historical data

#### events

> **events**: [`DomainEvent`](../../interfaces/DomainEvent.md)\<`unknown`\>[]

#### operations

> **operations**: [`OperationLogEntry`](../../ai-logging/interfaces/OperationLogEntry.md)[]

#### timeRange

> **timeRange**: `object`

##### timeRange.end

> **end**: `number`

##### timeRange.start

> **start**: `number`

***

### market?

> `optional` **market**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L39)

Market context

#### commodityType

> **commodityType**: `string`

#### currentPrice

> **currentPrice**: `number`

#### priceHistory

> **priceHistory**: `object`[]

#### volatility?

> `optional` **volatility**: `number`

***

### operation

> **operation**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L22)

Current operation being performed

***

### user?

> `optional` **user**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/ai-integration.ts:48](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-integration.ts#L48)

User context

#### id

> **id**: `string`

#### preferences?

> `optional` **preferences**: `Record`\<`string`, `unknown`\>

#### role

> **role**: `string`
