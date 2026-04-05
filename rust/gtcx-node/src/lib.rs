//! # GTCX Node.js Bindings
//!
//! NAPI-RS bindings exposing GTCX Rust crates to Node.js/TypeScript.
//!
//! ## Overview
//!
//! This crate provides high-performance native bindings for:
//! - Ed25519 signing and verification
//! - SHA-256, SHA-512, and Blake3 hashing
//! - Key generation and derivation
//! - Hash-chain audit log creation and verification
//!
//! ## Usage (TypeScript)
//!
//! ```typescript
//! import { sign, verify, generateKeyPair } from '@gtcx/crypto-native';
//!
//! const { privateKey, publicKey } = generateKeyPair();
//! const signature = sign(message, privateKey);
//! const isValid = verify(signature, message, publicKey);
//! ```

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

use napi_derive::napi;

// =============================================================================
// KEY GENERATION
// =============================================================================

/// A key pair returned to Node.js.
#[napi(object)]
pub struct JsKeyPair {
    /// The private key as a hex string.
    pub private_key: String,
    /// The public key as a hex string.
    pub public_key: String,
}

/// Generate a new Ed25519 key pair.
///
/// Returns an object with `privateKey` and `publicKey` as hex strings.
#[napi]
pub fn generate_key_pair() -> JsKeyPair {
    let (private_key, public_key) = gtcx_crypto::generate_keypair();
    JsKeyPair {
        private_key: hex::encode(private_key.as_bytes()),
        public_key: public_key.to_hex(),
    }
}

// =============================================================================
// SIGNING
// =============================================================================

