#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::keys::{generate_keypair, derive_public_key, PrivateKey};
use std::convert::TryInto;

// Fuzz key derivation operations.
// Properties verified:
// 1. derive_public_key never panics on valid private keys
// 2. Derived public key is deterministic
// 3. Invalid key bytes are rejected without panic
fuzz_target!(|data: &[u8]| {
    // Test derive_public_key with arbitrary 32-byte input
    if data.len() >= 32 {
        let key_bytes: &[u8; 32] = data[0..32].try_into().unwrap();

        // Attempt to create a private key from fuzz bytes
        if let Ok(sk) = PrivateKey::from_bytes(key_bytes) {
            // derive_public_key must not panic
            let pk1 = sk.public_key();
            let pk2 = sk.public_key();

            // Determinism: same private key always derives same public key
            assert_eq!(pk1.as_bytes(), pk2.as_bytes());

            // Public key must be 32 bytes (Ed25519)
            assert_eq!(pk1.as_bytes().len(), 32);
        }
    }

    // Test with a known-good keypair to verify roundtrip
    let (sk, pk) = generate_keypair();
    let derived = sk.public_key();
    assert_eq!(pk.as_bytes(), derived.as_bytes());

    // Test derive_public_key standalone function with raw bytes
    if data.len() >= 32 {
        let _ = derive_public_key(&data[0..32]);
    }
});
