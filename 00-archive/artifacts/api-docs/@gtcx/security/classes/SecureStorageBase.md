[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / SecureStorageBase

# Abstract Class: SecureStorageBase

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L28)

## Constructors

### Constructor

> **new SecureStorageBase**(`config?`): `SecureStorageBase`

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L34)

#### Parameters

##### config?

`Partial`\<[`SecureStorageOfflineSecurityConfig`](../type-aliases/SecureStorageOfflineSecurityConfig.md)\> = `{}`

#### Returns

`SecureStorageBase`

## Properties

### config

> `protected` **config**: `object`

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:29](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L29)

#### argon2Iterations

> **argon2Iterations**: `number`

#### argon2Memory

> **argon2Memory**: `number`

#### argon2Parallelism

> **argon2Parallelism**: `number`

#### credentialRefreshBufferHours

> **credentialRefreshBufferHours**: `number`

#### integrityCheckIntervalMinutes

> **integrityCheckIntervalMinutes**: `number`

#### keyDerivation

> **keyDerivation**: `"ARGON2ID"`

#### lockoutDurationSeconds

> **lockoutDurationSeconds**: `number`

#### maxFailedAttempts

> **maxFailedAttempts**: `number`

#### maxOfflineHours

> **maxOfflineHours**: `number`

#### storageEncryption

> **storageEncryption**: `"AES-256-GCM"`

#### wipeOnExceed

> **wipeOnExceed**: `boolean`

***

### encryptionKey

> `protected` **encryptionKey**: `Uint8Array`\<`ArrayBufferLike`\> \| `null` = `null`

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L31)

***

### state

> `protected` **state**: [`SecureStorageState`](../interfaces/SecureStorageState.md)

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L30)

## Methods

### decrypt()

> `abstract` `protected` **decrypt**(`ciphertext`, `key`, `iv`, `tag`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L74)

#### Parameters

##### ciphertext

`Uint8Array`

##### key

`Uint8Array`

##### iv

`Uint8Array`

##### tag

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### deriveKey()

> `abstract` `protected` **deriveKey**(`secret`, `salt`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L67)

#### Parameters

##### secret

`string`

##### salt

`Uint8Array`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### encrypt()

> `abstract` `protected` **encrypt**(`plaintext`, `key`): `Promise`\<\{ `ciphertext`: `Uint8Array`; `iv`: `Uint8Array`; `tag`: `Uint8Array`; \}\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L69)

#### Parameters

##### plaintext

`Uint8Array`

##### key

`Uint8Array`

#### Returns

`Promise`\<\{ `ciphertext`: `Uint8Array`; `iv`: `Uint8Array`; `tag`: `Uint8Array`; \}\>

***

### get()

> **get**\<`T`\>(`key`): `Promise`\<`T` \| `null`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:168](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L168)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`T` \| `null`\>

***

### getDeviceSalt()

> `abstract` `protected` **getDeviceSalt**(): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:83](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L83)

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### getStorage()

> `abstract` `protected` **getStorage**(): [`StorageBackend`](../interfaces/StorageBackend.md)

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L81)

#### Returns

[`StorageBackend`](../interfaces/StorageBackend.md)

***

### lock()

> **lock**(): `void`

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:138](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L138)

#### Returns

`void`

***

### needsSync()

> **needsSync**(): `boolean`

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:230](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L230)

#### Returns

`boolean`

***

### reinitialize()

> **reinitialize**(`secret`): `Promise`\<[`UnlockResult`](../interfaces/UnlockResult.md)\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:300](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L300)

#### Parameters

##### secret

`string`

#### Returns

`Promise`\<[`UnlockResult`](../interfaces/UnlockResult.md)\>

***

### remove()

> **remove**(`key`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:216](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L216)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

***

### set()

> **set**\<`T`\>(`key`, `data`, `expiresInHours?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:146](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L146)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### data

`T`

##### expiresInHours?

`number`

#### Returns

`Promise`\<`void`\>

***

### unlock()

> **unlock**(`secret`): `Promise`\<[`UnlockResult`](../interfaces/UnlockResult.md)\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:85](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L85)

#### Parameters

##### secret

`string`

#### Returns

`Promise`\<[`UnlockResult`](../interfaces/UnlockResult.md)\>

***

### wipe()

> **wipe**(): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/src/offline/secure-storage.ts:220](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/secure-storage.ts#L220)

#### Returns

`Promise`\<`void`\>
