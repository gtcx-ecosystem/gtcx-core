[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / CommodityCertificateConfig

# Interface: CommodityCertificateConfig

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:302](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L302)

Configuration overlay for commodity-specific certificate behavior

## Properties

### additionalRequiredFields?

> `optional` **additionalRequiredFields**: `string`[]

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:322](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L322)

Custom required fields beyond template defaults

***

### additionalValidation?

> `optional` **additionalValidation**: `object`[]

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:312](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L312)

Additional validation rules specific to this commodity

#### field

> **field**: `string`

#### max?

> `optional` **max**: `number`

#### message

> **message**: `string`

#### min?

> `optional` **min**: `number`

#### value?

> `optional` **value**: `string` \| `number` \| `boolean`

***

### commodityType

> **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:306](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L306)

Commodity type

***

### defaultUnit

> **defaultUnit**: [`MeasurementUnit`](../type-aliases/MeasurementUnit.md)

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:308](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L308)

Default measurement unit

***

### displayName

> **displayName**: `string`

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:310](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L310)

Display name for UI

***

### templateId

> **templateId**: `string`

Defined in: [03-platform/packages/verification/src/certificates/templates.ts:304](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/certificates/templates.ts#L304)

Which template to use
