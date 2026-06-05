[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/connectivity](../README.md) / ConnectivityDetector

# Class: ConnectivityDetector

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L47)

ConnectivityDetector provides network status detection for offline-first operation (Principle P8).

It periodically checks connectivity and notifies listeners when the state changes.
A pluggable `checkFn` allows injecting custom connectivity probes.

## Constructors

### Constructor

> **new ConnectivityDetector**(`options?`): `ConnectivityDetector`

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:58](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L58)

#### Parameters

##### options?

[`ConnectivityDetectorOptions`](../interfaces/ConnectivityDetectorOptions.md)

#### Returns

`ConnectivityDetector`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:125](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L125)

Clean up timers and listeners. The detector cannot be reused after destroy.

#### Returns

`void`

***

### forceCheck()

> **forceCheck**(): `Promise`\<[`ConnectivityState`](../interfaces/ConnectivityState.md)\>

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:105](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L105)

Trigger an immediate connectivity check.

#### Returns

`Promise`\<[`ConnectivityState`](../interfaces/ConnectivityState.md)\>

***

### getState()

> **getState**(): [`ConnectivityState`](../interfaces/ConnectivityState.md)

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L72)

Get the current connectivity state.

#### Returns

[`ConnectivityState`](../interfaces/ConnectivityState.md)

***

### onStateChange()

> **onStateChange**(`listener`): () => `void`

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L80)

Subscribe to state changes. Returns an unsubscribe function.
Listeners are only called when the state actually changes.

#### Parameters

##### listener

[`ConnectivityListener`](../type-aliases/ConnectivityListener.md)

#### Returns

> (): `void`

##### Returns

`void`

***

### setOnline()

> **setOnline**(`online`): `void`

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:115](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L115)

Manually set online/offline state. Useful for testing or manual override.
When setting offline, profile is set to 'offline'.
When setting online, profile is set to 'standard' (with no measurement data).

#### Parameters

##### online

`boolean`

#### Returns

`void`

***

### start()

> **start**(): `void`

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:88](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L88)

Begin periodic connectivity checks.

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [03-platform/packages/connectivity/03-platform/src/detector.ts:97](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/connectivity/03-platform/src/detector.ts#L97)

Stop periodic connectivity checks.

#### Returns

`void`
