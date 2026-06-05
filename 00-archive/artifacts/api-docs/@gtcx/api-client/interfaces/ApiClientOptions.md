[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / ApiClientOptions

# Interface: ApiClientOptions

Defined in: [03-platform/packages/api-client/src/types.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L75)

## Properties

### baseUrl

> **baseUrl**: `string`

Defined in: [03-platform/packages/api-client/src/types.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L76)

***

### circuitBreaker?

> `optional` **circuitBreaker**: `CircuitBreaker`

Defined in: [03-platform/packages/api-client/src/types.ts:91](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L91)

Circuit breaker for preventing cascade failures

***

### dedupe?

> `optional` **dedupe**: `boolean`

Defined in: [03-platform/packages/api-client/src/types.ts:95](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L95)

Deduplicate in-flight requests with the same key

***

### dispatcher?

> `optional` **dispatcher**: `Dispatcher`

Defined in: [03-platform/packages/api-client/src/types.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L82)

***

### fetcher()?

> `optional` **fetcher**: (`input`, `init?`) => `Promise`\<`Response`\>

Defined in: [03-platform/packages/api-client/src/types.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L81)

#### Parameters

##### input

`string` | `URL` | `Request`

##### init?

`RequestInit`

#### Returns

`Promise`\<`Response`\>

***

### headers?

> `optional` **headers**: `Record`\<`string`, `string`\>

Defined in: [03-platform/packages/api-client/src/types.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L79)

***

### interceptors?

> `optional` **interceptors**: `object`

Defined in: [03-platform/packages/api-client/src/types.ts:86](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L86)

Request/response interceptors for cross-cutting concerns

#### request?

> `optional` **request**: [`RequestInterceptor`](RequestInterceptor.md)[]

#### response?

> `optional` **response**: [`ResponseInterceptor`](ResponseInterceptor.md)[]

***

### mtls?

> `optional` **mtls**: [`MtlsOptions`](MtlsOptions.md)

Defined in: [03-platform/packages/api-client/src/types.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L83)

***

### offline?

> `optional` **offline**: [`OfflineHandler`](OfflineHandler.md)

Defined in: [03-platform/packages/api-client/src/types.ts:84](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L84)

***

### retries?

> `optional` **retries**: `number`

Defined in: [03-platform/packages/api-client/src/types.ts:78](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L78)

***

### retryPolicy?

> `optional` **retryPolicy**: `RetryPolicy`

Defined in: [03-platform/packages/api-client/src/types.ts:93](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L93)

Adaptive retry policy (replaces fixed exponential backoff)

***

### signer?

> `optional` **signer**: [`RequestSigner`](../type-aliases/RequestSigner.md)

Defined in: [03-platform/packages/api-client/src/types.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L80)

***

### telemetry?

> `optional` **telemetry**: [`TelemetryHooks`](TelemetryHooks.md)

Defined in: [03-platform/packages/api-client/src/types.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L97)

Telemetry hooks for metrics/tracing integration

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [03-platform/packages/api-client/src/types.ts:77](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L77)

***

### traceContext?

> `optional` **traceContext**: `SpanContext` \| () => `SpanContext` \| `undefined`

Defined in: [03-platform/packages/api-client/src/types.ts:99](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/types.ts#L99)

Inject W3C traceparent header automatically
