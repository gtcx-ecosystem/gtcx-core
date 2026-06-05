[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / CommonSchemas

# Variable: CommonSchemas

> `const` **CommonSchemas**: `object`

Defined in: [03-platform/packages/security/src/validation/schemas.ts:232](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/schemas.ts#L232)

Collection of common schemas for easy import

## Type Declaration

### boundingBox

> `readonly` **boundingBox**: `ZodEffects`\<`ZodTuple`\<\[`ZodNumber`, `ZodNumber`, `ZodNumber`, `ZodNumber`\], `null`\>, \[`number`, `number`, `number`, `number`\], \[`number`, `number`, `number`, `number`\]\> = `BoundingBoxSchema`

### commodityType

> `readonly` **commodityType**: `ZodEnum`\<\[`"gold"`, `"silver"`, `"platinum"`, `"palladium"`, `"rhodium"`, `"cocoa"`, `"coffee"`, `"cotton"`, `"sugar"`, `"vanilla"`, `"palm_oil"`, `"rubber"`, `"cobalt"`, `"lithium"`, `"copper"`, `"tin"`, `"tantalum"`, `"tungsten"`\]\> = `CommodityTypeSchema`

### complianceScore

> `readonly` **complianceScore**: `ZodNumber` = `ComplianceScoreSchema`

### coordinates

> `readonly` **coordinates**: `ZodObject`\<\{ `accuracy`: `ZodOptional`\<`ZodNumber`\>; `altitude`: `ZodOptional`\<`ZodNumber`\>; `latitude`: `ZodNumber`; `longitude`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `accuracy?`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; \}, \{ `accuracy?`: `number`; `altitude?`: `number`; `latitude`: `number`; `longitude`: `number`; \}\> = `CoordinatesSchema`

### datetime

> `readonly` **datetime**: `ZodString` = `DateTimeSchema`

### did

> `readonly` **did**: `ZodString` = `DidSchema`

### duration

> `readonly` **duration**: `ZodNumber` = `DurationSchema`

### email

> `readonly` **email**: `ZodString` = `EmailSchema`

### geoTagId

> `readonly` **geoTagId**: `ZodString` = `GeoTagIdSchema`

### hash256

> `readonly` **hash256**: `ZodString` = `Hash256Schema`

### hexString

> `readonly` **hexString**: `ZodString` = `HexStringSchema`

### phone

> `readonly` **phone**: `ZodString` = `PhoneSchema`

### priceData

> `readonly` **priceData**: `ZodObject`\<\{ `commodity`: `ZodEnum`\<\[`"gold"`, `"silver"`, `"platinum"`, `"palladium"`, `"rhodium"`, `"cocoa"`, `"coffee"`, `"cotton"`, `"sugar"`, `"vanilla"`, `"palm_oil"`, `"rubber"`, `"cobalt"`, `"lithium"`, `"copper"`, `"tin"`, `"tantalum"`, `"tungsten"`\]\>; `confidence`: `ZodNumber`; `currency`: `ZodString`; `price`: `ZodNumber`; `source`: `ZodString`; `timestamp`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `commodity`: `"gold"` \| `"silver"` \| `"platinum"` \| `"palladium"` \| `"rhodium"` \| `"cocoa"` \| `"coffee"` \| `"cotton"` \| `"sugar"` \| `"vanilla"` \| `"palm_oil"` \| `"rubber"` \| `"cobalt"` \| `"lithium"` \| `"copper"` \| `"tin"` \| `"tantalum"` \| `"tungsten"` \| `"diamond"` \| `"ruby"` \| `"emerald"` \| `"sapphire"` \| `"crude_oil"` \| `"natural_gas"` \| `"lng"` \| `"other"`; `confidence`: `number`; `currency`: `string`; `price`: `number`; `source`: `string`; `timestamp`: `string`; \}, \{ `commodity`: `"gold"` \| `"silver"` \| `"platinum"` \| `"palladium"` \| `"rhodium"` \| `"cocoa"` \| `"coffee"` \| `"cotton"` \| `"sugar"` \| `"vanilla"` \| `"palm_oil"` \| `"rubber"` \| `"cobalt"` \| `"lithium"` \| `"copper"` \| `"tin"` \| `"tantalum"` \| `"tungsten"` \| `"diamond"` \| `"ruby"` \| `"emerald"` \| `"sapphire"` \| `"crude_oil"` \| `"natural_gas"` \| `"lng"` \| `"other"`; `confidence`: `number`; `currency`: `string`; `price`: `number`; `source`: `string`; `timestamp`: `string`; \}\> = `PriceDataSchema`

### publicKey

> `readonly` **publicKey**: `ZodString` = `PublicKeySchema`

### purity

> `readonly` **purity**: `ZodNumber` = `PuritySchema`

### signature

> `readonly` **signature**: `ZodString` = `SignatureSchema`

### timestamp

> `readonly` **timestamp**: `ZodNumber` = `TimestampSchema`

### tradePassId

> `readonly` **tradePassId**: `ZodString` = `TradePassIdSchema`

### url

> `readonly` **url**: `ZodEffects`\<`ZodString`, `string`, `string`\> = `UrlSchema`

### uuid

> `readonly` **uuid**: `ZodString` = `UuidSchema`

### weight

> `readonly` **weight**: `ZodObject`\<\{ `unit`: `ZodEnum`\<\[`"g"`, `"kg"`, `"oz"`, `"lb"`, `"ct"`\]\>; `value`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `unit`: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ct"`; `value`: `number`; \}, \{ `unit`: `"g"` \| `"kg"` \| `"oz"` \| `"lb"` \| `"ct"`; `value`: `number`; \}\> = `WeightSchema`
