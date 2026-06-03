//! Peer identity types.

use gtcx_crypto::hashing::blake3;
use serde::{Deserialize, Serialize};

use crate::error::{NetworkError, Result};

/// A peer identifier derived from a public key hash.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct PeerId(String);

impl PeerId {
    /// Create a peer ID from a public key.
    ///
    /// The peer ID is the hex-encoded Blake3 hash of the public key bytes.
    pub fn from_public_key(public_key_bytes: &[u8; 32]) -> Self {
        let hash = blake3(public_key_bytes).expect("BLAKE3 not available in FIPS strict mode");
        Self(hex::encode(&hash[..16])) // Use first 16 bytes for shorter IDs
    }

    /// Create a peer ID from a string.
    ///
    /// # Errors
    ///
    /// Returns [`NetworkError::InvalidPeerId`] if the string is empty or too long.
    pub fn from_string(s: String) -> Result<Self> {
        if s.is_empty() {
            return Err(NetworkError::InvalidPeerId {
                reason: "empty string".to_string(),
            });
        }
        if s.len() > 64 {
            return Err(NetworkError::InvalidPeerId {
                reason: format!("too long: {} chars (max 64)", s.len()),
            });
        }
        Ok(Self(s))
    }

    /// Get the peer ID as a string slice.
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for PeerId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_peer_id_from_public_key() {
        let key = [42u8; 32];
        let id = PeerId::from_public_key(&key);
        assert!(!id.as_str().is_empty());
        assert_eq!(id.as_str().len(), 32); // 16 bytes hex-encoded
    }

    #[test]
    fn test_peer_id_deterministic() {
        let key = [42u8; 32];
        let id1 = PeerId::from_public_key(&key);
        let id2 = PeerId::from_public_key(&key);
        assert_eq!(id1, id2);
    }

    #[test]
    fn test_peer_id_different_keys() {
        let id1 = PeerId::from_public_key(&[1u8; 32]);
        let id2 = PeerId::from_public_key(&[2u8; 32]);
        assert_ne!(id1, id2);
    }

    #[test]
    fn test_peer_id_from_string() {
        let id = PeerId::from_string("test-peer".to_string()).unwrap();
        assert_eq!(id.as_str(), "test-peer");
    }

    #[test]
    fn test_peer_id_empty_rejected() {
        let err = PeerId::from_string(String::new()).unwrap_err();
        assert!(matches!(err, NetworkError::InvalidPeerId { .. }));
    }

    #[test]
    fn test_peer_id_too_long_rejected() {
        let long = "x".repeat(65);
        let err = PeerId::from_string(long).unwrap_err();
        assert!(matches!(err, NetworkError::InvalidPeerId { .. }));
    }

    #[test]
    fn test_peer_id_json_roundtrip() {
        let id = PeerId::from_string("test".to_string()).unwrap();
        let json = serde_json::to_string(&id).unwrap();
        let deserialized: PeerId = serde_json::from_str(&json).unwrap();
        assert_eq!(id, deserialized);
    }
}
