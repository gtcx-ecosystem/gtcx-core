[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / StorageBackend

# Interface: StorageBackend

Defined in: [03-platform/packages/security/src/offline/secure-storage/types.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/types.ts#L34)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage/types.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/types.ts#L39)

#### Returns

`Promise`\<`void`\>

***

### getAllKeys()

> **getAllKeys**(): `Promise`\<`string`[]\>

Defined in: [03-platform/packages/security/src/offline/secure-storage/types.ts:38](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/types.ts#L38)

#### Returns

`Promise`\<`string`[]\>

***

### getItem()

> **getItem**(`key`): `Promise`\<`string` \| `null`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage/types.ts:35](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/types.ts#L35)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### removeItem()

> **removeItem**(`key`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage/types.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/types.ts#L37)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### setItem()

> **setItem**(`key`, `value`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage/types.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage/types.ts#L36)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>
