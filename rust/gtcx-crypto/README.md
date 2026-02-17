# gtcx-crypto

Cryptographic primitives for GTCX — Ed25519 signing, SHA-256/512, Blake3 hashing, Merkle trees, and hash-chain audit logs.

## Usage

```toml
[dependencies]
gtcx-crypto = "0.1"
```

```rust
use gtcx_crypto::keys::generate_keypair;
use gtcx_crypto::signing::ed25519::{sign, verify};
use gtcx_crypto::hashing::{sha256, blake3};

let (private_key, public_key) = generate_keypair();
let sig = sign(b"hello", &private_key);
assert!(verify(&sig, b"hello", &public_key));

let hash = sha256(b"data");
let fast = blake3(b"data");
```

## API

| Module             | Key Functions                                                |
| ------------------ | ------------------------------------------------------------ |
| `keys`             | `generate_keypair`, `derive_child_key`, `derive_purpose_key` |
| `signing::ed25519` | `sign`, `verify`, `batch_verify`                             |
| `hashing`          | `sha256`, `sha512`, `blake3`, `blake3_keyed`                 |
| `chain`            | `create_genesis_entry`, `create_entry`, `verify_chain`       |

## License

MIT
