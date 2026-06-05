[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/security](../../README.md) / [audit](../README.md) / AuditTrail

# Interface: AuditTrail

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:313](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L313)

Create an audit trail for a multi-step operation

## Example

```ts
const audit = createAuditTrail('custody_transfer');
audit.record('initiated', { from: vaultA, to: vaultB });
audit.record('verified', { inspector: inspectorId });
audit.record('completed', { timestamp: Date.now() });
await audit.finalize();
```

## Properties

### operationId

> `readonly` **operationId**: `string`

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:314](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L314)

***

### operationType

> `readonly` **operationType**: `string`

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:315](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L315)

***

### startedAt

> `readonly` **startedAt**: `string`

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:316](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L316)

## Methods

### finalize()

> **finalize**(`outcome?`, `reason?`): `Promise`\<`void`\>

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:319](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L319)

#### Parameters

##### outcome?

[`SecurityOutcome`](../type-aliases/SecurityOutcome.md)

##### reason?

`string`

#### Returns

`Promise`\<`void`\>

***

### record()

> **record**(`step`, `metadata?`): `void`

Defined in: [03-platform/packages/security/03-platform/src/audit/events.ts:318](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/security/03-platform/src/audit/events.ts#L318)

#### Parameters

##### step

`string`

##### metadata?

`Record`\<`string`, `unknown`\>

#### Returns

`void`
