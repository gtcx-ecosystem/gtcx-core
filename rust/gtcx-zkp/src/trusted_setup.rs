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
use serde::Deserialize;
use sha2::{Digest, Sha256};
use std::ffi::OsStr;
use std::path::{Path, PathBuf};

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

#[derive(Debug, Deserialize)]
struct KatVkRecord {
    circuit: String,
    vk_hash: String,
}

/// Parse KAT `circuit` field into Groth16 circuit type.
pub fn groth16_circuit_from_kat_name(name: &str) -> Result<Groth16CircuitType> {
    match name {
        "GciThreshold" => Ok(Groth16CircuitType::GciThreshold),
        "AssetOwnership" => Ok(Groth16CircuitType::AssetOwnership),
        "LocationRegion" => Ok(Groth16CircuitType::LocationRegion),
        "CommodityOrigin" => Ok(Groth16CircuitType::CommodityOrigin),
        other => Err(ZkpError::UnsupportedCircuit(format!(
            "unknown Groth16 KAT circuit: {other}"
        ))),
    }
}

/// Verify every `groth16-*.kat.json` in `kat_dir` pins to `transcript_path`.
///
/// Returns mismatched `(filename, expected, actual)` entries (empty = pass).
pub fn verify_groth16_kat_pins(
    transcript_path: impl AsRef<Path>,
    kat_dir: impl AsRef<Path>,
) -> Result<Vec<KatPinMismatch>> {
    let kat_dir = kat_dir.as_ref();
    let mut mismatches = Vec::new();

    for entry in std::fs::read_dir(kat_dir).map_err(|e| ZkpError::IoError {
        reason: format!("read KAT dir {}: {e}", kat_dir.display()),
    })? {
        let entry = entry.map_err(|e| ZkpError::IoError {
            reason: format!("read KAT dir entry: {e}"),
        })?;
        let path = entry.path();
        let Some(name) = path.file_name().and_then(OsStr::to_str) else {
            continue;
        };
        if !name.starts_with("groth16-") || !name.ends_with(".kat.json") {
            continue;
        }

        let raw = std::fs::read_to_string(&path).map_err(|e| ZkpError::IoError {
            reason: format!("read KAT {}: {e}", path.display()),
        })?;
        let record: KatVkRecord = serde_json::from_str(&raw).map_err(|e| ZkpError::InvalidProofFormat {
            reason: format!("parse KAT {}: {e}", path.display()),
        })?;
        let circuit = groth16_circuit_from_kat_name(&record.circuit)?;
        let ok = verify_trusted_setup_vk(circuit, &transcript_path, &record.vk_hash)?;
        if !ok {
            let keys = groth16_generate_keys_from_seed(
                circuit,
                TrustedSetupTranscript::from_file(&transcript_path)?.seed,
            )?;
            mismatches.push(KatPinMismatch {
                kat_file: name.to_string(),
                circuit: record.circuit,
                expected_vk_hash: record.vk_hash.to_lowercase(),
                actual_vk_hash: vk_hash(&keys.verifying_key),
            });
        }
    }

    Ok(mismatches)
}

/// A KAT file whose `vk_hash` does not match the ceremony transcript.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct KatPinMismatch {
    /// KAT filename (e.g. `groth16-gci-threshold.kat.json`).
    pub kat_file: String,
    /// Circuit name from the KAT record.
    pub circuit: String,
    /// Hash recorded in the KAT artifact.
    pub expected_vk_hash: String,
    /// Hash re-derived from the transcript.
    pub actual_vk_hash: String,
}

/// Default repo-relative paths from `rust/gtcx-zkp` crate root.
pub fn default_transcript_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../artifacts/trusted-setup/transcript.seed")
}

/// Default Groth16 KAT directory from `rust/gtcx-zkp` crate root.
pub fn default_kat_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../artifacts/kat")
}
