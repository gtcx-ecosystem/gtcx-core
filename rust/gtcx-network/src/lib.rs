//! # GTCX P2P Networking
//!
//! Peer-to-peer networking layer for the GTCX protocol.
//!
//! ## Overview
//!
//! This crate provides:
//! - Peer identity and discovery types
//! - Gossip topic management
//! - Message serialization/deserialization
//! - Network message types for the PANX protocol
//!
//! ## Design
//!
//! The networking layer uses typed messages with cryptographic peer IDs.
//! Full libp2p integration (QUIC transport, gossipsub) is planned for Phase 2.
//! The current implementation provides the type system, message handling,
//! and topic routing that the transport layer plugs into.

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

use gtcx_crypto::hashing::blake3;
use serde::{Deserialize, Serialize};
use thiserror::Error;
use tracing::instrument;

// =============================================================================
// ERROR TYPES
// =============================================================================

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

// =============================================================================
// TYPES
// =============================================================================

/// Maximum message size (4 MB).
pub const MAX_MESSAGE_SIZE: usize = 4 * 1024 * 1024;

/// A peer identifier derived from a public key hash.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct PeerId(String);

impl PeerId {
    /// Create a peer ID from a public key.
    ///
    /// The peer ID is the hex-encoded Blake3 hash of the public key bytes.
    pub fn from_public_key(public_key_bytes: &[u8; 32]) -> Self {
        let hash = blake3(public_key_bytes);
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

/// A gossip topic for pub/sub messaging.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct Topic {
    /// The topic name.
    name: String,
    /// The topic hash (for efficient routing).
    hash: [u8; 32],
}

impl Topic {
    /// Create a new topic.
    pub fn new(name: &str) -> Self {
        let hash = blake3(name.as_bytes());
        Self {
            name: name.to_string(),
            hash,
        }
    }

    /// Get the topic name.
    pub fn name(&self) -> &str {
        &self.name
    }

    /// Get the topic hash.
    pub fn hash(&self) -> &[u8; 32] {
        &self.hash
    }
}

impl std::fmt::Display for Topic {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.name)
    }
}

/// Standard GTCX gossip topics.
pub mod topics {
    use super::Topic;

    /// Topic for new block announcements.
    pub fn blocks() -> Topic {
        Topic::new("gtcx/blocks/v1")
    }

    /// Topic for transaction broadcasts.
    pub fn transactions() -> Topic {
        Topic::new("gtcx/transactions/v1")
    }

    /// Topic for consensus messages.
    pub fn consensus() -> Topic {
        Topic::new("gtcx/consensus/v1")
    }

    /// Topic for peer discovery announcements.
    pub fn discovery() -> Topic {
        Topic::new("gtcx/discovery/v1")
    }

    /// All standard topics.
    pub fn all() -> Vec<Topic> {
        vec![blocks(), transactions(), consensus(), discovery()]
    }
}

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
        blake3(&data)
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

/// A simple topic subscription manager.
#[derive(Debug, Default)]
pub struct TopicManager {
    subscriptions: Vec<Topic>,
}

impl TopicManager {
    /// Create a new empty topic manager.
    pub fn new() -> Self {
        Self::default()
    }

    /// Subscribe to a topic.
    ///
    /// # Errors
    ///
    /// Returns [`NetworkError::DuplicateSubscription`] if already subscribed.
    #[instrument(skip(self), fields(topic = %topic.name()))]
    pub fn subscribe(&mut self, topic: Topic) -> Result<()> {
        if self.subscriptions.contains(&topic) {
            return Err(NetworkError::DuplicateSubscription(
                topic.name().to_string(),
            ));
        }
        self.subscriptions.push(topic);
        Ok(())
    }

    /// Unsubscribe from a topic. Returns true if was subscribed.
    pub fn unsubscribe(&mut self, topic_name: &str) -> bool {
        let before = self.subscriptions.len();
        self.subscriptions.retain(|t| t.name() != topic_name);
        self.subscriptions.len() < before
    }

    /// Check if subscribed to a topic.
    pub fn is_subscribed(&self, topic_name: &str) -> bool {
        self.subscriptions.iter().any(|t| t.name() == topic_name)
    }

    /// Get all subscribed topics.
    pub fn subscriptions(&self) -> &[Topic] {
        &self.subscriptions
    }

    /// Get the number of active subscriptions.
    pub fn count(&self) -> usize {
        self.subscriptions.len()
    }
}

// ── Internal helpers ──

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

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // ── PeerId ──

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

    // ── Topic ──

    #[test]
    fn test_topic_creation() {
        let t = Topic::new("gtcx/test");
        assert_eq!(t.name(), "gtcx/test");
        assert_ne!(t.hash(), &[0u8; 32]);
    }

    #[test]
    fn test_topic_hash_deterministic() {
        let t1 = Topic::new("same-topic");
        let t2 = Topic::new("same-topic");
        assert_eq!(t1.hash(), t2.hash());
    }

    #[test]
    fn test_topic_hash_different() {
        let t1 = Topic::new("topic-a");
        let t2 = Topic::new("topic-b");
        assert_ne!(t1.hash(), t2.hash());
    }

    #[test]
    fn test_standard_topics() {
        let all = topics::all();
        assert_eq!(all.len(), 4);
        assert!(all.iter().any(|t| t.name().contains("blocks")));
        assert!(all.iter().any(|t| t.name().contains("consensus")));
    }

    // ── Message ──

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

    // ── TopicManager ──

    #[test]
    fn test_topic_manager_subscribe() {
        let mut mgr = TopicManager::new();
        mgr.subscribe(topics::blocks()).unwrap();
        assert_eq!(mgr.count(), 1);
        assert!(mgr.is_subscribed("gtcx/blocks/v1"));
    }

    #[test]
    fn test_topic_manager_duplicate_rejected() {
        let mut mgr = TopicManager::new();
        mgr.subscribe(topics::blocks()).unwrap();
        let err = mgr.subscribe(topics::blocks()).unwrap_err();
        assert!(matches!(err, NetworkError::DuplicateSubscription(_)));
    }

    #[test]
    fn test_topic_manager_unsubscribe() {
        let mut mgr = TopicManager::new();
        mgr.subscribe(topics::blocks()).unwrap();
        assert!(mgr.unsubscribe("gtcx/blocks/v1"));
        assert_eq!(mgr.count(), 0);
        assert!(!mgr.is_subscribed("gtcx/blocks/v1"));
    }

    #[test]
    fn test_topic_manager_unsubscribe_nonexistent() {
        let mut mgr = TopicManager::new();
        assert!(!mgr.unsubscribe("nonexistent"));
    }

    #[test]
    fn test_topic_manager_multiple_subscriptions() {
        let mut mgr = TopicManager::new();
        for topic in topics::all() {
            mgr.subscribe(topic).unwrap();
        }
        assert_eq!(mgr.count(), 4);
    }

    // ── Serialization ──

    #[test]
    fn test_peer_id_json_roundtrip() {
        let id = PeerId::from_string("test".to_string()).unwrap();
        let json = serde_json::to_string(&id).unwrap();
        let deserialized: PeerId = serde_json::from_str(&json).unwrap();
        assert_eq!(id, deserialized);
    }

    #[test]
    fn test_topic_json_roundtrip() {
        let t = Topic::new("gtcx/test/v1");
        let json = serde_json::to_string(&t).unwrap();
        let deserialized: Topic = serde_json::from_str(&json).unwrap();
        assert_eq!(t, deserialized);
    }
}
