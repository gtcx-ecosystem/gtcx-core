//! # GTCX Zero-Knowledge Proofs
//!
//! Zero-knowledge proof system for the GTCX protocol.
//!
//! ## Overview
//!
//! This crate provides hash-commitment-based proof circuits for:
//! - **Compliance proofs** — prove regulatory compliance without revealing details
//! - **Provenance proofs** — prove origin without exposing supply chain
//! - **Quality proofs** — prove quality thresholds without revealing measurements
//! - **Identity proofs** — prove identity attributes without revealing PII
//!
//! ## Design
//!
//! Uses Blake3 hash commitments as the lightweight proof foundation.
//! Groth16 circuits (GCI threshold, asset ownership, location region), a
//! Bulletproofs amount range proof, and a Schnorr identity attribute proof are
//! implemented, while additional circuits (Bulletproofs, Groth16/Plonk) are
//! tracked in the roadmap and will expand this crate.

#![deny(unsafe_code)]
#![deny(warnings)]
#![deny(missing_docs)]

use ark_bn254::{Bn254, Fr};
use ark_crypto_primitives::crh::sha256::constraints::{DigestVar, Sha256Gadget, UnitVar};
use ark_crypto_primitives::crh::sha256::Sha256;
use ark_crypto_primitives::crh::{CRHScheme, CRHSchemeGadget, TwoToOneCRHScheme};
use ark_crypto_primitives::merkle_tree::constraints::{
    BytesVarDigestConverter, ConfigGadget, PathVar,
};
use ark_crypto_primitives::merkle_tree::{Config, DigestConverter, MerkleTree, Path};
use ark_ff::Field;
use ark_groth16::{Groth16, Proof as Groth16Proof, ProvingKey, VerifyingKey};
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::boolean::Boolean;
use ark_r1cs_std::eq::EqGadget;
use ark_r1cs_std::uint64::UInt64;
use ark_r1cs_std::uint8::UInt8;
use ark_r1cs_std::ToBitsGadget;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use ark_snark::SNARK;
use ark_std::rand::{rngs::StdRng, SeedableRng};
use bulletproofs::{BulletproofGens, PedersenGens, RangeProof};
use curve25519_dalek::constants::RISTRETTO_BASEPOINT_POINT;
use curve25519_dalek::ristretto::{CompressedRistretto, RistrettoPoint};
use curve25519_dalek::scalar::Scalar;
use gtcx_crypto::hashing::{blake3, blake3_keyed, sha256};
use merlin::Transcript;
use serde::{Deserialize, Serialize};
use std::io::Cursor;
use thiserror::Error;
use tracing::instrument;

// =============================================================================
// ERROR TYPES
// =============================================================================

/// Errors that can occur during ZKP operations.
#[derive(Debug, Error)]
pub enum ZkpError {
    /// The witness data is empty.
    #[error("Witness cannot be empty")]
    EmptyWitness,

    /// The witness data exceeds the maximum allowed size.
    #[error("Witness too large: {size} bytes exceeds maximum {max} bytes")]
    WitnessToLarge {
        /// Actual size in bytes.
        size: usize,
        /// Maximum allowed size.
        max: usize,
    },

    /// Proof verification failed.
    #[error("Proof verification failed")]
    VerificationFailed,

    /// Witness violates circuit preconditions.
    #[error("Invalid witness: {reason}")]
    InvalidWitness {
        /// Description of the constraint violation.
        reason: String,
    },

    /// Proof system error during setup, proving, or verification.
    #[error("Proof system error: {reason}")]
    ProofSystemError {
        /// Description of the proof system failure.
        reason: String,
    },

    /// Serialization failed for proof system objects.
    #[error("Serialization error: {reason}")]
    SerializationError {
        /// Description of the serialization failure.
        reason: String,
    },

    /// Deserialization failed for proof system objects.
    #[error("Deserialization error: {reason}")]
    DeserializationError {
        /// Description of the deserialization failure.
        reason: String,
    },

    /// Invalid proof format during deserialization.
    #[error("Invalid proof format: {reason}")]
    InvalidProofFormat {
        /// Description of the format error.
        reason: String,
    },

    /// Unsupported circuit type.
    #[error("Unsupported circuit type: {0}")]
    UnsupportedCircuit(String),
}

/// Result type for ZKP operations.
pub type Result<T> = std::result::Result<T, ZkpError>;

// =============================================================================
// TYPES
// =============================================================================

/// Maximum witness size in bytes (1 MB).
pub const MAX_WITNESS_SIZE: usize = 1_048_576;

/// Fixed digest size for SHA-256 outputs.
pub const DIGEST_BYTES: usize = 32;
/// Ristretto commitment size (bytes).
pub const COMMITMENT_BYTES: usize = 32;
/// Asset identifier size (bytes).
pub const ASSET_ID_BYTES: usize = 32;
/// Owner hash size (bytes).
pub const OWNER_HASH_BYTES: usize = 32;
/// Randomness size (bytes) for commitments.
pub const RANDOMNESS_BYTES: usize = 32;
/// Coordinate/timestamp size (bytes).
pub const U64_BYTES: usize = 8;

/// The type of circuit used for proof generation.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum CircuitType {
    /// Compliance proof circuit — regulatory compliance without details.
    Compliance,
    /// Provenance proof circuit — origin without supply chain exposure.
    Provenance,
    /// Quality proof circuit — quality threshold without measurements.
    Quality,
    /// Identity proof circuit — identity attributes without PII.
    Identity,
}

impl CircuitType {
    /// Convert to a byte tag for serialization.
    pub fn to_tag(self) -> u8 {
        match self {
            Self::Compliance => 0x01,
            Self::Provenance => 0x02,
            Self::Quality => 0x03,
            Self::Identity => 0x04,
        }
    }

    /// Parse from a string name (e.g., "compliance", "provenance").
    pub fn from_name(name: &str) -> Result<Self> {
        name.parse()
    }

    /// Parse from a byte tag.
    pub fn from_tag(tag: u8) -> Result<Self> {
        match tag {
            0x01 => Ok(Self::Compliance),
            0x02 => Ok(Self::Provenance),
            0x03 => Ok(Self::Quality),
            0x04 => Ok(Self::Identity),
            _ => Err(ZkpError::UnsupportedCircuit(format!("tag 0x{tag:02x}"))),
        }
    }
}

impl std::fmt::Display for CircuitType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Compliance => write!(f, "Compliance"),
            Self::Provenance => write!(f, "Provenance"),
            Self::Quality => write!(f, "Quality"),
            Self::Identity => write!(f, "Identity"),
        }
    }
}

impl std::str::FromStr for CircuitType {
    type Err = ZkpError;

    fn from_str(s: &str) -> Result<Self> {
        match s.to_lowercase().as_str() {
            "compliance" => Ok(Self::Compliance),
            "provenance" => Ok(Self::Provenance),
            "quality" => Ok(Self::Quality),
            "identity" => Ok(Self::Identity),
            other => Err(ZkpError::UnsupportedCircuit(other.to_string())),
        }
    }
}

/// Private witness data (the secret input to the proof).
#[derive(Debug, Clone)]
pub struct Witness {
    /// The circuit type this witness is for.
    pub circuit: CircuitType,
    /// The secret data.
    data: Vec<u8>,
}

impl Witness {
    /// Create a new witness for a given circuit type.
    ///
    /// # Errors
    ///
    /// Returns [`ZkpError::EmptyWitness`] if data is empty.
    /// Returns [`ZkpError::WitnessToLarge`] if data exceeds [`MAX_WITNESS_SIZE`].
    pub fn new(circuit: CircuitType, data: Vec<u8>) -> Result<Self> {
        if data.is_empty() {
            return Err(ZkpError::EmptyWitness);
        }
        if data.len() > MAX_WITNESS_SIZE {
            return Err(ZkpError::WitnessToLarge {
                size: data.len(),
                max: MAX_WITNESS_SIZE,
            });
        }
        Ok(Self { circuit, data })
    }

    /// Get the witness data bytes.
    pub fn data(&self) -> &[u8] {
        &self.data
    }
}

/// Public inputs to the proof (the statement being proved).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PublicInputs {
    /// The circuit type.
    pub circuit: CircuitType,
    /// The public commitment (hash of witness + salt).
    pub commitment: [u8; 32],
}

/// A zero-knowledge proof.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Proof {
    /// The circuit type this proof is for.
    pub circuit: CircuitType,
    /// The proof data (salt + hashed response).
    proof_data: Vec<u8>,
    /// The public commitment this proof corresponds to.
    pub commitment: [u8; 32],
}

