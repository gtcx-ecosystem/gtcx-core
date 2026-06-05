[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / AdaptiveModeConfig

# Interface: AdaptiveModeConfig

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:10](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L10)

## Properties

### batchFlushFn?

> `optional` **batchFlushFn**: [`BatchFlushFn`](../type-aliases/BatchFlushFn.md)

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L22)

Function called to flush a batch of requests. Required for batching to work.

***

### batchingFlushIntervalMs?

> `optional` **batchingFlushIntervalMs**: `number`

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L20)

Interval in ms between automatic batch flushes.

***

### batchingMaxSize?

> `optional` **batchingMaxSize**: `number`

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L18)

Maximum number of requests in a batch before auto-flush.

***

### batchingProfiles?

> `optional` **batchingProfiles**: [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)[]

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L16)

Profiles that trigger request batching. Defaults to edge, ussd-only, satellite.

***

### compressionProfiles?

> `optional` **compressionProfiles**: [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)[]

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L12)

Profiles that trigger compression. Defaults to edge, ussd-only, satellite.

***

### imageProfiles?

> `optional` **imageProfiles**: [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)[]

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L14)

Profiles that trigger image downsampling. Defaults to edge, ussd-only, satellite.
