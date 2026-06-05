[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / registerSecurityHandler

# Function: registerSecurityHandler()

> **registerSecurityHandler**(`handler`): `void`

Defined in: [03-platform/packages/security/src/audit/events.ts:220](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/events.ts#L220)

Register a handler for security events

## Parameters

### handler

[`SecurityEventHandler`](../type-aliases/SecurityEventHandler.md)

## Returns

`void`

## Example

```ts
registerSecurityHandler(async (event) => {
  await analyticsService.track(event);
  if (event.severity === 'CRITICAL') {
    await alertService.notify(event);
  }
});
```
