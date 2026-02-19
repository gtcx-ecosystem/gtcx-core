//! Key generation and derivation.
//!
//! This module provides key generation and HD (hierarchical deterministic)
//! key derivation for the GTCX protocol.
//!
//! ## Features
//!
//! - Secure random key generation using OS CSPRNG
//! - BIP-32 style HD key derivation
//! - Support for multiple key types
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::keys::{generate_keypair, derive_child_key};
//!
//! let (private_key, public_key) = generate_keypair();
//!
//! // Derive child keys for different purposes
//! let signing_key = derive_child_key(&private_key, 0);
//! let encryption_key = derive_child_key(&private_key, 1);
//! ```

use tracing::instrument;

use crate::hashing::blake3_derive;
use crate::signing::ed25519::{PrivateKey, PublicKey};

/// A key pair consisting of a private and public key.
#[derive(Debug)]
pub struct KeyPair {
    /// The private key (keep secret!)
    pub private_key: PrivateKey,
    /// The public key (can be shared)
    pub public_key: PublicKey,
}

/// Generate a new random key pair.
///
/// Uses the operating system's cryptographically secure random number
/// generator (CSPRNG) for key generation.
///
/// # Returns
///
/// A tuple of (`private_key`, `public_key`).
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::keys::generate_keypair;
///
/// let (private_key, public_key) = generate_keypair();
/// ```
#[instrument(name = "keys.generate_keypair")]
pub fn generate_keypair() -> (PrivateKey, PublicKey) {
    let private_key = PrivateKey::generate();
    let public_key = private_key.public_key();
    (private_key, public_key)
}

/// Generate a new random key pair as a `KeyPair` struct.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::keys::generate_keypair_struct;
///
/// let keypair = generate_keypair_struct();
/// println!("Public key: {}", keypair.public_key.to_hex());
/// ```
#[instrument(name = "keys.generate_keypair_struct")]
pub fn generate_keypair_struct() -> KeyPair {
    let (private_key, public_key) = generate_keypair();
    KeyPair {
        private_key,
        public_key,
    }
}

/// Derive a child key from a parent key using an index.
///
/// This implements a simplified HD (hierarchical deterministic) key derivation
/// scheme using Blake3 key derivation. Each index produces a unique child key.
///
/// # Arguments
///
/// * `parent` - The parent private key
/// * `index` - The child index (0..2^32)
///
/// # Returns
///
/// A derived child private key.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::keys::{generate_keypair, derive_child_key};
///
/// let (master_key, _) = generate_keypair();
///
/// // Derive different keys for different purposes
/// let signing_key = derive_child_key(&master_key, 0);
/// let encryption_key = derive_child_key(&master_key, 1);
/// let auth_key = derive_child_key(&master_key, 2);
/// ```
///
/// # Panics
///
/// Panics if Blake3 derivation produces invalid key material (should never happen).
#[instrument(skip(parent), fields(index = index))]
pub fn derive_child_key(parent: &PrivateKey, index: u32) -> PrivateKey {
    let context = format!("GTCX-2026 child key derivation index {index}");
    let derived_bytes = blake3_derive(&context, parent.as_bytes());
    PrivateKey::from_bytes(&derived_bytes).expect("Blake3 always produces valid key material")
}

/// Derive a key for a specific purpose.
///
/// Uses a purpose string to derive a unique key from a master key.
/// This is useful for deriving keys for different applications.
///
/// # Arguments
///
/// * `master` - The master private key
/// * `purpose` - A unique purpose string (e.g., "signing", "encryption")
///
/// # Returns
///
/// A derived private key for the specified purpose.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::keys::{generate_keypair, derive_purpose_key};
///
/// let (master_key, _) = generate_keypair();
///
/// let signing_key = derive_purpose_key(&master_key, "tradepass-signing");
/// let geotag_key = derive_purpose_key(&master_key, "geotag-signing");
/// ```
///
/// # Panics
///
/// Panics if Blake3 derivation produces invalid key material (should never happen).
#[instrument(skip(master), fields(purpose = purpose))]
pub fn derive_purpose_key(master: &PrivateKey, purpose: &str) -> PrivateKey {
    let context = format!("GTCX-2026 purpose key: {purpose}");
    let derived_bytes = blake3_derive(&context, master.as_bytes());
    PrivateKey::from_bytes(&derived_bytes).expect("Blake3 always produces valid key material")
}

