[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / UssdRequest

# Interface: UssdRequest

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:7](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L7)

USSD request as received from a mobile network gateway.

Gateways typically send this as URL-encoded POST data
or JSON payload on each user interaction.

## Properties

### networkCode?

> `optional` **networkCode**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L17)

Optional mobile network operator code.

***

### phoneNumber

> **phoneNumber**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L11)

MSISDN of the subscriber (E.164 format preferred).

***

### serviceCode

> **serviceCode**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:13](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L13)

The dialed service code, e.g. `*384*123#`.

***

### sessionId

> **sessionId**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:9](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L9)

Gateway-assigned session identifier.

***

### text

> **text**: `string`

Defined in: [03-platform/packages/connectivity/src/ussd/types.ts:15](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/src/ussd/types.ts#L15)

Text entered by the user since the last prompt (empty string on first hit).
