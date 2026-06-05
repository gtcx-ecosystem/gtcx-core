[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / DomainEventFactory

# Class: DomainEventFactory

Defined in: [types.ts:242](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L242)

## Constructors

### Constructor

> **new DomainEventFactory**(`correlationId?`): `DomainEventFactory`

Defined in: [types.ts:245](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L245)

#### Parameters

##### correlationId?

`string`

#### Returns

`DomainEventFactory`

## Methods

### compliance()

> **compliance**\<`T`\>(`type`, `payload`, `correlationId?`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

Defined in: [types.ts:292](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L292)

Create a compliance event

#### Type Parameters

##### T

`T`

#### Parameters

##### type

`"compliance.check_started"` | `"compliance.check_completed"` | `"compliance.violation_detected"` | `"compliance.warning_issued"` | `"compliance.report_generated"` | `"compliance.framework_registered"` | `"compliance.zk_proof_invalid"` | `"compliance.zk_proof_verified"`

##### payload

`T`

##### correlationId?

`string`

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

***

### getCorrelationId()

> **getCorrelationId**(): `string` \| `undefined`

Defined in: [types.ts:249](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L249)

#### Returns

`string` \| `undefined`

***

### registration()

> **registration**\<`T`\>(`type`, `payload`, `correlationId?`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

Defined in: [types.ts:256](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L256)

Create a registration event

#### Type Parameters

##### T

`T`

#### Parameters

##### type

`"registration.started"` | `"registration.validated"` | `"registration.completed"` | `"registration.failed"` | `"registration.progress_updated"`

##### payload

`T`

##### correlationId?

`string`

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

***

### trading()

> **trading**\<`T`\>(`type`, `payload`, `correlationId?`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

Defined in: [types.ts:274](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/src/types.ts#L274)

Create a trading event

#### Type Parameters

##### T

`T`

#### Parameters

##### type

`"trading.price_calculated"` | `"trading.opportunity_found"` | `"trading.trade_initiated"` | `"trading.trade_executed"` | `"trading.trade_failed"` | `"trading.settlement_started"` | `"trading.settlement_completed"`

##### payload

`T`

##### correlationId?

`string`

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>
