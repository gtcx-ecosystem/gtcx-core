[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / TradingConfig

# Interface: TradingConfig

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:5](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L5)

Trading service configuration.

## Properties

### allowedPaymentMethods?

> `optional` **allowedPaymentMethods**: `string`[]

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L17)

Allowed payment methods

***

### defaultCurrency

> **defaultCurrency**: `string`

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:7](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L7)

Default currency for trades

***

### defaultSpread

> **defaultSpread**: `number`

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:9](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L9)

Default price spread percentage

***

### highValueThreshold

> **highValueThreshold**: `number`

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:13](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L13)

High value transaction threshold (requires enhanced KYC)

***

### marketSources?

> `optional` **marketSources**: `string`[]

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L19)

Market data sources

***

### maxTransactionValue?

> `optional` **maxTransactionValue**: `number`

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:15](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L15)

Maximum transaction value allowed

***

### sellerMarkup

> **sellerMarkup**: `number`

Defined in: [03-platform/packages/services/03-platform/src/trading/config.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/trading/config.ts#L11)

Default seller markup percentage
