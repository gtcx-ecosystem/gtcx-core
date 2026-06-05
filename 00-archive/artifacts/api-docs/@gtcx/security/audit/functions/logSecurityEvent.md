[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / logSecurityEvent

# Function: logSecurityEvent()

> **logSecurityEvent**(`eventOrType`, `options?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:247](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L247)

Log a security event

Sends event to all registered handlers.
Also logs to console in development.

## Parameters

### eventOrType

[`SecurityEventType`](../type-aliases/SecurityEventType.md) | [`SecurityEvent`](../interfaces/SecurityEvent.md)

### options?

`Partial`\<`Omit`\<[`SecurityEvent`](../interfaces/SecurityEvent.md), `"timestamp"` \| `"eventType"`\>\>

## Returns

`Promise`\<`void`\>
