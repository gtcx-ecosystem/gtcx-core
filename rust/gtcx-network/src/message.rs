//! Network message types.

use gtcx_crypto::hashing::blake3;
use serde::{Deserialize, Serialize};

use crate::error::{NetworkError, Result};
use crate::peer::PeerId;
use crate::topic::MAX_MESSAGE_SIZE;

/// A network message with metadata.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    /// The sender's peer ID.
    pub from: PeerId,
    /// The topic this message is published to.
    pub topic: String,
    /// The message payload.
    pub payload: Vec<u8>,
    /// Monotonic sequence number from the sender.
    pub sequence: u64,
    /// Timestamp in milliseconds.
    pub timestamp_ms: u64,
}

impl Message {
    /// Create a new message.
    ///
    /// # Errors
    ///
    /// Returns [`NetworkError::MessageTooLarge`] if payload exceeds [`MAX_MESSAGE_SIZE`].
    pub fn new(from: PeerId, topic: &str, payload: Vec<u8>, sequence: u64) -> Result<Self> {
        if payload.len() > MAX_MESSAGE_SIZE {
            return Err(NetworkError::MessageTooLarge {
                size: payload.len(),
                max: MAX_MESSAGE_SIZE,
            });
        }
        Ok(Self {
            from,
            topic: topic.to_string(),
            payload,
            sequence,
            timestamp_ms: current_timestamp_ms(),
        })
    }

    /// Compute a unique message ID (Blake3 hash of from + sequence + payload).
    pub fn id(&self) -> [u8; 32] {
        let mut data = Vec::new();
        data.extend_from_slice(self.from.as_str().as_bytes());
        data.extend_from_slice(&self.sequence.to_be_bytes());
        data.extend_from_slice(&self.payload);
        blake3(&data).expect("BLAKE3 not available in FIPS strict mode")
    }

    /// Serialize the message to JSON bytes.
    pub fn to_json(&self) -> Result<Vec<u8>> {
        serde_json::to_vec(self).map_err(|e| NetworkError::Serialization(e.to_string()))
    }

    /// Deserialize a message from JSON bytes.
    pub fn from_json(bytes: &[u8]) -> Result<Self> {
        serde_json::from_slice(bytes).map_err(|e| NetworkError::Serialization(e.to_string()))
    }
}

fn current_timestamp_ms() -> u64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    u64::try_from(
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis(),
    )
    .unwrap_or(u64::MAX)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_message_creation() {
        let from = PeerId::from_string("sender".to_string()).unwrap();
        let msg = Message::new(from, "gtcx/test", b"hello".to_vec(), 1).unwrap();
        assert_eq!(msg.topic, "gtcx/test");
        assert_eq!(msg.payload, b"hello");
        assert_eq!(msg.sequence, 1);
    }

    #[test]
    fn test_message_too_large_rejected() {
        let from = PeerId::from_string("sender".to_string()).unwrap();
        let big = vec![0u8; MAX_MESSAGE_SIZE + 1];
        let err = Message::new(from, "topic", big, 0).unwrap_err();
        assert!(matches!(err, NetworkError::MessageTooLarge { .. }));
    }

    #[test]
    fn test_message_id_deterministic() {
        let from = PeerId::from_string("sender".to_string()).unwrap();
        let msg = Message::new(from, "topic", b"data".to_vec(), 1).unwrap();
        let id1 = msg.id();
        let id2 = msg.id();
        assert_eq!(id1, id2);
    }

    #[test]
    fn test_message_json_roundtrip() {
        let from = PeerId::from_string("sender".to_string()).unwrap();
        let msg = Message::new(from, "topic", b"payload".to_vec(), 42).unwrap();

        let json = msg.to_json().unwrap();
        let deserialized = Message::from_json(&json).unwrap();

        assert_eq!(deserialized.from, msg.from);
        assert_eq!(deserialized.topic, msg.topic);
        assert_eq!(deserialized.payload, msg.payload);
        assert_eq!(deserialized.sequence, msg.sequence);
    }
}
