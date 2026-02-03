# GTCX Rust Core

Performance-critical and security-critical infrastructure for GTCX Protocol. The Rust layer provides the cryptographic foundation that underpins all TypeScript packages.

## Crates

| Crate | Purpose | Status |
|-------|---------|--------|
| `gtcx-crypto` | Cryptographic primitives (Ed25519, secp256k1, SHA-256, Blake3) | In Development |
| `gtcx-zkp` | Zero-knowledge proofs (arkworks-based) | Planned |
| `gtcx-consensus` | PANX weighted PBFT consensus | Planned |
| `gtcx-network` | P2P networking (libp2p) | Planned |
| `gtcx-edge` | Edge/WASM runtime for offline verification | Planned |
| `gtcx-node` | Node.js NAPI-RS bindings | Planned |

## Architecture

```
rust/
├── Cargo.toml              # Workspace definition
├── Cargo.lock              # Locked dependencies
├── rust-toolchain.toml     # Rust version (1.75+)
│
├── gtcx-crypto/            # Cryptographic primitives
│   ├── Cargo.toml
│   ├── README.md
│   └── src/
│       ├── lib.rs
│       ├── error.rs
│       ├── signing/        # Ed25519, secp256k1
│       ├── hashing/        # SHA-256, SHA-512, Blake3
│       ├── keys/           # Generation, derivation
│       └── chain.rs        # Hash-chained audit logs
│
├── gtcx-zkp/               # Zero-knowledge proofs
├── gtcx-consensus/         # PANX consensus
├── gtcx-network/           # P2P networking
├── gtcx-edge/              # Edge runtime
└── gtcx-node/              # Node.js bindings
```

## Dependency Graph

```
gtcx-node (NAPI-RS bindings)
    │
    ├── gtcx-consensus
    │       │
    │       ├── gtcx-network
    │       │       │
    │       │       └── gtcx-crypto
    │       │
    │       └── gtcx-crypto
    │
    ├── gtcx-zkp
    │       │
    │       └── gtcx-crypto
    │
    └── gtcx-edge
            │
            └── gtcx-crypto

gtcx-crypto is the foundation — all crates depend on it.
```

## Quick Start

```bash
# Build all crates
cargo build

# Run tests
cargo test

# Run with optimizations
cargo build --release

# Generate documentation
cargo doc --open

# Lint
cargo clippy -- -D warnings
```

## Development Setup

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target (for gtcx-edge)
rustup target add wasm32-unknown-unknown

# Navigate to rust directory
cd rust

# Watch mode (install cargo-watch first)
cargo watch -x check -x test

# Run specific crate tests
cargo test -p gtcx-crypto

# Benchmarks
cargo bench
```

## Security

- `#![deny(unsafe_code)]` — No unsafe code allowed in any crate
- `#![deny(missing_docs)]` — All public items must be documented
- All secrets use `Zeroizing<T>` wrapper for automatic memory clearing
- All cryptographic operations use audited libraries (ed25519-dalek, k256, sha2)

## Principle Alignment

| Principle | Rust Enforcement |
|-----------|-----------------|
| P1 Package Structure | Each crate has a single responsibility |
| P2 Type Safety | Rust's type system + newtype pattern prevents key/signature confusion |
| P3 Modularity | Ownership system enforces purity; module system requires explicit imports |
| P5 AI-Native | `tracing` crate integration with `#[instrument]` on public functions |
| P6 Asset Abstraction | Generic types; commodity passed as parameter |
| P7 Documentation | `#![deny(missing_docs)]` enforced at compile time |
| P8 Offline-First | `gtcx-edge` provides offline verification via WASM |
| P9 Security | No unsafe code; zeroizing secrets; audited crypto libraries |

## Related

- [@gtcx/crypto](../packages/crypto.md) — TypeScript package that wraps Rust crypto via NAPI-RS
- [Shared Infrastructure](../architecture/shared-infrastructure.md) — Rust layer in the overall architecture
- [Security Framework](../specs/security-framework.md) — Cryptographic algorithm standards
- [Cryptographic Verification](../architecture/cryptographic-verification.md) — Why GTCX uses crypto infrastructure over blockchain
