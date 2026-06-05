[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/verification](../README.md) / [](../README.md) / parseProofBundle

# Function: parseProofBundle()

> **parseProofBundle**(`serialized`, `onError?`): [`ProofBundle`](../interfaces/ProofBundle.md) \| `null`

Defined in: [03-platform/packages/verification/src/proofs/bundler.ts:184](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/verification/src/proofs/bundler.ts#L184)

Parse proof bundle from serialized string with schema validation.
Returns null if JSON parsing or schema validation fails.

## Parameters

### serialized

`string`

### onError?

(`error`) => `void`

## Returns

[`ProofBundle`](../interfaces/ProofBundle.md) \| `null`
