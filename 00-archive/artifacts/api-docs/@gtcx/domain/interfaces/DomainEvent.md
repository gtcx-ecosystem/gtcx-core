[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / DomainEvent

# Interface: DomainEvent\<T\>

Defined in: 03-platform/packages/events/dist/index.d.ts:10

## Type Parameters

### T

`T` = `unknown`

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: 03-platform/packages/events/dist/index.d.ts:18

Correlation ID for distributed tracing

***

### payload

> **payload**: `T`

Defined in: 03-platform/packages/events/dist/index.d.ts:14

Event payload

***

### source

> **source**: `"registration"` \| `"compliance"` \| `"trading"`

Defined in: 03-platform/packages/events/dist/index.d.ts:20

Source service

***

### timestamp

> **timestamp**: `number`

Defined in: 03-platform/packages/events/dist/index.d.ts:16

Unix timestamp (ms)

***

### type

> **type**: [`DomainEventType`](../type-aliases/DomainEventType.md)

Defined in: 03-platform/packages/events/dist/index.d.ts:12

Event type

***

### version

> **version**: `number`

Defined in: 03-platform/packages/events/dist/index.d.ts:22

Schema version for evolution
