[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / ZKProofSchema

# Variable: ZKProofSchema

> `const` **ZKProofSchema**: `ZodObject`\<\{ `created`: `ZodString`; `proof`: `ZodString`; `proofType`: `ZodString`; `publicInputs`: `ZodArray`\<`ZodString`, `"many"`\>; `system`: `ZodEnum`\<\[`"schnorr"`, `"bulletproofs"`, `"groth16"`, `"plonk"`\]\>; `verificationKeyId`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}, \{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}\>

Defined in: [zkp.ts:11](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L11)
