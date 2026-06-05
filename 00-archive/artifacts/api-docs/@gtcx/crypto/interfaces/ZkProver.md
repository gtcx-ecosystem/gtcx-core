[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / ZkProver

# Interface: ZkProver

Defined in: [zkp.ts:31](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/zkp.ts#L31)

## Methods

### generate()

> **generate**(`input`): `Promise`\<\{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}\>

Defined in: [zkp.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/zkp.ts#L32)

#### Parameters

##### input

[`ZkProofInput`](ZkProofInput.md)

#### Returns

`Promise`\<\{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}\>
