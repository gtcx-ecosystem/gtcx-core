[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / IComplianceService

# Interface: IComplianceService

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:462](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L462)

Compliance service interface

## Methods

### checkCompliance()

> **checkCompliance**(`entityId`, `entityType`): `Promise`\<[`ComplianceRecord`](ComplianceRecord.md)[]\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:464](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L464)

#### Parameters

##### entityId

`string`

##### entityType

`string`

#### Returns

`Promise`\<[`ComplianceRecord`](ComplianceRecord.md)[]\>

***

### validateLicenses()

> **validateLicenses**(`traderId`): `Promise`\<`boolean`\>

Defined in: [03-platform/packages/domain/03-platform/src/types.ts:463](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/types.ts#L463)

#### Parameters

##### traderId

`string`

#### Returns

`Promise`\<`boolean`\>
