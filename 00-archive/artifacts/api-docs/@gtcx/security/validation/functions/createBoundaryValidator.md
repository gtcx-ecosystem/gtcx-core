[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / createBoundaryValidator

# Function: createBoundaryValidator()

> **createBoundaryValidator**\<`T`\>(`schema`, `options?`): (`input`) => [`ValidationOutcome`](../type-aliases/ValidationOutcome.md)\<`T`\>

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:216](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L216)

Create a boundary validator function

Use at API boundaries, message handlers, and any external input point.

## Type Parameters

### T

`T`

## Parameters

### schema

`ZodType`\<`T`\>

### options?

#### sanitize?

`boolean`

#### sanitizeOptions?

[`ObjectSanitizeOptions`](../interfaces/ObjectSanitizeOptions.md)

## Returns

> (`input`): [`ValidationOutcome`](../type-aliases/ValidationOutcome.md)\<`T`\>

### Parameters

#### input

`unknown`

### Returns

[`ValidationOutcome`](../type-aliases/ValidationOutcome.md)\<`T`\>

## Example

```ts
const validateRequest = createBoundaryValidator(RequestSchema);

// In handler:
const result = validateRequest(rawInput);
if (!result.success) {
  return res.status(400).json(result.error);
}
const validData = result.data;
```
