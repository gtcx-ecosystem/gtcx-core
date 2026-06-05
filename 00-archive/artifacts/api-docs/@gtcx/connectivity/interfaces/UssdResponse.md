[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / UssdResponse

# Interface: UssdResponse

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/types.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/types.ts#L26)

USSD response to be returned to the gateway.

The gateway renders `text` on the handset.
When `sessionActive` is `false` the gateway terminates the session.

## Properties

### sessionActive

> **sessionActive**: `boolean`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/types.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/types.ts#L30)

`true` to keep the session open and wait for further input.

***

### text

> **text**: `string`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/types.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/types.ts#L28)

Body text shown to the user. Keep under 160 chars for feature-phone compatibility.
