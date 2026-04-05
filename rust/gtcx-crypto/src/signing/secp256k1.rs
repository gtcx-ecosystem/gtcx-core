//! secp256k1 digital signatures.
//!
//! This module provides secp256k1 signing and verification using the
//! `k256` crate with deterministic RFC6979 signatures (SHA-256).
//!
//! ## Security Properties
//!
//! - 128-bit security level (ECDSA over secp256k1)
//! - Deterministic signatures (RFC6979)
//! - Interop with Bitcoin/Ethereum ecosystems
//! - Private keys automatically zeroized on drop
//!
//! ## Example
//!
//! ```rust
//! use gtcx_crypto::signing::secp256k1::{sign, verify, PrivateKey};
//!
//! let private_key = PrivateKey::generate();
//! let public_key = private_key.public_key();
//!
//! let message = b"Hello, GTCX!";
//! let signature = sign(message, &private_key);
//!
//! assert!(verify(&signature, message, &public_key));
//! ```

use k256::ecdsa::signature::{Signer, Verifier};
use k256::ecdsa::{Signature as K256Signature, SigningKey, VerifyingKey};
use k256::{EncodedPoint, FieldBytes};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use tracing::instrument;
use zeroize::{Zeroize, ZeroizeOnDrop, Zeroizing};

use crate::error::CryptoError;
use crate::Result;

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/// secp256k1 private key (32 bytes).
///
/// Private keys are automatically zeroed from memory when dropped.
#[derive(Clone, Zeroize, ZeroizeOnDrop)]
pub struct PrivateKey(Zeroizing<[u8; 32]>);

/// secp256k1 public key (33 bytes, compressed).
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct PublicKey(#[serde(with = "hex_array")] [u8; 33]);

/// secp256k1 signature (64 bytes, r||s).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Signature(#[serde(with = "hex_array")] [u8; 64]);

// =============================================================================
// PRIVATE KEY IMPLEMENTATION
// =============================================================================

impl PrivateKey {
    /// Generate a new random private key using the OS CSPRNG.
    #[instrument(name = "secp256k1.generate_key")]
    pub fn generate() -> Self {
        let mut csprng = OsRng;
        let signing_key = SigningKey::random(&mut csprng);
        let bytes = signing_key.to_bytes();
        let mut key_bytes = [0u8; 32];
        key_bytes.copy_from_slice(bytes.as_ref());
        Self(Zeroizing::new(key_bytes))
    }

    /// Create a private key from raw bytes.
    ///
    /// # Errors
    ///
    /// Returns `CryptoError::InvalidKeyLength` if `bytes` is not exactly 32 bytes.
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

    /// Derive the corresponding public key (compressed).
    ///
    /// # Panics
    ///
    /// Panics if the private key bytes do not form a valid secp256k1 scalar.
    pub fn public_key(&self) -> PublicKey {
        let signing_key = signing_key_from_bytes(self.as_bytes())
            .expect("valid private key should produce signing key");
        PublicKey::from_verifying_key(signing_key.verifying_key())
    }

    /// Get the raw bytes of the private key.
    pub fn as_bytes(&self) -> &[u8; 32] {
        &self.0
    }
}

impl std::fmt::Debug for PrivateKey {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("PrivateKey([REDACTED])")
    }
}

// =============================================================================
// PUBLIC KEY IMPLEMENTATION
// =============================================================================

impl PublicKey {
    /// Create a public key from raw bytes (33-byte compressed or 65-byte uncompressed).
    ///
    /// # Errors
    ///
    /// Returns `CryptoError::InvalidPublicKey` if bytes are not a valid encoded point.
    pub fn from_bytes(bytes: &[u8]) -> Result<Self> {
        let point = EncodedPoint::from_bytes(bytes).map_err(|_| CryptoError::InvalidPublicKey)?;
        let verifying_key =
            VerifyingKey::from_encoded_point(&point).map_err(|_| CryptoError::InvalidPublicKey)?;
        Ok(Self::from_verifying_key(&verifying_key))
    }

    /// Get the raw compressed public key bytes.
    pub const fn as_bytes(&self) -> &[u8; 33] {
        &self.0
    }

    /// Encode the public key as hex.
    pub fn to_hex(&self) -> String {
        hex::encode(self.0)
    }

    fn from_verifying_key(verifying_key: &VerifyingKey) -> Self {
        let point = verifying_key.to_encoded_point(true);
        let bytes = point.as_bytes();
        let mut arr = [0u8; 33];
        arr.copy_from_slice(bytes);
        Self(arr)
    }

    fn verifying_key(&self) -> Result<VerifyingKey> {
        let point = EncodedPoint::from_bytes(self.0).map_err(|_| CryptoError::InvalidPublicKey)?;
        VerifyingKey::from_encoded_point(&point).map_err(|_| CryptoError::InvalidPublicKey)
    }
}

// =============================================================================
// SIGNATURE IMPLEMENTATION
// =============================================================================

