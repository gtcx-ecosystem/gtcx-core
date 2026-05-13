//! Schnorr identity attribute proof bindings.

use napi_derive::napi;

use crate::utils::{decode_32_bytes, map_hex_err};

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
    let sh_bytes = hex::decode(&subject_hash_hex).map_err(map_hex_err)?;
    if sh_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Subject hash must be 32 bytes, got {}",
            sh_bytes.len()
        )));
    }
    let mut subject_hash = [0u8; 32];
    subject_hash.copy_from_slice(&sh_bytes);

    let bundle = gtcx_zkp::schnorr_prove_identity_attribute(&attribute, subject_hash)
        .map_err(map_hex_err)?;

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

    gtcx_zkp::schnorr_verify_identity_attribute(&bundle).map_err(map_hex_err)
}