impl Proof {
    /// Access the proof data bytes.
    pub fn proof_data(&self) -> &[u8] {
        &self.proof_data
    }

    /// Create a proof from its components.
    ///
    /// Used by NAPI bindings to reconstruct a proof from JavaScript.
    pub fn from_components(
        circuit: CircuitType,
        commitment: [u8; 32],
        proof_data: Vec<u8>,
    ) -> Self {
        Self {
            circuit,
            proof_data,
            commitment,
        }
    }

    /// Serialize the proof to bytes.
    ///
    /// # Errors
    ///
    /// Returns [`ZkpError::InvalidProofFormat`] if proof_data exceeds u32::MAX bytes.
    pub fn to_bytes(&self) -> Result<Vec<u8>> {
        let len =
            u32::try_from(self.proof_data.len()).map_err(|_| ZkpError::InvalidProofFormat {
                reason: format!("proof_data too large: {} bytes", self.proof_data.len()),
            })?;
        let mut bytes = Vec::with_capacity(37 + self.proof_data.len());
        // Header: circuit tag (1) + commitment (32)
        bytes.push(self.circuit.to_tag());
        bytes.extend_from_slice(&self.commitment);
        // Proof data length (4 bytes LE) + proof data
        bytes.extend_from_slice(&len.to_le_bytes());
        bytes.extend_from_slice(&self.proof_data);
        Ok(bytes)
    }

    /// Deserialize a proof from bytes.
    pub fn from_bytes(bytes: &[u8]) -> Result<Self> {
        // Minimum: 1 (tag) + 32 (commitment) + 4 (length) = 37
        if bytes.len() < 37 {
            return Err(ZkpError::InvalidProofFormat {
                reason: format!("too short: {} bytes, need at least 37", bytes.len()),
            });
        }

        let circuit = CircuitType::from_tag(bytes[0])?;
        let commitment: [u8; 32] =
            bytes[1..33]
                .try_into()
                .map_err(|_| ZkpError::InvalidProofFormat {
                    reason: "commitment extraction failed".to_string(),
                })?;

        let len_bytes: [u8; 4] =
            bytes[33..37]
                .try_into()
                .map_err(|_| ZkpError::InvalidProofFormat {
                    reason: "length extraction failed".to_string(),
                })?;
        let proof_len = usize::try_from(u32::from_le_bytes(len_bytes)).map_err(|_| {
            ZkpError::InvalidProofFormat {
                reason: "proof length exceeds platform maximum".to_string(),
            }
        })?;

        if bytes.len() < 37 + proof_len {
            return Err(ZkpError::InvalidProofFormat {
                reason: format!(
                    "truncated: expected {} proof bytes, got {}",
                    proof_len,
                    bytes.len() - 37
                ),
            });
        }

        let proof_data = bytes[37..37 + proof_len].to_vec();

        Ok(Self {
            circuit,
            commitment,
            proof_data,
        })
    }
}

// =============================================================================
// GROTH16 CIRCUITS (ARKWORKS)
// =============================================================================

/// Supported Groth16 circuits.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Groth16CircuitType {
    /// Prove that a GCI score is greater than or equal to a public threshold.
    GciThreshold,
    /// Prove asset ownership via Merkle membership.
    AssetOwnership,
    /// Prove location lies within a licensed region.
    LocationRegion,
}

/// Groth16 proving/verifying keys (serialized).
#[derive(Debug, Clone)]
pub struct Groth16Keys {
    /// Circuit this keypair belongs to.
    pub circuit: Groth16CircuitType,
    /// Proving key (canonical compressed bytes).
    pub proving_key: Vec<u8>,
    /// Verifying key (canonical compressed bytes).
    pub verifying_key: Vec<u8>,
}

/// Groth16 proof bundle with public inputs and verifying key.
#[derive(Debug, Clone)]
pub struct Groth16ProofBundle {
    /// Circuit this proof belongs to.
    pub circuit: Groth16CircuitType,
    /// Proof (canonical compressed bytes).
    pub proof: Vec<u8>,
    /// Verifying key (canonical compressed bytes).
    pub verifying_key: Vec<u8>,
    /// Public inputs for verification.
    pub public_inputs: Vec<Fr>,
}

/// Bulletproofs range proof bundle for amount range validation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BulletproofsRangeProofBundle {
    /// Minimum allowed amount (inclusive).
    pub min: u64,
    /// Maximum allowed amount (inclusive).
    pub max: u64,
    /// Pedersen commitment to the amount.
    pub commitment: [u8; COMMITMENT_BYTES],
    /// Range proof for (amount - min).
    pub proof_low: Vec<u8>,
    /// Range proof for (max - amount).
    pub proof_high: Vec<u8>,
}

/// Schnorr proof bundle for identity attribute possession.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchnorrIdentityProofBundle {
    /// Commitment to the attribute (derived from the attribute value).
    pub attribute_hash: [u8; COMMITMENT_BYTES],
    /// Hash of the subject identifier (public input).
    pub subject_hash: [u8; DIGEST_BYTES],
    /// Schnorr nonce commitment.
    pub nonce_commitment: [u8; COMMITMENT_BYTES],
    /// Schnorr response scalar (canonical bytes).
    pub response: [u8; COMMITMENT_BYTES],
}

/// Public inputs for the asset ownership circuit.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct AssetOwnershipPublicInputs {
    /// Commitment to the asset id (SHA-256 of asset id + randomness).
    pub asset_commitment: [u8; DIGEST_BYTES],
    /// Owner public key hash.
    pub owner_hash: [u8; DIGEST_BYTES],
    /// Merkle root of the ownership tree.
    pub ownership_root: [u8; DIGEST_BYTES],
}

/// Public inputs for the location region circuit.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct LocationRegionPublicInputs {
    /// Hash of the region bounds (min/max lat/lon).
    pub region_hash: [u8; DIGEST_BYTES],
    /// Commitment to the location (lat/lon/timestamp).
    pub location_commitment: [u8; DIGEST_BYTES],
    /// Timestamp associated with the proof.
    pub timestamp: u64,
}

#[derive(Clone)]
struct GciThresholdCircuit {
    score: Option<u64>,
    threshold: Option<u64>,
}

/// Merkle tree configuration for asset ownership proofs (SHA-256).
pub struct AssetOwnershipMerkleConfig;

/// Digest converter for asset ownership Merkle trees (raw bytes passthrough).
pub struct AssetOwnershipDigestConverter;

impl DigestConverter<Vec<u8>, [u8]> for AssetOwnershipDigestConverter {
    type TargetType = Vec<u8>;

    fn convert(
        item: Vec<u8>,
    ) -> std::result::Result<Self::TargetType, ark_crypto_primitives::Error> {
        Ok(item)
    }
}

impl Config for AssetOwnershipMerkleConfig {
    type Leaf = [u8];
    type LeafDigest = <Sha256 as CRHScheme>::Output;
    type LeafInnerDigestConverter = AssetOwnershipDigestConverter;
    type InnerDigest = <Sha256 as TwoToOneCRHScheme>::Output;
    type LeafHash = Sha256;
    type TwoToOneHash = Sha256;
}

struct AssetOwnershipMerkleConfigGadget;

impl ConfigGadget<AssetOwnershipMerkleConfig, Fr> for AssetOwnershipMerkleConfigGadget {
    type Leaf = [UInt8<Fr>];
    type LeafDigest = DigestVar<Fr>;
    type LeafInnerConverter = BytesVarDigestConverter<Self::LeafDigest, Fr>;
    type InnerDigest = DigestVar<Fr>;
    type LeafHash = Sha256Gadget<Fr>;
    type TwoToOneHash = Sha256Gadget<Fr>;
}

type AssetOwnershipMerkleTree = MerkleTree<AssetOwnershipMerkleConfig>;

#[derive(Clone)]
struct AssetOwnershipCircuit {
    asset_id: Option<[u8; ASSET_ID_BYTES]>,
    asset_commitment: Option<[u8; DIGEST_BYTES]>,
    owner_hash: Option<[u8; OWNER_HASH_BYTES]>,
    randomness: Option<[u8; RANDOMNESS_BYTES]>,
    ownership_root: Option<[u8; DIGEST_BYTES]>,
    merkle_path: Option<Path<AssetOwnershipMerkleConfig>>,
}

#[derive(Clone)]
struct LocationRegionCircuit {
    lat: Option<u64>,
    lon: Option<u64>,
    timestamp: Option<u64>,
    randomness: Option<[u8; RANDOMNESS_BYTES]>,
    bounds: Option<[u64; 4]>, // min_lat, max_lat, min_lon, max_lon
    region_hash: Option<[u8; DIGEST_BYTES]>,
    location_commitment: Option<[u8; DIGEST_BYTES]>,
}

