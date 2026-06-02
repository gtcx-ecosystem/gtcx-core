use super::AssetOwnershipMerkleTree;
use crate::error::{map_proof_system_error, Result, ZkpError};
use crate::types::{
    zk_rng, AssetOwnershipMerkleConfig, ASSET_ID_BYTES, DIGEST_BYTES, OWNER_HASH_BYTES,
    RANDOMNESS_BYTES, U64_BYTES,
};
use ark_bn254::Fr;
use ark_crypto_primitives::crh::sha256::Sha256;
use ark_crypto_primitives::crh::{CRHScheme, TwoToOneCRHScheme};
use ark_crypto_primitives::merkle_tree::Path;
use ark_r1cs_std::uint64::UInt64;
use ark_r1cs_std::uint8::UInt8;
use ark_r1cs_std::ToBitsGadget;
use ark_relations::r1cs::SynthesisError;
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};

use std::io::Cursor;

pub(crate) fn serialize<T: CanonicalSerialize>(value: &T) -> Result<Vec<u8>> {
    let mut bytes = Vec::new();
    value
        .serialize_compressed(&mut bytes)
        .map_err(|err| ZkpError::SerializationError {
            reason: err.to_string(),
        })?;
    Ok(bytes)
}

pub(crate) fn deserialize<T: CanonicalDeserialize>(bytes: &[u8]) -> Result<T> {
    let mut cursor = Cursor::new(bytes);
    T::deserialize_compressed(&mut cursor).map_err(|err| ZkpError::DeserializationError {
        reason: err.to_string(),
    })
}

pub(crate) fn u64_to_fr_bits(value: u64) -> Vec<Fr> {
    (0..64).map(|i| Fr::from((value >> i) & 1)).collect()
}

pub(crate) fn bytes_to_fr_bits(bytes: &[u8]) -> Vec<Fr> {
    let mut bits = Vec::with_capacity(bytes.len() * 8);
    for byte in bytes {
        for i in 0..8 {
            bits.push(Fr::from(u64::from((byte >> i) & 1)));
        }
    }
    bits
}

pub(crate) fn u64_to_le_bytes(value: u64) -> [u8; U64_BYTES] {
    value.to_le_bytes()
}

pub(crate) fn uint64_from_le_bytes(
    bytes: &[UInt8<Fr>],
) -> std::result::Result<UInt64<Fr>, SynthesisError> {
    if bytes.len() != U64_BYTES {
        return Err(SynthesisError::Unsatisfiable);
    }
    let mut bits = Vec::with_capacity(64);
    for byte in bytes {
        bits.extend(byte.to_bits_le()?);
    }
    Ok(UInt64::from_bits_le(&bits))
}

pub(crate) fn vec_to_digest(bytes: Vec<u8>) -> Result<[u8; DIGEST_BYTES]> {
    if bytes.len() != DIGEST_BYTES {
        return Err(ZkpError::InvalidWitness {
            reason: format!("digest length {} != {}", bytes.len(), DIGEST_BYTES),
        });
    }
    let mut digest = [0u8; DIGEST_BYTES];
    digest.copy_from_slice(&bytes);
    Ok(digest)
}

pub(crate) fn sha256_digest(data: &[u8]) -> Result<[u8; DIGEST_BYTES]> {
    let digest =
        <Sha256 as CRHScheme>::evaluate(&(), data).map_err(|_| ZkpError::ProofSystemError {
            reason: "sha256 evaluation failed".to_string(),
        })?;
    let mut out = [0u8; DIGEST_BYTES];
    out.copy_from_slice(&digest);
    Ok(out)
}

/// Sample witness data for asset ownership circuit tests and KAT generation.
pub struct AssetOwnershipSample {
    /// Unique asset identifier.
    pub asset_id: [u8; ASSET_ID_BYTES],
    /// Hash of the asset owner.
    pub owner_hash: [u8; OWNER_HASH_BYTES],
    /// Randomness for commitment blinding.
    pub randomness: [u8; RANDOMNESS_BYTES],
    /// Merkle root of approved ownership tree.
    pub ownership_root: [u8; DIGEST_BYTES],
    /// Merkle path proving asset membership.
    pub merkle_path: Path<AssetOwnershipMerkleConfig>,
    /// Expected asset commitment.
    pub asset_commitment: [u8; DIGEST_BYTES],
}

