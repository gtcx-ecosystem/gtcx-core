[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / ZkFullVerifier

# Interface: ZkFullVerifier

Defined in: [zkp.ts:39](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/zkp.ts#L39)

## Extends

- [`ZkVerifier`](ZkVerifier.md)

## Methods

### getVerificationKey()

> **getVerificationKey**(`proofType`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [zkp.ts:40](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/zkp.ts#L40)

#### Parameters

##### proofType

`string`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

***

### verify()

> **verify**(`proof`): `Promise`\<`boolean`\>

Defined in: [zkp.ts:36](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/src/zkp.ts#L36)

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

#### Inherited from

[`ZkVerifier`](ZkVerifier.md).[`verify`](ZkVerifier.md#verify)
