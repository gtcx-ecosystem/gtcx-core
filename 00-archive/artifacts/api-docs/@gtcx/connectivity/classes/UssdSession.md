[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / UssdSession

# Class: UssdSession

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:12](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L12)

In-memory USSD session manager.

Handles creation, lookup, state transitions, and expiration
of feature-phone sessions. Designed for single-node deployments;
scale-out requires an external session store.

## Constructors

### Constructor

> **new UssdSession**(`options?`): `UssdSession`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:16](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L16)

#### Parameters

##### options?

[`UssdSessionOptions`](../interfaces/UssdSessionOptions.md)

#### Returns

`UssdSession`

## Methods

### cleanup()

> **cleanup**(): `number`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:87](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L87)

Remove all sessions that have exceeded their TTL. Returns the number removed.

#### Returns

`number`

***

### clear()

> **clear**(): `void`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:117](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L117)

Clear every session.

#### Returns

`void`

***

### count()

> **count**(): `number`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:100](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L100)

Return the number of active (non-expired) sessions.

#### Returns

`number`

***

### create()

> **create**(`sessionId`, `phoneNumber`): [`UssdSessionData`](../interfaces/UssdSessionData.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:25](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L25)

Create a new session or replace an existing one.

#### Parameters

##### sessionId

`string`

##### phoneNumber

`string`

#### Returns

[`UssdSessionData`](../interfaces/UssdSessionData.md)

The newly created session data.

***

### destroy()

> **destroy**(`sessionId`): `boolean`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:75](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L75)

Remove a session permanently.

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`

***

### get()

> **get**(`sessionId`): [`UssdSessionData`](../interfaces/UssdSessionData.md) \| `undefined`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L40)

Retrieve a session by ID, or `undefined` if not found.

#### Parameters

##### sessionId

`string`

#### Returns

[`UssdSessionData`](../interfaces/UssdSessionData.md) \| `undefined`

***

### isExpired()

> **isExpired**(`sessionId`): `boolean`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L80)

Check whether a session has exceeded its TTL.

#### Parameters

##### sessionId

`string`

#### Returns

`boolean`

***

### size()

> **size**(): `number`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:112](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L112)

Return the total number of sessions in the registry (including expired).

#### Returns

`number`

***

### update()

> **update**(`sessionId`, `updates`): [`UssdSessionData`](../interfaces/UssdSessionData.md) \| `undefined`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/session.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/session.ts#L50)

Update session state and/or accumulated data.

Automatically refreshes `lastActivityAt`. Returns the updated
session, or `undefined` if the session does not exist.

#### Parameters

##### sessionId

`string`

##### updates

###### currentMenu?

`string`

###### data?

`Record`\<`string`, `string`\>

###### state?

[`UssdSessionState`](../type-aliases/UssdSessionState.md)

#### Returns

[`UssdSessionData`](../interfaces/UssdSessionData.md) \| `undefined`
