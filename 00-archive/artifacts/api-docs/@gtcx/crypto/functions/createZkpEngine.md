[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/crypto](../README.md) / createZkpEngine

# Function: createZkpEngine()

> **createZkpEngine**(): [`ZkProver`](../interfaces/ZkProver.md) & [`ZkVerifier`](../interfaces/ZkVerifier.md)

Defined in: [zkp.ts:243](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/crypto/03-platform/src/zkp.ts#L243)

Create the best available ZKP engine.

When `@gtcx/crypto-native` is installed and the Groth16 bindings are available,
returns an engine backed by real arkworks circuits via NAPI.

If native bindings are unavailable, the factory throws by default. Two opt-in
paths exist:

- Set `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1` to fall back to the placeholder
  hash-commitment engine. Only appropriate for testing or non-regulatory
  contexts. The placeholder is NOT a zero-knowledge proof system.
- Set `GTCX_REQUIRE_NATIVE=true` to make the factory's "no native" branch
  surface a more pointed error message (kept for backwards compatibility;
  default behavior already throws).

## Returns

[`ZkProver`](../interfaces/ZkProver.md) & [`ZkVerifier`](../interfaces/ZkVerifier.md)
