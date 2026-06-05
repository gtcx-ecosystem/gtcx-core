[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [metrics](../README.md) / InMemoryMetricsCollector

# Class: InMemoryMetricsCollector

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:116](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L116)

## Implements

- [`IMetricsCollector`](../interfaces/IMetricsCollector.md)

## Constructors

### Constructor

> **new InMemoryMetricsCollector**(`options?`): `InMemoryMetricsCollector`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:134](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L134)

#### Parameters

##### options?

###### maxObservations?

`number`

#### Returns

`InMemoryMetricsCollector`

## Methods

### gauge()

> **gauge**(`name`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:147](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L147)

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

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`gauge`](../interfaces/IMetricsCollector.md#gauge)

***

### getCounter()

> **getCounter**(`name`, `labels?`): `number`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:303](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L303)

Get counter value

#### Parameters

##### name

`string`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`number`

***

### getGauge()

> **getGauge**(`name`, `labels?`): `number` \| `undefined`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:309](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L309)

Get gauge value

#### Parameters

##### name

`string`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`number` \| `undefined`

***

### getHistogramStats()

> **getHistogramStats**(`name`, `labels?`): \{ `avg`: `number`; `count`: `number`; `max`: `number`; `min`: `number`; `p50`: `number`; `p95`: `number`; `p99`: `number`; `sum`: `number`; \} \| `undefined`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:315](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L315)

Get histogram statistics

#### Parameters

##### name

`string`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

\{ `avg`: `number`; `count`: `number`; `max`: `number`; `min`: `number`; `p50`: `number`; `p95`: `number`; `p99`: `number`; `sum`: `number`; \} \| `undefined`

***

### getMetrics()

> **getMetrics**(): [`Metric`](../interfaces/Metric.md)[]

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:178](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L178)

Get all metrics

#### Returns

[`Metric`](../interfaces/Metric.md)[]

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`getMetrics`](../interfaces/IMetricsCollector.md#getmetrics)

***

### histogram()

> **histogram**(`name`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:152](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L152)

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

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`histogram`](../interfaces/IMetricsCollector.md#histogram)

***

### increment()

> **increment**(`name`, `labels?`, `value?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:138](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L138)

Increment a counter

#### Parameters

##### name

`string`

##### labels?

`Record`\<`string`, `string`\>

##### value?

`number` = `1`

#### Returns

`void`

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`increment`](../interfaces/IMetricsCollector.md#increment)

***

### recordDuration()

> **recordDuration**(`name`, `startTime`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:297](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L297)

Record operation duration

#### Parameters

##### name

`string`

##### startTime

`number`

##### labels?

`Record`\<`string`, `string`\>

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:285](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L285)

Reset all metrics

#### Returns

`void`

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`reset`](../interfaces/IMetricsCollector.md#reset)

***

### summary()

> **summary**(`name`, `value`, `labels?`): `void`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:165](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L165)

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

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`summary`](../interfaces/IMetricsCollector.md#summary)

***

### toPrometheus()

> **toPrometheus**(): `string`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:245](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L245)

Get metrics in Prometheus format

#### Returns

`string`

#### Implementation of

[`IMetricsCollector`](../interfaces/IMetricsCollector.md).[`toPrometheus`](../interfaces/IMetricsCollector.md#toprometheus)
