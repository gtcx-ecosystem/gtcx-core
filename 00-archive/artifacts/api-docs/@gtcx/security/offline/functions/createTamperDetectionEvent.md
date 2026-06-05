[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / createTamperDetectionEvent

# Function: createTamperDetectionEvent()

> **createTamperDetectionEvent**(`dataId`, `dataType`, `checkType`, `result`, `deviceId?`): [`TamperDetectionEvent`](../interfaces/TamperDetectionEvent.md)

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:212](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L212)

Create tamper detection event for logging

## Parameters

### dataId

`string`

### dataType

`string`

### checkType

`"SCHEDULED"` | `"ON_ACCESS"` | `"MANUAL"`

### result

[`TamperCheckResult`](../interfaces/TamperCheckResult.md)

### deviceId?

`string`

## Returns

[`TamperDetectionEvent`](../interfaces/TamperDetectionEvent.md)
