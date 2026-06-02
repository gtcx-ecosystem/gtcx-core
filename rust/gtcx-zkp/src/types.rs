//! Core types and constants for the GTCX ZKP system.

use crate::error::{Result, ZkpError};
use ark_bn254::Fr;
use ark_crypto_primitives::crh::sha256::Sha256;
use ark_crypto_primitives::crh::{CRHScheme, TwoToOneCRHScheme};
use ark_crypto_primitives::merkle_tree::{Config, DigestConverter};
use curve25519_dalek::ristretto::{CompressedRistretto, RistrettoPoint};
use serde::{Deserialize, Serialize};

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
    pub(crate) data: Vec<u8>,
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
    pub(crate) proof_data: Vec<u8>,
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

/// Supported Groth16 circuits.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum Groth16CircuitType {
    /// Prove that a GCI score is greater than or equal to a public threshold.
    GciThreshold,
    /// Prove asset ownership via Merkle membership.
    AssetOwnership,
    /// Prove location lies within a licensed region.
    LocationRegion,
    /// Prove commodity origin: mine in approved set, within region, meets thresholds.
    /// Commodity-agnostic — works for gold, diamonds, coltan, etc.
    CommodityOrigin,
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

/// Bulletproofs commodity range proof bundle with commodity and unit commitments.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BulletproofsCommodityRangeBundle {
    /// Minimum allowed quantity (inclusive).
    pub min: u64,
    /// Maximum allowed quantity (inclusive).
    pub max: u64,
    /// Pedersen commitment to the quantity.
    pub commitment: [u8; COMMITMENT_BYTES],
    /// Hash of the commodity type (e.g. "gold", "diamonds").
    pub commodity_hash: [u8; DIGEST_BYTES],
    /// Hash of the unit of measurement (e.g. "grams", "carats").
    pub unit_hash: [u8; DIGEST_BYTES],
    /// Range proof for (quantity - min).
    pub proof_low: Vec<u8>,
    /// Range proof for (max - quantity).
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

/// Public inputs for the commodity origin circuit.
/// Commodity-agnostic — primary/secondary metrics are interpreted by the verifier
/// based on `commodity_type` (e.g., 0 = gold: purity/weight, 1 = diamond: clarity/carat).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CommodityOriginPublicInputs {
    /// Commodity type discriminator (0 = gold, 1 = diamond, etc.).
    pub commodity_type: u64,
    /// Hash of the region bounds (min/max lat/lon).
    pub region_hash: [u8; DIGEST_BYTES],
    /// Commitment to the primary quality metric.
    pub primary_commitment: [u8; DIGEST_BYTES],
    /// Commitment to the secondary quality metric.
    pub secondary_commitment: [u8; DIGEST_BYTES],
    /// Merkle root of approved mines.
    pub mines_root: [u8; DIGEST_BYTES],
    /// Minimum primary threshold.
    pub min_primary: u64,
    /// Minimum secondary threshold.
    pub min_secondary: u64,
    /// Certification flags bitmask (bit 0 = KP certified, etc.).
    pub certification_flags: u64,
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

pub(crate) fn zk_rng() -> ark_std::rand::rngs::StdRng {
    use ark_std::rand::{RngCore, SeedableRng};
    let mut seed = [0u8; 32];
    ark_std::rand::rngs::OsRng.fill_bytes(&mut seed);
    ark_std::rand::rngs::StdRng::from_seed(seed)
}

pub(crate) fn ristretto_point_from_bytes(bytes: [u8; COMMITMENT_BYTES]) -> Result<RistrettoPoint> {
    let compressed = CompressedRistretto(bytes);
    compressed.decompress().ok_or(ZkpError::InvalidProofFormat {
        reason: "invalid compressed Ristretto point".to_string(),
    })
}
