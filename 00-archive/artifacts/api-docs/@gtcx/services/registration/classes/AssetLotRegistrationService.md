[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/services](../../README.md) / [registration](../README.md) / AssetLotRegistrationService

# Class: AssetLotRegistrationService

Defined in: [03-platform/packages/services/src/registration.ts:60](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration.ts#L60)

## Constructors

### Constructor

> **new AssetLotRegistrationService**(`dependencies`, `config?`): `AssetLotRegistrationService`

Defined in: [03-platform/packages/services/src/registration.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration.ts#L70)

#### Parameters

##### dependencies

###### cryptoService

`ICryptoService`

###### eventEmitter?

[`IDomainEventEmitter`](../../../domain/interfaces/IDomainEventEmitter.md)

###### locationService

`ILocationService`

###### metricsCollector?

[`IMetricsCollector`](../../../domain/metrics/interfaces/IMetricsCollector.md)

###### operationLogger?

[`IOperationLogger`](../../../domain/ai-logging/interfaces/IOperationLogger.md)

###### storageService

`IStorageService`

##### config?

`Partial`\<[`RegistrationConfig`](../../interfaces/RegistrationConfig.md)\> = `{}`

#### Returns

`AssetLotRegistrationService`

## Methods

### calculateProgress()

> **calculateProgress**(`data`): `RegistrationProgress`

Defined in: [03-platform/packages/services/src/registration.ts:194](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration.ts#L194)

Calculate registration progress

#### Parameters

##### data

`Partial`\<[`ValidatedRegistrationData`](../../../domain/schemas/type-aliases/ValidatedRegistrationData.md)\>

#### Returns

`RegistrationProgress`

***

### getWorkflowSteps()

> **getWorkflowSteps**(): `WorkflowStep`[]

Defined in: [03-platform/packages/services/src/registration.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration.ts#L121)

Get registration workflow steps
Override-able per commodity type

#### Returns

`WorkflowStep`[]

***

### registerAssetLot()

> **registerAssetLot**(`data`): `Promise`\<`AssetLot`\>

Defined in: [03-platform/packages/services/src/registration.ts:241](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration.ts#L241)

Register a new asset lot
Performs validation, generates cryptographic proof, and stores the lot

#### Parameters

##### data

`unknown`

#### Returns

`Promise`\<`AssetLot`\>

***

### validateRegistrationData()

> **validateRegistrationData**(`data`): `ValidationResult`

Defined in: [03-platform/packages/services/src/registration.ts:183](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/services/src/registration.ts#L183)

Validate registration data with Zod schema
Returns detailed validation errors for UI feedback

#### Parameters

##### data

`unknown`

#### Returns

`ValidationResult`