/// Sample witness data for location region circuit tests and KAT generation.
pub struct LocationRegionSample {
    /// Latitude witness value.
    pub lat: u64,
    /// Longitude witness value.
    pub lon: u64,
    /// Timestamp witness value.
    pub timestamp: u64,
    /// Randomness for location commitment blinding.
    pub randomness: [u8; RANDOMNESS_BYTES],
    /// GPS bounds: [min_lat, max_lat, min_lon, max_lon].
    pub bounds: [u64; 4],
    /// Expected region hash (SHA-256 of bounds).
    pub region_hash: [u8; DIGEST_BYTES],
    /// Expected location commitment.
    pub location_commitment: [u8; DIGEST_BYTES],
}

/// Generate a sample asset ownership witness for testing and KAT generation.
pub fn sample_asset_ownership() -> Result<AssetOwnershipSample> {
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

/// Generate a sample location region witness for testing and KAT generation.
pub fn sample_location_region() -> Result<LocationRegionSample> {
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

/// Sample witness data for commodity origin circuit tests and KAT generation.
pub struct CommodityOriginSample {
    /// Commodity type identifier (e.g., 0 = gold, 1 = diamond).
    pub commodity_type: u64,
    /// Unique mine identifier.
    pub mine_id: [u8; ASSET_ID_BYTES],
    /// Latitude witness value.
    pub lat: u64,
    /// Longitude witness value.
    pub lon: u64,
    /// Primary quality metric (e.g., purity score).
    pub primary_metric: u64,
    /// Secondary quality metric (e.g., weight in grams).
    pub secondary_metric: u64,
    /// Randomness for primary commitment blinding.
    pub primary_randomness: [u8; RANDOMNESS_BYTES],
    /// Randomness for secondary commitment blinding.
    pub secondary_randomness: [u8; RANDOMNESS_BYTES],
    /// Randomness for location commitment blinding.
    pub location_randomness: [u8; RANDOMNESS_BYTES],
    /// GPS bounds: [min_lat, max_lat, min_lon, max_lon].
    pub bounds: [u64; 4],
    /// Minimum required primary metric.
    pub min_primary: u64,
    /// Minimum required secondary metric.
    pub min_secondary: u64,
    /// Certification bit flags.
    pub certification_flags: u64,
    /// Expected region hash (SHA-256 of bounds).
    pub region_hash: [u8; DIGEST_BYTES],
    /// Expected primary commitment.
    pub primary_commitment: [u8; DIGEST_BYTES],
    /// Expected secondary commitment.
    pub secondary_commitment: [u8; DIGEST_BYTES],
    /// Merkle root of approved mines tree.
    pub mines_root: [u8; DIGEST_BYTES],
    /// Merkle path proving mine membership.
    pub merkle_path: Path<AssetOwnershipMerkleConfig>,
}

/// Generate a sample commodity origin witness for testing and KAT vector generation.
pub fn sample_commodity_origin() -> Result<CommodityOriginSample> {
    let commodity_type = 0u64; // 0 = gold
    let mine_id = [1u8; ASSET_ID_BYTES];
    let lat = 15u64;
    let lon = 35u64;
    let primary_metric = 995u64; // 99.5% purity
    let secondary_metric = 1_000u64; // 1kg in grams
    let primary_randomness = [10u8; RANDOMNESS_BYTES];
    let secondary_randomness = [11u8; RANDOMNESS_BYTES];
    let location_randomness = [12u8; RANDOMNESS_BYTES];
    let bounds = [10u64, 20u64, 30u64, 40u64];
    let min_primary = 950u64;
    let min_secondary = 500u64;
    let certification_flags = 0u64; // no certifications for gold sample

    // Compute commitments
    let mut primary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
    primary_input.extend_from_slice(&u64_to_le_bytes(primary_metric));
    primary_input.extend_from_slice(&primary_randomness);
    let primary_commitment = sha256_digest(&primary_input)?;

    let mut secondary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
    secondary_input.extend_from_slice(&u64_to_le_bytes(secondary_metric));
    secondary_input.extend_from_slice(&secondary_randomness);
    let secondary_commitment = sha256_digest(&secondary_input)?;

    let mut region_input = Vec::with_capacity(U64_BYTES * 4);
    for bound in bounds {
        region_input.extend_from_slice(&u64_to_le_bytes(bound));
    }
    let region_hash = sha256_digest(&region_input)?;

    // Build Merkle tree with mine_id || padding leaves
    let make_leaf = |id: [u8; ASSET_ID_BYTES]| {
        let mut leaf = Vec::with_capacity(ASSET_ID_BYTES + OWNER_HASH_BYTES);
        leaf.extend_from_slice(&id);
        leaf.extend_from_slice(&[0u8; OWNER_HASH_BYTES]);
        leaf
    };

    let leaves = [
        make_leaf(mine_id),
        make_leaf([2u8; ASSET_ID_BYTES]),
        make_leaf([3u8; ASSET_ID_BYTES]),
        make_leaf([4u8; ASSET_ID_BYTES]),
    ];

    let mut rng = zk_rng();
    <Sha256 as CRHScheme>::setup(&mut rng).map_err(map_proof_system_error)?;
    <Sha256 as TwoToOneCRHScheme>::setup(&mut rng).map_err(map_proof_system_error)?;
    let tree = AssetOwnershipMerkleTree::new(&(), &(), leaves.iter().map(|leaf| leaf.as_slice()))
        .map_err(map_proof_system_error)?;
    let mines_root = vec_to_digest(tree.root())?;
    let merkle_path = tree.generate_proof(0).map_err(map_proof_system_error)?;

    Ok(CommodityOriginSample {
        commodity_type,
        mine_id,
        lat,
        lon,
        primary_metric,
        secondary_metric,
        primary_randomness,
        secondary_randomness,
        location_randomness,
        bounds,
        min_primary,
        min_secondary,
        certification_flags,
        region_hash,
        primary_commitment,
        secondary_commitment,
        mines_root,
        merkle_path,
    })
}

/// Create a sample diamond origin witness using the generic commodity origin circuit.
/// Returns a `CommodityOriginSample` with commodity_type = 1 (diamond) and KP flag set.
#[cfg(test)]
pub fn sample_diamond_origin() -> Result<CommodityOriginSample> {
    let commodity_type = 1u64; // 1 = diamond
    let mine_id = [2u8; ASSET_ID_BYTES];
    let lat = 18u64;
    let lon = 30u64;
    let primary_metric = 85u64; // VVS1+ clarity score
    let secondary_metric = 500u64; // 0.5 carat in centi-carats
    let primary_randomness = [13u8; RANDOMNESS_BYTES];
    let secondary_randomness = [14u8; RANDOMNESS_BYTES];
    let location_randomness = [15u8; RANDOMNESS_BYTES];
    let bounds = [15u64, 25u64, 25u64, 35u64];
    let min_primary = 70u64;
    let min_secondary = 100u64;
    let certification_flags = 1u64; // bit 0 = KP certified

    // Compute commitments
    let mut primary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
    primary_input.extend_from_slice(&u64_to_le_bytes(primary_metric));
    primary_input.extend_from_slice(&primary_randomness);
    let primary_commitment = sha256_digest(&primary_input)?;

    let mut secondary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
    secondary_input.extend_from_slice(&u64_to_le_bytes(secondary_metric));
    secondary_input.extend_from_slice(&secondary_randomness);
    let secondary_commitment = sha256_digest(&secondary_input)?;

    let mut region_input = Vec::with_capacity(U64_BYTES * 4);
    for bound in bounds {
        region_input.extend_from_slice(&u64_to_le_bytes(bound));
    }
    let region_hash = sha256_digest(&region_input)?;

    // Build Merkle tree with mine_id || padding leaves
    let make_leaf = |id: [u8; ASSET_ID_BYTES]| {
        let mut leaf = Vec::with_capacity(ASSET_ID_BYTES + OWNER_HASH_BYTES);
        leaf.extend_from_slice(&id);
        leaf.extend_from_slice(&[0u8; OWNER_HASH_BYTES]);
        leaf
    };

    let leaves = [
        make_leaf([1u8; ASSET_ID_BYTES]),
        make_leaf(mine_id),
        make_leaf([3u8; ASSET_ID_BYTES]),
        make_leaf([4u8; ASSET_ID_BYTES]),
    ];

    let mut rng = zk_rng();
    <Sha256 as CRHScheme>::setup(&mut rng).map_err(map_proof_system_error)?;
    <Sha256 as TwoToOneCRHScheme>::setup(&mut rng).map_err(map_proof_system_error)?;
    let tree = AssetOwnershipMerkleTree::new(&(), &(), leaves.iter().map(|leaf| leaf.as_slice()))
        .map_err(map_proof_system_error)?;
    let mines_root = vec_to_digest(tree.root())?;
    let merkle_path = tree.generate_proof(1).map_err(map_proof_system_error)?;

    Ok(CommodityOriginSample {
        commodity_type,
        mine_id,
        lat,
        lon,
        primary_metric,
        secondary_metric,
        primary_randomness,
        secondary_randomness,
        location_randomness,
        bounds,
        min_primary,
        min_secondary,
        certification_flags,
        region_hash,
        primary_commitment,
        secondary_commitment,
        mines_root,
        merkle_path,
    })
}
