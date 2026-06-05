[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [versioning](../README.md) / deprecated

# Function: deprecated()

> **deprecated**(`info`): (`target`, `propertyKey`, `descriptor`) => `PropertyDescriptor`

Defined in: [03-platform/packages/domain/src/versioning.ts:88](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/versioning.ts#L88)

Decorator to mark methods as deprecated
Logs warning when method is called

## Parameters

### info

`Omit`\<[`DeprecationInfo`](../interfaces/DeprecationInfo.md), `"feature"`\>

## Returns

> (`target`, `propertyKey`, `descriptor`): `PropertyDescriptor`

### Parameters

#### target

`any`

#### propertyKey

`string`

#### descriptor

`PropertyDescriptor`

### Returns

`PropertyDescriptor`
