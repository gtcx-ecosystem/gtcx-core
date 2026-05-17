//! Ed25519 digital signatures.
//!
//! This module provides Ed25519 signing and verification using the
//! `ed25519-dalek` crate with batch verification support.
//!
//! ## Security Properties
//!
//! - 128-bit security level
//! - Deterministic signatures (same message + key = same signature)
//! - Batch verification for 50x speedup on large batches
//! - Private keys automatically zeroized on drop
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::signing::ed25519::{sign, verify, PrivateKey};
//!
//! let private_key = PrivateKey::generate();
//! let public_key = private_key.public_key();
//!
//! let message = b"Hello, GTCX!";
//! let signature = sign(message, &private_key);
//!
//! assert!(verify(&signature, message, &public_key));
//! ```

use ed25519_dalek::{Signer, SigningKey, Verifier, VerifyingKey};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use tracing::instrument;
use zeroize::{Zeroize, ZeroizeOnDrop, Zeroizing};

use crate::error::CryptoError;
use crate::Result;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/// Ed25519 private key (32 bytes).
///
/// Private keys are automatically zeroed from memory when dropped.
///
/// # Security
///
/// - Never log or serialize private keys
/// - Use [`Zeroizing`] wrapper for any temporary copies
/// - Keys are generated using OS-level CSPRNG
#[derive(Clone, Zeroize, ZeroizeOnDrop)]
pub struct PrivateKey(Zeroizing<[u8; 32]>);

/// Ed25519 public key (32 bytes).
///
/// Public keys can be freely shared and serialized.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct PublicKey(#[serde(with = "hex_array")] [u8; 32]);

/// Ed25519 signature (64 bytes).
///
/// Signatures are deterministic: the same message and key always
/// produce the same signature.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Signature(#[serde(with = "hex_array")] [u8; 64]);

// =============================================================================
// PRIVATE KEY IMPLEMENTATION
// =============================================================================

impl PrivateKey {
    /// Generate a new random private key using the OS CSPRNG.
    ///
    /// # Example
    ///
    /// ```rust
    /// use gtcx_crypto::signing::ed25519::PrivateKey;
    ///
    /// let key = PrivateKey::generate();
    /// ```
    #[instrument(name = "ed25519.generate_key")]
    pub fn generate() -> Self {
        let mut csprng = OsRng;
        let signing_key = SigningKey::generate(&mut csprng);
        Self(Zeroizing::new(signing_key.to_bytes()))
    }

    /// Create a private key from raw bytes.
    ///
    /// # Arguments
    ///
    /// * `bytes` - Exactly 32 bytes of key material
    ///
    /// # Errors
    ///
    /// Returns [`crate::CryptoError::InvalidKeyLength`] if bytes is not 32 bytes.
    ///
    /// # Example
    ///
    /// ```rust
    /// use gtcx_crypto::signing::ed25519::PrivateKey;
    ///
    /// let bytes = [0u8; 32]; // In practice, use secure random bytes
    /// let key = PrivateKey::from_bytes(&bytes).unwrap();
    /// ```
    pub fn from_bytes(bytes: &[u8]) -> Result<Self> {
        if bytes.len() != 32 {
            return Err(CryptoError::InvalidKeyLength {
                expected: 32,
                actual: bytes.len(),
            });
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(bytes);
        Ok(Self(Zeroizing::new(arr)))
    }

    /// Derive the corresponding public key.
    ///
    /// # Example
    ///
    /// ```rust
    /// use gtcx_crypto::signing::ed25519::PrivateKey;
    ///
    /// let private_key = PrivateKey::generate();
    /// let public_key = private_key.public_key();
    /// ```
    pub fn public_key(&self) -> PublicKey {
        let signing_key = SigningKey::from_bytes(&self.0);
        PublicKey(signing_key.verifying_key().to_bytes())
    }

    /// Get the raw bytes of the private key.
    ///
    /// # Security Warning
    ///
    /// Only use this for serialization to secure storage.
    /// Never log or transmit these bytes in plaintext.
    pub fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }
}

// Don't implement Debug for PrivateKey - prevents accidental logging
impl std::fmt::Debug for PrivateKey {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("PrivateKey([REDACTED])")
    }
}

// =============================================================================
// PUBLIC KEY IMPLEMENTATION
// =============================================================================

impl PublicKey {
    /// Create a public key from raw bytes.
    ///
    /// # Arguments
    ///
    /// * `bytes` - Exactly 32 bytes of key material
    ///
    /// # Errors
    ///
    /// Returns [`crate::CryptoError::InvalidKeyLength`] if bytes is not 32 bytes.
    pub const fn from_bytes(bytes: &[u8]) -> Result<Self> {
        if bytes.len() != 32 {
            return Err(CryptoError::InvalidKeyLength {
                expected: 32,
                actual: bytes.len(),
            });
        }
        let mut arr = [0u8; 32];
        arr.copy_from_slice(bytes);
        Ok(Self(arr))
    }

    /// Get the raw bytes of the public key.
    pub const fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }

    /// Encode the public key as a hex string.
    pub fn to_hex(&self) -> String {
        hex::encode(self.0)
    }
}

// =============================================================================
// SIGNATURE IMPLEMENTATION
// =============================================================================

impl Signature {
    /// Create a signature from raw bytes.
    ///
    /// # Arguments
    ///
    /// * `bytes` - Exactly 64 bytes of signature data
    ///
    /// # Errors
    ///
    /// Returns [`CryptoError::InvalidSignatureLength`] if bytes is not 64 bytes.
    pub const fn from_bytes(bytes: &[u8]) -> Result<Self> {
        if bytes.len() != 64 {
            return Err(CryptoError::InvalidSignatureLength {
                expected: 64,
                actual: bytes.len(),
            });
        }
        let mut arr = [0u8; 64];
        arr.copy_from_slice(bytes);
        Ok(Self(arr))
    }

