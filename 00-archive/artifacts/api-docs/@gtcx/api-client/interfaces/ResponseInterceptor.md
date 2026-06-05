[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / ResponseInterceptor

# Interface: ResponseInterceptor()

Defined in: [03-platform/packages/api-client/03-platform/src/types.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/types.ts#L49)

> **ResponseInterceptor**\<`T`\>(`context`): `void` \| [`ApiResponse`](ApiResponse.md)\<`T`\> \| `Promise`\<`void` \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

Defined in: [03-platform/packages/api-client/03-platform/src/types.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/types.ts#L50)

## Type Parameters

### T

`T`

## Parameters

### context

#### method

`string`

#### response

[`ApiResponse`](ApiResponse.md)\<`T`\>

#### url

`string`

## Returns

`void` \| [`ApiResponse`](ApiResponse.md)\<`T`\> \| `Promise`\<`void` \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>
