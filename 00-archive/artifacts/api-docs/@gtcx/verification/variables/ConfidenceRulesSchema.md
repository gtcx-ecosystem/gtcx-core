[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / ConfidenceRulesSchema

# Variable: ConfidenceRulesSchema

> `const` **ConfidenceRulesSchema**: `ZodObject`\<\{ `baseScore`: `ZodNumber`; `decayModel`: `ZodOptional`\<`ZodEnum`\<\[`"linear"`, `"exponential"`, `"none"`\]\>\>; `evidenceWeights`: `ZodRecord`\<`ZodString`, `ZodNumber`\>; `halfLife`: `ZodOptional`\<`ZodNumber`\>; `minimumThreshold`: `ZodNumber`; \}, `"strip"`, `ZodTypeAny`, \{ `baseScore`: `number`; `decayModel?`: `"linear"` \| `"exponential"` \| `"none"`; `evidenceWeights`: `Record`\<`string`, `number`\>; `halfLife?`: `number`; `minimumThreshold`: `number`; \}, \{ `baseScore`: `number`; `decayModel?`: `"linear"` \| `"exponential"` \| `"none"`; `evidenceWeights`: `Record`\<`string`, `number`\>; `halfLife?`: `number`; `minimumThreshold`: `number`; \}\>

Defined in: [03-platform/packages/verification/03-platform/src/types/schemas/entities.ts:58](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/03-platform/src/types/schemas/entities.ts#L58)
