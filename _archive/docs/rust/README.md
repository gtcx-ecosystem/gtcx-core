# GTCX Rust Core

Performance‑critical and security‑critical infrastructure for GTCX. Rust crates back the native crypto path and ZKP implementations.

## Crates (Current)

| Crate            | Purpose                                                        | Status     |
| ---------------- | -------------------------------------------------------------- | ---------- |
| `gtcx-crypto`    | Cryptographic primitives (Ed25519, secp256k1, SHA‑256, Blake3) | Active     |
| `gtcx-zkp`       | Zero‑knowledge proofs (Groth16 + Bulletproofs + Schnorr)       | Active     |
| `gtcx-node`      | Node.js native bindings (NAPI)                                 | Active     |
| `gtcx-consensus` | Weighted PBFT consensus                                        | Scaffolded |
| `gtcx-network`   | P2P networking                                                 | Scaffolded |
| `gtcx-edge`      | Edge/WASM runtime                                              | Scaffolded |

## Workspace Layout

```
rust/
├── Cargo.toml
├── gtcx-crypto/
├── gtcx-zkp/
├── gtcx-node/
├── gtcx-consensus/
├── gtcx-network/
└── gtcx-edge/
```

## Common Commands

```bash
cd rust
cargo build
cargo test --workspace --lib
cargo clippy --workspace --all-targets -- -D warnings
```

## References

- `docs/specs/security-framework.md`
- `docs/packages/crypto-native.md`
- `rust/gtcx-crypto/README.md`
- `rust/gtcx-zkp/README.md`
