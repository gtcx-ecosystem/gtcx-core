[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / CortexAnalyticsQuery

# Interface: CortexAnalyticsQuery

Defined in: [03-platform/packages/types/src/api/intelligence.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/intelligence.ts#L97)

## Properties

### aggregation?

> `optional` **aggregation**: `"sum"` \| `"avg"` \| `"min"` \| `"max"` \| `"count"`

Defined in: [03-platform/packages/types/src/api/intelligence.ts:106](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/intelligence.ts#L106)

***

### dimensions?

> `optional` **dimensions**: `string`[]

Defined in: [03-platform/packages/types/src/api/intelligence.ts:99](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/intelligence.ts#L99)

***

### filters?

> `optional` **filters**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/types/src/api/intelligence.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/intelligence.ts#L100)

***

### metric

> **metric**: `string`

Defined in: [03-platform/packages/types/src/api/intelligence.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/intelligence.ts#L98)

***

### timeRange

> **timeRange**: `object`

Defined in: [03-platform/packages/types/src/api/intelligence.ts:101](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/api/intelligence.ts#L101)

#### end

> **end**: `number`

#### granularity?

> `optional` **granularity**: `"hour"` \| `"day"` \| `"week"` \| `"month"`

#### start

> **start**: `number`
