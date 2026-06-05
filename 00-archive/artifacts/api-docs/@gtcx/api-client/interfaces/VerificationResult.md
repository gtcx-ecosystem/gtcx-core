[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/api-client](../README.md) / [](../README.md) / VerificationResult

# Interface: VerificationResult

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:70](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L70)

Result of canonical request verification.

## Properties

### did?

> `optional` **did**: `string`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:80](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L80)

DID extracted from the envelope or headers.

***

### envelope?

> `optional` **envelope**: [`SignatureEnvelope`](SignatureEnvelope.md)

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:74](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L74)

Parsed envelope (only present when parsing succeeds).

***

### error?

> `optional` **error**: `string`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:76](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L76)

Human-readable error message when invalid.

***

### keyId?

> `optional` **keyId**: `string`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:78](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L78)

Key ID extracted from the envelope.

***

### valid

> **valid**: `boolean`

Defined in: [03-platform/packages/api-client/src/canonical/types.ts:72](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/api-client/src/canonical/types.ts#L72)

Whether the signature is cryptographically valid.
