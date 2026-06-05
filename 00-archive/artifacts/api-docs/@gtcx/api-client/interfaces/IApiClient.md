[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / IApiClient

# Interface: IApiClient

Defined in: [03-platform/packages/api-client/src/types.ts:123](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L123)

## Methods

### delete()

> **delete**\<`T`\>(`path`, `options?`): `Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

Defined in: [03-platform/packages/api-client/src/types.ts:140](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L140)

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### options?

[`RequestOptions`](RequestOptions.md)

#### Returns

`Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

***

### get()

> **get**\<`T`\>(`path`, `options?`): `Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

Defined in: [03-platform/packages/api-client/src/types.ts:124](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L124)

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### options?

[`RequestOptions`](RequestOptions.md)

#### Returns

`Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

***

### patch()

> **patch**\<`T`\>(`path`, `body`, `options?`): `Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

Defined in: [03-platform/packages/api-client/src/types.ts:135](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L135)

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### body

`unknown`

##### options?

[`RequestOptions`](RequestOptions.md)

#### Returns

`Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

***

### post()

> **post**\<`T`\>(`path`, `body`, `options?`): `Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

Defined in: [03-platform/packages/api-client/src/types.ts:125](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L125)

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### body

`unknown`

##### options?

[`RequestOptions`](RequestOptions.md)

#### Returns

`Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

***

### put()

> **put**\<`T`\>(`path`, `body`, `options?`): `Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>

Defined in: [03-platform/packages/api-client/src/types.ts:130](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L130)

#### Type Parameters

##### T

`T`

#### Parameters

##### path

`string`

##### body

`unknown`

##### options?

[`RequestOptions`](RequestOptions.md)

#### Returns

`Promise`\<[`QueuedResponse`](QueuedResponse.md) \| [`ApiResponse`](ApiResponse.md)\<`T`\>\>
