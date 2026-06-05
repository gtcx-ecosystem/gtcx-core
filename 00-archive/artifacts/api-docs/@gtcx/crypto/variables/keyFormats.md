[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / keyFormats

# Variable: keyFormats

> `const` **keyFormats**: `object`

Defined in: [keys.ts:177](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/keys.ts#L177)

Convert key to different formats

## Type Declaration

### fromBase64()

> **fromBase64**: (`base64`) => `string`

#### Parameters

##### base64

`string`

#### Returns

`string`

### toBase64()

> **toBase64**: (`hex`) => `string`

#### Parameters

##### hex

`string`

#### Returns

`string`

### toBytes()

> **toBytes**: (`hex`) => `Uint8Array`

#### Parameters

##### hex

`string`

#### Returns

`Uint8Array`

### toHex()

> **toHex**: (`bytes`) => `string`

#### Parameters

##### bytes

`Uint8Array`

#### Returns

`string`
