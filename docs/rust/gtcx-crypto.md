# gtcx-crypto (Rust)

Core cryptographic primitives for GTCX. This crate backs the native crypto bindings used by `@gtcx/crypto-native`.

## Modules

- `signing` — Ed25519 + secp256k1
- `hashing` — SHA‑256, SHA‑512, Blake3
- `keys` — key generation and derivation helpers
- `chain` — hash‑chained audit logs

## Quick Start

```rust
use gtcx_crypto::{sign, verify, generate_keypair, sha256};

let (private_key, public_key) = generate_keypair();
let message = b"Hello, GTCX!";
let signature = sign(message, &private_key);
assert!(verify(&signature, message, &public_key));
let hash = sha256(b"data to hash");
```

## Notes

- `#![deny(unsafe_code)]` and `#![deny(missing_docs)]` are enforced in the crate.
- Private keys use zeroization on drop.

## References

- `rust/gtcx-crypto/src/lib.rs`
- `docs/specs/security-framework.md`