/// Derive a key using a path (hierarchical derivation).
///
/// Allows deriving keys using a path of indices, similar to BIP-44.
///
/// # Arguments
///
/// * `master` - The master private key
/// * `path` - A slice of indices representing the derivation path
///
/// # Returns
///
/// A derived private key at the specified path.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::keys::{generate_keypair, derive_path};
///
/// let (master_key, _) = generate_keypair();
///
/// // Derive: master / 44 / 0 / 0 / 0
/// let derived = derive_path(&master_key, &[44, 0, 0, 0]);
/// ```
///
/// # Panics
///
/// Panics if key cloning or derivation produces invalid key material (should never happen).
#[instrument(skip(master), fields(path_len = path.len()))]
pub fn derive_path(master: &PrivateKey, path: &[u32]) -> PrivateKey {
    let mut current =
        PrivateKey::from_bytes(master.as_bytes()).expect("Cloning valid key should succeed");

    for &index in path {
        current = derive_child_key(&current, index);
    }

    current
}

/// Verify that a public key matches a private key.
///
/// # Arguments
///
/// * `private_key` - The private key to check
/// * `public_key` - The public key to verify against
///
/// # Returns
///
/// `true` if the public key was derived from the private key.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::keys::{generate_keypair, verify_keypair};
///
/// let (private_key, public_key) = generate_keypair();
/// assert!(verify_keypair(&private_key, &public_key));
/// ```
pub fn verify_keypair(private_key: &PrivateKey, public_key: &PublicKey) -> bool {
    private_key.public_key() == *public_key
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_keypair() {
        let (private_key, public_key) = generate_keypair();
        assert!(verify_keypair(&private_key, &public_key));
    }

    #[test]
    fn test_derive_child_key_deterministic() {
        let (master, _) = generate_keypair();

        let child1 = derive_child_key(&master, 0);
        let child2 = derive_child_key(&master, 0);

        assert_eq!(child1.as_bytes(), child2.as_bytes());
    }

    #[test]
    fn test_derive_child_key_different_indices() {
        let (master, _) = generate_keypair();

        let child0 = derive_child_key(&master, 0);
        let child1 = derive_child_key(&master, 1);

        assert_ne!(child0.as_bytes(), child1.as_bytes());
    }

    #[test]
    fn test_derive_purpose_key() {
        let (master, _) = generate_keypair();

        let signing = derive_purpose_key(&master, "signing");
        let encryption = derive_purpose_key(&master, "encryption");

        assert_ne!(signing.as_bytes(), encryption.as_bytes());
    }

    #[test]
    fn test_derive_path() {
        let (master, _) = generate_keypair();

        let derived = derive_path(&master, &[44, 0, 0, 0]);

        // Should be deterministic
        let derived2 = derive_path(&master, &[44, 0, 0, 0]);
        assert_eq!(derived.as_bytes(), derived2.as_bytes());

        // Different path = different key
        let different = derive_path(&master, &[44, 0, 0, 1]);
        assert_ne!(derived.as_bytes(), different.as_bytes());
    }

    #[test]
    fn test_verify_keypair_success() {
        let (private_key, public_key) = generate_keypair();
        assert!(verify_keypair(&private_key, &public_key));
    }

    #[test]
    fn test_verify_keypair_failure() {
        let (private_key1, _) = generate_keypair();
        let (_, public_key2) = generate_keypair();
        assert!(!verify_keypair(&private_key1, &public_key2));
    }
}
