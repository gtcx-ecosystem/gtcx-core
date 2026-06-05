[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / resetFailedAttempts

# Function: resetFailedAttempts()

> **resetFailedAttempts**(`session`): `object`

Defined in: [03-platform/packages/security/src/auth/sessions.ts:233](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/src/auth/sessions.ts#L233)

Reset failed attempts after successful auth

## Parameters

### session

#### createdAt

`string` = `...`

#### deviceId?

`string` = `...`

#### deviceType?

`"MOBILE"` \| `"WEB"` \| `"DESKTOP"` \| `"API"` = `...`

#### expiresAt

`string` = `...`

#### failedAttempts

`number` = `...`

#### geoLocation?

\{ `city?`: `string`; `country`: `string`; `region?`: `string`; \} = `...`

#### geoLocation.city?

`string` = `...`

#### geoLocation.country

`string` = `...`

#### geoLocation.region?

`string` = `...`

#### id

`string` = `...`

#### ipAddress?

`string` = `...`

#### lastActiveAt

`string` = `...`

#### lockedUntil?

`string` = `...`

#### offlineCapable

`boolean` = `...`

#### offlineExpiresAt?

`string` = `...`

#### offlineSyncedAt?

`string` = `...`

#### state

`"ACTIVE"` \| `"EXPIRED"` \| `"REVOKED"` \| `"LOCKED"` \| `"OFFLINE"` = `SessionStateSchema`

#### tradePassId?

`string` = `...`

#### userAgent?

`string` = `...`

#### userId

`string` = `...`

## Returns

`object`

### createdAt

> **createdAt**: `string`

### deviceId?

> `optional` **deviceId**: `string`

### deviceType?

> `optional` **deviceType**: `"MOBILE"` \| `"WEB"` \| `"DESKTOP"` \| `"API"`

### expiresAt

> **expiresAt**: `string`

### failedAttempts

> **failedAttempts**: `number`

### geoLocation?

> `optional` **geoLocation**: `object`

#### geoLocation.city?

> `optional` **city**: `string`

#### geoLocation.country

> **country**: `string`

#### geoLocation.region?

> `optional` **region**: `string`

### id

> **id**: `string`

### ipAddress?

> `optional` **ipAddress**: `string`

### lastActiveAt

> **lastActiveAt**: `string`

### lockedUntil?

> `optional` **lockedUntil**: `string`

### offlineCapable

> **offlineCapable**: `boolean`

### offlineExpiresAt?

> `optional` **offlineExpiresAt**: `string`

### offlineSyncedAt?

> `optional` **offlineSyncedAt**: `string`

### state

> **state**: `"ACTIVE"` \| `"EXPIRED"` \| `"REVOKED"` \| `"LOCKED"` \| `"OFFLINE"` = `SessionStateSchema`

### tradePassId?

> `optional` **tradePassId**: `string`

### userAgent?

> `optional` **userAgent**: `string`

### userId

> **userId**: `string`
