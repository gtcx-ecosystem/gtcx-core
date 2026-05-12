//! ZKP error types.

use thiserror::Error;

/// Errors that can occur during ZKP operations.
#[derive(Debug, Error)]
pub enum ZkpError {
    /// The witness data is empty.
    #[error("Witness cannot be empty")]
    EmptyWitness,

    /// The witness data exceeds the maximum allowed size.
    #[error("Witness too large: {size} bytes exceeds maximum {max} bytes")]
    WitnessToLarge {
        /// Actual size in bytes.
        size: usize,
        /// Maximum allowed size.
        max: usize,
    },

    /// Proof verification failed.
    #[error("Proof verification failed")]
    VerificationFailed,

    /// Witness violates circuit preconditions.
    #[error("Invalid witness: {reason}")]
    InvalidWitness {
        /// Description of the constraint violation.
        reason: String,
    },

    /// Proof system error during setup, proving, or verification.
    #[error("Proof system error: {reason}")]
    ProofSystemError {
        /// Description of the proof system failure.
        reason: String,
    },

    /// Serialization failed for proof system objects.
    #[error("Serialization error: {reason}")]
    SerializationError {
        /// Description of the serialization failure.
        reason: String,
    },

    /// Deserialization failed for proof system objects.
    #[error("Deserialization error: {reason}")]
    DeserializationError {
        /// Description of the deserialization failure.
        reason: String,
    },

    /// Invalid proof format during deserialization.
    #[error("Invalid proof format: {reason}")]
    InvalidProofFormat {
        /// Description of the format error.
        reason: String,
    },

    /// Unsupported circuit type.
    #[error("Unsupported circuit type: {0}")]
    UnsupportedCircuit(String),
}

/// Result type for ZKP operations.
pub type Result<T> = std::result::Result<T, ZkpError>;

pub(crate) fn map_proof_system_error(err: impl std::fmt::Display) -> ZkpError {
    ZkpError::ProofSystemError {
        reason: err.to_string(),
    }
}
