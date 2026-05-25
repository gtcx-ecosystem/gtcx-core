//! Hash-chained audit logs.
//!
//! This module provides tamper-evident hash chains for audit logging.
//! Each entry in the chain includes the hash of the previous entry,
//! making any modification detectable.
//!
//! ## How It Works
//!
//! ```text
//! ┌─────────┐    ┌─────────┐    ┌─────────┐
//! │ Entry 0 │───▶│ Entry 1 │───▶│ Entry 2 │
//! │ (gen)   │    │         │    │         │
//! └─────────┘    └─────────┘    └─────────┘
//!      │              │              │
//!      │         prev_hash      prev_hash
//!      │              │              │
//!      └──────────────┴──────────────┘
//!           hash(entry_n-1)
//! ```
//!
//! ## Non-Blockchain Design
//!
//! This provides blockchain-equivalent integrity guarantees **without**:
//! - Cryptocurrency or tokens
//! - Proof-of-work or proof-of-stake
//! - Distributed consensus (that's in `gtcx-consensus`)
//!
//! Instead, we use:
//! - SHA-256 hash chaining
//! - Ed25519 digital signatures
//! - `PostgreSQL` storage (not a distributed ledger)
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::chain::{create_genesis_entry, create_entry, verify_chain};
//! use gtcx_crypto::keys::generate_keypair;
//!
//! let (private_key, public_key) = generate_keypair();
//!
//! // Create genesis entry
//! let genesis = create_genesis_entry(b"Genesis payload", &private_key);
//!
//! // Create subsequent entries
//! let entry1 = create_entry(1, genesis.hash, b"Payload 1", &private_key);
//! let entry2 = create_entry(2, entry1.hash, b"Payload 2", &private_key);
//!
//! // Verify the chain
//! let chain = vec![genesis, entry1, entry2];
//! assert!(verify_chain(&chain, &public_key).is_ok());
//! ```

use serde::{Deserialize, Serialize};
use tracing::instrument;

use crate::error::CryptoError;
use crate::hashing::sha256;
use crate::signing::ed25519::{sign, verify, PrivateKey, PublicKey, Signature};
use crate::Result;

/// A single entry in a hash chain.
///
/// Each entry contains:
/// - A sequence number (for ordering)
/// - The hash of the previous entry (for chaining)
/// - A timestamp (for audit purposes)
/// - The payload data
/// - A signature (for authenticity)
/// - The computed hash (for the next entry to reference)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ChainEntry {
    /// Sequential index in the chain (0 = genesis).
    pub sequence: u64,

    /// Hash of the previous entry (all zeros for genesis).
    #[serde(with = "hex_array_32")]
    pub prev_hash: [u8; 32],

    /// Unix timestamp in milliseconds when the entry was created.
    pub timestamp_ms: u64,

    /// The payload data (arbitrary bytes).
    #[serde(with = "hex_bytes")]
    pub payload: Vec<u8>,

    /// Ed25519 signature over the entry (excluding this field and hash).
    pub signature: Signature,

    /// SHA-256 hash of this entry (computed from all above fields).
    #[serde(with = "hex_array_32")]
    pub hash: [u8; 32],
}

/// Create a genesis (first) entry in a new chain.
///
/// The genesis entry has:
/// - Sequence number 0
/// - All-zero previous hash
///
/// # Arguments
///
/// * `payload` - The payload data for the genesis entry
/// * `private_key` - The key to sign the entry
///
/// # Returns
///
/// A signed genesis chain entry.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::chain::create_genesis_entry;
/// use gtcx_crypto::keys::generate_keypair;
///
/// let (private_key, _) = generate_keypair();
/// let genesis = create_genesis_entry(b"Genesis block", &private_key);
///
/// assert_eq!(genesis.sequence, 0);
/// assert_eq!(genesis.prev_hash, [0u8; 32]);
/// ```
#[instrument(skip(payload, private_key), fields(payload_len = payload.len()))]
pub fn create_genesis_entry(payload: &[u8], private_key: &PrivateKey) -> ChainEntry {
    create_entry(0, [0u8; 32], payload, private_key)
}

/// Create a new entry in an existing chain.
///
/// # Arguments
///
/// * `sequence` - The sequence number (must be > 0 for non-genesis)
/// * `prev_hash` - The hash of the previous entry
/// * `payload` - The payload data
/// * `private_key` - The key to sign the entry
///
/// # Returns
///
/// A signed chain entry.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::chain::{create_genesis_entry, create_entry};
/// use gtcx_crypto::keys::generate_keypair;
///
/// let (private_key, _) = generate_keypair();
/// let genesis = create_genesis_entry(b"Genesis", &private_key);
///
/// let entry1 = create_entry(1, genesis.hash, b"Entry 1", &private_key);
/// assert_eq!(entry1.sequence, 1);
/// assert_eq!(entry1.prev_hash, genesis.hash);
/// ```
#[instrument(skip(payload, private_key), fields(sequence = sequence, payload_len = payload.len()))]
pub fn create_entry(
    sequence: u64,
    prev_hash: [u8; 32],
    payload: &[u8],
    private_key: &PrivateKey,
) -> ChainEntry {
    let timestamp_ms = current_timestamp_ms();

    // Build the signable content (everything except signature and hash)
    let signable = build_signable_content(sequence, &prev_hash, timestamp_ms, payload);

    // Sign the content
    let signature = sign(&signable, private_key);

    // Compute the hash (includes signature)
    let mut hashable = signable;
    hashable.extend_from_slice(signature.as_bytes());
    let hash = sha256(&hashable);

    ChainEntry {
        sequence,
        prev_hash,
        timestamp_ms,
        payload: payload.to_vec(),
        signature,
        hash,
    }
}

