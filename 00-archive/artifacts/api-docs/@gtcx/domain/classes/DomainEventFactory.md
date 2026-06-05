[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / DomainEventFactory

# Class: DomainEventFactory

Defined in: 03-platform/packages/events/dist/index.d.ts:168

## Constructors

### Constructor

> **new DomainEventFactory**(`correlationId?`): `DomainEventFactory`

Defined in: 03-platform/packages/events/dist/index.d.ts:170

#### Parameters

##### correlationId?

`string`

#### Returns

`DomainEventFactory`

## Methods

### compliance()

> **compliance**\<`T`\>(`type`, `payload`, `correlationId?`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

Defined in: 03-platform/packages/events/dist/index.d.ts:183

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

Defined in: 03-platform/packages/events/dist/index.d.ts:171

#### Returns

`string` \| `undefined`

***

### registration()

> **registration**\<`T`\>(`type`, `payload`, `correlationId?`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`T`\>

Defined in: 03-platform/packages/events/dist/index.d.ts:175

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

Defined in: 03-platform/packages/events/dist/index.d.ts:179

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
