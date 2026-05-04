#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::{verify, PublicKey, Signature};
use std::convert::TryInto;

// We are fuzzing the signature verification logic to mathematically ensure
// that malformed public keys, signatures, and messages NEVER cause a panic.
fuzz_target!(|data: &[u8]| {
    // We need at least enough data to extract a signature (64 bytes) and a public key (32 bytes).
    if data.len() < 64 + 32 {
        return;
    }

    let sig_bytes: &[u8; 64] = data[0..64].try_into().unwrap();
    let pk_bytes: &[u8; 32] = data[64..64 + 32].try_into().unwrap();
    let message = &data[64 + 32..];

    // We don't care if it returns an Error or Ok(false),
    // we only care that the operation does NOT panic.
    if let Ok(sig) = Signature::from_bytes(sig_bytes) {
        if let Ok(pk) = PublicKey::from_bytes(pk_bytes) {
            let _ = verify(&sig, message, &pk);
        }
    }
});
