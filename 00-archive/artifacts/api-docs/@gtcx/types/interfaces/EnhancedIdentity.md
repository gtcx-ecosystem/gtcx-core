[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/types](../README.md) / EnhancedIdentity

# Interface: EnhancedIdentity

Defined in: [03-platform/packages/types/src/protocols/identity.ts:66](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L66)

Enhanced identity with multi-signature support

## Extends

- [`DigitalIdentity`](DigitalIdentity.md)

## Properties

### certificationChain?

> `optional` **certificationChain**: `string`[]

Defined in: [03-platform/packages/types/src/protocols/identity.ts:71](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L71)

***

### createdAt

> **createdAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:48](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L48)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`createdAt`](DigitalIdentity.md#createdat)

***

### did?

> `optional` **did**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:45](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L45)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`did`](DigitalIdentity.md#did)

***

### entropyValidation?

> `optional` **entropyValidation**: [`EntropyValidation`](EntropyValidation.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L70)

***

### expiresAt?

> `optional` **expiresAt**: `number`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:49](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L49)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`expiresAt`](DigitalIdentity.md#expiresat)

***

### id

> **id**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:44](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L44)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`id`](DigitalIdentity.md#id)

***

### keyDerivation?

> `optional` **keyDerivation**: [`KeyDerivationParams`](KeyDerivationParams.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:69](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L69)

***

### metadata

> **metadata**: [`IdentityMetadata`](IdentityMetadata.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:51](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L51)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`metadata`](DigitalIdentity.md#metadata)

***

### multiKeyPairs

> **multiKeyPairs**: [`MultiKeyPairs`](MultiKeyPairs.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:67](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L67)

***

### postQuantumHash?

> `optional` **postQuantumHash**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:68](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L68)

***

### privateKeyRef

> **privateKeyRef**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:47](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L47)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`privateKeyRef`](DigitalIdentity.md#privatekeyref)

***

### publicKey

> **publicKey**: `string`

Defined in: [03-platform/packages/types/src/protocols/identity.ts:46](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L46)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`publicKey`](DigitalIdentity.md#publickey)

***

### securityLevel

> **securityLevel**: [`SecurityLevel`](../type-aliases/SecurityLevel.md)

Defined in: [03-platform/packages/types/src/protocols/identity.ts:50](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/types/src/protocols/identity.ts#L50)

#### Inherited from

[`DigitalIdentity`](DigitalIdentity.md).[`securityLevel`](DigitalIdentity.md#securitylevel)
