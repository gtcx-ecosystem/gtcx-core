[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / downsampleConfig

# Function: downsampleConfig()

> **downsampleConfig**(`profile`): [`DownsampleConfig`](../interfaces/DownsampleConfig.md)

Defined in: [03-platform/packages/connectivity/src/images.ts:27](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/images.ts#L27)

Return downsampling parameters for a given profile.

| Profile    | maxWidth | maxHeight | quality | format |
|------------|----------|-----------|---------|--------|
| edge       | 640      | 480       | 0.6     | jpeg   |
| ussd-only  | 320      | 240       | 0.4     | jpeg   |
| satellite  | 480      | 360       | 0.5     | jpeg   |
| other      | Infinity | Infinity  | 1.0     | jpeg   |

## Parameters

### profile

[`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)

## Returns

[`DownsampleConfig`](../interfaces/DownsampleConfig.md)
