[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / sanitizeSecrets

# Function: sanitizeSecrets()

> **sanitizeSecrets**\<`T`\>(`input`): `T`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:344](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L344)

Sanitize an object specifically to remove cryptographic secrets and keys.
Use this in tracing and logging callbacks.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### input

`T`

## Returns

`T`

## Example

```ts
const sanitized = sanitizeSecrets(input);
```
