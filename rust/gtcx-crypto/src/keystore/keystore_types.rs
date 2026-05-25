//! Key storage types and trait definitions.
//!
//! Provides the core abstractions for pluggable key storage backends:
//! - `KeyId` — opaque key identifier
//! - `Algorithm` — supported key algorithms
//! - `KeyState` — NIST SP 800-57 lifecycle state
//! - `KeyStore` — trait for storage backends

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
    /// ECDSA over NIST P-256 (FIPS-aligned, cloud KMS compatible)
    EcdsaP256,
    // Future: Secp256k1
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
