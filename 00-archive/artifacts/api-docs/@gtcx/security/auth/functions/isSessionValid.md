[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [auth](../README.md) / isSessionValid

# Function: isSessionValid()

> **isSessionValid**(`session`, `config?`): [`SessionValidationResult`](../interfaces/SessionValidationResult.md)

Defined in: [03-platform/packages/security/03-platform/src/auth/sessions.ts:107](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/auth/sessions.ts#L107)

Check if session is valid (not expired, not revoked, not locked)

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

### config?

[`SessionConfig`](../interfaces/SessionConfig.md) = `DEFAULT_SESSION_CONFIG`

## Returns

[`SessionValidationResult`](../interfaces/SessionValidationResult.md)
