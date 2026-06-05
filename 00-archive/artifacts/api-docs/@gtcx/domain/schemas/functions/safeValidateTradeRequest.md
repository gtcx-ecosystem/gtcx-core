[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / safeValidateTradeRequest

# Function: safeValidateTradeRequest()

> **safeValidateTradeRequest**(`data`): `SafeParseReturnType`\<\{ `agreedPrice`: `number`; `assetLotId`: `string`; `buyerId`: `string`; `currency`: `string`; `location?`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `notes?`: `string`; `paymentMethod`: `"cash"` \| `"mobile_money"` \| `"bank_transfer"` \| `"escrow"` \| `"letter_of_credit"`; `quantity`: `number`; `requestId?`: `string`; `sellerId`: `string`; `timestamp?`: `number`; \}, \{ `agreedPrice`: `number`; `assetLotId`: `string`; `buyerId`: `string`; `currency`: `string`; `location?`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `notes?`: `string`; `paymentMethod`: `"cash"` \| `"mobile_money"` \| `"bank_transfer"` \| `"escrow"` \| `"letter_of_credit"`; `quantity`: `number`; `requestId?`: `string`; `sellerId`: `string`; `timestamp?`: `number`; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:322](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L322)

## Parameters

### data

`unknown`

## Returns

`SafeParseReturnType`\<\{ `agreedPrice`: `number`; `assetLotId`: `string`; `buyerId`: `string`; `currency`: `string`; `location?`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `notes?`: `string`; `paymentMethod`: `"cash"` \| `"mobile_money"` \| `"bank_transfer"` \| `"escrow"` \| `"letter_of_credit"`; `quantity`: `number`; `requestId?`: `string`; `sellerId`: `string`; `timestamp?`: `number`; \}, \{ `agreedPrice`: `number`; `assetLotId`: `string`; `buyerId`: `string`; `currency`: `string`; `location?`: \{ `accuracy`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; `source?`: `"gps"` \| `"network"` \| `"manual"`; `timestamp`: `number`; \}; `notes?`: `string`; `paymentMethod`: `"cash"` \| `"mobile_money"` \| `"bank_transfer"` \| `"escrow"` \| `"letter_of_credit"`; `quantity`: `number`; `requestId?`: `string`; `sellerId`: `string`; `timestamp?`: `number`; \}\>