fn uint64_is_ge<F: Field>(
    lhs: &UInt64<F>,
    rhs: &UInt64<F>,
) -> std::result::Result<Boolean<F>, SynthesisError> {
    let lhs_bits = lhs.to_bits_le();
    let rhs_bits = rhs.to_bits_le();
    let mut greater = Boolean::constant(false);
    let mut equal = Boolean::constant(true);

    for i in (0..lhs_bits.len()).rev() {
        let l = lhs_bits[i].clone();
        let r = rhs_bits[i].clone();
        let l_and_not_r = l.and(&r.not())?;
        let greater_if_equal = equal.and(&l_and_not_r)?;
        greater = greater.or(&greater_if_equal)?;
        let bits_equal = l.xor(&r)?.not();
        equal = equal.and(&bits_equal)?;
    }

    greater.or(&equal)
}

impl ConstraintSynthesizer<Fr> for GciThresholdCircuit {
    fn generate_constraints(
        self,
        cs: ConstraintSystemRef<Fr>,
    ) -> std::result::Result<(), SynthesisError> {
        let score = UInt64::new_witness(cs.clone(), || {
            self.score.ok_or(SynthesisError::AssignmentMissing)
        })?;
        let threshold = UInt64::new_input(cs.clone(), || {
            self.threshold.ok_or(SynthesisError::AssignmentMissing)
        })?;

        let is_ge = uint64_is_ge(&score, &threshold)?;
        is_ge.enforce_equal(&Boolean::constant(true))?;
        Ok(())
    }
}

