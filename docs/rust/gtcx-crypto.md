# gtcx-crypto

Core cryptographic primitives for GTCX Protocol. This crate is the single source of truth for all cryptography in the Rust layer. Every other crate depends on it.

## Modules

| Module    | Operations                                         |
| --------- | -------------------------------------------------- |
| `signing` | Ed25519 and secp256k1 digital signatures           |
| `hashing` | SHA-256, SHA-512, Blake3                           |
| `keys`    | Key generation, derivation, HD wallet support      |
| `chain`   | Hash-chained audit logs for tamper-evident records |

## Quick Start

```rust
use gtcx_crypto::{sign, verify, generate_keypair, sha256};

// Generate a key pair
let (private_key, public_key) = generate_keypair();

// Sign a message
let message = b"Hello, GTCX!";
let signature = sign(message, &private_key);

// Verify the signature
assert!(verify(&signature, message, &public_key));

// Hash some data
let hash = sha256(b"data to hash");
```

## Module Details

### signing

Ed25519 and secp256k1 digital signatures with batch verification support.

```rust
use gtcx_crypto::signing::ed25519::{sign, verify, PrivateKey, PublicKey};

let private_key = PrivateKey::generate();
let public_key = private_key.public_key();

let signature = sign(b"message", &private_key);
assert!(verify(&signature, b"message", &public_key));
```

### hashing

SHA-256, SHA-512, and Blake3. Blake3 is preferred for non-interop use cases due to higher throughput.

```rust
use gtcx_crypto::hashing::{sha256, blake3};

let sha_hash = sha256(b"data");
let blake_hash = blake3(b"data");
```

### keys

Key generation and derivation. Supports HKDF-based key derivation for per-protocol keys from a master identity.

```rust
use gtcx_crypto::keys::{generate_keypair, derive_key};

let (private, public) = generate_keypair();
let derived = derive_key(&private, b"salt", 0);
```

### chain

Hash-chained audit logs for tamper-evident records. Each entry references the hash of the previous entry, forming a verifiable chain.

```rust
use gtcx_crypto::chain::{create_entry, ChainEntry};

let entry = create_entry(
    1,                      // sequence number
    [0u8; 32],              // previous hash (genesis)
    b"payload data",        // payload
    &private_key,           // signer
);
```

## Security Guarantees

1. **No unsafe code** — `#![deny(unsafe_code)]`
2. **Memory safety** — All secrets use `Zeroizing<T>` for automatic clearing
3. **Type safety** — Newtype pattern prevents key/signature type confusion
4. **Audited libraries** — Uses `ed25519-dalek`, `k256`, `sha2`, `blake3`

## Performance

| Operation          | Time  | Throughput |
| ------------------ | ----- | ---------- |
| Ed25519 sign       | ~50us | 20,000/sec |
| Ed25519 verify     | ~90us | 11,000/sec |
| Batch verify (100) | ~4ms  | 25,000/sec |
| SHA-256 (1KB)      | ~2us  | 500 MB/sec |
| Blake3 (1KB)       | ~1us  | 1 GB/sec   |

These benchmarks are approximately 10x faster than the equivalent TypeScript (@noble) implementations, which is why performance-critical paths use the Rust layer via NAPI-RS bindings.

## Principle Alignment

| Principle            | Implementation                                                                 |
| -------------------- | ------------------------------------------------------------------------------ |
| P1 Package Structure | Single-responsibility crate; signing, hashing, keys, chain as separate modules |
| P2 Type Safety       | Newtype pattern; Rust's ownership prevents misuse                              |
| P3 Modularity        | Each module independently usable; pure functions throughout                    |
| P5 AI-Native         | `#[instrument]` tracing on all public functions                                |
| P7 Documentation     | `#![deny(missing_docs)]` enforced at compile time                              |
| P9 Security          | No unsafe code; zeroizing secrets; audited libraries                           |

## Related

- [Rust Core](./README.md) — Workspace overview and crate dependency graph
- [Cargo.toml](./Cargo.toml) — Workspace dependency versions
- [@gtcx/crypto (TypeScript)](../packages/crypto.md) — TypeScript wrapper that exposes these primitives
- [Security Framework](../specs/security-framework.md) — Algorithm selection rationale and key hierarchy
