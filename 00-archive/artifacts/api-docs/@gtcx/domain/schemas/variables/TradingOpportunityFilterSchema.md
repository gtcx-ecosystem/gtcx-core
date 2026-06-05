[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [schemas](../README.md) / TradingOpportunityFilterSchema

# Variable: TradingOpportunityFilterSchema

> `const` **TradingOpportunityFilterSchema**: `ZodObject`\<\{ `commodityType`: `ZodOptional`\<`ZodString`\>; `forms`: `ZodOptional`\<`ZodArray`\<`ZodString`, `"many"`\>\>; `location`: `ZodOptional`\<`ZodObject`\<\{ `latitude`: `ZodNumber`; `longitude`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `latitude`: `number`; `longitude`: `number`; \}, \{ `latitude`: `number`; `longitude`: `number`; \}\>\>; `maxPrice`: `ZodOptional`\<`ZodNumber`\>; `maxPurity`: `ZodOptional`\<`ZodNumber`\>; `maxWeight`: `ZodOptional`\<`ZodNumber`\>; `minPrice`: `ZodOptional`\<`ZodNumber`\>; `minPurity`: `ZodOptional`\<`ZodNumber`\>; `minWeight`: `ZodOptional`\<`ZodNumber`\>; `radiusKm`: `ZodOptional`\<`ZodNumber`\>; \}, `"strip"`, `ZodTypeAny`, \{ `commodityType?`: `string`; `forms?`: `string`[]; `location?`: \{ `latitude`: `number`; `longitude`: `number`; \}; `maxPrice?`: `number`; `maxPurity?`: `number`; `maxWeight?`: `number`; `minPrice?`: `number`; `minPurity?`: `number`; `minWeight?`: `number`; `radiusKm?`: `number`; \}, \{ `commodityType?`: `string`; `forms?`: `string`[]; `location?`: \{ `latitude`: `number`; `longitude`: `number`; \}; `maxPrice?`: `number`; `maxPurity?`: `number`; `maxWeight?`: `number`; `minPrice?`: `number`; `minPurity?`: `number`; `minWeight?`: `number`; `radiusKm?`: `number`; \}\>

Defined in: [03-platform/packages/domain/03-platform/src/schemas.ts:175](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/schemas.ts#L175)