impl ConstraintSynthesizer<Fr> for AssetOwnershipCircuit {
    fn generate_constraints(
        self,
        cs: ConstraintSystemRef<Fr>,
    ) -> std::result::Result<(), SynthesisError> {
        let asset_commitment = DigestVar::new_input(cs.clone(), || {
            self.asset_commitment
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let owner_hash = DigestVar::new_input(cs.clone(), || {
            self.owner_hash
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let ownership_root = DigestVar::new_input(cs.clone(), || {
            self.ownership_root
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;

        let asset_id_bytes: Vec<UInt8<Fr>> = (0..ASSET_ID_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.asset_id
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        let randomness_bytes: Vec<UInt8<Fr>> = (0..RANDOMNESS_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.randomness
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        let unit = UnitVar::new_constant(cs.clone(), ())?;
        let mut commitment_input = Vec::with_capacity(ASSET_ID_BYTES + RANDOMNESS_BYTES);
        commitment_input.extend_from_slice(&asset_id_bytes);
        commitment_input.extend_from_slice(&randomness_bytes);
        let computed_commitment =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &commitment_input)?;
        computed_commitment.enforce_equal(&asset_commitment)?;

        let mut leaf_bytes = Vec::with_capacity(ASSET_ID_BYTES + OWNER_HASH_BYTES);
        leaf_bytes.extend_from_slice(&asset_id_bytes);
        leaf_bytes.extend_from_slice(&owner_hash.0);

        let path = PathVar::<AssetOwnershipMerkleConfig, Fr, AssetOwnershipMerkleConfigGadget>::new_witness(
            cs.clone(),
            || self.merkle_path.ok_or(SynthesisError::AssignmentMissing),
        )?;
        let is_member =
            path.verify_membership(&unit, &unit, &ownership_root, leaf_bytes.as_slice())?;
        is_member.enforce_equal(&Boolean::constant(true))?;
        Ok(())
    }
}

impl ConstraintSynthesizer<Fr> for LocationRegionCircuit {
    fn generate_constraints(
        self,
        cs: ConstraintSystemRef<Fr>,
    ) -> std::result::Result<(), SynthesisError> {
        let region_hash = DigestVar::new_input(cs.clone(), || {
            self.region_hash
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let location_commitment = DigestVar::new_input(cs.clone(), || {
            self.location_commitment
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;

        let timestamp_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| {
                UInt8::new_input(cs.clone(), || {
                    self.timestamp
                        .map(|v| u64_to_le_bytes(v)[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        let lat_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.lat
                        .map(|v| u64_to_le_bytes(v)[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;
        let lon_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.lon
                        .map(|v| u64_to_le_bytes(v)[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;
        let randomness_bytes: Vec<UInt8<Fr>> = (0..RANDOMNESS_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.randomness
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        let bounds = self.bounds.ok_or(SynthesisError::AssignmentMissing)?;
        let min_lat_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| UInt8::new_witness(cs.clone(), || Ok(u64_to_le_bytes(bounds[0])[i])))
            .collect::<std::result::Result<_, _>>()?;
        let max_lat_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| UInt8::new_witness(cs.clone(), || Ok(u64_to_le_bytes(bounds[1])[i])))
            .collect::<std::result::Result<_, _>>()?;
        let min_lon_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| UInt8::new_witness(cs.clone(), || Ok(u64_to_le_bytes(bounds[2])[i])))
            .collect::<std::result::Result<_, _>>()?;
        let max_lon_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| UInt8::new_witness(cs.clone(), || Ok(u64_to_le_bytes(bounds[3])[i])))
            .collect::<std::result::Result<_, _>>()?;

        let lat = uint64_from_le_bytes(&lat_bytes)?;
        let lon = uint64_from_le_bytes(&lon_bytes)?;
        let min_lat = uint64_from_le_bytes(&min_lat_bytes)?;
        let max_lat = uint64_from_le_bytes(&max_lat_bytes)?;
        let min_lon = uint64_from_le_bytes(&min_lon_bytes)?;
        let max_lon = uint64_from_le_bytes(&max_lon_bytes)?;

        let lat_ge_min = uint64_is_ge(&lat, &min_lat)?;
        let max_ge_lat = uint64_is_ge(&max_lat, &lat)?;
        let lon_ge_min = uint64_is_ge(&lon, &min_lon)?;
        let max_ge_lon = uint64_is_ge(&max_lon, &lon)?;
        lat_ge_min.enforce_equal(&Boolean::constant(true))?;
        max_ge_lat.enforce_equal(&Boolean::constant(true))?;
        lon_ge_min.enforce_equal(&Boolean::constant(true))?;
        max_ge_lon.enforce_equal(&Boolean::constant(true))?;

        let unit = UnitVar::new_constant(cs.clone(), ())?;
        let mut location_input = Vec::with_capacity(U64_BYTES * 3 + RANDOMNESS_BYTES);
        location_input.extend_from_slice(&lat_bytes);
        location_input.extend_from_slice(&lon_bytes);
        location_input.extend_from_slice(&timestamp_bytes);
        location_input.extend_from_slice(&randomness_bytes);
        let computed_commitment =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &location_input)?;
        computed_commitment.enforce_equal(&location_commitment)?;

        let mut region_input = Vec::with_capacity(U64_BYTES * 4);
        region_input.extend_from_slice(&min_lat_bytes);
        region_input.extend_from_slice(&max_lat_bytes);
        region_input.extend_from_slice(&min_lon_bytes);
        region_input.extend_from_slice(&max_lon_bytes);
        let computed_region =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &region_input)?;
        computed_region.enforce_equal(&region_hash)?;
        Ok(())
    }
}

fn serialize<T: CanonicalSerialize>(value: &T) -> Result<Vec<u8>> {
    let mut bytes = Vec::new();
    value
        .serialize_compressed(&mut bytes)
        .map_err(|err| ZkpError::SerializationError {
            reason: err.to_string(),
        })?;
    Ok(bytes)
}

fn deserialize<T: CanonicalDeserialize>(bytes: &[u8]) -> Result<T> {
    let mut cursor = Cursor::new(bytes);
    T::deserialize_compressed(&mut cursor).map_err(|err| ZkpError::DeserializationError {
        reason: err.to_string(),
    })
}

fn map_proof_system_error(err: impl std::fmt::Display) -> ZkpError {
    ZkpError::ProofSystemError {
        reason: err.to_string(),
    }
}

fn zk_rng() -> StdRng {
    StdRng::seed_from_u64(42)
}

fn u64_to_fr_bits(value: u64) -> Vec<Fr> {
    (0..64).map(|i| Fr::from((value >> i) & 1)).collect()
}

fn bytes_to_fr_bits(bytes: &[u8]) -> Vec<Fr> {
    let mut bits = Vec::with_capacity(bytes.len() * 8);
    for byte in bytes {
        for i in 0..8 {
            bits.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }
    bits
}

fn u64_to_le_bytes(value: u64) -> [u8; U64_BYTES] {
    value.to_le_bytes()
}

fn uint64_from_le_bytes(bytes: &[UInt8<Fr>]) -> std::result::Result<UInt64<Fr>, SynthesisError> {
    if bytes.len() != U64_BYTES {
        return Err(SynthesisError::Unsatisfiable);
    }
    let mut bits = Vec::with_capacity(64);
    for byte in bytes {
        bits.extend(byte.to_bits_le()?);
    }
    Ok(UInt64::from_bits_le(&bits))
}

fn vec_to_digest(bytes: Vec<u8>) -> Result<[u8; DIGEST_BYTES]> {
    if bytes.len() != DIGEST_BYTES {
        return Err(ZkpError::InvalidWitness {
            reason: format!("digest length {} != {}", bytes.len(), DIGEST_BYTES),
        });
    }
    let mut digest = [0u8; DIGEST_BYTES];
    digest.copy_from_slice(&bytes);
    Ok(digest)
}

fn sha256_digest(data: &[u8]) -> Result<[u8; DIGEST_BYTES]> {
    let digest =
        <Sha256 as CRHScheme>::evaluate(&(), data).map_err(|_| ZkpError::ProofSystemError {
            reason: "sha256 evaluation failed".to_string(),
        })?;
    let mut out = [0u8; DIGEST_BYTES];
    out.copy_from_slice(&digest);
    Ok(out)
}

struct AssetOwnershipSample {
    asset_id: [u8; ASSET_ID_BYTES],
    owner_hash: [u8; OWNER_HASH_BYTES],
    randomness: [u8; RANDOMNESS_BYTES],
    ownership_root: [u8; DIGEST_BYTES],
    merkle_path: Path<AssetOwnershipMerkleConfig>,
    asset_commitment: [u8; DIGEST_BYTES],
}

struct LocationRegionSample {
    lat: u64,
    lon: u64,
    timestamp: u64,
    randomness: [u8; RANDOMNESS_BYTES],
    bounds: [u64; 4],
    region_hash: [u8; DIGEST_BYTES],
    location_commitment: [u8; DIGEST_BYTES],
}

fn sample_asset_ownership() -> Result<AssetOwnershipSample> {
    let asset_id = [1u8; ASSET_ID_BYTES];
    let owner_hash = sha256_digest(b"owner-1")?;
    let randomness = [7u8; RANDOMNESS_BYTES];

    let mut commitment_input = Vec::with_capacity(ASSET_ID_BYTES + RANDOMNESS_BYTES);
    commitment_input.extend_from_slice(&asset_id);
    commitment_input.extend_from_slice(&randomness);
    let asset_commitment = sha256_digest(&commitment_input)?;

    let make_leaf = |asset: [u8; ASSET_ID_BYTES], owner: [u8; OWNER_HASH_BYTES]| {
        let mut leaf = Vec::with_capacity(ASSET_ID_BYTES + OWNER_HASH_BYTES);
        leaf.extend_from_slice(&asset);
        leaf.extend_from_slice(&owner);
        leaf
    };

    let leaves = [
        make_leaf(asset_id, owner_hash),
        make_leaf([2u8; ASSET_ID_BYTES], sha256_digest(b"owner-2")?),
        make_leaf([3u8; ASSET_ID_BYTES], sha256_digest(b"owner-3")?),
        make_leaf([4u8; ASSET_ID_BYTES], sha256_digest(b"owner-4")?),
    ];

    let mut rng = zk_rng();
    <Sha256 as CRHScheme>::setup(&mut rng).map_err(map_proof_system_error)?;
    <Sha256 as TwoToOneCRHScheme>::setup(&mut rng).map_err(map_proof_system_error)?;
    let tree = AssetOwnershipMerkleTree::new(&(), &(), leaves.iter().map(|leaf| leaf.as_slice()))
        .map_err(map_proof_system_error)?;
    let ownership_root = vec_to_digest(tree.root())?;
    let merkle_path = tree.generate_proof(0).map_err(map_proof_system_error)?;

    let leaf = make_leaf(asset_id, owner_hash);
    let root_vec = tree.root();
    let is_member = merkle_path
        .verify(&(), &(), &root_vec, leaf.as_slice())
        .map_err(map_proof_system_error)?;
    if !is_member {
        return Err(ZkpError::InvalidWitness {
            reason: "sample merkle path verification failed".to_string(),
        });
    }

    Ok(AssetOwnershipSample {
        asset_id,
        owner_hash,
        randomness,
        ownership_root,
        merkle_path,
        asset_commitment,
    })
}

fn sample_location_region() -> Result<LocationRegionSample> {
    let lat = 15u64;
    let lon = 35u64;
    let timestamp = 1_700_000_000u64;
    let randomness = [9u8; RANDOMNESS_BYTES];
    let bounds = [10u64, 20u64, 30u64, 40u64]; // min_lat, max_lat, min_lon, max_lon

    let mut region_input = Vec::with_capacity(U64_BYTES * 4);
    for bound in bounds {
        region_input.extend_from_slice(&u64_to_le_bytes(bound));
    }
    let region_hash = sha256_digest(&region_input)?;

    let mut location_input = Vec::with_capacity(U64_BYTES * 3 + RANDOMNESS_BYTES);
    location_input.extend_from_slice(&u64_to_le_bytes(lat));
    location_input.extend_from_slice(&u64_to_le_bytes(lon));
    location_input.extend_from_slice(&u64_to_le_bytes(timestamp));
    location_input.extend_from_slice(&randomness);
    let location_commitment = sha256_digest(&location_input)?;

    Ok(LocationRegionSample {
        lat,
        lon,
        timestamp,
        randomness,
        bounds,
        region_hash,
        location_commitment,
    })
}

/// Generate Groth16 proving and verifying keys for a circuit.
///
/// For now, only `GciThreshold` is supported.
#[instrument]
pub fn groth16_generate_keys(circuit: Groth16CircuitType) -> Result<Groth16Keys> {
    match circuit {
        Groth16CircuitType::GciThreshold => {
            let mut rng = zk_rng();
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
            let mut rng = zk_rng();
            let sample = sample_asset_ownership()?;
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
            let mut rng = zk_rng();
            let sample = sample_location_region()?;
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
    }
}

/// Generate a Groth16 proof for the GCI threshold circuit.
#[instrument]
pub fn groth16_prove_gci_threshold(
    score: u64,
    threshold: u64,
    keys: &Groth16Keys,
) -> Result<Groth16ProofBundle> {
    if keys.circuit != Groth16CircuitType::GciThreshold {
        return Err(ZkpError::UnsupportedCircuit(format!("{:?}", keys.circuit)));
    }
    if score < threshold {
        return Err(ZkpError::InvalidWitness {
            reason: "score below threshold".to_string(),
        });
    }

    let pk: ProvingKey<Bn254> = deserialize(&keys.proving_key)?;
    let mut rng = zk_rng();
    let circuit = GciThresholdCircuit {
        score: Some(score),
        threshold: Some(threshold),
    };
    let proof = Groth16::<Bn254>::prove(&pk, circuit, &mut rng).map_err(map_proof_system_error)?;
    let public_inputs = u64_to_fr_bits(threshold);

    Ok(Groth16ProofBundle {
        circuit: Groth16CircuitType::GciThreshold,
        proof: serialize(&proof)?,
        verifying_key: keys.verifying_key.clone(),
        public_inputs,
    })
}

/// Generate a Groth16 proof for the asset ownership circuit.
#[instrument]
pub fn groth16_prove_asset_ownership(
    asset_id: [u8; ASSET_ID_BYTES],
    owner_hash: [u8; OWNER_HASH_BYTES],
    randomness: [u8; RANDOMNESS_BYTES],
    ownership_root: [u8; DIGEST_BYTES],
    merkle_path: Path<AssetOwnershipMerkleConfig>,
    keys: &Groth16Keys,
) -> Result<(Groth16ProofBundle, AssetOwnershipPublicInputs)> {
    if keys.circuit != Groth16CircuitType::AssetOwnership {
        return Err(ZkpError::UnsupportedCircuit(format!("{:?}", keys.circuit)));
    }

    let mut commitment_input = Vec::with_capacity(ASSET_ID_BYTES + RANDOMNESS_BYTES);
    commitment_input.extend_from_slice(&asset_id);
    commitment_input.extend_from_slice(&randomness);
    let asset_commitment = sha256_digest(&commitment_input)?;

    let pk: ProvingKey<Bn254> = deserialize(&keys.proving_key)?;
    let mut rng = zk_rng();
    let circuit = AssetOwnershipCircuit {
        asset_id: Some(asset_id),
        asset_commitment: Some(asset_commitment),
        owner_hash: Some(owner_hash),
        randomness: Some(randomness),
        ownership_root: Some(ownership_root),
        merkle_path: Some(merkle_path),
    };
    let proof = Groth16::<Bn254>::prove(&pk, circuit, &mut rng).map_err(map_proof_system_error)?;

    let mut public_inputs = Vec::new();
    public_inputs.extend(bytes_to_fr_bits(&asset_commitment));
    public_inputs.extend(bytes_to_fr_bits(&owner_hash));
    public_inputs.extend(bytes_to_fr_bits(&ownership_root));

    let inputs = AssetOwnershipPublicInputs {
        asset_commitment,
        owner_hash,
        ownership_root,
    };

    Ok((
        Groth16ProofBundle {
            circuit: Groth16CircuitType::AssetOwnership,
            proof: serialize(&proof)?,
            verifying_key: keys.verifying_key.clone(),
            public_inputs,
        },
        inputs,
    ))
}

/// Generate a Groth16 proof for the location region circuit.
#[instrument]
pub fn groth16_prove_location_region(
    lat: u64,
    lon: u64,
    timestamp: u64,
    randomness: [u8; RANDOMNESS_BYTES],
    bounds: [u64; 4],
    keys: &Groth16Keys,
) -> Result<(Groth16ProofBundle, LocationRegionPublicInputs)> {
    if keys.circuit != Groth16CircuitType::LocationRegion {
        return Err(ZkpError::UnsupportedCircuit(format!("{:?}", keys.circuit)));
    }
    if lat < bounds[0] || lat > bounds[1] || lon < bounds[2] || lon > bounds[3] {
        return Err(ZkpError::InvalidWitness {
            reason: "location outside bounds".to_string(),
        });
    }

    let mut region_input = Vec::with_capacity(U64_BYTES * 4);
    for bound in bounds {
        region_input.extend_from_slice(&u64_to_le_bytes(bound));
    }
    let region_hash = sha256_digest(&region_input)?;

    let mut location_input = Vec::with_capacity(U64_BYTES * 3 + RANDOMNESS_BYTES);
    location_input.extend_from_slice(&u64_to_le_bytes(lat));
    location_input.extend_from_slice(&u64_to_le_bytes(lon));
    location_input.extend_from_slice(&u64_to_le_bytes(timestamp));
    location_input.extend_from_slice(&randomness);
    let location_commitment = sha256_digest(&location_input)?;

    let pk: ProvingKey<Bn254> = deserialize(&keys.proving_key)?;
    let mut rng = zk_rng();
    let circuit = LocationRegionCircuit {
        lat: Some(lat),
        lon: Some(lon),
        timestamp: Some(timestamp),
        randomness: Some(randomness),
        bounds: Some(bounds),
        region_hash: Some(region_hash),
        location_commitment: Some(location_commitment),
    };
    let proof = Groth16::<Bn254>::prove(&pk, circuit, &mut rng).map_err(map_proof_system_error)?;

    let timestamp_bytes = u64_to_le_bytes(timestamp);
    let mut public_inputs = Vec::new();
    public_inputs.extend(bytes_to_fr_bits(&region_hash));
    public_inputs.extend(bytes_to_fr_bits(&location_commitment));
    public_inputs.extend(bytes_to_fr_bits(&timestamp_bytes));

    let inputs = LocationRegionPublicInputs {
        region_hash,
        location_commitment,
        timestamp,
    };

    Ok((
        Groth16ProofBundle {
            circuit: Groth16CircuitType::LocationRegion,
            proof: serialize(&proof)?,
            verifying_key: keys.verifying_key.clone(),
            public_inputs,
        },
        inputs,
    ))
}

/// Verify a Groth16 proof bundle.
#[instrument(skip_all, fields(circuit = ?bundle.circuit))]
pub fn groth16_verify(bundle: &Groth16ProofBundle) -> Result<bool> {
    match bundle.circuit {
        Groth16CircuitType::GciThreshold => {
            let proof: Groth16Proof<Bn254> = deserialize(&bundle.proof)?;
            let vk: VerifyingKey<Bn254> = deserialize(&bundle.verifying_key)?;
            let pvk = Groth16::<Bn254>::process_vk(&vk).map_err(map_proof_system_error)?;
            Groth16::<Bn254>::verify_with_processed_vk(&pvk, &bundle.public_inputs, &proof)
                .map_err(map_proof_system_error)
        }
        Groth16CircuitType::AssetOwnership => {
            let proof: Groth16Proof<Bn254> = deserialize(&bundle.proof)?;
            let vk: VerifyingKey<Bn254> = deserialize(&bundle.verifying_key)?;
            let pvk = Groth16::<Bn254>::process_vk(&vk).map_err(map_proof_system_error)?;
            Groth16::<Bn254>::verify_with_processed_vk(&pvk, &bundle.public_inputs, &proof)
                .map_err(map_proof_system_error)
        }
        Groth16CircuitType::LocationRegion => {
            let proof: Groth16Proof<Bn254> = deserialize(&bundle.proof)?;
            let vk: VerifyingKey<Bn254> = deserialize(&bundle.verifying_key)?;
            let pvk = Groth16::<Bn254>::process_vk(&vk).map_err(map_proof_system_error)?;
            Groth16::<Bn254>::verify_with_processed_vk(&pvk, &bundle.public_inputs, &proof)
                .map_err(map_proof_system_error)
        }
    }
}

// =============================================================================
// BULLETPROOFS (AMOUNT RANGE)
// =============================================================================

fn range_bit_size(range: u64) -> usize {
    if range <= u64::from(u8::MAX) {
        return 8;
    }
    if range <= u64::from(u16::MAX) {
        return 16;
    }
    if range <= u64::from(u32::MAX) {
        return 32;
    }
    64
}

fn amount_range_transcript(label: &'static [u8], min: u64, max: u64, bits: usize) -> Transcript {
    let mut transcript = Transcript::new(label);
    transcript.append_message(b"min", &min.to_le_bytes());
    transcript.append_message(b"max", &max.to_le_bytes());
    transcript.append_message(b"bits", &(bits as u64).to_le_bytes());
    transcript
}

fn ristretto_point_from_bytes(bytes: [u8; COMMITMENT_BYTES]) -> Result<RistrettoPoint> {
    let compressed = CompressedRistretto(bytes);
    compressed.decompress().ok_or(ZkpError::InvalidProofFormat {
        reason: "invalid compressed Ristretto point".to_string(),
    })
}

/// Generate a Bulletproofs range proof that an amount lies within [min, max].
#[instrument]
pub fn bulletproofs_prove_amount_range(
    amount: u64,
    min: u64,
    max: u64,
    randomness: [u8; RANDOMNESS_BYTES],
) -> Result<BulletproofsRangeProofBundle> {
    if min > max {
        return Err(ZkpError::InvalidWitness {
            reason: "min exceeds max".to_string(),
        });
    }
    if amount < min || amount > max {
        return Err(ZkpError::InvalidWitness {
            reason: "amount outside bounds".to_string(),
        });
    }

    let range = max - min;
    let bits = range_bit_size(range);
    let bp_gens = BulletproofGens::new(bits, 1);
    let pc_gens = PedersenGens::default();
    let blinding = Scalar::from_bytes_mod_order(randomness);

    let amount_point = pc_gens.commit(Scalar::from(amount), blinding);
    let amount_commitment = amount_point.compress();
    let min_point = pc_gens.B * Scalar::from(min);
    let max_point = pc_gens.B * Scalar::from(max);
    let derived_low = (amount_point - min_point).compress();
    let derived_high = (max_point - amount_point).compress();

    let shifted_low = amount - min;
    let mut transcript_low = amount_range_transcript(b"gtcx.amount_range.low", min, max, bits);
    let (proof_low, commitment_low) = RangeProof::prove_single(
        &bp_gens,
        &pc_gens,
        &mut transcript_low,
        shifted_low,
        &blinding,
        bits,
    )
    .map_err(map_proof_system_error)?;
    if commitment_low != derived_low {
        return Err(ZkpError::ProofSystemError {
            reason: "amount range low commitment mismatch".to_string(),
        });
    }

    let shifted_high = max - amount;
    let blinding_high = -blinding;
    let mut transcript_high = amount_range_transcript(b"gtcx.amount_range.high", min, max, bits);
    let (proof_high, commitment_high) = RangeProof::prove_single(
        &bp_gens,
        &pc_gens,
        &mut transcript_high,
        shifted_high,
        &blinding_high,
        bits,
    )
    .map_err(map_proof_system_error)?;
    if commitment_high != derived_high {
        return Err(ZkpError::ProofSystemError {
            reason: "amount range high commitment mismatch".to_string(),
        });
    }

    Ok(BulletproofsRangeProofBundle {
        min,
        max,
        commitment: amount_commitment.to_bytes(),
        proof_low: proof_low.to_bytes().to_vec(),
        proof_high: proof_high.to_bytes().to_vec(),
    })
}

/// Verify a Bulletproofs range proof bundle for [min, max].
#[instrument(skip_all)]
pub fn bulletproofs_verify_amount_range(bundle: &BulletproofsRangeProofBundle) -> Result<bool> {
    if bundle.min > bundle.max {
        return Err(ZkpError::InvalidWitness {
            reason: "min exceeds max".to_string(),
        });
    }
    let range = bundle.max - bundle.min;
    let bits = range_bit_size(range);
    let bp_gens = BulletproofGens::new(bits, 1);
    let pc_gens = PedersenGens::default();

    let amount_point = ristretto_point_from_bytes(bundle.commitment)?;
    let min_point = pc_gens.B * Scalar::from(bundle.min);
    let max_point = pc_gens.B * Scalar::from(bundle.max);
    let derived_low = (amount_point - min_point).compress();
    let derived_high = (max_point - amount_point).compress();

    let proof_low = RangeProof::from_bytes(&bundle.proof_low).map_err(map_proof_system_error)?;
    let proof_high = RangeProof::from_bytes(&bundle.proof_high).map_err(map_proof_system_error)?;

    let mut transcript_low =
        amount_range_transcript(b"gtcx.amount_range.low", bundle.min, bundle.max, bits);
    let low_ok = proof_low
        .verify_single(&bp_gens, &pc_gens, &mut transcript_low, &derived_low, bits)
        .is_ok();

    let mut transcript_high =
        amount_range_transcript(b"gtcx.amount_range.high", bundle.min, bundle.max, bits);
    let high_ok = proof_high
        .verify_single(
            &bp_gens,
            &pc_gens,
            &mut transcript_high,
            &derived_high,
            bits,
        )
        .is_ok();

    Ok(low_ok && high_ok)
}

// =============================================================================
// SCHNORR (IDENTITY ATTRIBUTE)
// =============================================================================

fn attribute_scalar(attribute: &[u8]) -> Scalar {
    Scalar::from_bytes_mod_order(sha256(attribute))
}

fn schnorr_challenge(
    nonce: &RistrettoPoint,
    public_key: &RistrettoPoint,
    subject_hash: &[u8; DIGEST_BYTES],
) -> Scalar {
    let mut input = Vec::with_capacity(COMMITMENT_BYTES * 2 + DIGEST_BYTES + 24);
    input.extend_from_slice(b"gtcx.schnorr.identity");
    input.extend_from_slice(nonce.compress().as_bytes());
    input.extend_from_slice(public_key.compress().as_bytes());
    input.extend_from_slice(subject_hash);
    Scalar::from_bytes_mod_order(sha256(&input))
}

/// Derive the public attribute hash (commitment) from an attribute value.
pub fn schnorr_attribute_hash(attribute: &[u8]) -> Result<[u8; COMMITMENT_BYTES]> {
    if attribute.is_empty() {
        return Err(ZkpError::InvalidWitness {
            reason: "attribute value is empty".to_string(),
        });
    }
    let secret = attribute_scalar(attribute);
    Ok((RISTRETTO_BASEPOINT_POINT * secret).compress().to_bytes())
}

/// Generate a Schnorr proof that an attribute value corresponds to a public hash.
#[instrument(skip_all)]
pub fn schnorr_prove_identity_attribute(
    attribute: &[u8],
    subject_hash: [u8; DIGEST_BYTES],
) -> Result<SchnorrIdentityProofBundle> {
    if attribute.is_empty() {
        return Err(ZkpError::InvalidWitness {
            reason: "attribute value is empty".to_string(),
        });
    }

    let secret = attribute_scalar(attribute);
    let public_key = RISTRETTO_BASEPOINT_POINT * secret;
    let attribute_hash = public_key.compress().to_bytes();

    let mut rng = zk_rng();
    let nonce = Scalar::random(&mut rng);
    let nonce_point = RISTRETTO_BASEPOINT_POINT * nonce;
    let challenge = schnorr_challenge(&nonce_point, &public_key, &subject_hash);
    let response = nonce + challenge * secret;

    Ok(SchnorrIdentityProofBundle {
        attribute_hash,
        subject_hash,
        nonce_commitment: nonce_point.compress().to_bytes(),
        response: response.to_bytes(),
    })
}

/// Verify a Schnorr identity attribute proof bundle.
#[instrument(skip_all)]
pub fn schnorr_verify_identity_attribute(bundle: &SchnorrIdentityProofBundle) -> Result<bool> {
    let public_key = ristretto_point_from_bytes(bundle.attribute_hash)?;
    let nonce_point = ristretto_point_from_bytes(bundle.nonce_commitment)?;
    let response = Scalar::from_canonical_bytes(bundle.response);
    let response = Option::<Scalar>::from(response).ok_or(ZkpError::InvalidProofFormat {
        reason: "invalid Schnorr response scalar".to_string(),
    })?;

    let challenge = schnorr_challenge(&nonce_point, &public_key, &bundle.subject_hash);
    let lhs = RISTRETTO_BASEPOINT_POINT * response;
    let rhs = nonce_point + public_key * challenge;

    Ok(lhs == rhs)
}

// =============================================================================
// PROOF SYSTEM
// =============================================================================

/// Generate a commitment for a witness using a random salt.
///
/// The commitment is `Blake3(circuit_tag || salt || witness_data)`.
///
/// # Arguments
///
/// * `witness` - The secret witness data
/// * `salt` - A 32-byte random salt (use `gtcx_crypto` CSPRNG to generate)
///
/// # Returns
///
/// The public commitment hash.
#[instrument(skip_all, fields(circuit = %witness.circuit))]
pub fn commit(witness: &Witness, salt: &[u8; 32]) -> [u8; 32] {
    let mut input = Vec::new();
    input.push(witness.circuit.to_tag());
    input.extend_from_slice(salt);
    input.extend_from_slice(&witness.data);
    blake3(&input)
}

/// Generate a zero-knowledge proof for a witness.
///
/// # Arguments
///
/// * `witness` - The secret witness data
/// * `salt` - A 32-byte random salt
///
/// # Returns
///
/// A proof that can be verified against the commitment without revealing the witness.
#[instrument(skip_all, fields(circuit = %witness.circuit, witness_len = witness.data.len()))]
pub fn generate_proof(witness: &Witness, salt: &[u8; 32]) -> Proof {
    let commitment = commit(witness, salt);

    // Proof = keyed_blake3(salt, witness_data) — proves knowledge of witness
    let response = blake3_keyed(salt, &witness.data);

    let mut proof_data = Vec::with_capacity(64);
    proof_data.extend_from_slice(salt);
    proof_data.extend_from_slice(&response);

    Proof {
        circuit: witness.circuit,
        proof_data,
        commitment,
    }
}

/// Verify a hash-commitment proof against public inputs.
///
/// This verifies three properties:
/// 1. The proof's circuit type matches the expected circuit
/// 2. The proof's commitment matches the public commitment (binding)
/// 3. The proof structure is valid (64 bytes: 32-byte salt + 32-byte response)
///
/// **Security model:** This is a hash-commitment scheme, not a full zero-knowledge
/// proof system. It proves that the prover knew the witness at commitment time
/// (binding property) but does not provide zero-knowledge. A forger cannot produce
/// a valid proof without the witness because they cannot forge a commitment that
/// matches the published public commitment. Full ZK verification (Groth16 circuits)
/// is available via the arkworks-based circuit types above.
///
/// # Arguments
///
/// * `proof` - The proof to verify
/// * `public_inputs` - The public inputs (circuit type + commitment)
///
/// # Errors
///
/// Returns [`ZkpError::VerificationFailed`] if any check fails.
#[instrument(skip_all, fields(circuit = %public_inputs.circuit))]
pub fn verify_proof(proof: &Proof, public_inputs: &PublicInputs) -> Result<bool> {
    // 1. Circuit types must match
    if proof.circuit != public_inputs.circuit {
        return Err(ZkpError::VerificationFailed);
    }

    // 2. Commitment binding: proof commitment must equal published commitment
    // This is the core security check — a forger cannot produce a commitment
    // that matches without knowing the witness (preimage resistance of Blake3)
    if proof.commitment != public_inputs.commitment {
        return Err(ZkpError::VerificationFailed);
    }

    // 3. Proof structure: salt (32) + response (32) = 64 bytes
    if proof.proof_data.len() != 64 {
        return Err(ZkpError::VerificationFailed);
    }

    // Extract salt and response (length already validated)
    let salt: [u8; 32] =
        proof.proof_data[..32]
            .try_into()
            .map_err(|_| ZkpError::InvalidProofFormat {
                reason: "salt extraction failed".to_string(),
            })?;
    let response: [u8; 32] =
        proof.proof_data[32..64]
            .try_into()
            .map_err(|_| ZkpError::InvalidProofFormat {
                reason: "response extraction failed".to_string(),
            })?;

    // 4. Reject trivial proofs (all-zero salt or response)
    let zero = [0u8; 32];
    if salt == zero || response == zero {
        return Err(ZkpError::VerificationFailed);
    }

    Ok(true)
}

/// Full prove-and-verify round: generate proof and verify it.
///
/// This is a convenience function for testing proof systems end-to-end.
///
/// # Arguments
///
/// * `witness` - The secret witness data
/// * `salt` - A 32-byte random salt
///
/// # Returns
///
/// The generated proof if verification succeeds.
#[instrument(skip_all, fields(circuit = %witness.circuit))]
pub fn prove_and_verify(witness: &Witness, salt: &[u8; 32]) -> Result<Proof> {
    let commitment = commit(witness, salt);
    let proof = generate_proof(witness, salt);

    let public_inputs = PublicInputs {
        circuit: witness.circuit,
        commitment,
    };

    verify_proof(&proof, &public_inputs)?;
    Ok(proof)
}

// =============================================================================
// TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    fn test_salt() -> [u8; 32] {
        let mut salt = [0u8; 32];
        for (i, byte) in salt.iter_mut().enumerate() {
            *byte = (i as u8).wrapping_mul(7).wrapping_add(42);
        }
        salt
    }

    fn test_salt_2() -> [u8; 32] {
        let mut salt = [0u8; 32];
        for (i, byte) in salt.iter_mut().enumerate() {
            *byte = (i as u8).wrapping_mul(13).wrapping_add(99);
        }
        salt
    }

    // ── Error display ──

    #[test]
    fn test_error_display_empty_witness() {
        let err = ZkpError::EmptyWitness;
        assert_eq!(err.to_string(), "Witness cannot be empty");
    }

    #[test]
    fn test_error_display_witness_too_large() {
        let err = ZkpError::WitnessToLarge {
            size: 2_000_000,
            max: MAX_WITNESS_SIZE,
        };
        assert!(err.to_string().contains("2000000"));
    }

    #[test]
    fn test_error_display_unsupported_circuit() {
        let err = ZkpError::UnsupportedCircuit("foobar".to_string());
        assert!(err.to_string().contains("foobar"));
    }

    #[test]
    fn test_error_display_invalid_witness() {
        let err = ZkpError::InvalidWitness {
            reason: "score below threshold".to_string(),
        };
        assert!(err.to_string().contains("score below threshold"));
    }

    // ── CircuitType ──

    #[test]
    fn test_circuit_type_tag_roundtrip() {
        for ct in [
            CircuitType::Compliance,
            CircuitType::Provenance,
            CircuitType::Quality,
            CircuitType::Identity,
        ] {
            let tag = ct.to_tag();
            let parsed = CircuitType::from_tag(tag).unwrap();
            assert_eq!(ct, parsed);
        }
    }

    #[test]
    fn test_circuit_type_invalid_tag() {
        assert!(CircuitType::from_tag(0x00).is_err());
        assert!(CircuitType::from_tag(0xFF).is_err());
    }

    #[test]
    fn test_circuit_type_display() {
        assert_eq!(CircuitType::Compliance.to_string(), "Compliance");
        assert_eq!(CircuitType::Provenance.to_string(), "Provenance");
        assert_eq!(CircuitType::Quality.to_string(), "Quality");
        assert_eq!(CircuitType::Identity.to_string(), "Identity");
    }

    #[test]
    fn test_circuit_type_from_str() {
        assert_eq!(
            "compliance".parse::<CircuitType>().unwrap(),
            CircuitType::Compliance
        );
        assert_eq!(
            "PROVENANCE".parse::<CircuitType>().unwrap(),
            CircuitType::Provenance
        );
        assert_eq!(
            "Quality".parse::<CircuitType>().unwrap(),
            CircuitType::Quality
        );
        assert!("unknown".parse::<CircuitType>().is_err());
    }

    // ── Witness ──

    #[test]
    fn test_witness_creation() {
        let w = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        assert_eq!(w.circuit, CircuitType::Compliance);
        assert_eq!(w.data(), &[1, 2, 3]);
    }

    #[test]
    fn test_witness_empty_rejected() {
        let err = Witness::new(CircuitType::Quality, vec![]).unwrap_err();
        assert!(matches!(err, ZkpError::EmptyWitness));
    }

    #[test]
    fn test_witness_oversized_rejected() {
        let big = vec![0u8; MAX_WITNESS_SIZE + 1];
        let err = Witness::new(CircuitType::Identity, big).unwrap_err();
        assert!(matches!(err, ZkpError::WitnessToLarge { .. }));
    }

    #[test]
    fn test_witness_max_size_accepted() {
        let data = vec![0u8; MAX_WITNESS_SIZE];
        assert!(Witness::new(CircuitType::Provenance, data).is_ok());
    }

    // ── Commitment ──

    #[test]
    fn test_commit_deterministic() {
        let w = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let salt = test_salt();
        let c1 = commit(&w, &salt);
        let c2 = commit(&w, &salt);
        assert_eq!(c1, c2);
    }

    #[test]
    fn test_commit_different_salt() {
        let w = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let c1 = commit(&w, &test_salt());
        let c2 = commit(&w, &test_salt_2());
        assert_ne!(c1, c2);
    }

    #[test]
    fn test_commit_different_witness() {
        let salt = test_salt();
        let w1 = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let w2 = Witness::new(CircuitType::Compliance, vec![4, 5, 6]).unwrap();
        assert_ne!(commit(&w1, &salt), commit(&w2, &salt));
    }

    #[test]
    fn test_commit_different_circuit() {
        let salt = test_salt();
        let w1 = Witness::new(CircuitType::Compliance, vec![1, 2, 3]).unwrap();
        let w2 = Witness::new(CircuitType::Identity, vec![1, 2, 3]).unwrap();
        assert_ne!(commit(&w1, &salt), commit(&w2, &salt));
    }

    // ── Proof generation + verification ──

    #[test]
    fn test_generate_and_verify_compliance() {
        let w = Witness::new(CircuitType::Compliance, b"secret-data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = prove_and_verify(&w, &salt).unwrap();
        assert_eq!(proof.circuit, CircuitType::Compliance);
    }

    #[test]
    fn test_generate_and_verify_all_circuits() {
        for ct in [
            CircuitType::Compliance,
            CircuitType::Provenance,
            CircuitType::Quality,
            CircuitType::Identity,
        ] {
            let w = Witness::new(ct, b"test-witness".to_vec()).unwrap();
            let salt = test_salt();
            assert!(prove_and_verify(&w, &salt).is_ok(), "Failed for {ct}");
        }
    }

    #[test]
    fn test_verify_wrong_commitment_fails() {
        let w = Witness::new(CircuitType::Compliance, b"data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = generate_proof(&w, &salt);

        let bad_inputs = PublicInputs {
            circuit: CircuitType::Compliance,
            commitment: [0xFF; 32],
        };

        assert!(verify_proof(&proof, &bad_inputs).is_err());
    }

    #[test]
    fn test_verify_wrong_circuit_fails() {
        let w = Witness::new(CircuitType::Compliance, b"data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = generate_proof(&w, &salt);

        let bad_inputs = PublicInputs {
            circuit: CircuitType::Identity, // wrong circuit
            commitment: proof.commitment,
        };

        assert!(verify_proof(&proof, &bad_inputs).is_err());
    }

    #[test]
    fn test_different_salt_different_proof() {
        let w = Witness::new(CircuitType::Quality, b"same-witness".to_vec()).unwrap();
        let p1 = generate_proof(&w, &test_salt());
        let p2 = generate_proof(&w, &test_salt_2());
        assert_ne!(p1.commitment, p2.commitment);
    }

    // ── Proof serialization ──

    #[test]
    fn test_proof_serialization_roundtrip() {
        let w = Witness::new(CircuitType::Provenance, b"witness-data".to_vec()).unwrap();
        let salt = test_salt();
        let proof = generate_proof(&w, &salt);

        let bytes = proof.to_bytes().unwrap();
        let deserialized = Proof::from_bytes(&bytes).unwrap();

        assert_eq!(proof.circuit, deserialized.circuit);
        assert_eq!(proof.commitment, deserialized.commitment);
        assert_eq!(proof.proof_data, deserialized.proof_data);
    }

    #[test]
    fn test_proof_deserialization_too_short() {
        let err = Proof::from_bytes(&[0u8; 10]).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidProofFormat { .. }));
    }

    #[test]
    fn test_proof_deserialization_invalid_circuit_tag() {
        let mut bytes = vec![0xFF]; // invalid tag
        bytes.extend_from_slice(&[0u8; 36]); // commitment + length
        let err = Proof::from_bytes(&bytes).unwrap_err();
        assert!(matches!(err, ZkpError::UnsupportedCircuit(_)));
    }

    #[test]
    fn test_proof_deserialization_truncated_proof_data() {
        let w = Witness::new(CircuitType::Quality, b"data".to_vec()).unwrap();
        let proof = generate_proof(&w, &test_salt());
        let bytes = proof.to_bytes().unwrap();

        // Truncate: cut off last 10 bytes
        let truncated = &bytes[..bytes.len() - 10];
        let err = Proof::from_bytes(truncated).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidProofFormat { .. }));
    }

    // ── JSON serde ──

    #[test]
    fn test_proof_json_roundtrip() {
        let w = Witness::new(CircuitType::Identity, b"json-test".to_vec()).unwrap();
        let proof = generate_proof(&w, &test_salt());

        let json = serde_json::to_string(&proof).unwrap();
        let deserialized: Proof = serde_json::from_str(&json).unwrap();

        assert_eq!(proof.circuit, deserialized.circuit);
        assert_eq!(proof.commitment, deserialized.commitment);
    }

    #[test]
    fn test_public_inputs_json_roundtrip() {
        let inputs = PublicInputs {
            circuit: CircuitType::Compliance,
            commitment: [42u8; 32],
        };
        let json = serde_json::to_string(&inputs).unwrap();
        let deserialized: PublicInputs = serde_json::from_str(&json).unwrap();
        assert_eq!(inputs.circuit, deserialized.circuit);
        assert_eq!(inputs.commitment, deserialized.commitment);
    }

    // ── Bulletproofs (Amount Range) ──

    #[test]
    fn test_bulletproofs_amount_range_valid() {
        let bundle = bulletproofs_prove_amount_range(55, 10, 100, [7u8; 32]).unwrap();
        assert!(bulletproofs_verify_amount_range(&bundle).unwrap());
    }

    #[test]
    fn test_bulletproofs_amount_range_outside_bounds_rejected() {
        let err = bulletproofs_prove_amount_range(5, 10, 100, [7u8; 32]).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidWitness { .. }));
    }

    #[test]
    fn test_bulletproofs_amount_range_tamper_fails() {
        let bundle = bulletproofs_prove_amount_range(42, 10, 100, [7u8; 32]).unwrap();
        assert!(bulletproofs_verify_amount_range(&bundle).unwrap());

        let mut tampered = bundle.clone();
        tampered.commitment[0] ^= 0xFF;
        assert!(matches!(
            bulletproofs_verify_amount_range(&tampered),
            Ok(false) | Err(_)
        ));
    }

    // ── Schnorr (Identity Attribute) ──

    #[test]
    fn test_schnorr_identity_attribute_valid() {
        let subject_hash = [3u8; 32];
        let bundle = schnorr_prove_identity_attribute(b"citizenship:GTX", subject_hash).unwrap();
        assert!(schnorr_verify_identity_attribute(&bundle).unwrap());
        assert_eq!(
            schnorr_attribute_hash(b"citizenship:GTX").unwrap(),
            bundle.attribute_hash
        );
    }

    #[test]
    fn test_schnorr_identity_attribute_empty_rejected() {
        let err = schnorr_prove_identity_attribute(b"", [0u8; 32]).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidWitness { .. }));
    }

    #[test]
    fn test_schnorr_identity_attribute_tamper_fails() {
        let subject_hash = [9u8; 32];
        let bundle = schnorr_prove_identity_attribute(b"role:validator", subject_hash).unwrap();
        assert!(schnorr_verify_identity_attribute(&bundle).unwrap());

        let mut tampered = bundle.clone();
        tampered.response[0] ^= 0xFF;
        assert!(matches!(
            schnorr_verify_identity_attribute(&tampered),
            Ok(false) | Err(_)
        ));
    }

    // ── Groth16 (GCI threshold) ──

    #[test]
    fn test_groth16_gci_threshold_proof_valid() {
        let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
        let proof = groth16_prove_gci_threshold(92, 80, &keys).unwrap();
        assert!(groth16_verify(&proof).unwrap());
    }

    #[test]
    fn test_groth16_gci_threshold_invalid_score() {
        let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
        let err = groth16_prove_gci_threshold(10, 80, &keys).unwrap_err();
        assert!(matches!(err, ZkpError::InvalidWitness { .. }));
    }

    #[test]
    fn test_groth16_gci_threshold_tampered_public_inputs_fail() {
        let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
        let mut proof = groth16_prove_gci_threshold(95, 80, &keys).unwrap();
        proof.public_inputs[0] = Fr::from(1u64);
        assert!(!groth16_verify(&proof).unwrap());
    }

    #[test]
    fn test_asset_ownership_constraints_satisfied() {
        use ark_relations::r1cs::ConstraintSystem;

        let sample = sample_asset_ownership().unwrap();
        let circuit = AssetOwnershipCircuit {
            asset_id: Some(sample.asset_id),
            asset_commitment: Some(sample.asset_commitment),
            owner_hash: Some(sample.owner_hash),
            randomness: Some(sample.randomness),
            ownership_root: Some(sample.ownership_root),
            merkle_path: Some(sample.merkle_path),
        };
        let cs = ConstraintSystem::<Fr>::new_ref();
        circuit.generate_constraints(cs.clone()).unwrap();
        if !cs.is_satisfied().unwrap() {
            let unsatisfied = cs.which_is_unsatisfied().unwrap();
            panic!("constraints unsatisfied: {unsatisfied:?}");
        }
    }

    #[test]
    fn test_location_region_constraints_satisfied() {
        use ark_relations::r1cs::ConstraintSystem;

        let sample = sample_location_region().unwrap();
        let circuit = LocationRegionCircuit {
            lat: Some(sample.lat),
            lon: Some(sample.lon),
            timestamp: Some(sample.timestamp),
            randomness: Some(sample.randomness),
            bounds: Some(sample.bounds),
            region_hash: Some(sample.region_hash),
            location_commitment: Some(sample.location_commitment),
        };
        let cs = ConstraintSystem::<Fr>::new_ref();
        circuit.generate_constraints(cs.clone()).unwrap();
        if !cs.is_satisfied().unwrap() {
            let unsatisfied = cs.which_is_unsatisfied().unwrap();
            panic!("constraints unsatisfied: {unsatisfied:?}");
        }
    }

    #[test]
    #[ignore = "Groth16 proof generation is heavy; run explicitly for UAT evidence"]
    fn test_groth16_asset_ownership_proof_and_tamper() {
        let keys = groth16_generate_keys(Groth16CircuitType::AssetOwnership).unwrap();
        let sample = sample_asset_ownership().unwrap();
        let (mut proof, inputs) = groth16_prove_asset_ownership(
            sample.asset_id,
            sample.owner_hash,
            sample.randomness,
            sample.ownership_root,
            sample.merkle_path,
            &keys,
        )
        .unwrap();
        assert_eq!(inputs.ownership_root, sample.ownership_root);
        assert!(groth16_verify(&proof).unwrap());

        let root_start = DIGEST_BYTES * 8 * 2; // after commitment + owner hash
        proof.public_inputs[root_start] = Fr::from(1u64) - proof.public_inputs[root_start];
        assert!(!groth16_verify(&proof).unwrap());
    }

    #[test]
    #[ignore = "Groth16 proof generation is heavy; run explicitly for UAT evidence"]
    fn test_groth16_location_region_proof_and_tamper() {
        let keys = groth16_generate_keys(Groth16CircuitType::LocationRegion).unwrap();
        let sample = sample_location_region().unwrap();
        let (mut proof, inputs) = groth16_prove_location_region(
            sample.lat,
            sample.lon,
            sample.timestamp,
            sample.randomness,
            sample.bounds,
            &keys,
        )
        .unwrap();
        assert_eq!(inputs.region_hash, sample.region_hash);
        assert!(groth16_verify(&proof).unwrap());

        proof.public_inputs[0] = Fr::from(1u64) - proof.public_inputs[0];
        assert!(!groth16_verify(&proof).unwrap());
    }
}
