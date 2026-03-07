# @gtcx/crypto-native

Native Node.js bindings loader for cryptographic primitives. Wraps the `rust/gtcx-node` build output and exposes a fast native API consumed by `@gtcx/crypto` when native mode is enabled.

## Scope

- Key generation (Ed25519)
- Signing and verification
- SHA-256, SHA-512
- Optional: Blake3, key derivation helpers

## Key Exports (`packages/crypto-native/src/index.ts`)

| Export             | Description                                |
| ------------------ | ------------------------------------------ |
| `generateKeyPair`  | Ed25519 key pair generation                |
| `sign`, `verify`   | Ed25519 signing and verification           |
| `sha256`, `sha512` | Hash functions                             |
| `blake3Hash`       | Blake3 hashing (optional)                  |
| `deriveChildKey`   | HKDF-based child key derivation (optional) |
| `derivePurposeKey` | Purpose-scoped key derivation (optional)   |
| `version`          | Native module version string (optional)    |

## Native Loading

The loader searches standard locations for `gtcx_node.node`. Override the path with:

```bash
GTCX_CRYPTO_NATIVE_PATH=/path/to/gtcx_node.node
```

## Build Requirements

The native artifact is produced by building `rust/gtcx-node` via NAPI-RS. CI builds this in the `crypto-native-ci` workflow.

## References

- `crypto.md` — TypeScript wrapper
- `rust/gtcx-node.md` — native crate spec
- `packages/crypto-native/src/index.ts`
