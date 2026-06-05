[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/events](../README.md) / TypedEventBus

# Class: TypedEventBus

Defined in: [event-bus.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L24)

## Implements

- [`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md)

## Constructors

### Constructor

> **new TypedEventBus**(`options?`): `TypedEventBus`

Defined in: [event-bus.ts:37](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L37)

#### Parameters

##### options?

[`EventBusOptions`](../interfaces/EventBusOptions.md)

#### Returns

`TypedEventBus`

## Accessors

### isDestroyed

#### Get Signature

> **get** **isDestroyed**(): `boolean`

Defined in: [event-bus.ts:208](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L208)

Whether the bus has been destroyed.

##### Returns

`boolean`

***

### isOnline

#### Get Signature

> **get** **isOnline**(): `boolean`

Defined in: [event-bus.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L51)

Whether the bus is currently online (dispatching events).

##### Returns

`boolean`

## Methods

### clear()

> **clear**(): `void`

Defined in: [event-bus.ts:184](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L184)

Clear all event history.

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [event-bus.ts:197](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L197)

Destroy the event bus, removing all subscriptions and clearing state.

#### Returns

`void`

***

### emit()

> **emit**(`event`): `void`

Defined in: [event-bus.ts:81](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L81)

Emit a domain event.
If online, dispatches to handlers immediately.
If offline and buffering is enabled, stores for later replay.

#### Parameters

##### event

[`DomainEvent`](../interfaces/DomainEvent.md)

#### Returns

`void`

#### Implementation of

[`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md).[`emit`](../interfaces/IDomainEventEmitter.md#emit)

***

### getHistory()

> **getHistory**(`type?`, `limit?`): [`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

Defined in: [event-bus.ts:160](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L160)

Retrieve past events, optionally filtered by type and limited in count.

#### Parameters

##### type?

[`DomainEventType`](../type-aliases/DomainEventType.md)

##### limit?

`number`

#### Returns

[`DomainEvent`](../interfaces/DomainEvent.md)\<`unknown`\>[]

***

### getOfflineBuffer()

> **getOfflineBuffer**(): [`OfflineEventBuffer`](OfflineEventBuffer.md)

Defined in: [event-bus.ts:217](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L217)

Get the underlying offline buffer for direct inspection.

#### Returns

[`OfflineEventBuffer`](OfflineEventBuffer.md)

***

### goOffline()

> **goOffline**(): `void`

Defined in: [event-bus.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L68)

Set the bus to offline mode. Events will be buffered instead of dispatched.

#### Returns

`void`

***

### goOnline()

> **goOnline**(): `Promise`\<`number`\>

Defined in: [event-bus.ts:59](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L59)

Set the bus to online mode. If offline buffering is enabled,
buffered events are flushed automatically.

#### Returns

`Promise`\<`number`\>

***

### off()

> **off**(`type`, `handler`): `void`

Defined in: [event-bus.ts:137](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L137)

Unsubscribe a handler from a specific event type.

#### Parameters

##### type

[`DomainEventType`](../type-aliases/DomainEventType.md)

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

#### Returns

`void`

***

### on()

> **on**(`type`, `handler`): () => `void`

Defined in: [event-bus.ts:102](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L102)

Subscribe to a specific event type.
Returns an unsubscribe function (IDomainEventEmitter contract)
and also provides an EventSubscription object.

#### Parameters

##### type

[`DomainEventType`](../type-aliases/DomainEventType.md)

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

#### Returns

> (): `void`

##### Returns

`void`

#### Implementation of

[`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md).[`on`](../interfaces/IDomainEventEmitter.md#on)

***

### onAny()

> **onAny**(`handler`): () => `void`

Defined in: [event-bus.ts:122](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L122)

Subscribe to all events.
Returns an unsubscribe function.

#### Parameters

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

#### Returns

> (): `void`

##### Returns

`void`

#### Implementation of

[`IDomainEventEmitter`](../interfaces/IDomainEventEmitter.md).[`onAny`](../interfaces/IDomainEventEmitter.md#onany)

***

### once()

> **once**(`type`, `handler`): () => `void`

Defined in: [event-bus.ts:145](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/events/03-platform/src/event-bus.ts#L145)

Subscribe to a specific event type for one-time delivery.
The handler is automatically removed after its first invocation.

#### Parameters

##### type

[`DomainEventType`](../type-aliases/DomainEventType.md)

##### handler

[`EventHandler`](../type-aliases/EventHandler.md)

#### Returns

> (): `void`

##### Returns

`void`
