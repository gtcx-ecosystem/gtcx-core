[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / migrateGoldLotData

# ~~Variable: migrateGoldLotData()~~

> `const` **migrateGoldLotData**: (`legacyData`, `commodityType`) => [`AssetLotData`](../interfaces/AssetLotData.md) = `migrateLegacyLotData`

Defined in: [03-platform/packages/verification/src/types/definitions/commodities.ts:379](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/commodities.ts#L379)

Convert legacy lot data format to universal AssetLotData

## Parameters

### legacyData

[`GoldLotData`](../interfaces/GoldLotData.md)

### commodityType?

[`CommodityType`](../type-aliases/CommodityType.md) = `'gold'`

## Returns

[`AssetLotData`](../interfaces/AssetLotData.md)

## Deprecated

The GoldLotData type itself is deprecated - use AssetLotData directly

## Deprecated

Use migrateLegacyLotData instead
