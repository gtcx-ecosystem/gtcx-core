//! Groth16 zero-knowledge proof bindings.

use napi_derive::napi;

use crate::utils::{circuit_type_from_str, decode_32_bytes, map_hex_err};

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
    /// Registry profile ID when prove used a policy pack (e.g. `gh-gold-origin`).
    pub profile_id: Option<String>,
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
        profile_id: None,
        proof: hex::encode(&bundle.proof),
        verifying_key: hex::encode(&bundle.verifying_key),
        public_inputs_json: serde_json::to_string(&pi_bytes).map_err(map_hex_err)?,
    })
}

struct DecodedCommodityOriginWitness {
    commodity_type: u64,
    mine_id: [u8; 32],
    lat: u64,
    lon: u64,
    primary_metric: u64,
    secondary_metric: u64,
    primary_randomness: [u8; 32],
    secondary_randomness: [u8; 32],
    location_randomness: [u8; 32],
    bounds: [u64; 4],
    min_primary: u64,
    min_secondary: u64,
    certification_flags: u64,
    merkle_path: ark_crypto_primitives::merkle_tree::Path<gtcx_zkp::AssetOwnershipMerkleConfig>,
    keys: gtcx_zkp::Groth16Keys,
}

fn decode_commodity_origin_witness(
    commodity_type: i64,
    mine_id_hex: String,
    lat: i64,
    lon: i64,
    primary_metric: i64,
    secondary_metric: i64,
    primary_randomness_hex: String,
    secondary_randomness_hex: String,
    location_randomness_hex: String,
    bounds: Vec<i64>,
    min_primary: i64,
    min_secondary: i64,
    certification_flags: i64,
    merkle_path_hex: String,
    proving_key_hex: String,
    verifying_key_hex: String,
) -> napi::Result<DecodedCommodityOriginWitness> {
    use ark_crypto_primitives::merkle_tree::Path;
    use gtcx_zkp::AssetOwnershipMerkleConfig;

    if bounds.len() != 4 {
        return Err(napi::Error::from_reason(
            "bounds must have exactly 4 elements [min_lat, max_lat, min_lon, max_lon]".to_string(),
        ));
    }

    let mine_id = decode_32_bytes(&mine_id_hex, "mine_id")?;
    let primary_randomness = decode_32_bytes(&primary_randomness_hex, "primary_randomness")?;
    let secondary_randomness = decode_32_bytes(&secondary_randomness_hex, "secondary_randomness")?;
    let location_randomness = decode_32_bytes(&location_randomness_hex, "location_randomness")?;

    let merkle_path_bytes = hex::decode(&merkle_path_hex).map_err(map_hex_err)?;
    let merkle_path =
        <Path<AssetOwnershipMerkleConfig> as ark_serialize::CanonicalDeserialize>::deserialize_compressed(
            &*merkle_path_bytes,
        )
        .map_err(|e| napi::Error::from_reason(format!("Invalid merkle path: {e}")))?;

    let pk_bytes = hex::decode(&proving_key_hex).map_err(map_hex_err)?;
    let vk_bytes = hex::decode(&verifying_key_hex).map_err(map_hex_err)?;
    let keys = gtcx_zkp::Groth16Keys {
        circuit: gtcx_zkp::Groth16CircuitType::CommodityOrigin,
        proving_key: pk_bytes,
        verifying_key: vk_bytes,
    };

    Ok(DecodedCommodityOriginWitness {
        commodity_type: commodity_type as u64,
        mine_id,
        lat: lat as u64,
        lon: lon as u64,
        primary_metric: primary_metric as u64,
        secondary_metric: secondary_metric as u64,
        primary_randomness,
        secondary_randomness,
        location_randomness,
        bounds: [
            bounds[0] as u64,
            bounds[1] as u64,
            bounds[2] as u64,
            bounds[3] as u64,
        ],
        min_primary: min_primary as u64,
        min_secondary: min_secondary as u64,
        certification_flags: certification_flags as u64,
        merkle_path,
        keys,
    })
}

fn prove_commodity_origin_decoded(
    decoded: &DecodedCommodityOriginWitness,
    profile_id: Option<&str>,
) -> napi::Result<JsGroth16ProofBundle> {
    let (bundle, _inputs) = gtcx_zkp::groth16_prove_commodity_origin(
        decoded.commodity_type,
        decoded.mine_id,
        decoded.lat,
        decoded.lon,
        decoded.primary_metric,
        decoded.secondary_metric,
        decoded.primary_randomness,
        decoded.secondary_randomness,
        decoded.location_randomness,
        decoded.bounds,
        decoded.min_primary,
        decoded.min_secondary,
        decoded.certification_flags,
        decoded.merkle_path.clone(),
        &decoded.keys,
    )
    .map_err(map_hex_err)?;

    let mut pi_bytes = Vec::new();
    for f in &bundle.public_inputs {
        let mut buf = Vec::new();
        ark_serialize::CanonicalSerialize::serialize_compressed(f, &mut buf)
            .map_err(map_hex_err)?;
        pi_bytes.push(hex::encode(&buf));
    }

    Ok(JsGroth16ProofBundle {
        circuit: "commodity_origin".to_string(),
        profile_id: profile_id.map(str::to_string),
        proof: hex::encode(&bundle.proof),
        verifying_key: hex::encode(&bundle.verifying_key),
        public_inputs_json: serde_json::to_string(&pi_bytes).map_err(map_hex_err)?,
    })
}

