[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/logging](../README.md) / LogEntry

# Interface: LogEntry

Defined in: [logger.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L31)

Structured log entry produced by the logger.

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [logger.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L41)

Optional correlation ID for tracing requests across services

***

### data?

> `optional` **data**: `Record`\<`string`, `unknown`\>

Defined in: [logger.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L49)

Arbitrary structured data attached to the log entry

***

### duration?

> `optional` **duration**: `number`

Defined in: [logger.ts:57](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L57)

Duration in milliseconds (for timed operations)

***

### error?

> `optional` **error**: `object`

Defined in: [logger.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L51)

Serialized error information

#### message

> **message**: `string`

#### name

> **name**: `string`

#### stack?

> `optional` **stack**: `string`

***

### level

> **level**: [`LogLevel`](../type-aliases/LogLevel.md)

Defined in: [logger.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L35)

Severity level

***

### message

> **message**: `string`

Defined in: [logger.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L37)

Human-readable log message

***

### parentSpanId?

> `optional` **parentSpanId**: `string`

Defined in: [logger.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L47)

Optional parent span ID for nested trace hierarchies

***

### service

> **service**: `string`

Defined in: [logger.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L39)

Service or module name

***

### spanId?

> `optional` **spanId**: `string`

Defined in: [logger.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L45)

Optional span ID within a trace

***

### timestamp

> **timestamp**: `string`

Defined in: [logger.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L33)

ISO 8601 timestamp

***

### traceId?

> `optional` **traceId**: `string`

Defined in: [logger.ts:43](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L43)

Optional distributed trace ID
