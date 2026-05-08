//! Key storage abstraction.
//!
//! Provides a trait for pluggable key storage backends:
//! - `MemoryKeyStore` — in-process, keys in zeroizing memory (default, testing)
//! - Future: `Pkcs11KeyStore` — PKCS#11 (SoftHSMv2 in CI, hardware HSM in prod)
//! - Future: `CloudKmsKeyStore` — AWS KMS / GCP Cloud KMS ($1/key/month)
//!
//! ## Design
//!
//! Keys are identified by opaque `KeyId` handles. Private key material
//! never leaves the store — signing happens inside the store boundary.
//! This enables HSM-backed keys where the private key physically cannot
//! be extracted.
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::keystore::{KeyStore, MemoryKeyStore, Algorithm};
//!
//! let store = MemoryKeyStore::new();
//! let key_id = store.generate_key(Algorithm::Ed25519).unwrap();
//! let signature = store.sign(&key_id, b"message").unwrap();
//! let public_key = store.public_key(&key_id).unwrap();
//!
//! // Verify using the public API
//! use gtcx_crypto::{verify, PublicKey, Signature};
//! let pk = PublicKey::from_bytes(&public_key).unwrap();
//! let sig = Signature::from_bytes(&signature).unwrap();
//! assert!(verify(&sig, b"message", &pk));
//! ```

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use crate::error::CryptoError;
use crate::signing::ed25519::{self, PrivateKey, PublicKey};
use crate::Result;

// =============================================================================
// KEY ID
// =============================================================================

/// Opaque key identifier.
///
/// Key IDs are handles — they do not contain key material.
/// The format is backend-specific:
/// - MemoryKeyStore: UUID-like string
/// - PKCS#11: CKA_ID hex
/// - Cloud KMS: resource ARN/path
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct KeyId(String);

impl KeyId {
    /// Create a new key ID from a string.
    pub fn new(id: impl Into<String>) -> Self {
        Self(id.into())
    }

    /// Get the key ID as a string reference.
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl std::fmt::Display for KeyId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

// =============================================================================
// ALGORITHM
// =============================================================================

/// Supported key algorithms.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Algorithm {
    /// Ed25519 (default, 128-bit security)
    Ed25519,
    // Future: Secp256k1, P256 (FIPS)
}

// =============================================================================
// KEY STATE
// =============================================================================

/// Key lifecycle state per NIST SP 800-57.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum KeyState {
    /// Key generated, not yet activated.
    Created,
    /// Key in active use for signing.
    Active,
    /// Key rotated — can verify historical signatures, cannot sign.
    Rotated,
    /// Key revoked — can verify with warning, cannot sign.
    Revoked,
    /// Key destroyed — no operations possible.
    Destroyed,
}

// =============================================================================
// KEYSTORE TRAIT
// =============================================================================

/// Trait for key storage backends.
///
/// All operations are synchronous. For async backends (Cloud KMS),
/// wrap in `tokio::task::spawn_blocking` or implement a separate
/// async trait in a downstream crate.
pub trait KeyStore: Send + Sync {
    /// Generate a new key. Returns an opaque key ID.
    fn generate_key(&self, algorithm: Algorithm) -> Result<KeyId>;

    /// Sign a message using the key identified by `key_id`.
    /// The private key never leaves the store.
    fn sign(&self, key_id: &KeyId, message: &[u8]) -> Result<Vec<u8>>;

    /// Get the public key bytes for a given key ID.
    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>>;

    /// Get the current state of a key.
    fn key_state(&self, key_id: &KeyId) -> Result<KeyState>;

    /// Transition a key to a new state.
    fn transition(&self, key_id: &KeyId, new_state: KeyState) -> Result<()>;

    /// Destroy a key (zeroize and remove).
    fn destroy_key(&self, key_id: &KeyId) -> Result<()>;
}

// =============================================================================
// IN-MEMORY KEY STORE
// =============================================================================

struct StoredKey {
    private_key: PrivateKey,
    public_key: PublicKey,
    _algorithm: Algorithm,
    state: KeyState,
}

/// In-memory key store for testing and local development.
///
/// Keys are stored in process memory with `Zeroize` protection.
/// Keys are lost when the process exits.
pub struct MemoryKeyStore {
    keys: Arc<Mutex<HashMap<String, StoredKey>>>,
    counter: Arc<Mutex<u64>>,
}

impl MemoryKeyStore {
    /// Create a new empty in-memory key store.
    pub fn new() -> Self {
        Self {
            keys: Arc::new(Mutex::new(HashMap::new())),
            counter: Arc::new(Mutex::new(0)),
        }
    }

    fn next_id(&self) -> String {
        let mut counter = self.counter.lock().expect("counter lock poisoned");
        *counter += 1;
        format!("mem-key-{counter}")
    }
}

impl Default for MemoryKeyStore {
    fn default() -> Self {
        Self::new()
    }
}

impl KeyStore for MemoryKeyStore {
    fn generate_key(&self, algorithm: Algorithm) -> Result<KeyId> {
        match algorithm {
            Algorithm::Ed25519 => {
                let private_key = PrivateKey::generate();
                let public_key = private_key.public_key();
                let id = self.next_id();

                let stored = StoredKey {
                    private_key,
                    public_key,
                    _algorithm: algorithm,
                    state: KeyState::Active,
                };

                self.keys
                    .lock()
                    .expect("keys lock poisoned")
                    .insert(id.clone(), stored);

                Ok(KeyId::new(id))
            }
        }
    }

