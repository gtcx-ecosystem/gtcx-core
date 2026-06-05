[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [validation](../README.md) / ObjectSanitizeOptions

# Interface: ObjectSanitizeOptions

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:86](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L86)

## Properties

### maxArrayLength?

> `optional` **maxArrayLength**: `number`

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:92](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L92)

Maximum array length

***

### maxDepth?

> `optional` **maxDepth**: `number`

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:88](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L88)

Maximum nesting depth

***

### maxKeys?

> `optional` **maxKeys**: `number`

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:90](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L90)

Maximum number of keys per object

***

### stringOptions?

> `optional` **stringOptions**: [`StringSanitizeOptions`](StringSanitizeOptions.md)

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:98](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L98)

String sanitization options for string values

***

### stripNullish?

> `optional` **stripNullish**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:96](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L96)

Remove null and undefined values

***

### stripProto?

> `optional` **stripProto**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/validation/sanitize.ts:94](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/validation/sanitize.ts#L94)

Remove __proto__ and constructor properties
