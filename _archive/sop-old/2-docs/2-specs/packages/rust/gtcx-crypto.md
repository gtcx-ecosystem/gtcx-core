# gtcx-crypto (Rust)

Native Rust implementation of cryptographic primitives for `gtcx-core`. Provides high-performance Ed25519, SHA-256, and Blake3 operations exposed to TypeScript via `@gtcx/crypto-native`.

## Scope

| Operation          | Algorithm                                       |
| ------------------ | ----------------------------------------------- |
| Digital signatures | Ed25519                                         |
| Hashing            | SHA-256, Blake3                                 |
| Merkle proofs      | Blake3-based tree construction and verification |

## TypeScript Binding

This crate is the native target for `@gtcx/crypto-native`. When built and registered:

- `@gtcx/crypto` automatically delegates to native implementations when `GTCX_REQUIRE_NATIVE=1` is set.
- The binding artifact is produced by `gtcx-node` and loaded via `GTCX_CRYPTO_NATIVE_PATH`.

## Build Requirements

- Rust toolchain (stable)
- `cargo build --release` in `rust/gtcx-crypto/`
- Output artifact registered in `GTCX_CRYPTO_NATIVE_PATH` before starting the Node.js process

## Notes

- No JavaScript fallback exists at the Rust level — fallback is handled by `@gtcx/crypto` pure-JS implementations.
- Blake3 is preferred over SHA-256 for performance-sensitive internal hashing (Merkle trees, content addressing).
- Ed25519 is the primary signing algorithm; Secp256k1 is handled at the TypeScript layer.

## References

- `packages/crypto/` — TypeScript consumer
- `packages/crypto-native/` — native loader
- `rust/gtcx-node/` — binding target
- `SOP/2-docs/2-specs/packages/crypto.md`
- `SOP/2-docs/2-specs/packages/crypto-native.md`
- `SOP/2-docs/3-engineering/security/security-framework.md`
