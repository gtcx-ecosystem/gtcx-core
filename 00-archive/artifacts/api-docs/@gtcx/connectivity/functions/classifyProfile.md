[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / classifyProfile

# Function: classifyProfile()

> **classifyProfile**(`bandwidthKbps`, `latencyMs`): [`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)

Defined in: [03-platform/packages/connectivity/src/profiles.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/profiles.ts#L19)

Classify a connectivity profile based on bandwidth and latency measurements.

Profile thresholds (matching architecture docs):
| Profile    | Bandwidth      | Latency  |
|------------|--------------- |----------|
| offline    | 0              | -        |
| ussd-only  | <1 Kbps        | -        |
| satellite  | <512 Kbps      | >500ms   |
| edge       | <200 Kbps      | -        |
| degraded   | 1-5 Mbps       | -        |
| standard   | >5 Mbps        | <200ms   |

Note: satellite is checked before edge/degraded because it is
distinguished by high latency combined with low bandwidth.

## Parameters

### bandwidthKbps

`number`

### latencyMs

`number`

## Returns

[`ConnectivityProfile`](../type-aliases/ConnectivityProfile.md)
