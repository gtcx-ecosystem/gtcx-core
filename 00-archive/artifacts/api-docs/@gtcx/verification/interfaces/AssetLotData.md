[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / AssetLotData

# Interface: AssetLotData

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:139](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L139)

Asset lot data - universal

## Properties

### attributes?

> `optional` **attributes**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:158](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L158)

***

### category?

> `optional` **category**: [`AssetCategory`](../type-aliases/AssetCategory.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:143](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L143)

***

### commoditySubtype?

> `optional` **commoditySubtype**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:142](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L142)

***

### commodityType

> **commodityType**: [`CommodityType`](../type-aliases/CommodityType.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:141](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L141)

***

### discoveryDate?

> `optional` **discoveryDate**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:154](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L154)

***

### estimatedWeight

> **estimatedWeight**: `number`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:144](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L144)

***

### lotId?

> `optional` **lotId**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:140](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L140)

***

### operatorRole?

> `optional` **operatorRole**: [`OperatorRole`](../type-aliases/OperatorRole.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:153](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L153)

***

### previousState?

> `optional` **previousState**: [`AssetLifecycleState`](../type-aliases/AssetLifecycleState.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:151](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L151)

Previous state (for transitions)

***

### producerId?

> `optional` **producerId**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:152](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L152)

***

### purity?

> `optional` **purity**: `number`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:147](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L147)

***

### quality?

> `optional` **quality**: [`QualityGrade`](../type-aliases/QualityGrade.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:146](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L146)

***

### site?

> `optional` **site**: [`SiteReference`](SiteReference.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:157](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L157)

Site reference with full details

***

### siteId?

> `optional` **siteId**: `string`

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:155](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L155)

***

### state?

> `optional` **state**: [`AssetLifecycleState`](../type-aliases/AssetLifecycleState.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:149](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L149)

Current lifecycle state

***

### unit

> **unit**: [`MeasurementUnit`](../type-aliases/MeasurementUnit.md)

Defined in: [03-platform/packages/verification/src/types/definitions/certificates.ts:145](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/types/definitions/certificates.ts#L145)
