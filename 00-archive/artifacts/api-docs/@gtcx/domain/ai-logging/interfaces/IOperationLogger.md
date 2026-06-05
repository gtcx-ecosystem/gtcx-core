[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-logging](../README.md) / IOperationLogger

# Interface: IOperationLogger

Defined in: [03-platform/packages/domain/src/ai-logging.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L82)

## Methods

### addTags()

> **addTags**(`operationId`, `tags`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:119](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L119)

Add tags to an operation

#### Parameters

##### operationId

`string`

##### tags

`string`[]

#### Returns

`void`

***

### fail()

> **fail**(`operationId`, `error`, `errorCode?`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:109](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L109)

Mark operation as failed

#### Parameters

##### operationId

`string`

##### error

`string` | `Error`

##### errorCode?

`string`

#### Returns

`void`

***

### get()

> **get**(`operationId`): [`OperationLogEntry`](OperationLogEntry.md) \| `undefined`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:124](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L124)

Get operation entry

#### Parameters

##### operationId

`string`

#### Returns

[`OperationLogEntry`](OperationLogEntry.md) \| `undefined`

***

### getByCorrelationId()

> **getByCorrelationId**(`correlationId`): [`OperationLogEntry`](OperationLogEntry.md)[]

Defined in: [03-platform/packages/domain/src/ai-logging.ts:129](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L129)

Get all operations for a correlation ID

#### Parameters

##### correlationId

`string`

#### Returns

[`OperationLogEntry`](OperationLogEntry.md)[]

***

### skip()

> **skip**(`operationId`, `reason`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:114](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L114)

Mark operation as skipped

#### Parameters

##### operationId

`string`

##### reason

`string`

#### Returns

`void`

***

### start()

> **start**(`type`, `input?`, `options?`): `string`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:87](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L87)

Start a new operation

#### Parameters

##### type

[`OperationType`](../type-aliases/OperationType.md)

##### input?

`Record`\<`string`, `unknown`\>

##### options?

###### correlationId?

`string`

###### parentId?

`string`

###### tags?

`string`[]

#### Returns

`string`

Operation ID

***

### success()

> **success**(`operationId`, `output?`, `aiContext?`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L100)

Mark operation as successful

#### Parameters

##### operationId

`string`

##### output?

`Record`\<`string`, `unknown`\>

##### aiContext?

###### anomalies?

`string`[]

Anomaly indicators

###### confidence?

`number`

Confidence score (0-1)

###### patterns?

`string`[]

Pattern matches

###### suggestedNextOps?

[`OperationType`](../type-aliases/OperationType.md)[]

Suggested follow-up operations

#### Returns

`void`
