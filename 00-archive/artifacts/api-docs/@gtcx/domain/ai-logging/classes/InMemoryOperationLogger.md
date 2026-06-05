[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-logging](../README.md) / InMemoryOperationLogger

# Class: InMemoryOperationLogger

Defined in: [03-platform/packages/domain/src/ai-logging.ts:136](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L136)

## Implements

- [`IOperationLogger`](../interfaces/IOperationLogger.md)

## Constructors

### Constructor

> **new InMemoryOperationLogger**(`maxEntries?`): `InMemoryOperationLogger`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:140](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L140)

#### Parameters

##### maxEntries?

`number` = `1000`

#### Returns

`InMemoryOperationLogger`

## Methods

### addTags()

> **addTags**(`operationId`, `tags`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:211](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L211)

Add tags to an operation

#### Parameters

##### operationId

`string`

##### tags

`string`[]

#### Returns

`void`

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`addTags`](../interfaces/IOperationLogger.md#addtags)

***

### clear()

> **clear**(): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:265](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L265)

Clear all operations

#### Returns

`void`

***

### fail()

> **fail**(`operationId`, `error`, `errorCode?`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:187](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L187)

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

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`fail`](../interfaces/IOperationLogger.md#fail)

***

### get()

> **get**(`operationId`): [`OperationLogEntry`](../interfaces/OperationLogEntry.md) \| `undefined`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:218](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L218)

Get operation entry

#### Parameters

##### operationId

`string`

#### Returns

[`OperationLogEntry`](../interfaces/OperationLogEntry.md) \| `undefined`

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`get`](../interfaces/IOperationLogger.md#get)

***

### getAll()

> **getAll**(): [`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

Defined in: [03-platform/packages/domain/src/ai-logging.ts:235](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L235)

Get all operations (for testing/debugging)

#### Returns

[`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

***

### getAnomalies()

> **getAnomalies**(): [`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

Defined in: [03-platform/packages/domain/src/ai-logging.ts:256](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L256)

Get operations with anomalies

#### Returns

[`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

***

### getByCorrelationId()

> **getByCorrelationId**(`correlationId`): [`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

Defined in: [03-platform/packages/domain/src/ai-logging.ts:222](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L222)

Get all operations for a correlation ID

#### Parameters

##### correlationId

`string`

#### Returns

[`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`getByCorrelationId`](../interfaces/IOperationLogger.md#getbycorrelationid)

***

### getByType()

> **getByType**(`type`): [`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

Defined in: [03-platform/packages/domain/src/ai-logging.ts:242](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L242)

Get operations by type

#### Parameters

##### type

[`OperationType`](../type-aliases/OperationType.md)

#### Returns

[`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

***

### getFailed()

> **getFailed**(): [`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

Defined in: [03-platform/packages/domain/src/ai-logging.ts:249](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L249)

Get failed operations

#### Returns

[`OperationLogEntry`](../interfaces/OperationLogEntry.md)[]

***

### skip()

> **skip**(`operationId`, `reason`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:201](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L201)

Mark operation as skipped

#### Parameters

##### operationId

`string`

##### reason

`string`

#### Returns

`void`

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`skip`](../interfaces/IOperationLogger.md#skip)

***

### start()

> **start**(`type`, `input?`, `options?`): `string`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:144](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L144)

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

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`start`](../interfaces/IOperationLogger.md#start)

***

### success()

> **success**(`operationId`, `output?`, `aiContext?`): `void`

Defined in: [03-platform/packages/domain/src/ai-logging.ts:172](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-logging.ts#L172)

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

#### Implementation of

[`IOperationLogger`](../interfaces/IOperationLogger.md).[`success`](../interfaces/IOperationLogger.md#success)
