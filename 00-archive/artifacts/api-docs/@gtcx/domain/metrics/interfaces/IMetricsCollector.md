[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [metrics](../README.md) / IMetricsCollector

# Interface: IMetricsCollector

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:89](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L89)

## Methods

### gauge()

> **gauge**(`name`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:94](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L94)

Set a gauge value

#### Parameters

##### name

`string`

##### value

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### getMetrics()

> **getMetrics**(): [`Metric`](Metric.md)[]

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:103](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L103)

Get all metrics

#### Returns

[`Metric`](Metric.md)[]

***

### histogram()

> **histogram**(`name`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L97)

Record a histogram observation

#### Parameters

##### name

`string`

##### value

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### increment()

> **increment**(`name`, `labels?`, `value?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:91](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L91)

Increment a counter

#### Parameters

##### name

`string`

##### labels?

`Record`\<`string`, `string`\>

##### value?

`number`

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:109](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L109)

Reset all metrics

#### Returns

`void`

***

### summary()

> **summary**(`name`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L100)

Record a summary observation

#### Parameters

##### name

`string`

##### value

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### toPrometheus()

> **toPrometheus**(): `string`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:106](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L106)

Get metrics in Prometheus format

#### Returns

`string`
