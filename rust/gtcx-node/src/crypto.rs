//! Cryptographic primitives: key generation, signing, hashing, and key derivation.

use napi_derive::napi;

use crate::utils::map_hex_err;

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
    let key_bytes = hex::decode(&private_key_hex).map_err(map_hex_err)?;
    let private_key =
        gtcx_crypto::signing::ed25519::PrivateKey::from_bytes(&key_bytes).map_err(map_hex_err)?;

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
    let sig_bytes = hex::decode(&signature_hex).map_err(map_hex_err)?;
    let pk_bytes = hex::decode(&public_key_hex).map_err(map_hex_err)?;

    let signature =
        gtcx_crypto::signing::ed25519::Signature::from_bytes(&sig_bytes).map_err(map_hex_err)?;
    let public_key =
        gtcx_crypto::signing::ed25519::PublicKey::from_bytes(&pk_bytes).map_err(map_hex_err)?;

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
    hex::encode(gtcx_crypto::blake3(&data).expect("BLAKE3 not available in FIPS strict mode"))
}

// =============================================================================
// KEY DERIVATION
// =============================================================================

/// Derive a child key from a parent key using an index.
///
/// Returns the derived private key as a hex string.
#[napi]
pub fn derive_child_key(parent_key_hex: String, index: u32) -> napi::Result<String> {
    let key_bytes = hex::decode(&parent_key_hex).map_err(map_hex_err)?;
    let parent =
        gtcx_crypto::signing::ed25519::PrivateKey::from_bytes(&key_bytes).map_err(map_hex_err)?;

    let child = gtcx_crypto::keys::derive_child_key(&parent, index).map_err(map_hex_err)?;
    Ok(hex::encode(child.as_bytes()))
}

/// Derive a key for a specific purpose.
///
/// Returns the derived private key as a hex string.
#[napi]
pub fn derive_purpose_key(master_key_hex: String, purpose: String) -> napi::Result<String> {
    let key_bytes = hex::decode(&master_key_hex).map_err(map_hex_err)?;
    let master =
        gtcx_crypto::signing::ed25519::PrivateKey::from_bytes(&key_bytes).map_err(map_hex_err)?;

    let derived = gtcx_crypto::keys::derive_purpose_key(&master, &purpose).map_err(map_hex_err)?;
    Ok(hex::encode(derived.as_bytes()))
}
