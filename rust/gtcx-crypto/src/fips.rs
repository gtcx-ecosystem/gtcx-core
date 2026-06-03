//! FIPS 140-3 runtime policy enforcement.
//!
//! This module provides the centralized runtime check for FIPS strict mode.
//! When `GTCX_FIPS_STRICT=1` is set in the environment, only FIPS-approved
//! algorithms may be used. Non-FIPS algorithms (e.g., BLAKE3) are rejected.
//!
//! ## Usage
//!
//! Call [`assert_fips_permissive`] before using a non-FIPS algorithm:
//!
//! ```rust
//! use gtcx_crypto::fips::{assert_fips_permissive, fips_mode_only};
//!
//! if fips_mode_only() {
//!     // FIPS strict mode is active
//! }
//!
//! // Before calling a non-FIPS algorithm:
//! assert_fips_permissive("blake3").unwrap();
//! ```

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
///
/// # Errors
///
/// Returns [`CryptoError::NonFipsAlgorithm`] when `GTCX_FIPS_STRICT=1`.
pub fn assert_fips_permissive(algorithm: &'static str) -> Result<(), CryptoError> {
    if fips_mode_only() {
        Err(CryptoError::NonFipsAlgorithm { algorithm })
    } else {
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    #![allow(unsafe_code)]
    use super::*;

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

    #[test]
    fn test_assert_fips_permissive_blocks_in_strict_mode() {
        unsafe { std::env::set_var("GTCX_FIPS_STRICT", "1") };
        let err = assert_fips_permissive("test-alg").unwrap_err();
        assert!(
            matches!(err, CryptoError::NonFipsAlgorithm { algorithm: "test-alg" }),
            "expected NonFipsAlgorithm for test-alg, got {err:?}"
        );
        unsafe { std::env::remove_var("GTCX_FIPS_STRICT") };
    }

    #[test]
    fn test_assert_fips_permissive_allows_when_not_strict() {
        unsafe { std::env::remove_var("GTCX_FIPS_STRICT") };
        assert!(assert_fips_permissive("test-alg").is_ok());
    }
}
