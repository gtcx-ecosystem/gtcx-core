[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / ILocationService

# Interface: ILocationService

Defined in: [03-platform/packages/domain/src/types.ts:432](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L432)

Location service interface

## Methods

### getCurrentLocation()

> **getCurrentLocation**(`options`): `Promise`\<[`Location`](Location.md)\>

Defined in: [03-platform/packages/domain/src/types.ts:433](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L433)

#### Parameters

##### options

###### accuracy

`string`

###### maximumAge

`number`

###### timeout

`number`

#### Returns

`Promise`\<[`Location`](Location.md)\>

***

### reverseGeocode()

> **reverseGeocode**(`latitude`, `longitude`): `Promise`\<\{ `formattedAddress`: `string`; \}\>

Defined in: [03-platform/packages/domain/src/types.ts:438](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/types.ts#L438)

#### Parameters

##### latitude

`number`

##### longitude

`number`

#### Returns

`Promise`\<\{ `formattedAddress`: `string`; \}\>
