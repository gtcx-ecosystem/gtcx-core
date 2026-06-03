//! Trusted-setup transcript verification for Groth16 circuits.
//!
//! This module is gated behind the `trusted-setup-verify` feature. When enabled,
//! it provides tools to re-derive verifying keys from a published ceremony
//! transcript and confirm the VK hash matches the canonical KAT artifact.
//!
//! # Ceremony format (placeholder)
//!
//! Until XR-402 completes, the transcript is modelled as a raw 32-byte seed
//! file. When the sovereign signing ceremony finishes, this format will be
//! upgraded to the full multi-party contribution transcript (JSON or binary
//! CRS dump) without changing the public API.

#![allow(dead_code)]

use crate::error::{map_proof_system_error, Result, ZkpError};
use crate::groth16::serialize;
use crate::groth16::{
    AssetOwnershipCircuit, CommodityOriginCircuit, GciThresholdCircuit, LocationRegionCircuit,
};
use crate::types::{Groth16CircuitType, Groth16Keys};
use ark_bn254::Bn254;
use ark_groth16::Groth16;
use ark_snark::SNARK;
use sha2::{Digest, Sha256};
use std::path::Path;

/// Trusted-setup transcript entropy (placeholder — 32-byte seed).
///
/// When XR-402 completes this will be replaced by the full CRS struct.
pub struct TrustedSetupTranscript {
    /// 32-byte deterministic seed derived from ceremony contributions.
    pub seed: [u8; 32],
}

impl TrustedSetupTranscript {
    /// Read a raw 32-byte seed from a file.
    pub fn from_file<P: AsRef<Path>>(path: P) -> Result<Self> {
        let bytes = std::fs::read(path.as_ref()).map_err(|e| ZkpError::IoError {
            reason: format!("failed to read transcript: {e}"),
        })?;
        if bytes.len() != 32 {
            return Err(ZkpError::InvalidProofFormat {
                reason: format!(
                    "transcript must be exactly 32 bytes, got {}",
                    bytes.len()
                ),
            });
        }
        let mut seed = [0u8; 32];
        seed.copy_from_slice(&bytes);
        Ok(Self { seed })
    }
}

/// Deterministically generate Groth16 keys from a 32-byte seed.
///
/// This mirrors `groth16_generate_keys` but uses a fixed seed instead of
/// `OsRng`, allowing reproducible key derivation from a ceremony transcript.
pub fn groth16_generate_keys_from_seed(
    circuit: Groth16CircuitType,
    seed: [u8; 32],
) -> Result<Groth16Keys> {
    use ark_std::rand::SeedableRng;
    let mut rng = ark_std::rand::rngs::StdRng::from_seed(seed);

    match circuit {
        Groth16CircuitType::GciThreshold => {
            let circuit_impl = GciThresholdCircuit {
                score: Some(1),
                threshold: Some(0),
            };
            let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit_impl, &mut rng)
                .map_err(map_proof_system_error)?;
            Ok(Groth16Keys {
                circuit: Groth16CircuitType::GciThreshold,
                proving_key: serialize(&pk)?,
                verifying_key: serialize(&vk)?,
            })
        }
        Groth16CircuitType::AssetOwnership => {
            let sample = crate::groth16::sample_asset_ownership()?;
            let circuit_impl = AssetOwnershipCircuit {
                asset_id: Some(sample.asset_id),
                asset_commitment: Some(sample.asset_commitment),
                owner_hash: Some(sample.owner_hash),
                randomness: Some(sample.randomness),
                ownership_root: Some(sample.ownership_root),
                merkle_path: Some(sample.merkle_path),
            };
            let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit_impl, &mut rng)
                .map_err(map_proof_system_error)?;
            Ok(Groth16Keys {
                circuit: Groth16CircuitType::AssetOwnership,
                proving_key: serialize(&pk)?,
                verifying_key: serialize(&vk)?,
            })
        }
        Groth16CircuitType::LocationRegion => {
            let sample = crate::groth16::sample_location_region()?;
            let circuit_impl = LocationRegionCircuit {
                lat: Some(sample.lat),
                lon: Some(sample.lon),
                timestamp: Some(sample.timestamp),
                randomness: Some(sample.randomness),
                bounds: Some(sample.bounds),
                region_hash: Some(sample.region_hash),
                location_commitment: Some(sample.location_commitment),
            };
            let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit_impl, &mut rng)
                .map_err(map_proof_system_error)?;
            Ok(Groth16Keys {
                circuit: Groth16CircuitType::LocationRegion,
                proving_key: serialize(&pk)?,
                verifying_key: serialize(&vk)?,
            })
        }
        Groth16CircuitType::CommodityOrigin => {
            let sample = crate::groth16::sample_commodity_origin()?;
            let circuit_impl = CommodityOriginCircuit {
                commodity_type: Some(sample.commodity_type),
                mine_id: Some(sample.mine_id),
                lat: Some(sample.lat),
                lon: Some(sample.lon),
                primary_metric: Some(sample.primary_metric),
                secondary_metric: Some(sample.secondary_metric),
                primary_randomness: Some(sample.primary_randomness),
                secondary_randomness: Some(sample.secondary_randomness),
                location_randomness: Some(sample.location_randomness),
                bounds: Some(sample.bounds),
                min_primary: Some(sample.min_primary),
                min_secondary: Some(sample.min_secondary),
                certification_flags: Some(sample.certification_flags),
                region_hash: Some(sample.region_hash),
                primary_commitment: Some(sample.primary_commitment),
                secondary_commitment: Some(sample.secondary_commitment),
                mines_root: Some(sample.mines_root),
                merkle_path: Some(sample.merkle_path),
            };
            let (pk, vk) = Groth16::<Bn254>::circuit_specific_setup(circuit_impl, &mut rng)
                .map_err(map_proof_system_error)?;
            Ok(Groth16Keys {
                circuit: Groth16CircuitType::CommodityOrigin,
                proving_key: serialize(&pk)?,
                verifying_key: serialize(&vk)?,
            })
        }
    }
}

/// Compute the SHA-256 hash of a serialized verifying key.
pub fn vk_hash(verifying_key: &[u8]) -> String {
    hex::encode(Sha256::digest(verifying_key))
}

/// Verify that a trusted-setup transcript re-derives a verifying key whose
/// hash matches `expected_vk_hash_hex`.
///
/// # Arguments
/// * `circuit` — the Groth16 circuit type to verify.
/// * `transcript_path` — filesystem path to the ceremony transcript.
/// * `expected_vk_hash_hex` — lowercase hex string of the expected VK hash.
pub fn verify_trusted_setup_vk<P: AsRef<Path>>(
    circuit: Groth16CircuitType,
    transcript_path: P,
    expected_vk_hash_hex: &str,
) -> Result<bool> {
    let transcript = TrustedSetupTranscript::from_file(transcript_path)?;
    let keys = groth16_generate_keys_from_seed(circuit, transcript.seed)?;
    let actual_hash = vk_hash(&keys.verifying_key);
    Ok(actual_hash == expected_vk_hash_hex.to_lowercase())
}
