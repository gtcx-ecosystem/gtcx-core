[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / createStrictValidator

# Function: createStrictValidator()

> **createStrictValidator**\<`T`\>(`schema`, `options?`): (`input`) => `T`

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:267](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L267)

Strict boundary validator that throws on invalid input

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

> (`input`): `T`

### Parameters

#### input

`unknown`

### Returns

`T`

## Throws

if validation fails
