//! Groth16 zero-knowledge proof bindings.

use napi_derive::napi;

use crate::utils::{circuit_type_from_str, map_hex_err};

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
    let keys = gtcx_zkp::groth16_generate_keys(ct).map_err(map_hex_err)?;
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
    let pk_bytes = hex::decode(&proving_key_hex).map_err(map_hex_err)?;
    let vk_bytes = hex::decode(&verifying_key_hex).map_err(map_hex_err)?;
    let keys = gtcx_zkp::Groth16Keys {
        circuit: gtcx_zkp::Groth16CircuitType::GciThreshold,
        proving_key: pk_bytes,
        verifying_key: vk_bytes.clone(),
    };

    let bundle = gtcx_zkp::groth16_prove_gci_threshold(score as u64, threshold as u64, &keys)
        .map_err(map_hex_err)?;

    let mut pi_bytes = Vec::new();
    for f in &bundle.public_inputs {
        let mut buf = Vec::new();
        ark_serialize::CanonicalSerialize::serialize_compressed(f, &mut buf)
            .map_err(map_hex_err)?;
        pi_bytes.push(hex::encode(&buf));
    }

    Ok(JsGroth16ProofBundle {
        circuit: "gci_threshold".to_string(),
        proof: hex::encode(&bundle.proof),
        verifying_key: hex::encode(&bundle.verifying_key),
        public_inputs_json: serde_json::to_string(&pi_bytes).map_err(map_hex_err)?,
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
    let proof_bytes = hex::decode(&proof_hex).map_err(map_hex_err)?;
    let vk_bytes = hex::decode(&verifying_key_hex).map_err(map_hex_err)?;
    let pi_hex_strings: Vec<String> =
        serde_json::from_str(&public_inputs_json).map_err(map_hex_err)?;

    let public_inputs: Vec<Fr> = pi_hex_strings
        .iter()
        .map(|s| {
            let bytes = hex::decode(s).map_err(map_hex_err)?;
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

    gtcx_zkp::groth16_verify(&bundle).map_err(map_hex_err)
}
