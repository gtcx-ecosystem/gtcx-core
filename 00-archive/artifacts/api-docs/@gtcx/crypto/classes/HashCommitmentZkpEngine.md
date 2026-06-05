[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / HashCommitmentZkpEngine

# Class: HashCommitmentZkpEngine

Defined in: [zkp.ts:163](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L163)

Hash-commitment proof engine — **PLACEHOLDER, NOT PRODUCTION ZK**.

WARNING: This engine does NOT provide zero-knowledge proofs. It uses
hash commitments to provide a compatible API surface while full ZK
circuits are implemented in Rust (arkworks/Groth16/Bulletproofs).

A verifier using this engine cannot distinguish a valid proof from
any 64 random non-zero bytes. Do not rely on this for compliance
claims, regulatory submissions, or any context where proof
correctness matters.

`generate()` throws by default — opt in with `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`
if you understand the placeholder semantics. `verify()` remains open so
services receiving such proofs can validate them without holding the flag.

For real ZK verification, use the Rust NAPI bindings via
`@gtcx/crypto-native` which delegates to `gtcx-zkp`.

## See

 - rust/gtcx-zkp for production ZK implementation
 - 01-docs/09-security/threat-model.md SA-002 for the rationale behind the default-deny

## Implements

- [`ZkProver`](../interfaces/ZkProver.md)
- [`ZkVerifier`](../interfaces/ZkVerifier.md)

## Constructors

### Constructor

> **new HashCommitmentZkpEngine**(): `HashCommitmentZkpEngine`

#### Returns

`HashCommitmentZkpEngine`

## Properties

### supportsVerificationKeys

> `readonly` **supportsVerificationKeys**: `false` = `false`

Defined in: [zkp.ts:165](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L165)

Hash-commitment engine does not produce verification keys. Use Rust NAPI bindings for full ZKP.

## Methods

### generate()

> **generate**(`input`): `Promise`\<\{ `created`: `string`; `proof`: `string`; `proofType`: `string`; `publicInputs`: `string`[]; `system`: `"schnorr"` \| `"bulletproofs"` \| `"groth16"` \| `"plonk"`; `verificationKeyId`: `string`; \}\>

Defined in: [zkp.ts:166](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L166)

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

Defined in: [zkp.ts:193](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L193)

Simplified hash-commitment verification only.
Real ZKP verification requires Rust arkworks circuits via NAPI bindings.

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
