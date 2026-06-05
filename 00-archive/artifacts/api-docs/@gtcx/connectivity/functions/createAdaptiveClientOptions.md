[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / createAdaptiveClientOptions

# Function: createAdaptiveClientOptions()

> **createAdaptiveClientOptions**(`detector`, `baseOptions`): `object`

Defined in: [03-platform/packages/connectivity/03-platform/src/adapters/api-client.ts:129](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/adapters/api-client.ts#L129)

Create an api-client options object that automatically adapts
to connectivity profile changes.

Returns the adapted options and a function to refresh them
when the profile changes.

## Parameters

### detector

[`ConnectivityDetector`](../classes/ConnectivityDetector.md)

### baseOptions

`ApiClientOptions`

## Returns

`object`

### options

> **options**: `ApiClientOptions`

### refresh()

> **refresh**: () => `void`

#### Returns

`void`

### unsubscribe()

> **unsubscribe**: () => `void`

#### Returns

`void`
