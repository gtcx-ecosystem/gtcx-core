[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / SecurityLoggerConfig

# Interface: SecurityLoggerConfig

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L17)

## Properties

### batchSize

> **batchSize**: `number`

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L29)

Batch configuration

***

### flushIntervalMs

> **flushIntervalMs**: `number`

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L30)

***

### includeStackTraces

> **includeStackTraces**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L22)

Include stack traces

***

### minSeverity

> **minSeverity**: [`SecuritySeverity`](../type-aliases/SecuritySeverity.md)

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:19](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L19)

Minimum severity to log

***

### outputJson

> **outputJson**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L33)

Output as JSON

***

### redactSensitiveFields

> **redactSensitiveFields**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L25)

Redact sensitive fields

***

### sensitiveFields

> **sensitiveFields**: `string`[]

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L26)

***

### strictMode

> **strictMode**: `boolean`

Defined in: [03-platform/packages/security/03-platform/src/audit/logger.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/logger.ts#L40)

When true, the logger requires at least one external handler to be
registered before any event can be logged. This prevents accidental
console fallback in production environments.
