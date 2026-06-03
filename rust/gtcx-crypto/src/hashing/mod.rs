//! Cryptographic hash functions.
//!
//! This module provides SHA-256, SHA-512, and Blake3 hashing.
//!
//! ## Algorithms
//!
//! | Algorithm | Output | Speed | Use Case |
//! |-----------|--------|-------|----------|
//! | SHA-256 | 32 bytes | Moderate | Standard, compatibility |
//! | SHA-512 | 64 bytes | Fast on 64-bit | Large hashes |
//! | Blake3 | 32 bytes | Fastest | Performance-critical |
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::hashing::{sha256, sha512, blake3};
//!
//! let hash256 = sha256(b"Hello, GTCX!");
//! let hash512 = sha512(b"Hello, GTCX!");
//! let hash_blake = blake3(b"Hello, GTCX!");
//! ```

use sha2::{Digest, Sha256, Sha512};
use tracing::instrument;

use crate::error::CryptoError;

/// Check if FIPS strict mode is enabled.
///
/// When `GTCX_FIPS_STRICT=1` is set in the environment, only FIPS-approved
/// algorithms (SHA-256, SHA-512) may be used. BLAKE3 is rejected.
///
/// # Returns
///
/// `true` if `GTCX_FIPS_STRICT` is set to `"1"`, `false` otherwise.
pub fn fips_mode_only() -> bool {
    std::env::var("GTCX_FIPS_STRICT")
        .map(|v| v == "1")
        .unwrap_or(false)
}

/// Verify that FIPS strict mode is not active, or return an error.
///
/// Call this before using non-FIPS algorithms (e.g., BLAKE3).
fn assert_fips_permissive(algorithm: &'static str) -> Result<(), CryptoError> {
    if fips_mode_only() {
        Err(CryptoError::NonFipsAlgorithm { algorithm })
    } else {
        Ok(())
    }
}

/// Compute SHA-256 hash of input data.
///
/// This is a **pure function**: same input always produces same output.
///
/// # Arguments
///
/// * `data` - The data to hash (any length)
///
/// # Returns
///
/// A 32-byte SHA-256 hash.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::hashing::sha256;
///
/// let hash = sha256(b"Hello, GTCX!");
/// assert_eq!(hash.len(), 32);
/// ```
#[instrument(skip_all, fields(data_len = data.len()))]
pub fn sha256(data: &[u8]) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(data);
    hasher.finalize().into()
}

/// Compute SHA-512 hash of input data.
///
/// This is a **pure function**: same input always produces same output.
///
/// # Arguments
///
/// * `data` - The data to hash (any length)
///
/// # Returns
///
/// A 64-byte SHA-512 hash.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::hashing::sha512;
///
/// let hash = sha512(b"Hello, GTCX!");
/// assert_eq!(hash.len(), 64);
/// ```
#[instrument(skip_all, fields(data_len = data.len()))]
pub fn sha512(data: &[u8]) -> [u8; 64] {
    let mut hasher = Sha512::new();
    hasher.update(data);
    hasher.finalize().into()
}

/// Compute Blake3 hash of input data.
///
/// Blake3 is the fastest cryptographic hash function available,
/// optimized for modern CPUs with SIMD instructions.
///
/// This is a **pure function**: same input always produces same output.
///
/// # Arguments
///
/// * `data` - The data to hash (any length)
///
/// # Returns
///
/// A 32-byte Blake3 hash.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::hashing::blake3;
///
/// let hash = blake3(b"Hello, GTCX!");
/// assert_eq!(hash.len(), 32);
/// ```
#[instrument(skip_all, fields(data_len = data.len()))]
pub fn blake3(data: &[u8]) -> [u8; 32] {
    blake3::hash(data).into()
}

/// Compute Blake3 hash of input data, respecting FIPS strict mode.
///
/// Returns `Err(CryptoError::NonFipsAlgorithm)` when `GTCX_FIPS_STRICT=1`.
/// Use this in security-critical paths where FIPS compliance is required.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::hashing::blake3_checked;
///
/// let hash = blake3_checked(b"Hello, GTCX!").unwrap();
/// assert_eq!(hash.len(), 32);
/// ```
#[instrument(skip_all, fields(data_len = data.len()))]
pub fn blake3_checked(data: &[u8]) -> Result<[u8; 32], CryptoError> {
    assert_fips_permissive("blake3")?;
    Ok(blake3(data))
}

/// Compute Blake3 hash with a key (keyed hash / MAC).
///
/// This produces a message authentication code (MAC) that can only
/// be verified by someone who knows the key.
///
/// # Arguments
///
/// * `key` - A 32-byte secret key
/// * `data` - The data to hash (any length)
///
/// # Returns
///
/// A 32-byte keyed Blake3 hash.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::hashing::blake3_keyed;
///
/// let key = [0u8; 32]; // Use a proper secret key in production
/// let mac = blake3_keyed(&key, b"Hello, GTCX!");
/// assert_eq!(mac.len(), 32);
/// ```
#[instrument(skip_all, fields(data_len = data.len()))]
pub fn blake3_keyed(key: &[u8; 32], data: &[u8]) -> [u8; 32] {
    blake3::keyed_hash(key, data).into()
}

/// Compute keyed Blake3 hash, respecting FIPS strict mode.
///
/// Returns `Err(CryptoError::NonFipsAlgorithm)` when `GTCX_FIPS_STRICT=1`.
#[instrument(skip_all, fields(data_len = data.len()))]
pub fn blake3_keyed_checked(key: &[u8; 32], data: &[u8]) -> Result<[u8; 32], CryptoError> {
    assert_fips_permissive("blake3-keyed")?;
    Ok(blake3_keyed(key, data))
}