/// Sign a message using Ed25519.
///
/// # Arguments
///
/// * `message` - The message bytes to sign
/// * `private_key_hex` - The private key as a hex string (64 hex chars = 32 bytes)
///
/// # Returns
///
/// The signature as a hex string (128 hex chars = 64 bytes).
#[napi]
pub fn sign(message: Vec<u8>, private_key_hex: String) -> napi::Result<String> {
    let key_bytes =
        hex::decode(&private_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let private_key = gtcx_crypto::signing::ed25519::PrivateKey::from_bytes(&key_bytes)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let signature = gtcx_crypto::sign(&message, &private_key);
    Ok(signature.to_hex())
}

/// Verify an Ed25519 signature.
///
/// # Arguments
///
/// * `signature_hex` - The signature as a hex string
/// * `message` - The original message bytes
/// * `public_key_hex` - The public key as a hex string
///
/// # Returns
///
/// `true` if the signature is valid.
#[napi]
pub fn verify(
    signature_hex: String,
    message: Vec<u8>,
    public_key_hex: String,
) -> napi::Result<bool> {
    let sig_bytes =
        hex::decode(&signature_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let pk_bytes =
        hex::decode(&public_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let signature = gtcx_crypto::signing::ed25519::Signature::from_bytes(&sig_bytes)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let public_key = gtcx_crypto::signing::ed25519::PublicKey::from_bytes(&pk_bytes)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    Ok(gtcx_crypto::verify(&signature, &message, &public_key))
}

// =============================================================================
// HASHING
// =============================================================================

/// Compute SHA-256 hash of input data.
///
/// Returns the hash as a hex string (64 hex chars = 32 bytes).
#[napi]
pub fn sha256(data: Vec<u8>) -> String {
    hex::encode(gtcx_crypto::sha256(&data))
}

/// Compute SHA-512 hash of input data.
///
/// Returns the hash as a hex string (128 hex chars = 64 bytes).
#[napi]
pub fn sha512(data: Vec<u8>) -> String {
    hex::encode(gtcx_crypto::hashing::sha512(&data))
}

/// Compute Blake3 hash of input data.
///
/// Returns the hash as a hex string (64 hex chars = 32 bytes).
#[napi]
pub fn blake3_hash(data: Vec<u8>) -> String {
    hex::encode(gtcx_crypto::blake3(&data))
}

// =============================================================================
// KEY DERIVATION
// =============================================================================

/// Derive a child key from a parent key using an index.
///
/// Returns the derived private key as a hex string.
#[napi]
pub fn derive_child_key(parent_key_hex: String, index: u32) -> napi::Result<String> {
    let key_bytes =
        hex::decode(&parent_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let parent = gtcx_crypto::signing::ed25519::PrivateKey::from_bytes(&key_bytes)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let child = gtcx_crypto::keys::derive_child_key(&parent, index)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(hex::encode(child.as_bytes()))
}

/// Derive a key for a specific purpose.
///
/// Returns the derived private key as a hex string.
#[napi]
pub fn derive_purpose_key(master_key_hex: String, purpose: String) -> napi::Result<String> {
    let key_bytes =
        hex::decode(&master_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let master = gtcx_crypto::signing::ed25519::PrivateKey::from_bytes(&key_bytes)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let derived = gtcx_crypto::keys::derive_purpose_key(&master, &purpose)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(hex::encode(derived.as_bytes()))
}

// =============================================================================
// UTILITY
// =============================================================================

/// Get the version of the GTCX native bindings.
#[napi]
pub fn version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // ── Key generation ──

    #[test]
    fn test_generate_key_pair() {
        let kp = generate_key_pair();
        assert_eq!(kp.private_key.len(), 64); // 32 bytes hex
        assert_eq!(kp.public_key.len(), 64); // 32 bytes hex
    }

    #[test]
    fn test_generate_unique_keys() {
        let kp1 = generate_key_pair();
        let kp2 = generate_key_pair();
        assert_ne!(kp1.private_key, kp2.private_key);
        assert_ne!(kp1.public_key, kp2.public_key);
    }

    // ── Signing ──

    #[test]
    fn test_sign_and_verify() {
        let kp = generate_key_pair();
        let message = b"Hello, GTCX!".to_vec();

        let sig_hex = sign(message.clone(), kp.private_key).unwrap();
        assert_eq!(sig_hex.len(), 128); // 64 bytes hex

        let valid = verify(sig_hex, message, kp.public_key).unwrap();
        assert!(valid);
    }

    #[test]
    fn test_verify_wrong_message() {
        let kp = generate_key_pair();
        let sig_hex = sign(b"original".to_vec(), kp.private_key).unwrap();
        let valid = verify(sig_hex, b"tampered".to_vec(), kp.public_key).unwrap();
        assert!(!valid);
    }

    #[test]
    fn test_verify_wrong_key() {
        let kp1 = generate_key_pair();
        let kp2 = generate_key_pair();
        let sig_hex = sign(b"message".to_vec(), kp1.private_key).unwrap();
        let valid = verify(sig_hex, b"message".to_vec(), kp2.public_key).unwrap();
        assert!(!valid);
    }

    #[test]
    fn test_sign_invalid_key_hex() {
        let err = sign(b"test".to_vec(), "not-hex".to_string()).unwrap_err();
        assert!(err.reason.contains("Odd"));
    }

    #[test]
    fn test_sign_wrong_key_length() {
        let err = sign(b"test".to_vec(), "aabb".to_string()).unwrap_err();
        assert!(err.reason.contains("Invalid key length"));
    }

    // ── Hashing ──

    #[test]
    fn test_sha256_known_vector() {
        let hash = sha256(b"abc".to_vec());
        assert_eq!(
            hash,
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
    }

    #[test]
    fn test_sha512_output_length() {
        let hash = sha512(b"test".to_vec());
        assert_eq!(hash.len(), 128); // 64 bytes hex
    }

    #[test]
    fn test_blake3_deterministic() {
        let h1 = blake3_hash(b"data".to_vec());
        let h2 = blake3_hash(b"data".to_vec());
        assert_eq!(h1, h2);
    }

    #[test]
    fn test_blake3_different_inputs() {
        let h1 = blake3_hash(b"input1".to_vec());
        let h2 = blake3_hash(b"input2".to_vec());
        assert_ne!(h1, h2);
    }

    // ── Key derivation ──

    #[test]
    fn test_derive_child_key_deterministic() {
        let kp = generate_key_pair();
        let child1 = derive_child_key(kp.private_key.clone(), 0).unwrap();
        let child2 = derive_child_key(kp.private_key, 0).unwrap();
        assert_eq!(child1, child2);
    }

    #[test]
    fn test_derive_child_key_different_indices() {
        let kp = generate_key_pair();
        let child0 = derive_child_key(kp.private_key.clone(), 0).unwrap();
        let child1 = derive_child_key(kp.private_key, 1).unwrap();
        assert_ne!(child0, child1);
    }

    #[test]
    fn test_derive_purpose_key_deterministic() {
        let kp = generate_key_pair();
        let key1 = derive_purpose_key(kp.private_key.clone(), "signing".to_string()).unwrap();
        let key2 = derive_purpose_key(kp.private_key, "signing".to_string()).unwrap();
        assert_eq!(key1, key2);
    }

    #[test]
    fn test_derive_purpose_key_different_purposes() {
        let kp = generate_key_pair();
        let k1 = derive_purpose_key(kp.private_key.clone(), "signing".to_string()).unwrap();
        let k2 = derive_purpose_key(kp.private_key, "encryption".to_string()).unwrap();
        assert_ne!(k1, k2);
    }

    // ── Version ──

    #[test]
    fn test_version() {
        let v = version();
        assert!(!v.is_empty());
        assert!(v.contains('.'));
    }
}
