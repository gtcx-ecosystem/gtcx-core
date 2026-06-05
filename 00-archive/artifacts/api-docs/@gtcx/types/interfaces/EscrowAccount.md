[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / EscrowAccount

# Interface: EscrowAccount

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:148](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L148)

Escrow account for holding funds/assets

## Properties

### id

> **id**: `string`

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:149](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L149)

***

### lockedAt

> **lockedAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:153](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L153)

***

### releaseConditions

> **releaseConditions**: [`ReleaseCondition`](ReleaseCondition.md)[]

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:154](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L154)

***

### releasedAt?

> `optional` **releasedAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:155](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L155)

***

### releasedTo?

> `optional` **releasedTo**: `string`

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:156](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L156)

***

### status

> **status**: [`EscrowStatus`](../type-aliases/EscrowStatus.md)

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:152](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L152)

***

### tradeMatchId

> **tradeMatchId**: `string`

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:150](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L150)

***

### type

> **type**: `"payment"` \| `"asset"` \| `"both"`

Defined in: [03-platform/packages/types/src/protocols/pvp.ts:151](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/pvp.ts#L151)
