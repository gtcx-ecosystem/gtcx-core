[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / createAdaptiveMode

# Function: createAdaptiveMode()

> **createAdaptiveMode**(`detector`, `config?`): [`AdaptiveMode`](../interfaces/AdaptiveMode.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/adaptive-mode.ts:56](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/adaptive-mode.ts#L56)

Create an adaptive mode orchestrator bound to a ConnectivityDetector.

All thresholds are driven by the provided config (with sensible defaults).
The returned object exposes compression, image, and batching utilities
that automatically respect the current connectivity profile.

## Parameters

### detector

[`ConnectivityDetector`](../classes/ConnectivityDetector.md)

### config?

[`AdaptiveModeConfig`](../interfaces/AdaptiveModeConfig.md)

## Returns

[`AdaptiveMode`](../interfaces/AdaptiveMode.md)
