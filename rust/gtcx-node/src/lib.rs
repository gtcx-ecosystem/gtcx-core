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
// ZERO-KNOWLEDGE PROOFS (Hash-Commitment)
// =============================================================================

/// A ZKP proof result returned to Node.js.
#[napi(object)]
pub struct JsProofResult {
    /// The circuit type tag (e.g., "compliance", "provenance", "quality", "location").
    pub circuit: String,
    /// The public commitment as a hex string (64 hex chars = 32 bytes).
    pub commitment: String,
    /// The proof data as a hex string.
    pub proof_data: String,
}

/// Create a hash-commitment proof for a witness.
///
/// # Arguments
///
/// * `circuit_type` - One of: "compliance", "provenance", "quality", "location"
/// * `witness_data` - The secret witness bytes
/// * `salt` - A 32-byte random salt as hex string (64 hex chars)
///
/// # Returns
///
/// A proof object with circuit, commitment, and proof_data.
#[napi]
pub fn zkp_commit_and_prove(
    circuit_type: String,
    witness_data: Vec<u8>,
    salt_hex: String,
) -> napi::Result<JsProofResult> {
    let circuit = gtcx_zkp::CircuitType::from_name(&circuit_type)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let witness = gtcx_zkp::Witness::new(circuit, witness_data)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let salt_bytes = hex::decode(&salt_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    if salt_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Salt must be 32 bytes, got {}",
            salt_bytes.len()
        )));
    }
    let mut salt = [0u8; 32];
    salt.copy_from_slice(&salt_bytes);

    let proof = gtcx_zkp::generate_proof(&witness, &salt);

    Ok(JsProofResult {
        circuit: circuit_type,
        commitment: hex::encode(proof.commitment),
        proof_data: hex::encode(proof.proof_data()),
    })
}

/// Verify a hash-commitment proof against public inputs.
///
/// # Arguments
///
/// * `circuit_type` - The expected circuit type
/// * `commitment_hex` - The public commitment (64 hex chars)
/// * `proof_data_hex` - The proof data from `zkp_commit_and_prove`
///
/// # Returns
///
/// `true` if the proof is valid.
#[napi]
pub fn zkp_verify(
    circuit_type: String,
    commitment_hex: String,
    proof_data_hex: String,
) -> napi::Result<bool> {
    let circuit = gtcx_zkp::CircuitType::from_name(&circuit_type)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let commitment_bytes =
        hex::decode(&commitment_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    if commitment_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Commitment must be 32 bytes, got {}",
            commitment_bytes.len()
        )));
    }
    let mut commitment = [0u8; 32];
    commitment.copy_from_slice(&commitment_bytes);

    let proof_data =
        hex::decode(&proof_data_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let proof = gtcx_zkp::Proof::from_components(circuit, commitment, proof_data);
    let public_inputs = gtcx_zkp::PublicInputs {
        circuit,
        commitment,
    };

    gtcx_zkp::verify_proof(&proof, &public_inputs)
        .map_err(|e| napi::Error::from_reason(e.to_string()))
}

// =============================================================================
// GROTH16 ZERO-KNOWLEDGE PROOFS
// =============================================================================

/// Serialized Groth16 keys returned to Node.js.
#[napi(object)]
pub struct JsGroth16Keys {
    /// The circuit type ("gci_threshold", "asset_ownership", "location_region").
    pub circuit: String,
    /// The proving key as a hex string.
    pub proving_key: String,
    /// The verifying key as a hex string.
    pub verifying_key: String,
}

/// A Groth16 proof bundle returned to Node.js.
#[napi(object)]
pub struct JsGroth16ProofBundle {
    /// The circuit type.
    pub circuit: String,
    /// The serialized proof as a hex string.
    pub proof: String,
    /// The verifying key as a hex string.
    pub verifying_key: String,
    /// The public inputs as a JSON-encoded array of field element strings.
    pub public_inputs_json: String,
}

fn circuit_type_from_str(s: &str) -> napi::Result<gtcx_zkp::Groth16CircuitType> {
    match s {
        "gci_threshold" => Ok(gtcx_zkp::Groth16CircuitType::GciThreshold),
        "asset_ownership" => Ok(gtcx_zkp::Groth16CircuitType::AssetOwnership),
        "location_region" => Ok(gtcx_zkp::Groth16CircuitType::LocationRegion),
        _ => Err(napi::Error::from_reason(format!(
            "Unknown circuit type: {s}"
        ))),
    }
}

