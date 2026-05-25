//! Network error types.

use thiserror::Error;

/// Errors in the networking layer.
#[derive(Debug, Error)]
pub enum NetworkError {
    /// Invalid peer ID format.
    #[error("Invalid peer ID: {reason}")]
    InvalidPeerId {
        /// Description of why the ID is invalid.
        reason: String,
    },

    /// Message exceeds maximum size.
    #[error("Message too large: {size} bytes exceeds maximum {max} bytes")]
    MessageTooLarge {
        /// Actual message size.
        size: usize,
        /// Maximum allowed size.
        max: usize,
    },

    /// Unknown topic.
    #[error("Unknown topic: {0}")]
    UnknownTopic(String),

    /// Serialization error.
    #[error("Serialization error: {0}")]
    Serialization(String),

    /// Duplicate subscription.
    #[error("Already subscribed to topic: {0}")]
    DuplicateSubscription(String),
}

/// Result type for network operations.
pub type Result<T> = std::result::Result<T, NetworkError>;
