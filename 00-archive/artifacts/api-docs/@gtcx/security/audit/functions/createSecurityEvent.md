[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / createSecurityEvent

# Function: createSecurityEvent()

> **createSecurityEvent**(`eventType`, `outcome`, `options?`): [`SecurityEvent`](../interfaces/SecurityEvent.md)

Defined in: [03-platform/packages/security/src/audit/events.ts:166](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L166)

Build a security event with defaults

## Parameters

### eventType

[`SecurityEventType`](../type-aliases/SecurityEventType.md)

### outcome

[`SecurityOutcome`](../type-aliases/SecurityOutcome.md)

### options?

`Partial`\<`Omit`\<[`SecurityEvent`](../interfaces/SecurityEvent.md), `"timestamp"` \| `"eventType"` \| `"outcome"`\>\> = `{}`

## Returns

[`SecurityEvent`](../interfaces/SecurityEvent.md)