/// Generate Groth16 proving and verifying keys for a circuit type.
///
/// # Arguments
///
/// * `circuit_type` - One of: "gci_threshold", "asset_ownership", "location_region"
///
/// # Returns
///
/// Serialized proving and verifying keys as hex strings.
#[napi]
pub fn groth16_generate_keys(circuit_type: String) -> napi::Result<JsGroth16Keys> {
    let ct = circuit_type_from_str(&circuit_type)?;
    let keys =
        gtcx_zkp::groth16_generate_keys(ct).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(JsGroth16Keys {
        circuit: circuit_type,
        proving_key: hex::encode(&keys.proving_key),
        verifying_key: hex::encode(&keys.verifying_key),
    })
}

/// Prove a GCI threshold statement: score >= threshold.
///
/// # Arguments
///
/// * `score` - The actual GCI score
/// * `threshold` - The minimum acceptable score
/// * `proving_key_hex` - The proving key from `groth16_generate_keys`
/// * `verifying_key_hex` - The verifying key from `groth16_generate_keys`
#[napi]
pub fn groth16_prove_gci_threshold(
    score: i64,
    threshold: i64,
    proving_key_hex: String,
    verifying_key_hex: String,
) -> napi::Result<JsGroth16ProofBundle> {
    let pk_bytes =
        hex::decode(&proving_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let vk_bytes =
        hex::decode(&verifying_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let keys = gtcx_zkp::Groth16Keys {
        circuit: gtcx_zkp::Groth16CircuitType::GciThreshold,
        proving_key: pk_bytes,
        verifying_key: vk_bytes.clone(),
    };

    let bundle = gtcx_zkp::groth16_prove_gci_threshold(score as u64, threshold as u64, &keys)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let mut pi_bytes = Vec::new();
    for f in &bundle.public_inputs {
        let mut buf = Vec::new();
        ark_serialize::CanonicalSerialize::serialize_compressed(f, &mut buf)
            .map_err(|e| napi::Error::from_reason(e.to_string()))?;
        pi_bytes.push(hex::encode(&buf));
    }

    Ok(JsGroth16ProofBundle {
        circuit: "gci_threshold".to_string(),
        proof: hex::encode(&bundle.proof),
        verifying_key: hex::encode(&bundle.verifying_key),
        public_inputs_json: serde_json::to_string(&pi_bytes)
            .map_err(|e| napi::Error::from_reason(e.to_string()))?,
    })
}

/// Verify a Groth16 proof bundle.
///
/// # Arguments
///
/// * `circuit_type` - The circuit type
/// * `proof_hex` - The proof as a hex string
/// * `verifying_key_hex` - The verifying key as a hex string
/// * `public_inputs_json` - JSON array of field element strings
#[napi]
pub fn groth16_verify_proof(
    circuit_type: String,
    proof_hex: String,
    verifying_key_hex: String,
    public_inputs_json: String,
) -> napi::Result<bool> {
    use ark_bn254::Fr;

    let ct = circuit_type_from_str(&circuit_type)?;
    let proof_bytes =
        hex::decode(&proof_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let vk_bytes =
        hex::decode(&verifying_key_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let pi_hex_strings: Vec<String> = serde_json::from_str(&public_inputs_json)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let public_inputs: Vec<Fr> = pi_hex_strings
        .iter()
        .map(|s| {
            let bytes = hex::decode(s).map_err(|e| napi::Error::from_reason(e.to_string()))?;
            ark_serialize::CanonicalDeserialize::deserialize_compressed(&*bytes)
                .map_err(|e| napi::Error::from_reason(format!("Invalid field element: {e}")))
        })
        .collect::<napi::Result<Vec<_>>>()?;

    let bundle = gtcx_zkp::Groth16ProofBundle {
        circuit: ct,
        proof: proof_bytes,
        verifying_key: vk_bytes,
        public_inputs,
    };

    gtcx_zkp::groth16_verify(&bundle).map_err(|e| napi::Error::from_reason(e.to_string()))
}

// =============================================================================
// BULLETPROOFS (AMOUNT RANGE)
// =============================================================================

/// A Bulletproofs range proof bundle returned to Node.js.
#[napi(object)]
pub struct JsBulletproofsBundle {
    /// Minimum value of the range.
    pub min: i64,
    /// Maximum value of the range.
    pub max: i64,
    /// The Pedersen commitment as a hex string (64 hex chars).
    pub commitment: String,
    /// The low range proof as a hex string.
    pub proof_low: String,
    /// The high range proof as a hex string.
    pub proof_high: String,
}

/// Prove that an amount lies within [min, max] using Bulletproofs.
///
/// # Arguments
///
/// * `amount` - The secret value to prove is in range
/// * `min` - Lower bound (inclusive)
/// * `max` - Upper bound (inclusive)
/// * `randomness_hex` - 32-byte randomness as hex string (64 hex chars)
#[napi]
pub fn bulletproofs_prove_amount_range(
    amount: i64,
    min: i64,
    max: i64,
    randomness_hex: String,
) -> napi::Result<JsBulletproofsBundle> {
    let rand_bytes =
        hex::decode(&randomness_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    if rand_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Randomness must be 32 bytes, got {}",
            rand_bytes.len()
        )));
    }
    let mut randomness = [0u8; 32];
    randomness.copy_from_slice(&rand_bytes);

    let bundle = gtcx_zkp::bulletproofs_prove_amount_range(
        amount as u64,
        min as u64,
        max as u64,
        randomness,
    )
    .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    Ok(JsBulletproofsBundle {
        min,
        max,
        commitment: hex::encode(bundle.commitment),
        proof_low: hex::encode(&bundle.proof_low),
        proof_high: hex::encode(&bundle.proof_high),
    })
}

/// Verify a Bulletproofs range proof bundle.
#[napi]
pub fn bulletproofs_verify_amount_range(
    min: i64,
    max: i64,
    commitment_hex: String,
    proof_low_hex: String,
    proof_high_hex: String,
) -> napi::Result<bool> {
    let commitment_bytes =
        hex::decode(&commitment_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    if commitment_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Commitment must be 32 bytes, got {}",
            commitment_bytes.len()
        )));
    }
    let mut commitment = [0u8; 32];
    commitment.copy_from_slice(&commitment_bytes);

    let proof_low =
        hex::decode(&proof_low_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    let proof_high =
        hex::decode(&proof_high_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;

    let bundle = gtcx_zkp::BulletproofsRangeProofBundle {
        min: min as u64,
        max: max as u64,
        commitment,
        proof_low,
        proof_high,
    };

    gtcx_zkp::bulletproofs_verify_amount_range(&bundle)
        .map_err(|e| napi::Error::from_reason(e.to_string()))
}

// =============================================================================
// SCHNORR (IDENTITY ATTRIBUTE)
// =============================================================================

/// A Schnorr identity proof bundle returned to Node.js.
#[napi(object)]
pub struct JsSchnorrBundle {
    /// The public attribute hash (commitment) as a hex string.
    pub attribute_hash: String,
    /// The subject hash as a hex string.
    pub subject_hash: String,
    /// The nonce commitment as a hex string.
    pub nonce_commitment: String,
    /// The response scalar as a hex string.
    pub response: String,
}

/// Prove knowledge of an identity attribute corresponding to a public hash.
///
/// # Arguments
///
/// * `attribute` - The secret attribute value (e.g., "John Doe")
/// * `subject_hash_hex` - 32-byte subject identifier hash as hex string
#[napi]
pub fn schnorr_prove_identity_attribute(
    attribute: Vec<u8>,
    subject_hash_hex: String,
) -> napi::Result<JsSchnorrBundle> {
    let sh_bytes =
        hex::decode(&subject_hash_hex).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    if sh_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Subject hash must be 32 bytes, got {}",
            sh_bytes.len()
        )));
    }
    let mut subject_hash = [0u8; 32];
    subject_hash.copy_from_slice(&sh_bytes);

    let bundle = gtcx_zkp::schnorr_prove_identity_attribute(&attribute, subject_hash)
        .map_err(|e| napi::Error::from_reason(e.to_string()))?;

    Ok(JsSchnorrBundle {
        attribute_hash: hex::encode(bundle.attribute_hash),
        subject_hash: hex::encode(bundle.subject_hash),
        nonce_commitment: hex::encode(bundle.nonce_commitment),
        response: hex::encode(bundle.response),
    })
}

