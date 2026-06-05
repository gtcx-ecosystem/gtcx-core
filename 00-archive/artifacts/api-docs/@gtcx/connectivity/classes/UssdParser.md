[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / UssdParser

# Class: UssdParser

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/parser.ts:17](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/parser.ts#L17)

USSD message parser and formatter.

Normalises raw gateway payloads into structured [UssdRequest](../interfaces/UssdRequest.md)
objects and formats outgoing [UssdResponse](../interfaces/UssdResponse.md) payloads.

## Constructors

### Constructor

> **new UssdParser**(): `UssdParser`

#### Returns

`UssdParser`

## Methods

### extractInput()

> **extractInput**(`dialString`, `serviceCode`): `string`

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/parser.ts:79](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/parser.ts#L79)

Extract user input from a raw dial string.

USSD dial strings follow the pattern `*service-code*input#`.
Only the portion after the service code is returned.

#### Parameters

##### dialString

`string`

##### serviceCode

`string`

#### Returns

`string`

#### Example

```ts
parser.extractInput('*384*123*1*42#'); // => '1*42'
parser.extractInput('*384*123#');      // => ''
```

***

### formatResponse()

> **formatResponse**(`text`, `sessionActive`): [`UssdResponse`](../interfaces/UssdResponse.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/parser.ts:63](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/parser.ts#L63)

Format a response for the gateway.

Some gateways expect JSON; others expect URL-encoded form data.
This helper returns a plain object that the transport layer can
serialise as needed.

#### Parameters

##### text

`string`

##### sessionActive

`boolean`

#### Returns

[`UssdResponse`](../interfaces/UssdResponse.md)

***

### parse()

> **parse**(`payload`): [`UssdRequest`](../interfaces/UssdRequest.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/parser.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/parser.ts#L26)

Parse a raw gateway payload into a structured request.

Accepts both camelCase and snake_case field names to maximise
compatibility with different gateway implementations.

#### Parameters

##### payload

`unknown`

#### Returns

[`UssdRequest`](../interfaces/UssdRequest.md)

#### Throws

when required fields are missing or invalid.

***

### parseDialString()

> **parseDialString**(`dialString`): [`UssdParsedInput`](../interfaces/UssdParsedInput.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/ussd/parser.ts:107](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/ussd/parser.ts#L107)

Parse a full dial string into service code and user input.

#### Parameters

##### dialString

`string`

#### Returns

[`UssdParsedInput`](../interfaces/UssdParsedInput.md)

#### Example

```ts
parser.parseDialString('*384*123*1*42#'); // => { serviceCode: '*384*123#', input: '1*42' }
```
