[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/services](../../README.md) / [trading](../README.md) / TradingService

# Class: TradingService

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L71)

## Constructors

### Constructor

> **new TradingService**(`dependencies`, `config?`): `TradingService`

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:84](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L84)

#### Parameters

##### dependencies

###### complianceService

`IComplianceService`

###### cryptoService

`ICryptoService`

###### eventEmitter?

[`IDomainEventEmitter`](../../../domain/interfaces/IDomainEventEmitter.md)

###### metricsCollector?

[`IMetricsCollector`](../../../domain/metrics/interfaces/IMetricsCollector.md)

###### operationLogger?

[`IOperationLogger`](../../../domain/ai-logging/interfaces/IOperationLogger.md)

###### priceService

`IPriceService`

###### storageService

`IStorageService`

###### traderRepository?

[`ITraderRepository`](../../interfaces/ITraderRepository.md)

###### transactionRepository?

[`ITransactionRepository`](../../interfaces/ITransactionRepository.md)

##### config?

`Partial`\<[`TradingConfig`](../../interfaces/TradingConfig.md)\> = `{}`

#### Returns

`TradingService`

## Methods

### calculateFairPrice()

> **calculateFairPrice**(`assetLot`): `Promise`\<\{ `adjustedPrice`: `number`; `basePrice`: `number`; `breakdown`: \{ `formAdjustment`: `number`; `locationFactor`: `number`; `purityAdjustment`: `number`; `qualityPremium`: `number`; `total`: `number`; \}; `currency`: `string`; \}\>

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:164](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L164)

#### Parameters

##### assetLot

`AssetLot`

#### Returns

`Promise`\<\{ `adjustedPrice`: `number`; `basePrice`: `number`; `breakdown`: \{ `formAdjustment`: `number`; `locationFactor`: `number`; `purityAdjustment`: `number`; `qualityPremium`: `number`; `total`: `number`; \}; `currency`: `string`; \}\>

***

### executeTrade()

> **executeTrade**(`request`): `Promise`\<`Transaction`\>

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:299](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L299)

#### Parameters

##### request

`unknown`

#### Returns

`Promise`\<`Transaction`\>

***

### findTradingOpportunities()

> **findTradingOpportunities**(`filters`): `Promise`\<`TradingOpportunity`[]\>

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:226](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L226)

#### Parameters

##### filters

`unknown`

#### Returns

`Promise`\<`TradingOpportunity`[]\>

***

### getCurrentMarketPrices()

> **getCurrentMarketPrices**(`commodityType`, `forms?`): `Promise`\<`MarketPrice`[]\>

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:124](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L124)

#### Parameters

##### commodityType

`string`

##### forms?

`string`[]

#### Returns

`Promise`\<`MarketPrice`[]\>

***

### getTradeAnalytics()

> **getTradeAnalytics**(`commodityType`, `period?`): `Promise`\<`TradeAnalytics`\>

Defined in: [03-platform/packages/services/03-platform/src/trading.ts:379](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading.ts#L379)

#### Parameters

##### commodityType

`string`

##### period?

`"24h"` | `"7d"` | `"30d"` | `"90d"`

#### Returns

`Promise`\<`TradeAnalytics`\>
