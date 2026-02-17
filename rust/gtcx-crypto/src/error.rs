//! Error types for cryptographic operations.
//!
//! This module defines all error types used throughout the `gtcx-crypto` crate.
//! All errors are designed to be informative without leaking sensitive information.

use thiserror::Error;

/// Errors that can occur during cryptographic operations.
///
/// # Security Note
///
/// Error messages are designed to be safe to log without leaking
/// sensitive information like key material or plaintext.
#[derive(Debug, Error)]
pub enum CryptoError {
    /// The provided key has an invalid length.
    #[error("Invalid key length: expected {expected} bytes, got {actual}")]
    InvalidKeyLength {
        /// Expected length in bytes.
        expected: usize,
        /// Actual length provided.
        actual: usize,
    },

    /// The provided signature has an invalid length.
    #[error("Invalid signature length: expected {expected} bytes, got {actual}")]
    InvalidSignatureLength {
        /// Expected length in bytes.
        expected: usize,
        /// Actual length provided.
        actual: usize,
    },

    /// The provided signature is malformed or invalid.
    #[error("Invalid signature format")]
    InvalidSignature,

    /// The provided public key is malformed or invalid.
    #[error("Invalid public key format")]
    InvalidPublicKey,

    /// The provided private key is malformed or invalid.
    #[error("Invalid private key format")]
    InvalidPrivateKey,

    /// Signature verification failed.
    #[error("Signature verification failed")]
    VerificationFailed,

    /// Array lengths don't match for batch operations.
    #[error("Length mismatch in batch operation: messages={messages}, signatures={signatures}, keys={keys}")]
    LengthMismatch {
        /// Number of messages.
        messages: usize,
        /// Number of signatures.
        signatures: usize,
        /// Number of public keys.
        keys: usize,
    },

    /// Invalid hash chain: previous hash doesn't match.
    #[error("Chain integrity violation: expected previous hash {expected}, got {actual}")]
    ChainIntegrityViolation {
        /// Expected previous hash (hex).
        expected: String,
        /// Actual previous hash (hex).
        actual: String,
    },

    /// Key derivation failed.
    #[error("Key derivation failed: {reason}")]
    DerivationFailed {
        /// Reason for failure.
        reason: String,
    },

    /// Random number generation failed.
    #[error("Random number generation failed")]
    RngFailed,
}

impl CryptoError {
    /// Create a length mismatch error for batch operations.
    pub const fn length_mismatch(messages: usize, signatures: usize, keys: usize) -> Self {
        Self::LengthMismatch {
            messages,
            signatures,
            keys,
        }
    }

    /// Create a chain integrity violation error.
    pub fn chain_violation(expected: &[u8; 32], actual: &[u8; 32]) -> Self {
        Self::ChainIntegrityViolation {
            expected: hex::encode(expected),
            actual: hex::encode(actual),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let err = CryptoError::InvalidKeyLength {
            expected: 32,
            actual: 16,
        };
        assert_eq!(
            err.to_string(),
            "Invalid key length: expected 32 bytes, got 16"
        );
    }

    #[test]
    fn test_length_mismatch() {
        let err = CryptoError::length_mismatch(10, 9, 10);
        assert!(err.to_string().contains("messages=10"));
        assert!(err.to_string().contains("signatures=9"));
    }
}
