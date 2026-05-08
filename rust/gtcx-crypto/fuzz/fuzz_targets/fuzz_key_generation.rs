#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::{generate_keypair, PrivateKey, PublicKey};
use gtcx_crypto::signing::secp256k1;
use std::convert::TryInto;

// Fuzz key construction from arbitrary bytes.
// Ensures no panic on malformed input and valid keys roundtrip correctly.
fuzz_target!(|data: &[u8]| {
    // --- Ed25519 ---
    if data.len() >= 32 {
        let key_bytes: &[u8; 32] = data[0..32].try_into().unwrap();

        // PublicKey::from_bytes must not panic
        let _ = PublicKey::from_bytes(key_bytes);

        // PrivateKey::from_bytes must not panic
        if let Ok(sk) = PrivateKey::from_bytes(key_bytes) {
            // If construction succeeds, public key derivation must not panic
            let pk = sk.public_key();
            // Roundtrip: derived public key must be consistent
            let pk2 = sk.public_key();
            assert_eq!(pk.as_bytes(), pk2.as_bytes());
        }
    }

    // --- secp256k1 ---
    if data.len() >= 32 {
        let key_bytes: &[u8; 32] = data[0..32].try_into().unwrap();
        // secp256k1 private key from arbitrary bytes must not panic
        let _ = secp256k1::PrivateKey::from_bytes(key_bytes);
    }

    // Valid keypair generation must always succeed
    let (_sk, _pk) = generate_keypair();
});
