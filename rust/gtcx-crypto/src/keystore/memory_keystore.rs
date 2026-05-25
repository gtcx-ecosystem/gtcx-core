//! In-memory key store implementation.
//!
//! Provides `MemoryKeyStore` — an in-process key store for testing and
//! local development. Keys are stored in process memory and lost when
//! the process exits.
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

use std::collections::HashMap;
use std::sync::{Arc, Mutex};

use crate::error::CryptoError;
use crate::keystore::keystore_types::{Algorithm, KeyId, KeyState, KeyStore};
use crate::Result;
use crate::signing::{ed25519, p256};

// =============================================================================
// STORED KEY MATERIAL
// =============================================================================

enum StoredKeyMaterial {
    Ed25519 {
        private_key: ed25519::PrivateKey,
        public_key: ed25519::PublicKey,
    },
    EcdsaP256 {
        private_key: p256::PrivateKey,
        public_key: p256::PublicKey,
    },
}

struct StoredKey {
    material: StoredKeyMaterial,
    state: KeyState,
}

// =============================================================================
// MEMORY KEY STORE
// =============================================================================

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
                let private_key = ed25519::PrivateKey::generate();
                let public_key = private_key.public_key();
                let id = self.next_id();

                let stored = StoredKey {
                    material: StoredKeyMaterial::Ed25519 {
                        private_key,
                        public_key,
                    },
                    state: KeyState::Active,
                };

                self.keys
                    .lock()
                    .expect("keys lock poisoned")
                    .insert(id.clone(), stored);

                Ok(KeyId::new(id))
            }
            Algorithm::EcdsaP256 => {
                let private_key = p256::PrivateKey::generate();
                let public_key = private_key.public_key();
                let id = self.next_id();

                let stored = StoredKey {
                    material: StoredKeyMaterial::EcdsaP256 {
                        private_key,
                        public_key,
                    },
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
            match &stored.material {
                StoredKeyMaterial::Ed25519 {
                    private_key,
                    public_key: _,
                } => ed25519::sign(message, private_key).as_bytes().to_vec(),
                StoredKeyMaterial::EcdsaP256 {
                    private_key,
                    public_key: _,
                } => p256::sign(message, private_key).as_bytes().to_vec(),
            }
        };
        Ok(signature)
    }

    fn public_key(&self, key_id: &KeyId) -> Result<Vec<u8>> {
        let bytes = {
            let keys = self.keys.lock().expect("keys lock poisoned");
            let stored = keys
                .get(key_id.as_str())
                .ok_or_else(|| CryptoError::KeyNotFound(key_id.to_string()))?;
            match &stored.material {
                StoredKeyMaterial::Ed25519 {
                    private_key: _,
                    public_key,
                } => public_key.as_bytes().to_vec(),
                StoredKeyMaterial::EcdsaP256 {
                    private_key: _,
                    public_key,
                } => public_key.as_bytes().to_vec(),
            }
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
    use crate::signing::{ed25519, p256};

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
    fn generate_and_sign_p256() {
        let store = MemoryKeyStore::new();
        let key_id = store.generate_key(Algorithm::EcdsaP256).unwrap();
        let sig_bytes = store.sign(&key_id, b"hello").unwrap();
        let pk_bytes = store.public_key(&key_id).unwrap();

        let pk = p256::PublicKey::from_bytes(&pk_bytes).unwrap();
        let sig = p256::Signature::from_bytes(&sig_bytes).unwrap();
        assert!(p256::verify(&sig, b"hello", &pk));
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
