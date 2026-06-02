//! Bulletproofs range proof bindings.

use napi_derive::napi;

use crate::utils::{decode_32_bytes, map_hex_err};

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
    let rand_bytes = hex::decode(&randomness_hex).map_err(map_hex_err)?;
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
    .map_err(map_hex_err)?;

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
    let commitment_bytes = hex::decode(&commitment_hex).map_err(map_hex_err)?;
    if commitment_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Commitment must be 32 bytes, got {}",
            commitment_bytes.len()
        )));
    }
    let mut commitment = [0u8; 32];
    commitment.copy_from_slice(&commitment_bytes);

    let proof_low = hex::decode(&proof_low_hex).map_err(map_hex_err)?;
    let proof_high = hex::decode(&proof_high_hex).map_err(map_hex_err)?;

    let bundle = gtcx_zkp::BulletproofsRangeProofBundle {
        min: min as u64,
        max: max as u64,
        commitment,
        proof_low,
        proof_high,
    };

    gtcx_zkp::bulletproofs_verify_amount_range(&bundle).map_err(map_hex_err)
}

/// A Bulletproofs commodity range proof bundle returned to Node.js.
#[napi(object)]
pub struct JsBulletproofsCommodityRangeBundle {
    /// Minimum value of the range.
    pub min: i64,
    /// Maximum value of the range.
    pub max: i64,
    /// The Pedersen commitment as a hex string (64 hex chars).
    pub commitment: String,
    /// Hash of the commodity type (64 hex chars).
    pub commodity_hash: String,
    /// Hash of the unit of measurement (64 hex chars).
    pub unit_hash: String,
    /// The low range proof as a hex string.
    pub proof_low: String,
    /// The high range proof as a hex string.
    pub proof_high: String,
}

/// Prove that a commodity quantity lies within [min, max] using Bulletproofs.
///
/// # Arguments
///
/// * `quantity` - The secret quantity value
/// * `min` - Lower bound (inclusive)
/// * `max` - Upper bound (inclusive)
/// * `commodity_hash_hex` - 32-byte hash of the commodity type
/// * `unit_hash_hex` - 32-byte hash of the unit of measurement
/// * `randomness_hex` - 32-byte randomness as hex string (64 hex chars)
#[napi]
pub fn bulletproofs_prove_commodity_range(
    quantity: i64,
    min: i64,
    max: i64,
    commodity_hash_hex: String,
    unit_hash_hex: String,
    randomness_hex: String,
) -> napi::Result<JsBulletproofsCommodityRangeBundle> {
    let commodity_hash = decode_32_bytes(&commodity_hash_hex, "commodity_hash")?;
    let unit_hash = decode_32_bytes(&unit_hash_hex, "unit_hash")?;
    let rand_bytes = hex::decode(&randomness_hex).map_err(map_hex_err)?;
    if rand_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Randomness must be 32 bytes, got {}",
            rand_bytes.len()
        )));
    }
    let mut randomness = [0u8; 32];
    randomness.copy_from_slice(&rand_bytes);

    let bundle = gtcx_zkp::bulletproofs_prove_commodity_range(
        quantity as u64,
        min as u64,
        max as u64,
        commodity_hash,
        unit_hash,
        randomness,
    )
    .map_err(map_hex_err)?;

    Ok(JsBulletproofsCommodityRangeBundle {
        min,
        max,
        commitment: hex::encode(bundle.commitment),
        commodity_hash: hex::encode(bundle.commodity_hash),
        unit_hash: hex::encode(bundle.unit_hash),
        proof_low: hex::encode(&bundle.proof_low),
        proof_high: hex::encode(&bundle.proof_high),
    })
}

/// Verify a Bulletproofs commodity range proof bundle.
#[napi]
pub fn bulletproofs_verify_commodity_range(
    min: i64,
    max: i64,
    commitment_hex: String,
    commodity_hash_hex: String,
    unit_hash_hex: String,
    proof_low_hex: String,
    proof_high_hex: String,
) -> napi::Result<bool> {
    let commitment_bytes = hex::decode(&commitment_hex).map_err(map_hex_err)?;
    if commitment_bytes.len() != 32 {
        return Err(napi::Error::from_reason(format!(
            "Commitment must be 32 bytes, got {}",
            commitment_bytes.len()
        )));
    }
    let mut commitment = [0u8; 32];
    commitment.copy_from_slice(&commitment_bytes);

    let commodity_hash = decode_32_bytes(&commodity_hash_hex, "commodity_hash")?;
    let unit_hash = decode_32_bytes(&unit_hash_hex, "unit_hash")?;
    let proof_low = hex::decode(&proof_low_hex).map_err(map_hex_err)?;
    let proof_high = hex::decode(&proof_high_hex).map_err(map_hex_err)?;

    let bundle = gtcx_zkp::BulletproofsCommodityRangeBundle {
        min: min as u64,
        max: max as u64,
        commitment,
        commodity_hash,
        unit_hash,
        proof_low,
        proof_high,
    };

    gtcx_zkp::bulletproofs_verify_commodity_range(&bundle).map_err(map_hex_err)
}
