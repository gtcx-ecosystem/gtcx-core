[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / adaptClientOptionsForProfile

# Function: adaptClientOptionsForProfile()

> **adaptClientOptionsForProfile**(`profile`, `options`): `ApiClientOptions`

Defined in: [03-platform/packages/connectivity/src/adapters/api-client.ts:109](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/adapters/api-client.ts#L109)

Adapt ApiClientOptions for a given connectivity profile.

Merges profile-specific timeout, retry count, and retry policy
into the provided options. Explicit options always win.

## Parameters

### profile

[`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)

### options

`ApiClientOptions`

## Returns

`ApiClientOptions`