    fn sign(&self, key_id: &KeyId, message: &[u8]) -> Result<Vec<u8>> {
        let keys = self.keys.lock().expect("keys lock poisoned");
        let stored = keys
            .get(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;

        match stored.state {
            KeyState::Active => {}
            KeyState::Rotated | KeyState::Revoked => {
                return Err(CryptoError::KeyNotActive(key_id.to_string()));
            }
            KeyState::Destroyed => {
                return Err(CryptoError::KeyNotFound(key_id.to_string()));
            }
            KeyState::Created => {
                return Err(CryptoError::KeyNotActive(key_id.to_string()));
            }
        }

        let signature = ed25519::sign(message, &stored.private_key);
        Ok(signature.as_bytes().to_vec())
    }

    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>> {
        let keys = self.keys.lock().expect("keys lock poisoned");
        let stored = keys
            .get(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
        Ok(stored.public_key.as_bytes().to_vec())
    }

    fn key_state(&self, key_id: &KeyId) -> Result<KeyState> {
        let keys = self.keys.lock().expect("keys lock poisoned");
        let stored = keys
            .get(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
        Ok(stored.state)
    }

    fn transition(&self, key_id: &KeyId, new_state: KeyState) -> Result<()> {
        let mut keys = self.keys.lock().expect("keys lock poisoned");
        let stored = keys
            .get_mut(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;

        // Validate state transition per NIST SP 800-57
        let valid = matches!(
            (stored.state, new_state),
            (KeyState::Created, KeyState::Active)
                | (KeyState::Active, KeyState::Rotated)
                | (KeyState::Active, KeyState::Revoked)
                | (KeyState::Rotated, KeyState::Destroyed)
                | (KeyState::Revoked, KeyState::Destroyed)
        );

        if !valid {
            return Err(CryptoError::InvalidStateTransition {
                from: format!("{:?}", stored.state),
                to: format!("{:?}", new_state),
            });
        }

        stored.state = new_state;
        Ok(())
    }

    fn destroy_key(&self, key_id: &KeyId) -> Result<()> {
        let mut keys = self.keys.lock().expect("keys lock poisoned");
        // Remove drops the StoredKey, which Zeroizes the PrivateKey
        keys.remove(key_id.as_str())
            .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::signing::ed25519;

    #[test]
    fn generate_and_sign() {
        let store = MemoryKeyStore::new();
        let key_id = store.generate_key(Algorithm::Ed25519).unwrap();
        let sig_bytes = store.sign(&key_id, b"hello").unwrap();
        let pk_bytes = store.public_key(&key_id).unwrap();

        // Verify using the standard API
        let pk = ed25519::PublicKey::from_bytes(&pk_bytes).unwrap();
        let sig = ed25519::Signature::from_bytes(&sig_bytes).unwrap();
        assert!(ed25519::verify(&sig, b"hello", &pk));
    }

    #[test]
    fn key_lifecycle() {
        let store = MemoryKeyStore::new();
        let key_id = store.generate_key(Algorithm::Ed25519).unwrap();

        assert_eq!(store.key_state(&key_id).unwrap(), KeyState::Active);

        // Can sign while active
        assert!(store.sign(&key_id, b"msg").is_ok());

        // Rotate
        store.transition(&key_id, KeyState::Rotated).unwrap();
        assert_eq!(store.key_state(&key_id).unwrap(), KeyState::Rotated);

        // Cannot sign after rotation
        assert!(store.sign(&key_id, b"msg").is_err());

        // Can still get public key
        assert!(store.public_key(&key_id).is_ok());

        // Destroy
        store.transition(&key_id, KeyState::Destroyed).unwrap();
    }

    #[test]
    fn invalid_transitions_rejected() {
        let store = MemoryKeyStore::new();
        let key_id = store.generate_key(Algorithm::Ed25519).unwrap();

        // Active → Destroyed is invalid (must rotate or revoke first)
        assert!(store.transition(&key_id, KeyState::Destroyed).is_err());

        // Active → Created is invalid
        assert!(store.transition(&key_id, KeyState::Created).is_err());
    }

    #[test]
    fn revoked_key_cannot_sign() {
        let store = MemoryKeyStore::new();
        let key_id = store.generate_key(Algorithm::Ed25519).unwrap();

        store.transition(&key_id, KeyState::Revoked).unwrap();
        assert!(store.sign(&key_id, b"msg").is_err());
    }

    #[test]
    fn destroy_removes_key() {
        let store = MemoryKeyStore::new();
        let key_id = store.generate_key(Algorithm::Ed25519).unwrap();

        store.destroy_key(&key_id).unwrap();

        // All operations should fail
        assert!(store.sign(&key_id, b"msg").is_err());
        assert!(store.public_key(&key_id).is_err());
        assert!(store.key_state(&key_id).is_err());
    }

    #[test]
    fn unknown_key_id_fails() {
        let store = MemoryKeyStore::new();
        let fake = KeyId::new("nonexistent");
        assert!(store.sign(&fake, b"msg").is_err());
        assert!(store.public_key(&fake).is_err());
    }
}
