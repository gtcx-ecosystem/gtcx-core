[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/security](../README.md) / [](../README.md) / CredentialCache

# Class: CredentialCache

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L82)

Credential cache manager
Uses SecureStorageBase for encrypted persistence

## Constructors

### Constructor

> **new CredentialCache**(`config?`): `CredentialCache`

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:85](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L85)

#### Parameters

##### config?

`Partial`\<[`CredentialCacheConfig`](../interfaces/CredentialCacheConfig.md)\> = `{}`

#### Returns

`CredentialCache`

## Methods

### calculateOfflineExpiry()

> **calculateOfflineExpiry**(`issuedAt`): `Date`

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:134](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L134)

Calculate offline expiry from issuance

#### Parameters

##### issuedAt

`Date`

#### Returns

`Date`

***

### findExpiredCredentials()

> **findExpiredCredentials**(`credentials`): `object`[]

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:187](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L187)

Find expired credentials for cleanup

#### Parameters

##### credentials

`object`[]

#### Returns

`object`[]

***

### hasValidSignatureChain()

> **hasValidSignatureChain**(`credential`): `boolean`

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:200](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L200)

Validate signature chain (basic check)
Full verification should use @gtcx/crypto

#### Parameters

##### credential

###### dataHash

`string` = `...`

###### expiresAt

`string` = `...`

###### holderId

`string` = `...`

###### holderPublicKey

`string` = `...`

###### id

`string` = `...`

###### issuedAt

`string` = `...`

###### lastRevocationCheckAt

`string` = `...`

###### offlineExpiresAt

`string` = `...`

###### revocationListHash?

`string` = `...`

###### signatureChain

`object`[] = `...`

###### syncedAt

`string` = `...`

###### syncRequired

`boolean` = `...`

###### type

`"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"` = `...`

#### Returns

`boolean`

***

### isCredentialValidOffline()

> **isCredentialValidOffline**(`credential`): [`CredentialValidation`](../interfaces/CredentialValidation.md)

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:92](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L92)

Check if a credential is valid for offline use

#### Parameters

##### credential

###### dataHash

`string` = `...`

###### expiresAt

`string` = `...`

###### holderId

`string` = `...`

###### holderPublicKey

`string` = `...`

###### id

`string` = `...`

###### issuedAt

`string` = `...`

###### lastRevocationCheckAt

`string` = `...`

###### offlineExpiresAt

`string` = `...`

###### revocationListHash?

`string` = `...`

###### signatureChain

`object`[] = `...`

###### syncedAt

`string` = `...`

###### syncRequired

`boolean` = `...`

###### type

`"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"` = `...`

#### Returns

[`CredentialValidation`](../interfaces/CredentialValidation.md)

***

### markSynced()

> **markSynced**(`credential`): `object`

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:172](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L172)

Mark credential as synced

#### Parameters

##### credential

###### dataHash

`string` = `...`

###### expiresAt

`string` = `...`

###### holderId

`string` = `...`

###### holderPublicKey

`string` = `...`

###### id

`string` = `...`

###### issuedAt

`string` = `...`

###### lastRevocationCheckAt

`string` = `...`

###### offlineExpiresAt

`string` = `...`

###### revocationListHash?

`string` = `...`

###### signatureChain

`object`[] = `...`

###### syncedAt

`string` = `...`

###### syncRequired

`boolean` = `...`

###### type

`"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"` = `...`

#### Returns

`object`

##### dataHash

> **dataHash**: `string`

##### expiresAt

> **expiresAt**: `string`

##### holderId

> **holderId**: `string`

##### holderPublicKey

> **holderPublicKey**: `string`

##### id

> **id**: `string`

##### issuedAt

> **issuedAt**: `string`

##### lastRevocationCheckAt

> **lastRevocationCheckAt**: `string`

##### offlineExpiresAt

> **offlineExpiresAt**: `string`

##### revocationListHash?

> `optional` **revocationListHash**: `string`

##### signatureChain

> **signatureChain**: `object`[]

##### syncedAt

> **syncedAt**: `string`

##### syncRequired

> **syncRequired**: `boolean`

##### type

> **type**: `"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"`

***

### needsSync()

> **needsSync**(`credential`): `boolean`

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:141](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L141)

Check if credential needs sync

#### Parameters

##### credential

###### dataHash

`string` = `...`

###### expiresAt

`string` = `...`

###### holderId

`string` = `...`

###### holderPublicKey

`string` = `...`

###### id

`string` = `...`

###### issuedAt

`string` = `...`

###### lastRevocationCheckAt

`string` = `...`

###### offlineExpiresAt

`string` = `...`

###### revocationListHash?

`string` = `...`

###### signatureChain

`object`[] = `...`

###### syncedAt

`string` = `...`

###### syncRequired

`boolean` = `...`

###### type

`"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"` = `...`

#### Returns

`boolean`

***

### prepareForOffline()

> **prepareForOffline**(`credential`): `object`

Defined in: [03-platform/packages/security/src/offline/credential-cache.ts:157](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/offline/credential-cache.ts#L157)

Prepare credential for offline caching

#### Parameters

##### credential

`Omit`\<[`CredentialCacheEntry`](../type-aliases/CredentialCacheEntry.md), `"offlineExpiresAt"` \| `"syncedAt"` \| `"syncRequired"`\>

#### Returns

`object`

##### dataHash

> **dataHash**: `string`

##### expiresAt

> **expiresAt**: `string`

##### holderId

> **holderId**: `string`

##### holderPublicKey

> **holderPublicKey**: `string`

##### id

> **id**: `string`

##### issuedAt

> **issuedAt**: `string`

##### lastRevocationCheckAt

> **lastRevocationCheckAt**: `string`

##### offlineExpiresAt

> **offlineExpiresAt**: `string`

##### revocationListHash?

> `optional` **revocationListHash**: `string`

##### signatureChain

> **signatureChain**: `object`[]

##### syncedAt

> **syncedAt**: `string`

##### syncRequired

> **syncRequired**: `boolean`

##### type

> **type**: `"TRADEPASS"` \| `"SESSION"` \| `"TOKEN"` \| `"CERTIFICATE"`
