[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [offline](../README.md) / ConflictResolution

# Interface: ConflictResolution\<T\>

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L80)

## Type Parameters

### T

`T` = `unknown`

## Properties

### localData

> **localData**: `T`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L83)

***

### operationId

> **operationId**: `string`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L81)

***

### resolvedAt

> **resolvedAt**: `number`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:87](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L87)

***

### resolvedBy

> **resolvedBy**: `"user"` \| `"auto"`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:86](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L86)

***

### resolvedData?

> `optional` **resolvedData**: `T`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:85](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L85)

***

### serverData

> **serverData**: `T`

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:84](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L84)

***

### strategy

> **strategy**: [`ConflictStrategy`](../type-aliases/ConflictStrategy.md)

Defined in: [03-platform/packages/domain/03-platform/src/internal/offline-queue.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/03-platform/src/internal/offline-queue.ts#L82)
