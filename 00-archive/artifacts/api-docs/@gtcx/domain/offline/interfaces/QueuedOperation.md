[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [offline](../README.md) / QueuedOperation

# Interface: QueuedOperation\<T\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:33](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L33)

## Type Parameters

### T

`T` = `unknown`

## Properties

### attempts

> **attempts**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L45)

Number of retry attempts

***

### completedAt?

> `optional` **completedAt**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:53](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L53)

Completed timestamp

***

### conflictStrategy

> **conflictStrategy**: [`ConflictStrategy`](../type-aliases/ConflictStrategy.md)

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:61](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L61)

Conflict resolution strategy

***

### createdAt

> **createdAt**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L49)

Created timestamp

***

### dependsOn?

> `optional` **dependsOn**: `string`[]

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L59)

Dependencies (other operation IDs that must complete first)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L35)

Unique operation ID

***

### lastAttemptAt?

> `optional` **lastAttemptAt**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L51)

Last attempt timestamp

***

### lastError?

> `optional` **lastError**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:55](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L55)

Error from last attempt

***

### maxAttempts

> **maxAttempts**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L47)

Maximum retry attempts

***

### metadata?

> `optional` **metadata**: `object`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:63](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L63)

Metadata for conflict resolution

#### checksum?

> `optional` **checksum**: `string`

#### entityId?

> `optional` **entityId**: `string`

#### entityType?

> `optional` **entityType**: `string`

#### version?

> `optional` **version**: `number`

***

### payload

> **payload**: `T`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:43](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L43)

Operation payload

***

### priority

> **priority**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:57](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L57)

Priority (higher = more urgent)

***

### sequence

> **sequence**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L37)

Monotonic logical sequence for replay ordering

***

### status

> **status**: [`QueuedOperationStatus`](../type-aliases/QueuedOperationStatus.md)

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:41](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L41)

Current status

***

### type

> **type**: [`QueuedOperationType`](../type-aliases/QueuedOperationType.md)

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L39)

Operation type
