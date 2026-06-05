[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / RequestBatcher

# Class: RequestBatcher

Defined in: [03-platform/packages/connectivity/src/batching.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/batching.ts#L35)

RequestBatcher queues requests and flushes them as a batch.

For active low-bandwidth profiles (edge, ussd-only, satellite) requests
are queued and sent together. For standard and degraded profiles,
requests pass through immediately.

## Constructors

### Constructor

> **new RequestBatcher**(`options`): `RequestBatcher`

Defined in: [03-platform/packages/connectivity/src/batching.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/batching.ts#L45)

#### Parameters

##### options

[`RequestBatcherOptions`](../interfaces/RequestBatcherOptions.md)

#### Returns

`RequestBatcher`

## Methods

### add()

> **add**(`request`): `Promise`\<[`BatchResponse`](../interfaces/BatchResponse.md)\>

Defined in: [03-platform/packages/connectivity/src/batching.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/batching.ts#L67)

Add a request to the batcher.

If the current profile is not active, the request is sent
immediately. Otherwise it is queued for the next flush.

#### Parameters

##### request

`Omit`\<[`BatchRequest`](../interfaces/BatchRequest.md), `"id"`\> & `object`

#### Returns

`Promise`\<[`BatchResponse`](../interfaces/BatchResponse.md)\>

***

### destroy()

> **destroy**(): `void`

Defined in: [03-platform/packages/connectivity/src/batching.ts:130](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/batching.ts#L130)

Stop the auto-flush timer and reject all pending requests.

#### Returns

`void`

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/connectivity/src/batching.ts:94](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/batching.ts#L94)

Flush all queued requests now.

#### Returns

`Promise`\<`void`\>
