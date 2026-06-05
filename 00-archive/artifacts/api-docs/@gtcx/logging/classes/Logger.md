[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/logging](../README.md) / Logger

# Class: Logger

Defined in: [logger.ts:104](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L104)

Structured logger that produces JSON-formatted log entries.

Supports log level filtering, correlation IDs, child loggers,
error serialization, and timed operations.

## Constructors

### Constructor

> **new Logger**(`config`): `Logger`

Defined in: [logger.ts:107](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L107)

#### Parameters

##### config

[`LoggerConfig`](../interfaces/LoggerConfig.md)

#### Returns

`Logger`

## Methods

### child()

> **child**(`overrides`): `Logger`

Defined in: [logger.ts:156](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L156)

Create a child logger that inherits the parent's configuration
with optional overrides. Useful for adding context (e.g., a
correlation ID or sub-service name) to a subset of log entries.

#### Parameters

##### overrides

`Partial`\<[`LoggerConfig`](../interfaces/LoggerConfig.md)\>

#### Returns

`Logger`

***

### debug()

> **debug**(`message`, `data?`): `void`

Defined in: [logger.ts:119](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L119)

Log a debug-level message.

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### error()

> **error**(`message`, `error?`, `data?`): `void`

Defined in: [logger.ts:140](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L140)

Log an error-level message with an optional Error object.

#### Parameters

##### message

`string`

##### error?

`Error`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### fatal()

> **fatal**(`message`, `error?`, `data?`): `void`

Defined in: [logger.ts:147](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L147)

Log a fatal-level message with an optional Error object.

#### Parameters

##### message

`string`

##### error?

`Error`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### info()

> **info**(`message`, `data?`): `void`

Defined in: [logger.ts:126](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L126)

Log an info-level message.

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### startTimer()

> **startTimer**(): () => `number`

Defined in: [logger.ts:176](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L176)

Start a timer and return a function that, when called, returns
the elapsed duration in milliseconds. Useful for measuring
operation durations.

#### Returns

> (): `number`

##### Returns

`number`

#### Example

```ts
const elapsed = logger.startTimer();
await someOperation();
const duration = elapsed();
logger.info('Operation complete', { duration });
```

***

### warn()

> **warn**(`message`, `data?`): `void`

Defined in: [logger.ts:133](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L133)

Log a warn-level message.

#### Parameters

##### message

`string`

##### data?

`Record`\<`string`, `unknown`\>

#### Returns

`void`

***

### generateCorrelationId()

> `static` **generateCorrelationId**(): `string`

Defined in: [logger.ts:186](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/logging/03-platform/src/logger.ts#L186)

Generate a unique correlation ID based on the current timestamp
and random hex characters. Useful for tracing requests across
service boundaries.

#### Returns

`string`
