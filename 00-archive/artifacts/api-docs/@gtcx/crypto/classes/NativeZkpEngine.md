[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / NativeZkpEngine

# Class: NativeZkpEngine

Defined in: [zkp.ts:281](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L281)

ZKP engine backed by real arkworks circuits via NAPI-RS native bindings.

Supports Groth16 (GCI threshold, asset ownership, location region),
Bulletproofs (amount range), and Schnorr (identity attribute) proofs.

## Implements

- [`ZkProver`](../interfaces/ZkProver.md)
- [`ZkVerifier`](../interfaces/ZkVerifier.md)

## Constructors

### Constructor

> **new NativeZkpEngine**(`nativeModule`): `NativeZkpEngine`

Defined in: [zkp.ts:285](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L285)

#### Parameters

##### nativeModule

`Record`\<`string`, `unknown`\>

#### Returns

`NativeZkpEngine`

## Properties

### supportsVerificationKeys

> `readonly` **supportsVerificationKeys**: `true` = `true`

Defined in: [zkp.ts:282](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L282)

## Methods

### generate()

> **generate**(`input`): `Promise`\<\{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}\>

Defined in: [zkp.ts:298](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L298)

#### Parameters

##### input

[`ZkProofInput`](../interfaces/ZkProofInput.md)

#### Returns

`Promise`\<\{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}\>

#### Implementation of

[`ZkProver`](../interfaces/ZkProver.md).[`generate`](../interfaces/ZkProver.md#generate)

***

### verify()

> **verify**(`proof`): `Promise`\<`boolean`\>

Defined in: [zkp.ts:400](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L400)

#### Parameters

##### proof

###### created

`string` = `...`

###### proof

`string` = `...`

###### proofType

`string` = `...`

###### publicInputs

`string`[] = `...`

###### system

`"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"` = `ZKProofSystemSchema`

###### verificationKeyId

`string` = `...`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`ZkVerifier`](../interfaces/ZkVerifier.md).[`verify`](../interfaces/ZkVerifier.md#verify)
