#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::signing::secp256k1::{self, PrivateKey, PublicKey, Signature};
use std::convert::TryInto;

// Fuzz secp256k1 signature verification with arbitrary bytes.
// Ensures no panic on malformed signatures, public keys, or messages.
fuzz_target!(|data: &[u8]| {
    // secp256k1 signatures are 64 bytes (r || s), public keys are 33 (compressed) or 65 (uncompressed)
    // Use 64 + 33 = 97 byte minimum for compressed key variant
    if data.len() < 97 {
        return;
    }

    let sig_bytes = &data[0..64];
    let pk_bytes = &data[64..97];
    let message = &data[97..];

    // Signature from raw bytes must not panic
    if let Ok(sig) = Signature::from_bytes(sig_bytes.try_into().unwrap_or(&[0u8; 64])) {
        // PublicKey from compressed bytes must not panic
        if let Ok(pk) = PublicKey::from_bytes(pk_bytes) {
            // Verification must not panic (return true/false or error, never crash)
            let _ = secp256k1::verify(&sig, message, &pk);
        }
    }

    // Also fuzz with the full data as a message against a valid keypair
    if data.len() >= 32 {
        let sk = PrivateKey::generate();
        let sig = secp256k1::sign(data, &sk);
        let pk = sk.public_key();
        // Valid signature must always verify
        assert!(secp256k1::verify(&sig, data, &pk));
    }
});
