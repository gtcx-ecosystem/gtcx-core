[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/logging](../README.md) / LoggerConfig

# Interface: LoggerConfig

Defined in: [logger.ts:63](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/src/logger.ts#L63)

Configuration for creating a Logger instance.

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [logger.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/src/logger.ts#L69)

Correlation ID to include in every log entry

***

### level?

> `optional` **level**: [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [logger.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/src/logger.ts#L67)

Minimum log level to output. Defaults to 'debug'.

***

### output()?

> `optional` **output**: (`entry`) => `void`

Defined in: [logger.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/src/logger.ts#L71)

Custom output handler. Defaults to writing JSON to stdout/stderr.

#### Parameters

##### entry

[`LogEntry`](LogEntry.md)

#### Returns

`void`

***

### service

> **service**: `string`

Defined in: [logger.ts:65](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/src/logger.ts#L65)

Service or module name to include in every log entry
