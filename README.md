# GTCX Core

Shared foundation for the GTCX ecosystem. Cryptographic primitives, type definitions, schemas, and domain models consumed by all other repos.

---

## Packages

### Rust Crates (cryptographic foundation)

| Crate | Purpose |
|-------|---------|
| `gtcx-crypto` | Ed25519 signing, K256, SHA2, Blake3, key management |
| `gtcx-zkp` | Zero-knowledge proofs (Arkworks, Groth16, BN254) |
| `gtcx-consensus` | Byzantine fault-tolerant consensus |
| `gtcx-network` | P2P networking (libp2p, QUIC, Gossipsub) |
| `gtcx-edge` | Edge/WASM runtime |
| `gtcx-node` | Node.js bindings (NAPI-RS) |

### TypeScript Packages (shared libraries)

| Package | Purpose |
|---------|---------|
| `@gtcx/types` | Shared TypeScript type definitions |
| `@gtcx/schemas` | Core12 compliance Zod schemas |
| `@gtcx/crypto` | Rust-to-TypeScript crypto bindings |
| `@gtcx/domain` | Business domain models |
| `@gtcx/utils` | Common utilities |
| `@gtcx/identity` | DID, credentials, offline identity cache |
| `@gtcx/security` | Security utilities, offline credential cache |
| `@gtcx/verification` | Certificates, QR codes, proofs, offline verification |

---

## Structure

```
gtcx-core/
├── rust/
│   ├── gtcx-crypto/
│   ├── gtcx-zkp/
│   ├── gtcx-consensus/
│   ├── gtcx-network/
│   ├── gtcx-edge/
│   └── gtcx-node/
├── packages/
│   ├── types/
│   ├── schemas/
│   ├── crypto/
│   ├── domain/
│   ├── utils/
│   ├── identity/
│   ├── security/
│   └── verification/
└── docs/
```

---

## Design Principles

- **Cryptographic infrastructure, NOT blockchain.** Governments won't adopt blockchain. We need verification certainty, not distributed consensus.
- **Rust for security-critical code.** All cryptographic operations in Rust for memory safety and auditability.
- **Stable versioning.** This repo changes infrequently. Breaking changes require major version bumps with migration guides.
- **Zero runtime dependencies on other GTCX repos.** This is the foundation — it depends on nothing.

---

## Source Reference

- Rust crates: `../gtcx/rust/`
- TypeScript packages: `../gtcx/packages/{types,schemas,crypto,domain,utils,identity,security,verification}/`
