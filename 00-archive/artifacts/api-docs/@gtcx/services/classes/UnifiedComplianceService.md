[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/services](../README.md) / [](../README.md) / UnifiedComplianceService

# Class: UnifiedComplianceService

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L46)

## Constructors

### Constructor

> **new UnifiedComplianceService**(`dependencies`, `config?`): `UnifiedComplianceService`

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L59)

#### Parameters

##### dependencies

###### complianceRepository?

`IComplianceRepository`

###### cryptoService

`ICryptoService`

###### eventEmitter?

`IDomainEventEmitter`

###### metricsCollector?

`IMetricsCollector`

###### operationLogger?

`IOperationLogger`

###### storageService

`IStorageService`

###### zkpVerifier?

`ZkVerifier`

##### config?

`Partial`\<[`ComplianceConfig`](../interfaces/ComplianceConfig.md)\> = `{}`

#### Returns

`UnifiedComplianceService`

## Methods

### checkAssetLotCompliance()

> **checkAssetLotCompliance**(`assetLot`): `Promise`\<`ComplianceRecord`[]\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:141](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L141)

#### Parameters

##### assetLot

`AssetLot`

#### Returns

`Promise`\<`ComplianceRecord`[]\>

***

### checkCompliance()

> **checkCompliance**(`entityId`, `entityType`): `Promise`\<\{ `checked`: `boolean`; `records`: `ComplianceRecord`[]; \}\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:462](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L462)

#### Parameters

##### entityId

`string`

##### entityType

`"asset_lot"` | `"transaction"` | `"trader"` | `"producer"`

#### Returns

`Promise`\<\{ `checked`: `boolean`; `records`: `ComplianceRecord`[]; \}\>

***

### checkKYCCompliance()

> `protected` **checkKYCCompliance**(`transaction`): `Promise`\<[`ComplianceCheckResult`](../interfaces/ComplianceCheckResult.md)\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:484](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L484)

#### Parameters

##### transaction

`Transaction`

#### Returns

`Promise`\<[`ComplianceCheckResult`](../interfaces/ComplianceCheckResult.md)\>

***

### checkProducerLicense()

> `protected` **checkProducerLicense**(`producerId`): `Promise`\<[`ComplianceCheckResult`](../interfaces/ComplianceCheckResult.md)\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:477](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L477)

#### Parameters

##### producerId

`string`

#### Returns

`Promise`\<[`ComplianceCheckResult`](../interfaces/ComplianceCheckResult.md)\>

***

### checkTraderLicense()

> `protected` **checkTraderLicense**(`traderId`): `Promise`\<[`ComplianceCheckResult`](../interfaces/ComplianceCheckResult.md)\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:481](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L481)

#### Parameters

##### traderId

`string`

#### Returns

`Promise`\<[`ComplianceCheckResult`](../interfaces/ComplianceCheckResult.md)\>

***

### checkTransactionCompliance()

> **checkTransactionCompliance**(`transaction`): `Promise`\<`ComplianceRecord`[]\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:287](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L287)

#### Parameters

##### transaction

`Transaction`

#### Returns

`Promise`\<`ComplianceRecord`[]\>

***

### generateComplianceReport()

> **generateComplianceReport**(`options`): `Promise`\<[`ComplianceReport`](../interfaces/ComplianceReport.md)\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:402](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L402)

#### Parameters

##### options

`unknown`

#### Returns

`Promise`\<[`ComplianceReport`](../interfaces/ComplianceReport.md)\>

***

### getComplianceDashboard()

> **getComplianceDashboard**(): `Promise`\<`ComplianceDashboard`\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:126](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L126)

#### Returns

`Promise`\<`ComplianceDashboard`\>

***

### getFrameworks()

> **getFrameworks**(): `RegulatoryFramework`[]

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:112](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L112)

#### Returns

`RegulatoryFramework`[]

***

### getFrameworksByJurisdiction()

> **getFrameworksByJurisdiction**(`jurisdiction`): `RegulatoryFramework`[]

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:116](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L116)

#### Parameters

##### jurisdiction

`string`

#### Returns

`RegulatoryFramework`[]

***

### registerFramework()

> **registerFramework**(`framework`): `void`

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L97)

#### Parameters

##### framework

`RegulatoryFramework`

#### Returns

`void`

***

### validateLicenses()

> **validateLicenses**(`traderId`): `Promise`\<`boolean`\>

Defined in: [03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts:457](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/03-platform/src/compliance/UnifiedComplianceService.ts#L457)

#### Parameters

##### traderId

`string`

#### Returns

`Promise`\<`boolean`\>
