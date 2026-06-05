[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / UssdSessionData

# Interface: UssdSessionData

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L44)

Persisted data for an active USSD session.

## Properties

### createdAt

> **createdAt**: `number`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:53](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L53)

Unix timestamp (ms) when the session was created.

***

### currentMenu?

> `optional` **currentMenu**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L51)

Identifier of the current menu/step, if any.

***

### data

> **data**: `Record`\<`string`, `string`\>

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L49)

Key-value store accumulated during the session.

***

### lastActivityAt

> **lastActivityAt**: `number`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:55](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L55)

Unix timestamp (ms) of the most recent interaction.

***

### phoneNumber

> **phoneNumber**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L46)

***

### sessionId

> **sessionId**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L45)

***

### state

> **state**: [`UssdSessionState`](../type-aliases/UssdSessionState.md)

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L47)
