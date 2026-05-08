#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::keys::{generate_keypair, derive_child_key};
use gtcx_crypto::signing::ed25519::PrivateKey;
use std::convert::TryInto;

// Fuzz key derivation operations.
// Properties verified:
// 1. derive_child_key never panics on valid private keys
// 2. Derived keys are deterministic (same parent + index = same child)
// 3. Invalid key bytes are rejected without panic
fuzz_target!(|data: &[u8]| {
    if data.len() < 36 {
        return;
    }

    let key_bytes: &[u8; 32] = data[0..32].try_into().unwrap();
    let index = u32::from_le_bytes(data[32..36].try_into().unwrap());

    // Attempt to create a private key from fuzz bytes
    if let Ok(sk) = PrivateKey::from_bytes(key_bytes) {
        // derive_child_key must not panic
        let result1 = derive_child_key(&sk, index);
        let result2 = derive_child_key(&sk, index);

        // Determinism: same parent + index always derives same child
        match (&result1, &result2) {
            (Ok(child1), Ok(child2)) => {
                assert_eq!(child1.as_bytes(), child2.as_bytes());
                // Derived public key must also be deterministic
                let pk1 = child1.public_key();
                let pk2 = child2.public_key();
                assert_eq!(pk1.as_bytes(), pk2.as_bytes());
            }
            (Err(_), Err(_)) => {} // Both failed consistently — ok
            _ => panic!("Derivation must be deterministic"),
        }
    }

    // Valid keypair derivation must always succeed
    let (sk, pk) = generate_keypair();
    let derived_pk = sk.public_key();
    assert_eq!(pk.as_bytes(), derived_pk.as_bytes());
});
