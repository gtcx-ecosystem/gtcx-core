//! Gossip topic types and subscription management.

use gtcx_crypto::hashing::blake3;
use serde::{Deserialize, Serialize};
use tracing::instrument;

use crate::error::{NetworkError, Result};

/// Maximum message size (4 MB).
pub const MAX_MESSAGE_SIZE: usize = 4 * 1024 * 1024;

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
        let hash = blake3(name.as_bytes()).expect("BLAKE3 not available in FIPS strict mode");
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

#[cfg(test)]
mod tests {
    use super::*;

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

    #[test]
    fn test_topic_json_roundtrip() {
        let t = Topic::new("gtcx/test/v1");
        let json = serde_json::to_string(&t).unwrap();
        let deserialized: Topic = serde_json::from_str(&json).unwrap();
        assert_eq!(t, deserialized);
    }

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
}
