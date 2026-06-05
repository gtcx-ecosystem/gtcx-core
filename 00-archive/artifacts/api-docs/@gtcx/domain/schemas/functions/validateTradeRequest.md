[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / validateTradeRequest

# Function: validateTradeRequest()

> **validateTradeRequest**(`data`): `object`

Defined in: [03-platform/packages/domain/src/schemas.ts:303](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/schemas.ts#L303)

## Parameters

### data

`unknown`

## Returns

`object`

### agreedPrice

> **agreedPrice**: `number` = `PositiveNumberSchema`

### assetLotId

> **assetLotId**: `string` = `UuidSchema`

### buyerId

> **buyerId**: `string` = `TraderIdSchema`

### currency

> **currency**: `string` = `CurrencyCodeSchema`

### location?

> `optional` **location**: `object`

#### location.accuracy

> **accuracy**: `number`

#### location.altitude?

> `optional` **altitude**: `number`

#### location.latitude

> **latitude**: `number`

#### location.longitude

> **longitude**: `number`

#### location.source?

> `optional` **source**: `"gps"` \| `"network"` \| `"manual"`

#### location.timestamp

> **timestamp**: `number`

### notes?

> `optional` **notes**: `string`

### paymentMethod

> **paymentMethod**: `"cash"` \| `"mobile_money"` \| `"bank_transfer"` \| `"escrow"` \| `"letter_of_credit"` = `PaymentMethodSchema`

### quantity

> **quantity**: `number` = `PositiveNumberSchema`

### requestId?

> `optional` **requestId**: `string`

### sellerId

> **sellerId**: `string` = `TraderIdSchema`

### timestamp?

> `optional` **timestamp**: `number`
