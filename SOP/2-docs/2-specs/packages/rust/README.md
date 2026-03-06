# Rust Crate Specs

One document per Rust crate in `gtcx-core`. These are the native performance and ZKP layers that back the TypeScript packages.

## Crates

| Crate                                 | Status  | Purpose                               | TS Binding                                 |
| ------------------------------------- | ------- | ------------------------------------- | ------------------------------------------ |
| [gtcx-crypto](./gtcx-crypto.md)       | Active  | Ed25519, SHA-256, Blake3              | `@gtcx/crypto-native`                      |
| [gtcx-zkp](./gtcx-zkp.md)             | Active  | Groth16, Bulletproofs, Schnorr proofs | `@gtcx/crypto` (ZKP API)                   |
| [gtcx-node](./gtcx-node.md)           | Active  | Native binding artifact target        | Produces `.node` for `@gtcx/crypto-native` |
| [gtcx-network](./gtcx-network.md)     | Active  | libp2p transport primitives           | `@gtcx/network` (optional)                 |
| [gtcx-consensus](./gtcx-consensus.md) | Planned | Validator consensus engine            | Planned — not yet bound                    |
| [gtcx-edge](./gtcx-edge.md)           | Planned | Edge runtime and hardware hooks       | Planned — not yet bound                    |

## Build Entry Point

All Rust crates are under `rust/` in the workspace root. Build the native binding artifact:

```bash
cargo build --release --manifest-path rust/gtcx-node/Cargo.toml
```

See `SOP/2-docs/3-engineering/guides/build-and-test.md` for full build instructions.
