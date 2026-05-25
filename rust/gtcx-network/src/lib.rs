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

pub mod error;
pub mod message;
pub mod peer;
pub mod topic;

pub use error::{NetworkError, Result};
pub use message::Message;
pub use peer::PeerId;
pub use topic::{Topic, TopicManager, MAX_MESSAGE_SIZE};