/// Verify a Schnorr identity attribute proof.
#[napi]
pub fn schnorr_verify_identity_attribute(
    attribute_hash_hex: String,
    subject_hash_hex: String,
    nonce_commitment_hex: String,
    response_hex: String,
) -> napi::Result<bool> {
    let attribute_hash = decode_32_bytes(&attribute_hash_hex, "attribute_hash")?;
    let subject_hash = decode_32_bytes(&subject_hash_hex, "subject_hash")?;
    let nonce_commitment = decode_32_bytes(&nonce_commitment_hex, "nonce_commitment")?;
    let response = decode_32_bytes(&response_hex, "response")?;

    let bundle = gtcx_zkp::SchnorrIdentityProofBundle {
        attribute_hash,
        subject_hash,
        nonce_commitment,
        response,
    };

    gtcx_zkp::schnorr_verify_identity_attribute(&bundle)
        .map_err(|e| napi::Error::from_reason(e.to_string()))
}

fn decode_32_bytes(hex_str: &str, name: &str) -> napi::Result<[u8; 32]> {
    let bytes = hex::decode(hex_str).map_err(|e| napi::Error::from_reason(e.to_string()))?;
    if bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "{} must be 32 bytes, got {}",
            name,
            bytes.len()
        )));
    }
    let mut arr = [0u8; 32];
    arr.copy_from_slice(&bytes);
    Ok(arr)
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
    use proptest::prelude::*;

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

    // ── ZKP ──

    #[test]
    fn test_zkp_commit_prove_verify_roundtrip() {
        let salt = "ab".repeat(32); // 32 bytes = 64 hex chars
        let result =
            zkp_commit_and_prove("compliance".to_string(), b"secret-witness".to_vec(), salt)
                .unwrap();

        assert_eq!(result.circuit, "compliance");
        assert_eq!(result.commitment.len(), 64); // 32 bytes hex
        assert_eq!(result.proof_data.len(), 128); // 64 bytes hex

        let valid = zkp_verify(
            "compliance".to_string(),
            result.commitment,
            result.proof_data,
        )
        .unwrap();
        assert!(valid);
    }

    #[test]
    fn test_zkp_verify_tampered_proof_data_fails() {
        let salt = "cd".repeat(32);
        let result =
            zkp_commit_and_prove("provenance".to_string(), b"witness".to_vec(), salt).unwrap();

        // Tamper with proof data (replace with zeros — will fail trivial proof check)
        let tampered_proof = "00".repeat(64); // 64 bytes of zeros
        let err = zkp_verify("provenance".to_string(), result.commitment, tampered_proof);
        assert!(err.is_err());
    }

    #[test]
    fn test_zkp_different_witnesses_produce_different_proofs() {
        let salt = "ef".repeat(32);
        let result1 =
            zkp_commit_and_prove("quality".to_string(), b"witness-a".to_vec(), salt.clone())
                .unwrap();
        let result2 =
            zkp_commit_and_prove("quality".to_string(), b"witness-b".to_vec(), salt).unwrap();

        assert_ne!(result1.commitment, result2.commitment);
        assert_ne!(result1.proof_data, result2.proof_data);
    }

    #[test]
    fn test_zkp_invalid_salt_length() {
        let err = zkp_commit_and_prove(
            "compliance".to_string(),
            b"witness".to_vec(),
            "aabb".to_string(),
        );
        assert!(err.is_err());
    }

    proptest! {
        #[test]
        fn prop_sign_rejects_malformed_private_key(
            key in ".*",
            message in proptest::collection::vec(any::<u8>(), 0..256)
        ) {
            if hex::decode(&key).ok().filter(|bytes| bytes.len() == 32).is_some() {
                return Ok(());
            }

            let result = sign(message, key);
            prop_assert!(result.is_err());
        }

        #[test]
        fn prop_verify_rejects_malformed_signature_or_key(
            signature in ".*",
            public_key in ".*",
            message in proptest::collection::vec(any::<u8>(), 0..256)
        ) {
            let signature_is_valid = hex::decode(&signature)
                .ok()
                .filter(|bytes| bytes.len() == 64)
                .is_some();
            let key_is_valid = hex::decode(&public_key)
                .ok()
                .filter(|bytes| bytes.len() == 32)
                .is_some();

            if signature_is_valid && key_is_valid {
                return Ok(());
            }

            let result = verify(signature, message, public_key);
            prop_assert!(result.is_err());
        }

        #[test]
        fn prop_zkp_verify_rejects_malformed_commitment_or_proof(
            commitment in ".*",
            proof_data in ".*"
        ) {
            let commitment_is_valid = hex::decode(&commitment)
                .ok()
                .filter(|bytes| bytes.len() == 32)
                .is_some();
            let proof_is_valid = hex::decode(&proof_data)
                .ok()
                .filter(|bytes| !bytes.is_empty())
                .is_some();

            if commitment_is_valid && proof_is_valid {
                return Ok(());
            }

            let result = zkp_verify("compliance".to_string(), commitment, proof_data);
            prop_assert!(result.is_err());
        }
    }

    // ── Groth16 ──

    #[test]
    fn test_groth16_gci_threshold_roundtrip() {
        let keys = groth16_generate_keys("gci_threshold".to_string()).unwrap();
        assert!(!keys.proving_key.is_empty());
        assert!(!keys.verifying_key.is_empty());

        let bundle =
            groth16_prove_gci_threshold(85, 70, keys.proving_key, keys.verifying_key.clone())
                .unwrap();
        assert_eq!(bundle.circuit, "gci_threshold");

        let valid = groth16_verify_proof(
            bundle.circuit,
            bundle.proof,
            bundle.verifying_key,
            bundle.public_inputs_json,
        )
        .unwrap();
        assert!(valid);
    }

    #[test]
    fn test_groth16_score_below_threshold_fails() {
        let keys = groth16_generate_keys("gci_threshold".to_string()).unwrap();
        let err = groth16_prove_gci_threshold(50, 70, keys.proving_key, keys.verifying_key);
        assert!(err.is_err());
    }

    // ── Bulletproofs ──

    #[test]
    fn test_bulletproofs_amount_range_roundtrip() {
        let randomness = "ab".repeat(32); // 32 bytes
        let bundle = bulletproofs_prove_amount_range(500, 100, 1000, randomness).unwrap();
        assert_eq!(bundle.min, 100);
        assert_eq!(bundle.max, 1000);

        let valid = bulletproofs_verify_amount_range(
            bundle.min,
            bundle.max,
            bundle.commitment,
            bundle.proof_low,
            bundle.proof_high,
        )
        .unwrap();
        assert!(valid);
    }

    #[test]
    fn test_bulletproofs_out_of_range_fails() {
        let randomness = "cd".repeat(32);
        let err = bulletproofs_prove_amount_range(50, 100, 1000, randomness);
        assert!(err.is_err());
    }

    // ── Schnorr ──

    #[test]
    fn test_schnorr_identity_roundtrip() {
        let subject_hash = "ef".repeat(32); // 32 bytes
        let bundle = schnorr_prove_identity_attribute(b"John Doe".to_vec(), subject_hash).unwrap();

        let valid = schnorr_verify_identity_attribute(
            bundle.attribute_hash,
            bundle.subject_hash,
            bundle.nonce_commitment,
            bundle.response,
        )
        .unwrap();
        assert!(valid);
    }

    #[test]
    fn test_schnorr_tampered_response_fails() {
        let subject_hash = "ab".repeat(32);
        let bundle = schnorr_prove_identity_attribute(b"Jane Doe".to_vec(), subject_hash).unwrap();

        // Tamper with response
        let tampered_response = "00".repeat(32);
        let result = schnorr_verify_identity_attribute(
            bundle.attribute_hash,
            bundle.subject_hash,
            bundle.nonce_commitment,
            tampered_response,
        );
        // Either returns false or errors — both acceptable
        if let Ok(valid) = result {
            assert!(!valid);
        }
    }

    // ── Version ──

    #[test]
    fn test_version() {
        let v = version();
        assert!(!v.is_empty());
        assert!(v.contains('.'));
    }
}