/// Prove a commodity origin statement.
///
/// Commodity-agnostic: `primary_metric`/`secondary_metric` and `commodity_type`
/// are interpreted by the verifier based on the commodity policy.
///
/// # Arguments
///
/// * `commodity_type` - Commodity discriminator (0 = gold, 1 = diamond, etc.)
/// * `mine_id_hex` - The mine identifier (32 bytes hex)
/// * `lat` - GPS latitude
/// * `lon` - GPS longitude
/// * `primary_metric` - Primary quality metric value
/// * `secondary_metric` - Secondary quality metric value
/// * `primary_randomness_hex` - Randomness for primary commitment (32 bytes hex)
/// * `secondary_randomness_hex` - Randomness for secondary commitment (32 bytes hex)
/// * `location_randomness_hex` - Randomness for location commitment (32 bytes hex)
/// * `bounds` - [min_lat, max_lat, min_lon, max_lon]
/// * `min_primary` - Minimum primary threshold
/// * `min_secondary` - Minimum secondary threshold
/// * `certification_flags` - Certification bitmask (bit 0 = KP certified)
/// * `merkle_path_hex` - Serialized Merkle path (canonical arkworks bytes)
/// * `proving_key_hex` - The proving key from `groth16_generate_keys`
/// * `verifying_key_hex` - The verifying key from `groth16_generate_keys`
#[napi]
pub fn groth16_prove_commodity_origin(
    commodity_type: i64,
    mine_id_hex: String,
    lat: i64,
    lon: i64,
    primary_metric: i64,
    secondary_metric: i64,
    primary_randomness_hex: String,
    secondary_randomness_hex: String,
    location_randomness_hex: String,
    bounds: Vec<i64>,
    min_primary: i64,
    min_secondary: i64,
    certification_flags: i64,
    merkle_path_hex: String,
    proving_key_hex: String,
    verifying_key_hex: String,
) -> napi::Result<JsGroth16ProofBundle> {
    let decoded = decode_commodity_origin_witness(
        commodity_type,
        mine_id_hex,
        lat,
        lon,
        primary_metric,
        secondary_metric,
        primary_randomness_hex,
        secondary_randomness_hex,
        location_randomness_hex,
        bounds,
        min_primary,
        min_secondary,
        certification_flags,
        merkle_path_hex,
        proving_key_hex,
        verifying_key_hex,
    )?;
    prove_commodity_origin_decoded(&decoded, None)
}

/// Prove commodity origin using a registry profile policy pack (same R1CS keys as
/// `groth16_prove_commodity_origin`).
///
/// Witness fields are validated against the profile (GPS box, cert mask, metric mins).
/// Public circuit parameters (`bounds`, `min_primary`, `min_secondary`, `commodity_type`)
/// are taken from the profile config — not from caller-supplied policy fields.
///
/// # Arguments
///
/// * `profile_id` - Registry ID (e.g. `gh-gold-origin`, `zw-diamond-origin`)
/// * Remaining args — witness + keys (see `groth16_prove_commodity_origin`; bounds/mins ignored)
#[napi]
pub fn groth16_prove_commodity_origin_profile(
    profile_id: String,
    mine_id_hex: String,
    lat: i64,
    lon: i64,
    primary_metric: i64,
    secondary_metric: i64,
    primary_randomness_hex: String,
    secondary_randomness_hex: String,
    location_randomness_hex: String,
    certification_flags: i64,
    merkle_path_hex: String,
    proving_key_hex: String,
    verifying_key_hex: String,
) -> napi::Result<JsGroth16ProofBundle> {
    let profile = gtcx_zkp::resolve_profile(&profile_id, false).map_err(|e| {
        napi::Error::from_reason(format!("Circuit registry: {e}"))
    })?;

    gtcx_zkp::validate_profile_witness(
        &profile,
        &gtcx_zkp::ProfileWitnessFields {
            commodity_type: profile.commodity_type,
            lat: lat as u64,
            lon: lon as u64,
            primary_metric: primary_metric as u64,
            secondary_metric: secondary_metric as u64,
            certification_flags: certification_flags as u64,
        },
    )
    .map_err(|e| napi::Error::from_reason(format!("Profile validation failed: {e:?}")))?;

    let decoded = decode_commodity_origin_witness(
        profile.commodity_type as i64,
        mine_id_hex,
        lat,
        lon,
        primary_metric,
        secondary_metric,
        primary_randomness_hex,
        secondary_randomness_hex,
        location_randomness_hex,
        profile.bounds.iter().map(|&b| b as i64).collect(),
        profile.min_primary as i64,
        profile.min_secondary as i64,
        certification_flags,
        merkle_path_hex,
        proving_key_hex,
        verifying_key_hex,
    )?;

    prove_commodity_origin_decoded(&decoded, Some(profile.profile_id))
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
