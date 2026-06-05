[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-logging](../README.md) / OperationLogEntry

# Interface: OperationLogEntry

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L32)

## Properties

### aiContext?

> `optional` **aiContext**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:64](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L64)

AI analysis hints

#### anomalies?

> `optional` **anomalies**: `string`[]

Anomaly indicators

#### confidence?

> `optional` **confidence**: `number`

Confidence score (0-1)

#### patterns?

> `optional` **patterns**: `string`[]

Pattern matches

#### suggestedNextOps?

> `optional` **suggestedNextOps**: [`OperationType`](../type-aliases/OperationType.md)[]

Suggested follow-up operations

***

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:60](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L60)

Correlation ID for distributed tracing

***

### duration?

> `optional` **duration**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L44)

Duration (ms)

***

### endTime?

> `optional` **endTime**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:42](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L42)

End timestamp (ms)

***

### error?

> `optional` **error**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L50)

Error details if failed

#### code?

> `optional` **code**: `string`

#### message

> **message**: `string`

#### stack?

> `optional` **stack**: `string`

***

### input?

> `optional` **input**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L46)

Input summary (sanitized, no PII)

***

### operationId

> **operationId**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L34)

Unique operation ID

***

### output?

> `optional` **output**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:48](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L48)

Output summary

***

### parentId?

> `optional` **parentId**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:58](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L58)

Parent operation ID for nested operations

***

### startTime

> **startTime**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L40)

Start timestamp (ms)

***

### status

> **status**: [`OperationStatus`](../type-aliases/OperationStatus.md)

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L38)

Current status

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:62](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L62)

Tags for filtering

***

### type

> **type**: [`OperationType`](../type-aliases/OperationType.md)

Defined in: [03-platform/packages/domain/03-platform/src/ai-logging.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/ai-logging.ts#L36)

Operation type
