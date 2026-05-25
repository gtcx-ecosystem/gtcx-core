//! Zero-knowledge proof bindings (hash-commitment scheme).

use napi_derive::napi;

use crate::utils::map_hex_err;

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
    let circuit = gtcx_zkp::CircuitType::from_name(&circuit_type).map_err(map_hex_err)?;

    let witness = gtcx_zkp::Witness::new(circuit, witness_data).map_err(map_hex_err)?;

    let salt_bytes = hex::decode(&salt_hex).map_err(map_hex_err)?;
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
    let circuit = gtcx_zkp::CircuitType::from_name(&circuit_type).map_err(map_hex_err)?;

    let commitment_bytes = hex::decode(&commitment_hex).map_err(map_hex_err)?;
    if commitment_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Commitment must be 32 bytes, got {}",
            commitment_bytes.len()
        )));
    }
    let mut commitment = [0u8; 32];
    commitment.copy_from_slice(&commitment_bytes);

    let proof_data = hex::decode(&proof_data_hex).map_err(map_hex_err)?;

    let proof = gtcx_zkp::Proof::from_components(circuit, commitment, proof_data);
    let public_inputs = gtcx_zkp::PublicInputs {
        circuit,
        commitment,
    };

    gtcx_zkp::verify_proof(&proof, &public_inputs).map_err(map_hex_err)
}
