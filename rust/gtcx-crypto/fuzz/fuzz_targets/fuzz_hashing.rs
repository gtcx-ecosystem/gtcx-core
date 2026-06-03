#![no_main]

use libfuzzer_sys::fuzz_target;
use gtcx_crypto::hashing::{sha256, sha512, blake3};

// Fuzz all hash functions with arbitrary input.
// Properties verified:
// 1. No panic on any input (including empty)
// 2. Output length is always correct (32/64/32 bytes)
// 3. Determinism — same input always produces same output
fuzz_target!(|data: &[u8]| {
    // SHA-256: must produce 32 bytes, must be deterministic
    let h1 = sha256(data);
    let h2 = sha256(data);
    assert_eq!(h1.len(), 32);
    assert_eq!(h1, h2, "SHA-256 must be deterministic");

    // SHA-512: must produce 64 bytes, must be deterministic
    let h3 = sha512(data);
    let h4 = sha512(data);
    assert_eq!(h3.len(), 64);
    assert_eq!(h3, h4, "SHA-512 must be deterministic");

    // BLAKE3: must produce 32 bytes, must be deterministic
    let h5 = blake3(data).unwrap();
    let h6 = blake3(data).unwrap();
    assert_eq!(h5.len(), 32);
    assert_eq!(h5, h6, "BLAKE3 must be deterministic");

    // Different algorithms must produce different outputs (with overwhelming probability)
    if !data.is_empty() {
        // SHA-256 and BLAKE3 both produce 32 bytes but must differ
        assert_ne!(h1, h5, "SHA-256 and BLAKE3 should produce different hashes");
    }
});
