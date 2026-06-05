[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / AdaptiveMode

# Interface: AdaptiveMode

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L25)

## Properties

### batching

> **batching**: `object`

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L35)

#### batcher

> **batcher**: [`RequestBatcher`](../classes/RequestBatcher.md)

#### isActive()

> **isActive**: () => `boolean`

##### Returns

`boolean`

***

### compression

> **compression**: `object`

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L26)

#### compressPayload()

> **compressPayload**: (`data`) => `Promise`\<[`CompressedPayload`](CompressedPayload.md)\>

##### Parameters

###### data

`unknown`

##### Returns

`Promise`\<[`CompressedPayload`](CompressedPayload.md)\>

#### decompressPayload()

> **decompressPayload**: (`compressed`) => `Promise`\<`unknown`\>

##### Parameters

###### compressed

[`CompressedPayload`](CompressedPayload.md)

##### Returns

`Promise`\<`unknown`\>

#### shouldCompress()

> **shouldCompress**: () => `boolean`

##### Returns

`boolean`

***

### images

> **images**: `object`

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L31)

#### downsampleConfig()

> **downsampleConfig**: () => [`DownsampleConfig`](DownsampleConfig.md)

##### Returns

[`DownsampleConfig`](DownsampleConfig.md)

#### shouldDownsample()

> **shouldDownsample**: () => `boolean`

##### Returns

`boolean`

## Accessors

### profile

#### Get Signature

> **get** **profile**(): [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)

Defined in: [03-platform/packages/connectivity/src/adaptive-mode.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adaptive-mode.ts#L40)

Current connectivity profile.

##### Returns

[`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)
