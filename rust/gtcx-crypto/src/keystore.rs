//! Key storage abstraction.
//!
//! Provides types and a trait for pluggable key storage backends:
//! - `MemoryKeyStore` — in-process, keys in zeroizing memory (default, testing)
//! - `Pkcs11KeyStore` — `PKCS#11` (`SoftHSMv2` in CI, hardware HSM in prod)
//! - `CloudKmsKeyStore` — AWS KMS / GCP Cloud KMS
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

pub use keystore_types::{Algorithm, KeyId, KeyState, KeyStore};
pub use memory_keystore::MemoryKeyStore;

mod keystore_types;
mod memory_keystore;
