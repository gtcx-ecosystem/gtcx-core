[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [metrics](../README.md) / SummaryMetric

# Interface: SummaryMetric

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L41)

## Extends

- [`Metric`](Metric.md)

## Properties

### count

> **count**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L45)

***

### help

> **help**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L18)

#### Inherited from

[`Metric`](Metric.md).[`help`](Metric.md#help)

***

### labels?

> `optional` **labels**: `Record`\<`string`, `string`\>

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L19)

#### Inherited from

[`Metric`](Metric.md).[`labels`](Metric.md#labels)

***

### name

> **name**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L16)

#### Inherited from

[`Metric`](Metric.md).[`name`](Metric.md#name)

***

### quantiles

> **quantiles**: [`SummaryQuantile`](SummaryQuantile.md)[]

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:43](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L43)

***

### sum

> **sum**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L44)

***

### timestamp

> **timestamp**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:21](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L21)

#### Inherited from

[`Metric`](Metric.md).[`timestamp`](Metric.md#timestamp)

***

### type

> **type**: `"summary"`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L42)

#### Overrides

[`Metric`](Metric.md).[`type`](Metric.md#type)

***

### value

> **value**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/metrics.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/metrics.ts#L20)

#### Inherited from

[`Metric`](Metric.md).[`value`](Metric.md#value)
