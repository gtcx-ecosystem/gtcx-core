[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/utils](../README.md) / deepClone

# Function: deepClone()

> **deepClone**\<`T`\>(`obj`): `T`

Defined in: [index.ts:84](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/utils/src/index.ts#L84)

Deep clone an object using structuredClone.
Handles Date, Map, Set, RegExp, ArrayBuffer, and other structured types
that JSON.parse(JSON.stringify()) would destroy.

## Type Parameters

### T

`T`

## Parameters

### obj

`T`

## Returns

`T`
