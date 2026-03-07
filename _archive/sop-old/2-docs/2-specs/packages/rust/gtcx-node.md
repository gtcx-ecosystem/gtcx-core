# gtcx-node (Rust)

Native Node.js binding target for `gtcx-core` Rust crates. Produces the `.node` artifact loaded by `@gtcx/crypto-native` at runtime.

## Scope

`gtcx-node` is a Rust build target — not a standalone library. Its sole purpose is to compile and expose native bindings for:

- `gtcx-crypto` — cryptographic primitives (Ed25519, SHA-256, Blake3)
- `gtcx-zkp` — ZKP generation and verification (once Phase C is active)

## Build Output

| Artifact       | Path                                   | Consumer                                            |
| -------------- | -------------------------------------- | --------------------------------------------------- |
| Native binding | `rust/gtcx-node/target/release/*.node` | `@gtcx/crypto-native` via `GTCX_CRYPTO_NATIVE_PATH` |

## Build Requirements

```bash
cargo build --release --manifest-path rust/gtcx-node/Cargo.toml
```

Set `GTCX_CRYPTO_NATIVE_PATH` to the resulting `.node` file path before the Node.js process starts.

## Environment Variables

| Variable                  | Effect                                                 |
| ------------------------- | ------------------------------------------------------ |
| `GTCX_CRYPTO_NATIVE_PATH` | Path to the `.node` binding artifact                   |
| `GTCX_REQUIRE_NATIVE=1`   | Causes `@gtcx/crypto` to throw if native is not loaded |

## CI Notes

- Native artifacts must be built and cached in CI before running integration tests that require `GTCX_REQUIRE_NATIVE=1`.
- Platform-specific artifacts (Linux, macOS, ARM) are built separately — no universal binary.

## References

- `SOP/2-docs/2-specs/packages/crypto-native.md`
- `SOP/2-docs/2-specs/packages/crypto.md`
- `rust/gtcx-node/`
