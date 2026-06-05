[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / ConfidenceRules

# Interface: ConfidenceRules

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts:116](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts#L116)

Confidence scoring rules

## Properties

### baseScore

> **baseScore**: `number`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts:117](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts#L117)

***

### decayModel?

> `optional` **decayModel**: `"linear"` \| `"exponential"` \| `"none"`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts:120](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts#L120)

***

### evidenceWeights

> **evidenceWeights**: `Record`\<`string`, `number`\>

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts:118](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts#L118)

***

### halfLife?

> `optional` **halfLife**: `number`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts:121](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts#L121)

***

### minimumThreshold

> **minimumThreshold**: `number`

Defined in: [03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts:119](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/definitions/predicates.ts#L119)