/// Compute Blake3 key derivation.
///
/// Derives a subkey from a master key and context string.
/// Useful for deriving multiple keys from a single master secret.
///
/// # Arguments
///
/// * `context` - A unique context string (e.g., "GTCX-2026 signing key")
/// * `key_material` - The input key material
///
/// # Returns
///
/// A 32-byte derived key.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::hashing::blake3_derive;
///
/// let master_key = b"my-master-secret-key";
/// let signing_key = blake3_derive("GTCX signing key v1", master_key);
/// let encryption_key = blake3_derive("GTCX encryption key v1", master_key);
///
/// // Different contexts produce different keys
/// assert_ne!(signing_key, encryption_key);
/// ```
#[instrument(skip_all, fields(context = context))]
pub fn blake3_derive(context: &str, key_material: &[u8]) -> [u8; 32] {
    blake3::derive_key(context, key_material)
}

/// Derive a subkey via Blake3 KDF, respecting FIPS strict mode.
///
/// Returns `Err(CryptoError::NonFipsAlgorithm)` when `GTCX_FIPS_STRICT=1`.
#[instrument(skip_all, fields(context = context))]
pub fn blake3_derive_checked(context: &str, key_material: &[u8]) -> Result<[u8; 32], CryptoError> {
    assert_fips_permissive("blake3-derive")?;
    Ok(blake3_derive(context, key_material))
}

#[cfg(test)]
mod tests {
    #![allow(unsafe_code)]
    use super::*;

    #[test]
    fn test_sha256_known_vector() {
        // Test vector: SHA-256("abc")
        let hash = sha256(b"abc");
        let expected =
            hex::decode("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
                .unwrap();
        assert_eq!(hash.as_slice(), expected.as_slice());
    }

    #[test]
    fn test_sha512_known_vector() {
        // Test vector: SHA-512("abc")
        let hash = sha512(b"abc");
        let expected = hex::decode(
            "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
        ).unwrap();
        assert_eq!(hash.as_slice(), expected.as_slice());
    }

    #[test]
    fn test_blake3_deterministic() {
        let hash1 = blake3(b"test data");
        let hash2 = blake3(b"test data");
        assert_eq!(hash1, hash2);
    }

    #[test]
    fn test_blake3_different_inputs() {
        let hash1 = blake3(b"input 1");
        let hash2 = blake3(b"input 2");
        assert_ne!(hash1, hash2);
    }

    #[test]
    fn test_blake3_keyed_mac() {
        let key = [42u8; 32];
        let mac1 = blake3_keyed(&key, b"message");
        let mac2 = blake3_keyed(&key, b"message");
        assert_eq!(mac1, mac2);

        // Different key = different MAC
        let different_key = [43u8; 32];
        let mac3 = blake3_keyed(&different_key, b"message");
        assert_ne!(mac1, mac3);
    }

    #[test]
    fn test_blake3_derive_different_contexts() {
        let master = b"master-key-material";
        let key1 = blake3_derive("context-1", master);
        let key2 = blake3_derive("context-2", master);
        assert_ne!(key1, key2);
    }

    #[test]
    fn test_empty_input() {
        // Should not panic on empty input
        let _ = sha256(b"");
        let _ = sha512(b"");
        let _ = blake3(b"");
    }

    #[test]
    fn test_large_input() {
        // Should handle large inputs
        let large_data = vec![0u8; 1_000_000]; // 1 MB
        let _ = sha256(&large_data);
        let _ = blake3(&large_data);
    }

    #[test]
    fn test_fips_strict_rejects_blake3() {
        // Set FIPS strict mode
        unsafe { std::env::set_var("GTCX_FIPS_STRICT", "1") };

        // blake3_checked should reject
        let err = blake3_checked(b"test").unwrap_err();
        assert!(matches!(
            err,
            CryptoError::NonFipsAlgorithm {
                algorithm: "blake3"
            }
        ));

        // blake3_keyed_checked should reject
        let key = [0u8; 32];
        let err = blake3_keyed_checked(&key, b"test").unwrap_err();
        assert!(matches!(
            err,
            CryptoError::NonFipsAlgorithm {
                algorithm: "blake3-keyed"
            }
        ));

        // blake3_derive_checked should reject
        let err = blake3_derive_checked("ctx", b"material").unwrap_err();
        assert!(matches!(
            err,
            CryptoError::NonFipsAlgorithm {
                algorithm: "blake3-derive"
            }
        ));

        // Clean up
        unsafe { std::env::remove_var("GTCX_FIPS_STRICT") };
    }

    #[test]
    fn test_fips_permissive_allows_blake3() {
        // Ensure FIPS mode is off
        unsafe { std::env::remove_var("GTCX_FIPS_STRICT") };

        // blake3_checked should succeed when FIPS strict is off
        let hash = blake3_checked(b"test").unwrap();
        assert_eq!(hash, blake3(b"test"));

        let key = [0u8; 32];
        let hash = blake3_keyed_checked(&key, b"test").unwrap();
        assert_eq!(hash, blake3_keyed(&key, b"test"));

        let hash = blake3_derive_checked("ctx", b"material").unwrap();
        assert_eq!(hash, blake3_derive("ctx", b"material"));
    }

    #[test]
    fn test_fips_mode_only() {
        unsafe { std::env::set_var("GTCX_FIPS_STRICT", "1") };
        assert!(fips_mode_only());

        unsafe { std::env::remove_var("GTCX_FIPS_STRICT") };
        assert!(!fips_mode_only());

        unsafe { std::env::set_var("GTCX_FIPS_STRICT", "0") };
        assert!(!fips_mode_only());

        unsafe { std::env::remove_var("GTCX_FIPS_STRICT") };
    }
}
