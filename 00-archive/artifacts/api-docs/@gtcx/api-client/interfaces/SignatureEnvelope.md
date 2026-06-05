[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / SignatureEnvelope

# Interface: SignatureEnvelope

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:22](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L22)

Parsed signature envelope components.

## Properties

### algorithm

> **algorithm**: `"ed25519"`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:26](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L26)

Signing algorithm (e.g. 'ed25519').

***

### keyId

> **keyId**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:28](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L28)

DID-formatted key identifier.

***

### nonce

> **nonce**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:32](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L32)

Hex-encoded nonce.

***

### signature

> **signature**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:34](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L34)

Hex-encoded signature.

***

### timestamp

> **timestamp**: `string`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:30](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L30)

ISO 8601 timestamp used when signing.

***

### version

> **version**: `"v1"`

Defined in: [03-platform/packages/api-client/03-platform/src/canonical/types.ts:24](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/03-platform/src/canonical/types.ts#L24)

Protocol version (e.g. 'v1').
