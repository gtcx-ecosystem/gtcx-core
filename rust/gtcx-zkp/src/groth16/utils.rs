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

pub struct AssetOwnershipSample {
    pub(crate) asset_id: [u8; ASSET_ID_BYTES],
    pub(crate) owner_hash: [u8; OWNER_HASH_BYTES],
    pub(crate) randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) ownership_root: [u8; DIGEST_BYTES],
    pub(crate) merkle_path: Path<AssetOwnershipMerkleConfig>,
    pub(crate) asset_commitment: [u8; DIGEST_BYTES],
}

pub struct LocationRegionSample {
    pub(crate) lat: u64,
    pub(crate) lon: u64,
    pub(crate) timestamp: u64,
    pub(crate) randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) bounds: [u64; 4],
    pub(crate) region_hash: [u8; DIGEST_BYTES],
    pub(crate) location_commitment: [u8; DIGEST_BYTES],
}

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

pub struct CommodityOriginSample {
    pub(crate) mine_id: [u8; ASSET_ID_BYTES],
    pub(crate) lat: u64,
    pub(crate) lon: u64,
    pub(crate) purity: u64,
    pub(crate) weight: u64,
    pub(crate) purity_randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) weight_randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) location_randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) bounds: [u64; 4],
    pub(crate) min_purity: u64,
    pub(crate) min_weight: u64,
    pub(crate) region_hash: [u8; DIGEST_BYTES],
    pub(crate) purity_commitment: [u8; DIGEST_BYTES],
    pub(crate) weight_commitment: [u8; DIGEST_BYTES],
    pub(crate) mines_root: [u8; DIGEST_BYTES],
    pub(crate) merkle_path: Path<AssetOwnershipMerkleConfig>,
}

pub fn sample_commodity_origin() -> Result<CommodityOriginSample> {
    let mine_id = [1u8; ASSET_ID_BYTES];
    let lat = 15u64;
    let lon = 35u64;
    let purity = 995u64; // 99.5%
    let weight = 1_000u64; // 1kg in grams
    let purity_randomness = [10u8; RANDOMNESS_BYTES];
    let weight_randomness = [11u8; RANDOMNESS_BYTES];
    let location_randomness = [12u8; RANDOMNESS_BYTES];
    let bounds = [10u64, 20u64, 30u64, 40u64];
    let min_purity = 950u64;
    let min_weight = 500u64;

    // Compute commitments
    let mut purity_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
    purity_input.extend_from_slice(&u64_to_le_bytes(purity));
    purity_input.extend_from_slice(&purity_randomness);
    let purity_commitment = sha256_digest(&purity_input)?;

    let mut weight_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
    weight_input.extend_from_slice(&u64_to_le_bytes(weight));
    weight_input.extend_from_slice(&weight_randomness);
    let weight_commitment = sha256_digest(&weight_input)?;

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
        mine_id,
        lat,
        lon,
        purity,
        weight,
        purity_randomness,
        weight_randomness,
        location_randomness,
        bounds,
        min_purity,
        min_weight,
        region_hash,
        purity_commitment,
        weight_commitment,
        mines_root,
        merkle_path,
    })
}
