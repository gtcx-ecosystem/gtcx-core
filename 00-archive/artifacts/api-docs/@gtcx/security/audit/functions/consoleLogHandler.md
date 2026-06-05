[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / consoleLogHandler

# Function: consoleLogHandler()

> **consoleLogHandler**(`event`): `void`

Defined in: [03-platform/packages/security/src/audit/logger.ts:379](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L379)

Console log handler for development.
Writes to stdout/stderr via process.stdout/process.stderr to avoid
unstructured console interleaving and no-console lint violations.

## Parameters

### event

[`SecurityEvent`](../interfaces/SecurityEvent.md)

## Returns

`void`
