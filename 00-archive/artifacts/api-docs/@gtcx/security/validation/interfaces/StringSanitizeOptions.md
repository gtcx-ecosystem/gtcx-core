[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / StringSanitizeOptions

# Interface: StringSanitizeOptions

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:14](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L14)

## Properties

### allowedPattern?

> `optional` **allowedPattern**: `RegExp`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L26)

Allowed characters regex (strips everything else)

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L16)

Maximum allowed length (truncates if exceeded)

***

### normalizeUnicode?

> `optional` **normalizeUnicode**: `boolean`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L22)

Normalize to NFC Unicode form

***

### stripControlChars?

> `optional` **stripControlChars**: `boolean`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L24)

Replace control characters

***

### stripHtml?

> `optional` **stripHtml**: `boolean`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:18](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L18)

Remove HTML tags

***

### trimWhitespace?

> `optional` **trimWhitespace**: `boolean`

Defined in: [03-platform/packages/security/src/validation/sanitize.ts:20](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/validation/sanitize.ts#L20)

Trim leading/trailing whitespace
