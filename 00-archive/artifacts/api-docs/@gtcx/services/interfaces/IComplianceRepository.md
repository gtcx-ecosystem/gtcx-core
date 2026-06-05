[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / IComplianceRepository

# Interface: IComplianceRepository

Defined in: [03-platform/packages/services/src/repositories.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/repositories.ts#L28)

## Methods

### checkKYC()

> **checkKYC**(`transaction`): `Promise`\<[`ComplianceCheckResult`](ComplianceCheckResult.md)\>

Defined in: [03-platform/packages/services/src/repositories.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/repositories.ts#L32)

#### Parameters

##### transaction

`Transaction`

#### Returns

`Promise`\<[`ComplianceCheckResult`](ComplianceCheckResult.md)\>

***

### checkLicense()

> **checkLicense**(`id`, `type`): `Promise`\<[`ComplianceCheckResult`](ComplianceCheckResult.md)\>

Defined in: [03-platform/packages/services/src/repositories.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/repositories.ts#L30)

#### Parameters

##### id

`string`

##### type

`"trader"` | `"producer"`

#### Returns

`Promise`\<[`ComplianceCheckResult`](ComplianceCheckResult.md)\>

***

### checkLocation()

> **checkLocation**(`location`): `Promise`\<[`ComplianceCheckResult`](ComplianceCheckResult.md)\>

Defined in: [03-platform/packages/services/src/repositories.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/repositories.ts#L31)

#### Parameters

##### location

`Location`

#### Returns

`Promise`\<[`ComplianceCheckResult`](ComplianceCheckResult.md)\>

***

### getRecords()

> **getRecords**(`entityId?`, `entityType?`): `Promise`\<`ComplianceRecord`[]\>

Defined in: [03-platform/packages/services/src/repositories.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/repositories.ts#L29)

#### Parameters

##### entityId?

`string`

##### entityType?

`string`

#### Returns

`Promise`\<`ComplianceRecord`[]\>
