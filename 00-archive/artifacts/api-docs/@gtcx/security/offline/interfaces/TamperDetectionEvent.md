[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [offline](../README.md) / TamperDetectionEvent

# Interface: TamperDetectionEvent

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:194](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L194)

Tamper detection event for audit logging

## Properties

### checkType

> **checkType**: `"SCHEDULED"` \| `"ON_ACCESS"` \| `"MANUAL"`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:198](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L198)

***

### dataId

> **dataId**: `string`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:196](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L196)

***

### dataType

> **dataType**: `string`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:197](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L197)

***

### deviceId?

> `optional` **deviceId**: `string`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:200](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L200)

***

### location?

> `optional` **location**: `object`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:201](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L201)

#### latitude

> **latitude**: `number`

#### longitude

> **longitude**: `number`

***

### result

> **result**: [`TamperCheckResult`](TamperCheckResult.md)

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:199](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L199)

***

### timestamp

> **timestamp**: `string`

Defined in: [03-platform/packages/security/src/offline/tamper-detection.ts:195](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/tamper-detection.ts#L195)
