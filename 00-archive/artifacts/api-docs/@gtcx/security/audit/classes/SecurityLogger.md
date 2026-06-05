[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / SecurityLogger

# Class: SecurityLogger

Defined in: [03-platform/packages/security/src/audit/logger.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L121)

Security logger with batching and structured output

## Example

```ts
const logger = new SecurityLogger({ minSeverity: 'WARN' });
logger.addHandler(consoleLogHandler);
await logger.authSuccess('user-123', 'session-456');
```

## Constructors

### Constructor

> **new SecurityLogger**(`config?`): `SecurityLogger`

Defined in: [03-platform/packages/security/src/audit/logger.ts:128](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L128)

#### Parameters

##### config?

`Partial`\<[`SecurityLoggerConfig`](../interfaces/SecurityLoggerConfig.md)\> = `{}`

#### Returns

`SecurityLogger`

## Methods

### accessDenied()

> **accessDenied**(`actorId`, `resource`, `action`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:266](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L266)

Log access denied

#### Parameters

##### actorId

`string`

##### resource

`string`

##### action

`string`

#### Returns

`Promise`\<`void`\>

***

### addBatchHandler()

> **addBatchHandler**(`handler`): `void`

Defined in: [03-platform/packages/security/src/audit/logger.ts:142](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L142)

Register a batch log handler

#### Parameters

##### handler

[`SecurityBatchLogHandler`](../type-aliases/SecurityBatchLogHandler.md)

#### Returns

`void`

***

### addHandler()

> **addHandler**(`handler`): `void`

Defined in: [03-platform/packages/security/src/audit/logger.ts:135](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L135)

Register a log handler

#### Parameters

##### handler

[`SecurityLogHandler`](../type-aliases/SecurityLogHandler.md)

#### Returns

`void`

***

### authFailure()

> **authFailure**(`reason`, `actorId?`, `ip?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:255](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L255)

Log authentication failure

#### Parameters

##### reason

`string`

##### actorId?

`string`

##### ip?

`string`

#### Returns

`Promise`\<`void`\>

***

### authSuccess()

> **authSuccess**(`actorId`, `sessionId`, `metadata?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:240](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L240)

Log authentication success

#### Parameters

##### actorId

`string`

##### sessionId

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:205](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L205)

Flush batched events

#### Returns

`Promise`\<`void`\>

***

### log()

> **log**(`event`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:149](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L149)

Log a security event

#### Parameters

##### event

[`SecurityEvent`](../interfaces/SecurityEvent.md)

#### Returns

`Promise`\<`void`\>

***

### logEvent()

> **logEvent**(`eventType`, `outcome`, `options?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:193](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L193)

Quick log method - creates event and logs it

#### Parameters

##### eventType

[`SecurityEventType`](../type-aliases/SecurityEventType.md)

##### outcome

[`SecurityOutcome`](../type-aliases/SecurityOutcome.md)

##### options?

`Partial`\<`Omit`\<[`SecurityEvent`](../interfaces/SecurityEvent.md), `"timestamp"` \| `"eventType"` \| `"outcome"`\>\>

#### Returns

`Promise`\<`void`\>

***

### securityAlert()

> **securityAlert**(`description`, `metadata?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:300](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L300)

Log security alert

#### Parameters

##### description

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:225](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L225)

Shutdown logger and flush remaining events

#### Returns

`Promise`\<`void`\>

***

### tamperDetected()

> **tamperDetected**(`dataId`, `dataType`, `reason`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:288](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L288)

Log tamper detection

#### Parameters

##### dataId

`string`

##### dataType

`string`

##### reason

`string`

#### Returns

`Promise`\<`void`\>

***

### validationFailure()

> **validationFailure**(`resource`, `reason`, `actorId?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/audit/logger.ts:277](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/audit/logger.ts#L277)

Log validation failure

#### Parameters

##### resource

`string`

##### reason

`string`

##### actorId?

`string`

#### Returns

`Promise`\<`void`\>