impl Signature {
    /// Create a signature from raw bytes.
    ///
    /// # Errors
    ///
    /// Returns `CryptoError::InvalidSignatureLength` if `bytes` is not exactly 64 bytes.
    pub fn from_bytes(bytes: &[u8]) -> Result<Self> {
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

    /// Get the raw signature bytes (r||s).
    pub const fn as_bytes(&self) -> &[u8; 64] {
        &self.0
    }

    /// Encode the signature as DER for interop.
    ///
    /// # Errors
    ///
    /// Returns `CryptoError::InvalidSignature` if the raw bytes are not a valid ECDSA signature.
    pub fn to_der(&self) -> Result<Vec<u8>> {
        let sig = K256Signature::from_slice(&self.0).map_err(|_| CryptoError::InvalidSignature)?;
        Ok(sig.to_der().as_bytes().to_vec())
    }

    /// Decode a DER signature to raw bytes.
    ///
    /// # Errors
    ///
    /// Returns `CryptoError::InvalidSignature` if `bytes` is not valid DER-encoded ECDSA.
    pub fn from_der(bytes: &[u8]) -> Result<Self> {
        let sig = K256Signature::from_der(bytes).map_err(|_| CryptoError::InvalidSignature)?;
        Ok(Self(signature_bytes(&sig)))
    }
}

// =============================================================================
// SIGNING OPERATIONS
// =============================================================================

/// Sign a message using secp256k1 (ECDSA + SHA-256).
///
/// # Panics
///
/// Panics if `private_key` contains bytes that are not a valid secp256k1 scalar.
#[instrument(name = "secp256k1.sign", skip(message, private_key))]
pub fn sign(message: &[u8], private_key: &PrivateKey) -> Signature {
    let signing_key = signing_key_from_bytes(private_key.as_bytes())
        .expect("valid private key should produce signing key");
    let sig: K256Signature = signing_key.sign(message);
    Signature(signature_bytes(&sig))
}

/// Verify a secp256k1 signature (ECDSA + SHA-256).
#[instrument(name = "secp256k1.verify", skip(signature, message, public_key))]
pub fn verify(signature: &Signature, message: &[u8], public_key: &PublicKey) -> bool {
    let Ok(verifying_key) = public_key.verifying_key() else {
        return false;
    };
    let Ok(sig) = K256Signature::from_slice(signature.as_bytes()) else {
        return false;
    };
    verifying_key.verify(message, &sig).is_ok()
}

fn signing_key_from_bytes(bytes: &[u8; 32]) -> Result<SigningKey> {
    let field_bytes = FieldBytes::from(*bytes);
    SigningKey::from_bytes(&field_bytes).map_err(|_| CryptoError::InvalidPrivateKey)
}

fn signature_bytes(sig: &K256Signature) -> [u8; 64] {
    let raw = sig.to_bytes();
    let mut out = [0u8; 64];
    out.copy_from_slice(raw.as_ref());
    out
}

// =============================================================================
// HEX SERIALIZATION HELPERS
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
mod tests {
    use super::*;
    use sha2::{Digest, Sha256};

    #[test]
    fn test_sign_verify_roundtrip() {
        let private_key = PrivateKey::generate();
        let public_key = private_key.public_key();
        let message = b"Test message";

        let signature = sign(message, &private_key);
        assert!(verify(&signature, message, &public_key));
    }

    #[test]
    fn test_verify_wrong_message() {
        let private_key = PrivateKey::generate();
        let public_key = private_key.public_key();

        let signature = sign(b"Original", &private_key);
        assert!(!verify(&signature, b"Tampered", &public_key));
    }

    #[test]
    fn test_verify_wrong_key() {
        let private_key1 = PrivateKey::generate();
        let private_key2 = PrivateKey::generate();
        let public_key2 = private_key2.public_key();

        let signature = sign(b"Message", &private_key1);
        assert!(!verify(&signature, b"Message", &public_key2));
    }

    #[test]
    fn test_deterministic_signatures() {
        let private_key = PrivateKey::generate();
        let message = b"Same message";

        let sig1 = sign(message, &private_key);
        let sig2 = sign(message, &private_key);

        assert_eq!(sig1, sig2, "secp256k1 signatures should be deterministic");
    }

    #[test]
    fn test_signature_der_roundtrip() {
        let private_key = PrivateKey::generate();
        let message = b"DER message";

        let signature = sign(message, &private_key);
        let der = signature.to_der().unwrap();
        let parsed = Signature::from_der(&der).unwrap();

        assert_eq!(signature, parsed);
    }

    #[test]
    fn test_public_key_from_uncompressed() {
        let private_key = PrivateKey::generate();
        let signing_key = signing_key_from_bytes(private_key.as_bytes()).unwrap();
        let verifying_key = signing_key.verifying_key();
        let uncompressed = verifying_key.to_encoded_point(false);

        let public_key = PublicKey::from_bytes(uncompressed.as_bytes()).unwrap();
        assert_eq!(public_key.as_bytes().len(), 33);
    }

    #[test]
    fn test_interop_with_secp256k1_crate() {
        let mut key_bytes = [0u8; 32];
        key_bytes[31] = 1;

        let private_key = PrivateKey::from_bytes(&key_bytes).unwrap();
        let public_key = private_key.public_key();
        let message = b"interop";

        let signature = sign(message, &private_key);
        assert!(verify(&signature, message, &public_key));

        let msg_hash = Sha256::digest(message);
        let secp = secp256k1::Secp256k1::new();
        let secret = secp256k1::SecretKey::from_slice(&key_bytes).unwrap();
        let pubkey = secp256k1::PublicKey::from_secret_key(&secp, &secret);
        let msg = secp256k1::Message::from_digest_slice(&msg_hash).unwrap();
        let sig = secp256k1::ecdsa::Signature::from_compact(signature.as_bytes()).unwrap();

        assert!(secp.verify_ecdsa(&msg, &sig, &pubkey).is_ok());
    }
}
