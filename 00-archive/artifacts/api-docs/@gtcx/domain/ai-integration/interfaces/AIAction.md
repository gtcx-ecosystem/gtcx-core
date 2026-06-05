[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / AIAction

# Interface: AIAction

Defined in: [03-platform/packages/domain/src/ai-integration.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L80)

AI-suggested action

## Properties

### confidence

> **confidence**: `number`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:92](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L92)

Confidence in this recommendation

***

### description

> **description**: `string`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:86](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L86)

Action description

***

### id

> **id**: `string`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:82](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L82)

Action identifier

***

### params?

> `optional` **params**: `Record`\<`string`, `unknown`\>

Defined in: [03-platform/packages/domain/src/ai-integration.ts:90](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L90)

Parameters for the action

***

### priority

> **priority**: `number`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:88](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L88)

Priority (1-10)

***

### type

> **type**: `"registration"` \| `"trade"` \| `"compliance"` \| `"alert"` \| `"notification"`

Defined in: [03-platform/packages/domain/src/ai-integration.ts:84](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L84)

Action type
