[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / TelemetryHooks

# Interface: TelemetryHooks

Defined in: [03-platform/packages/api-client/src/types.ts:57](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L57)

## Methods

### onRequestComplete()?

> `optional` **onRequestComplete**(`context`): `void`

Defined in: [03-platform/packages/api-client/src/types.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L59)

#### Parameters

##### context

###### attempt

`number`

###### durationMs

`number`

###### method

`string`

###### status

`number`

###### url

`string`

#### Returns

`void`

***

### onRequestError()?

> `optional` **onRequestError**(`context`): `void`

Defined in: [03-platform/packages/api-client/src/types.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L66)

#### Parameters

##### context

###### attempt

`number`

###### error

`unknown`

###### method

`string`

###### retryable

`boolean`

###### url

`string`

#### Returns

`void`

***

### onRequestStart()?

> `optional` **onRequestStart**(`context`): `void`

Defined in: [03-platform/packages/api-client/src/types.ts:58](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L58)

#### Parameters

##### context

###### headers

`Record`\<`string`, `string`\>

###### method

`string`

###### url

`string`

#### Returns

`void`
