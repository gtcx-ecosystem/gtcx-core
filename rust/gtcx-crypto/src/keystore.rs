//! Key storage abstraction.
//!
//! Provides a trait for pluggable key storage backends:
//! - `MemoryKeyStore` — in-process, keys in zeroizing memory (default, testing)
//! - Future: `Pkcs11KeyStore` — `PKCS#11` (`SoftHSMv2` in CI, hardware HSM in prod)
//! - Future: `CloudKmsKeyStore` — AWS KMS / GCP Cloud KMS ($1/key/month)
//!
//! ## A note on `clippy::significant_drop_tightening`
//!
//! The methods below acquire a single short-lived lock for the duration of the
//! call. Clippy's nursery-level `significant_drop_tightening` lint asks for the
//! lock to be released even earlier — which would require cloning every read
//! out of the locked block before use. For an in-memory store where the
//! locked region is microseconds, that trade is wrong: the clones are more
//! expensive than the lock window. Suppressed at module level. The trait
//! contract is unchanged; HSM and KMS backends will use their own
//! concurrency models, not this mutex.

#![allow(clippy::significant_drop_tightening)]
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
/// - `MemoryKeyStore`: UUID-like string
/// - `PKCS#11`: `CKA_ID` hex
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
///
/// Serializable so HSM-backed `KeyStore` implementations can persist the
/// state outside the HSM (the HSM itself does not have a per-key state
/// machine in PKCS#11 v3).
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
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
    ///
    /// # Errors
    ///
    /// Returns an error if the backend cannot generate a key (e.g. CSPRNG
    /// unavailable, HSM session lost, storage full).
    fn generate_key(&self, algorithm: Algorithm) -> Result<KeyId>;

    /// Sign a message using the key identified by `key_id`.
    /// The private key never leaves the store.
    ///
    /// # Errors
    ///
    /// Returns an error if the key does not exist (`KeyNotFound`) or is not
    /// in the `Active` state (`KeyNotActive`). Backends may also surface
    /// transient errors (HSM disconnected, KMS rate-limited).
    fn sign(&self, key_id: &KeyId, message: &[u8]) -> Result<Vec<u8>>;

    /// Get the public key bytes for a given key ID.
    ///
    /// # Errors
    ///
    /// Returns `KeyNotFound` if the key does not exist or has been destroyed.
    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>>;

    /// Get the current state of a key.
    ///
    /// # Errors
    ///
    /// Returns `KeyNotFound` if the key does not exist or has been destroyed.
    fn key_state(&self, key_id: &KeyId) -> Result<KeyState>;

    /// Transition a key to a new state.
    ///
    /// # Errors
    ///
    /// Returns `KeyNotFound` if the key does not exist; returns
    /// `InvalidStateTransition` if the requested transition violates the
    /// NIST SP 800-57 lifecycle (e.g. Active → Created).
    fn transition(&self, key_id: &KeyId, new_state: KeyState) -> Result<()>;

    /// Destroy a key (zeroize and remove).
    ///
    /// # Errors
    ///
    /// Returns `KeyNotFound` if the key does not exist.
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
        let next = {
            let mut counter = self.counter.lock().expect("counter lock poisoned");
            *counter += 1;
            *counter
        };
        format!("mem-key-{next}")
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
        let signature = {
            let keys = self.keys.lock().expect("keys lock poisoned");
            let stored = keys
                .get(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;

            match stored.state {
                KeyState::Active => {}
                KeyState::Created | KeyState::Rotated | KeyState::Revoked => {
                    return Err(CryptoError::KeyNotActive(key_id.to_string()));
                }
                KeyState::Destroyed => {
                    return Err(CryptoError::KeyNotFound(key_id.to_string()));
                }
            }

            ed25519::sign(message, &stored.private_key)
        };
        Ok(signature.as_bytes().to_vec())
    }

    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>> {
        let bytes = {
            let keys = self.keys.lock().expect("keys lock poisoned");
            let stored = keys
                .get(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
            stored.public_key.as_bytes().to_vec()
        };
        Ok(bytes)
    }

    fn key_state(&self, key_id: &KeyId) -> Result<KeyState> {
        let state = {
            let keys = self.keys.lock().expect("keys lock poisoned");
            let stored = keys
                .get(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
            stored.state
        };
        Ok(state)
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
                | (KeyState::Active, KeyState::Rotated | KeyState::Revoked)
                | (KeyState::Rotated | KeyState::Revoked, KeyState::Destroyed)
        );

        if !valid {
            let from = format!("{:?}", stored.state);
            let to = format!("{new_state:?}");
            return Err(CryptoError::InvalidStateTransition { from, to });
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
