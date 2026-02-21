# @gtcx/crypto-native

Native Node.js bindings for cryptographic primitives. Wraps the `rust/gtcx-node` build output and exposes a minimal, fast API used by `@gtcx/crypto` when native mode is enabled.

## Scope

- Key generation (Ed25519)
- Signing + verification
- SHA‑256 / SHA‑512
- Optional Blake3 and key derivation helpers

## Key Exports

- `generateKeyPair`
- `sign`, `verify`
- `sha256`, `sha512`
- `blake3Hash` (optional)
- `deriveChildKey` (optional)
- `derivePurposeKey` (optional)
- `version` (optional)

## Native Loading

The loader searches known locations and honors:

- `GTCX_CRYPTO_NATIVE_PATH` — explicit path to `gtcx_node.node`

## References

- `packages/crypto-native/src/index.ts`
- `rust/gtcx-node`
