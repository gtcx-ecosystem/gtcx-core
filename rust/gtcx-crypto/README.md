# gtcx-crypto

> **Purpose:** Core cryptographic primitives for the GTCX protocol. This crate is the SINGLE SOURCE OF TRUTH for all cryptography in GTCX.

---

## Features

| Module | Operations |
|--------|------------|
| `signing` | Ed25519, secp256k1 signatures |
| `hashing` | SHA-256, SHA-512, Blake3 |
| `keys` | Generation, derivation, HD wallets |
| `chain` | Hash-chained audit logs |

---

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

---

## Modules

### signing

Ed25519 and secp256k1 digital signatures.

```rust
use gtcx_crypto::signing::ed25519::{sign, verify, PrivateKey, PublicKey};

let private_key = PrivateKey::generate();
let public_key = private_key.public_key();

let signature = sign(b"message", &private_key);
assert!(verify(&signature, b"message", &public_key));
```

### hashing

SHA-256, SHA-512, and Blake3 hashing.

```rust
use gtcx_crypto::hashing::{sha256, blake3};

let sha_hash = sha256(b"data");
let blake_hash = blake3(b"data");
```

### keys

Key generation and derivation.

```rust
use gtcx_crypto::keys::{generate_keypair, derive_key};

let (private, public) = generate_keypair();
let derived = derive_key(&private, b"salt", 0);
```

### chain

Hash-chained audit logs for tamper-evident records.

```rust
use gtcx_crypto::chain::{create_entry, ChainEntry};

let entry = create_entry(
    1,                      // sequence
    [0u8; 32],             // previous hash (genesis)
    b"payload data",       // payload
    &private_key,          // signer
);
```

---

## Security Guarantees

1. **No unsafe code** — `#![deny(unsafe_code)]`
2. **Memory safety** — All secrets use `Zeroizing<T>`
3. **Type safety** — Newtype pattern prevents key/signature confusion
4. **Audited libraries** — Uses `ed25519-dalek`, `k256`, `sha2`

---

## Performance

| Operation | Time | Throughput |
|-----------|------|------------|
| Ed25519 sign | ~50μs | 20,000/sec |
| Ed25519 verify | ~90μs | 11,000/sec |
| Batch verify (100) | ~4ms | 25,000/sec |
| SHA-256 (1KB) | ~2μs | 500 MB/sec |
| Blake3 (1KB) | ~1μs | 1 GB/sec |

---

## Principle Compliance

| Principle | How This Crate Complies |
|-----------|------------------------|
| Single Responsibility | Only cryptographic primitives |
| Pure Functions | All hash/sign/verify are pure |
| Explicit Dependencies | All imports visible |
| No File > 300 Lines | Modular structure |
| Type Safety | Newtype pattern |
| Traceable | `#[instrument]` on all functions |
| Documentation | `#![deny(missing_docs)]` |

---

## License

MIT
