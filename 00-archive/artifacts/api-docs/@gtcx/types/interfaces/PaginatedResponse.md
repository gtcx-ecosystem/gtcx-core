[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / PaginatedResponse

# Interface: PaginatedResponse\<T\>

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L33)

Paginated response

## Extends

- [`ApiResponse`](ApiResponse.md)\<`T`[]\>

## Type Parameters

### T

`T`

## Properties

### data?

> `optional` **data**: `T`[]

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L11)

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`data`](ApiResponse.md#data)

***

### error?

> `optional` **error**: [`ApiError`](ApiError.md)

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L12)

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`error`](ApiResponse.md#error)

***

### meta?

> `optional` **meta**: [`ResponseMeta`](ResponseMeta.md)

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:13](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L13)

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`meta`](ApiResponse.md#meta)

***

### pagination

> **pagination**: [`PaginationInfo`](PaginationInfo.md)

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L34)

***

### success

> **success**: `boolean`

Defined in: [03-platform/packages/types/03-platform/src/api/common.ts:10](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/03-platform/src/api/common.ts#L10)

#### Inherited from

[`ApiResponse`](ApiResponse.md).[`success`](ApiResponse.md#success)
