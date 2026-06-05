[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / SecurityLogHandler

# Type Alias: SecurityLogHandler()

> **SecurityLogHandler** = (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L83)

Handler function for security events
Implement this to send events to your logging infrastructure

## Parameters

### event

[`SecurityEvent`](../interfaces/SecurityEvent.md)

## Returns

`void` \| `Promise`\<`void`\>
