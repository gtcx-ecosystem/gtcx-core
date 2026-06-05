[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ApiResponse

# Interface: ApiResponse\<T\>

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:9](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L9)

Standard API response wrapper

## Extended by

- [`PaginatedResponse`](PaginatedResponse.md)

## Type Parameters

### T

`T`

## Properties

### data?

> `optional` **data**: `T`

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L11)

***

### error?

> `optional` **error**: [`ApiError`](ApiError.md)

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L12)

***

### meta?

> `optional` **meta**: [`ResponseMeta`](ResponseMeta.md)

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:13](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L13)

***

### success

> **success**: `boolean`

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:10](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L10)
