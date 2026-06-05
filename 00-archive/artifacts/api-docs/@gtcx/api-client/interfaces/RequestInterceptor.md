[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / RequestInterceptor

# Interface: RequestInterceptor()

Defined in: [03-platform/packages/api-client/src/types.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L38)

> **RequestInterceptor**(`context`): `Promise`\<\{ `body?`: `unknown`; `headers?`: `Record`\<`string`, `string`\>; `method?`: `string`; `url?`: `string`; \}\> \| \{ `body?`: `unknown`; `headers?`: `Record`\<`string`, `string`\>; `method?`: `string`; `url?`: `string`; \}

Defined in: [03-platform/packages/api-client/src/types.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L39)

## Parameters

### context

#### body?

`unknown`

#### headers

`Record`\<`string`, `string`\>

#### method

`string`

#### url

`string`

## Returns

`Promise`\<\{ `body?`: `unknown`; `headers?`: `Record`\<`string`, `string`\>; `method?`: `string`; `url?`: `string`; \}\> \| \{ `body?`: `unknown`; `headers?`: `Record`\<`string`, `string`\>; `method?`: `string`; `url?`: `string`; \}
