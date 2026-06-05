[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [metrics](../README.md) / ServiceMetrics

# Class: ServiceMetrics

Defined in: [03-platform/packages/domain/src/metrics.ts:407](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L407)

## Constructors

### Constructor

> **new ServiceMetrics**(`collector`, `prefix`): `ServiceMetrics`

Defined in: [03-platform/packages/domain/src/metrics.ts:411](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L411)

#### Parameters

##### collector

[`IMetricsCollector`](../interfaces/IMetricsCollector.md)

##### prefix

`string`

#### Returns

`ServiceMetrics`

## Methods

### failure()

> **failure**(`operation`, `duration`, `errorCode`, `labels?`): `void`

Defined in: [03-platform/packages/domain/src/metrics.ts:423](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L423)

Record failed operation

#### Parameters

##### operation

`string`

##### duration

`number`

##### errorCode

`string`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### recordValue()

> **recordValue**(`metric`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/src/metrics.ts:438](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L438)

Record a value (e.g., trade volume)

#### Parameters

##### metric

`string`

##### value

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### setGauge()

> **setGauge**(`metric`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/src/metrics.ts:443](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L443)

Set a gauge (e.g., queue size)

#### Parameters

##### metric

`string`

##### value

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### startTimer()

> **startTimer**(): () => `number`

Defined in: [03-platform/packages/domain/src/metrics.ts:448](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L448)

Create a timer for measuring duration

#### Returns

> (): `number`

##### Returns

`number`

***

### success()

> **success**(`operation`, `duration`, `labels?`): `void`

Defined in: [03-platform/packages/domain/src/metrics.ts:417](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L417)

Record successful operation

#### Parameters

##### operation

`string`

##### duration

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`
