[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / ProtocolEvent

# Type Alias: ProtocolEvent\<K\>

> **ProtocolEvent**\<`K`\> = [`DomainEvent`](../interfaces/DomainEvent.md)\<[`ProtocolEventDataMap`](../interfaces/ProtocolEventDataMap.md)\[`K`\]\> & `object`

Defined in: [03-platform/packages/types/src/common/events.ts:183](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/common/events.ts#L183)

Type-safe protocol event constructor.

## Type Declaration

### type

> **type**: `K`

## Type Parameters

### K

`K` *extends* keyof [`ProtocolEventDataMap`](../interfaces/ProtocolEventDataMap.md)