/// Verify a single chain entry's signature.
///
/// # Arguments
///
/// * `entry` - The entry to verify
/// * `public_key` - The expected signer's public key
///
/// # Returns
///
/// `true` if the signature is valid.
#[instrument(skip_all, fields(sequence = entry.sequence))]
pub fn verify_entry(entry: &ChainEntry, public_key: &PublicKey) -> bool {
    let signable = build_signable_content(
        entry.sequence,
        &entry.prev_hash,
        entry.timestamp_ms,
        &entry.payload,
    );

    verify(&entry.signature, &signable, public_key)
}

/// Verify an entire chain's integrity.
///
/// Checks:
/// 1. All signatures are valid
/// 2. Sequence numbers are consecutive starting from 0
/// 3. Each entry's `prev_hash` matches the previous entry's hash
///
/// # Arguments
///
/// * `chain` - The chain entries in order
/// * `public_key` - The expected signer's public key
///
/// # Returns
///
/// `Ok(())` if the chain is valid.
///
/// # Errors
///
/// - [`CryptoError::VerificationFailed`] if any signature is invalid
/// - [`CryptoError::ChainIntegrityViolation`] if hashes don't chain correctly
#[instrument(skip_all, fields(chain_len = chain.len()))]
pub fn verify_chain(chain: &[ChainEntry], public_key: &PublicKey) -> Result<()> {
    if chain.is_empty() {
        return Ok(());
    }

    // Verify genesis
    let genesis = &chain[0];
    if genesis.sequence != 0 {
        return Err(CryptoError::ChainIntegrityViolation {
            expected: "sequence 0 for genesis".to_string(),
            actual: format!("sequence {}", genesis.sequence),
        });
    }
    if genesis.prev_hash != [0u8; 32] {
        return Err(CryptoError::ChainIntegrityViolation {
            expected: "all-zero prev_hash for genesis".to_string(),
            actual: hex::encode(genesis.prev_hash),
        });
    }
    if !verify_entry(genesis, public_key) {
        return Err(CryptoError::VerificationFailed);
    }

    // Verify each subsequent entry
    for i in 1..chain.len() {
        let prev = &chain[i - 1];
        let curr = &chain[i];

        // Check sequence
        if curr.sequence != prev.sequence + 1 {
            return Err(CryptoError::ChainIntegrityViolation {
                expected: format!("sequence {}", prev.sequence + 1),
                actual: format!("sequence {}", curr.sequence),
            });
        }

        // Check hash chain
        if curr.prev_hash != prev.hash {
            return Err(CryptoError::chain_violation(&prev.hash, &curr.prev_hash));
        }

        // Check signature
        if !verify_entry(curr, public_key) {
            return Err(CryptoError::VerificationFailed);
        }
    }

    Ok(())
}

/// Verify that a new entry correctly extends an existing chain.
///
/// # Arguments
///
/// * `last_entry` - The current last entry in the chain
/// * `new_entry` - The proposed new entry
/// * `public_key` - The expected signer's public key
///
/// # Returns
///
/// `Ok(())` if the new entry is a valid extension.
///
/// # Errors
///
/// - [`CryptoError::ChainIntegrityViolation`] if sequence or hash doesn't match
/// - [`CryptoError::VerificationFailed`] if the signature is invalid
#[instrument(skip_all, fields(last_seq = last_entry.sequence, new_seq = new_entry.sequence))]
pub fn verify_extension(
    last_entry: &ChainEntry,
    new_entry: &ChainEntry,
    public_key: &PublicKey,
) -> Result<()> {
    // Check sequence
    if new_entry.sequence != last_entry.sequence + 1 {
        return Err(CryptoError::ChainIntegrityViolation {
            expected: format!("sequence {}", last_entry.sequence + 1),
            actual: format!("sequence {}", new_entry.sequence),
        });
    }

    // Check hash chain
    if new_entry.prev_hash != last_entry.hash {
        return Err(CryptoError::chain_violation(
            &last_entry.hash,
            &new_entry.prev_hash,
        ));
    }

    // Check signature
    if !verify_entry(new_entry, public_key) {
        return Err(CryptoError::VerificationFailed);
    }

    Ok(())
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/// Build the content that gets signed (everything except signature and hash).
fn build_signable_content(
    sequence: u64,
    prev_hash: &[u8; 32],
    timestamp_ms: u64,
    payload: &[u8],
) -> Vec<u8> {
    let mut content = Vec::new();
    content.extend_from_slice(&sequence.to_be_bytes());
    content.extend_from_slice(prev_hash);
    content.extend_from_slice(&timestamp_ms.to_be_bytes());
    content.extend_from_slice(&(payload.len() as u64).to_be_bytes());
    content.extend_from_slice(payload);
    content
}

/// Get current timestamp in milliseconds.
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
// SERDE HELPERS
// =============================================================================

mod hex_array_32 {
    use serde::{Deserialize, Deserializer, Serializer};

    pub fn serialize<S>(bytes: &[u8; 32], serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&hex::encode(bytes))
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<[u8; 32], D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        let bytes = hex::decode(&s).map_err(serde::de::Error::custom)?;
        bytes
            .try_into()
            .map_err(|_| serde::de::Error::custom("expected 32 bytes"))
    }
}

mod hex_bytes {
    use serde::{Deserialize, Deserializer, Serializer};

    pub fn serialize<S>(bytes: &[u8], serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&hex::encode(bytes))
    }

    pub fn deserialize<'de, D>(deserializer: D) -> Result<Vec<u8>, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        hex::decode(&s).map_err(serde::de::Error::custom)
    }
}

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests;