    /// Get the raw bytes of the signature.
    pub const fn as_bytes(&self) -> &[u8; 64] {
        &self.0
    }

    /// Encode the signature as a hex string.
    pub fn to_hex(&self) -> String {
        hex::encode(self.0)
    }
}

// =============================================================================
// SIGNING OPERATIONS
// =============================================================================

/// Sign a message using Ed25519.
///
/// This is a **pure function**: the same message and key always produce
/// the same signature (Ed25519 is deterministic).
///
/// # Arguments
///
/// * `message` - The message bytes to sign (any length)
/// * `private_key` - The signer's private key
///
/// # Returns
///
/// A 64-byte Ed25519 signature.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::signing::ed25519::{sign, PrivateKey};
///
/// let private_key = PrivateKey::generate();
/// let signature = sign(b"Hello, GTCX!", &private_key);
/// ```
#[instrument(skip(private_key), fields(msg_len = message.len()))]
pub fn sign(message: &[u8], private_key: &PrivateKey) -> Signature {
    let signing_key = SigningKey::from_bytes(&private_key.0);
    let sig = signing_key.sign(message);
    Signature(sig.to_bytes())
}

/// Verify an Ed25519 signature.
///
/// This is a **pure function**: verification is deterministic.
///
/// # Arguments
///
/// * `signature` - The signature to verify
/// * `message` - The original message
/// * `public_key` - The signer's public key
///
/// # Returns
///
/// `true` if the signature is valid, `false` otherwise.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::signing::ed25519::{sign, verify, PrivateKey};
///
/// let private_key = PrivateKey::generate();
/// let public_key = private_key.public_key();
///
/// let signature = sign(b"Hello", &private_key);
/// assert!(verify(&signature, b"Hello", &public_key));
/// assert!(!verify(&signature, b"Tampered", &public_key));
/// ```
#[instrument(skip_all, fields(msg_len = message.len()))]
pub fn verify(signature: &Signature, message: &[u8], public_key: &PublicKey) -> bool {
    let Ok(verifying_key) = VerifyingKey::from_bytes(&public_key.0) else {
        return false;
    };
    let sig = ed25519_dalek::Signature::from_bytes(&signature.0);
    verifying_key.verify(message, &sig).is_ok()
}

/// Batch verify multiple signatures.
///
/// Uses multi-scalar multiplication for ~50x speedup on large batches.
/// This is significantly faster than verifying signatures individually.
///
/// # Arguments
///
/// * `messages` - Array of message byte slices
/// * `signatures` - Array of signatures (same order as messages)
/// * `public_keys` - Array of public keys (same order as messages)
///
/// # Returns
///
/// `Ok(true)` if ALL signatures are valid, `Ok(false)` if ANY is invalid.
///
/// # Errors
///
/// Returns [`CryptoError::LengthMismatch`] if array lengths don't match.
///
/// # Example
///
/// ```rust
/// use gtcx_crypto::signing::ed25519::{sign, batch_verify, PrivateKey};
///
/// let keys: Vec<_> = (0..100).map(|_| PrivateKey::generate()).collect();
/// let messages: Vec<Vec<u8>> = (0..100).map(|i| format!("msg{i}").into_bytes()).collect();
/// let signatures: Vec<_> = keys.iter()
///     .zip(messages.iter())
///     .map(|(k, m)| sign(m, k))
///     .collect();
/// let public_keys: Vec<_> = keys.iter().map(PrivateKey::public_key).collect();
/// let msg_refs: Vec<&[u8]> = messages.iter().map(Vec::as_slice).collect();
///
/// assert!(batch_verify(&msg_refs, &signatures, &public_keys).unwrap());
/// ```
#[instrument(skip_all, fields(count = signatures.len()))]
pub fn batch_verify(
    messages: &[&[u8]],
    signatures: &[Signature],
    public_keys: &[PublicKey],
) -> Result<bool> {
    // Check lengths match
    if messages.len() != signatures.len() || messages.len() != public_keys.len() {
        return Err(CryptoError::length_mismatch(
            messages.len(),
            signatures.len(),
            public_keys.len(),
        ));
    }

    // Convert to dalek types
    let sigs: Vec<_> = signatures
        .iter()
        .map(|s| ed25519_dalek::Signature::from_bytes(&s.0))
        .collect();

    let pks: std::result::Result<Vec<_>, _> = public_keys
        .iter()
        .map(|pk| VerifyingKey::from_bytes(&pk.0))
        .collect();
    let pks = pks.map_err(|_| CryptoError::InvalidPublicKey)?;

    // Batch verify
    Ok(ed25519_dalek::verify_batch(messages, &sigs, &pks).is_ok())
}

// =============================================================================
// SERDE HELPERS
// =============================================================================

mod hex_array {
    use serde::{Deserialize, Deserializer, Serializer};

    pub fn serialize<S, const N: usize>(bytes: &[u8; N], serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&hex::encode(bytes))
    }

    pub fn deserialize<'de, D, const N: usize>(deserializer: D) -> Result<[u8; N], D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        let bytes = hex::decode(&s).map_err(serde::de::Error::custom)?;
        bytes
            .try_into()
            .map_err(|_| serde::de::Error::custom("invalid length"))
    }
}

// =============================================================================
// TESTS
// =============================================================================


#[cfg(test)]
mod tests;
