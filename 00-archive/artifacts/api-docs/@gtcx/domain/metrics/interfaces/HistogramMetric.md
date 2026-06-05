[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [metrics](../README.md) / HistogramMetric

# Interface: HistogramMetric

Defined in: [03-platform/packages/domain/src/metrics.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L29)

## Extends

- [`Metric`](Metric.md)

## Properties

### buckets

> **buckets**: [`HistogramBucket`](HistogramBucket.md)[]

Defined in: [03-platform/packages/domain/src/metrics.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L31)

***

### count

> **count**: `number`

Defined in: [03-platform/packages/domain/src/metrics.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L33)

***

### help

> **help**: `string`

Defined in: [03-platform/packages/domain/src/metrics.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L18)

#### Inherited from

[`Metric`](Metric.md).[`help`](Metric.md#help)

***

### labels?

> `optional` **labels**: `Record`\<`string`, `string`\>

Defined in: [03-platform/packages/domain/src/metrics.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L19)

#### Inherited from

[`Metric`](Metric.md).[`labels`](Metric.md#labels)

***

### name

> **name**: `string`

Defined in: [03-platform/packages/domain/src/metrics.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L16)

#### Inherited from

[`Metric`](Metric.md).[`name`](Metric.md#name)

***

### sum

> **sum**: `number`

Defined in: [03-platform/packages/domain/src/metrics.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L32)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/domain/src/metrics.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L21)

#### Inherited from

[`Metric`](Metric.md).[`timestamp`](Metric.md#timestamp)

***

### type

> **type**: `"histogram"`

Defined in: [03-platform/packages/domain/src/metrics.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L30)

#### Overrides

[`Metric`](Metric.md).[`type`](Metric.md#type)

***

### value

> **value**: `number`

Defined in: [03-platform/packages/domain/src/metrics.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/metrics.ts#L20)

#### Inherited from

[`Metric`](Metric.md).[`value`](Metric.md#value)
