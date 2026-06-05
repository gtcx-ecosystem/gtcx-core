[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / RequestBatcherOptions

# Interface: RequestBatcherOptions

Defined in: [03-platform/packages/connectivity/03-platform/src/batching.ts:15](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/batching.ts#L15)

## Properties

### activeProfiles?

> `optional` **activeProfiles**: [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)[]

Defined in: [03-platform/packages/connectivity/03-platform/src/batching.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/batching.ts#L20)

***

### flushFn

> **flushFn**: [`BatchFlushFn`](../type-aliases/BatchFlushFn.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/batching.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/batching.ts#L16)

***

### flushIntervalMs?

> `optional` **flushIntervalMs**: `number`

Defined in: [03-platform/packages/connectivity/03-platform/src/batching.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/batching.ts#L19)

***

### getProfile()

> **getProfile**: () => [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/batching.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/batching.ts#L17)

#### Returns

[`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)

***

### maxBatchSize?

> `optional` **maxBatchSize**: `number`

Defined in: [03-platform/packages/connectivity/03-platform/src/batching.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/batching.ts#L18)
