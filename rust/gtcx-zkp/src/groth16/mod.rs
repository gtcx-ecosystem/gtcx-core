//! Groth16 circuits and operations (arkworks).

use crate::error::{map_proof_system_error, Result, ZkpError};
use crate::types::{
    zk_rng, AssetOwnershipMerkleConfig, AssetOwnershipPublicInputs, Groth16CircuitType,
    Groth16Keys, Groth16ProofBundle, LocationRegionPublicInputs, ASSET_ID_BYTES, DIGEST_BYTES,
    OWNER_HASH_BYTES, RANDOMNESS_BYTES, U64_BYTES,
};
use ark_bn254::{Bn254, Fr};
use ark_crypto_primitives::crh::sha256::constraints::{DigestVar, Sha256Gadget, UnitVar};
use ark_crypto_primitives::crh::sha256::Sha256;
use ark_crypto_primitives::crh::CRHSchemeGadget;
use ark_crypto_primitives::merkle_tree::constraints::{
    BytesVarDigestConverter, ConfigGadget, PathVar,
};
use ark_crypto_primitives::merkle_tree::{MerkleTree, Path};
use ark_ff::Field;
use ark_groth16::{Groth16, Proof as Groth16Proof, ProvingKey, VerifyingKey};
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::boolean::Boolean;
use ark_r1cs_std::eq::EqGadget;
use ark_r1cs_std::uint64::UInt64;
use ark_r1cs_std::uint8::UInt8;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use ark_snark::SNARK;

#[derive(Clone)]
pub(crate) struct GciThresholdCircuit {
    pub(crate) score: Option<u64>,
    pub(crate) threshold: Option<u64>,
}

#[derive(Clone)]
pub(crate) struct AssetOwnershipCircuit {
    pub(crate) asset_id: Option<[u8; ASSET_ID_BYTES]>,
    pub(crate) asset_commitment: Option<[u8; DIGEST_BYTES]>,
    pub(crate) owner_hash: Option<[u8; OWNER_HASH_BYTES]>,
    pub(crate) randomness: Option<[u8; RANDOMNESS_BYTES]>,
    pub(crate) ownership_root: Option<[u8; DIGEST_BYTES]>,
    pub(crate) merkle_path: Option<Path<AssetOwnershipMerkleConfig>>,
}

#[derive(Clone)]
pub(crate) struct LocationRegionCircuit {
    pub(crate) lat: Option<u64>,
    pub(crate) lon: Option<u64>,
    pub(crate) timestamp: Option<u64>,
    pub(crate) randomness: Option<[u8; RANDOMNESS_BYTES]>,
    pub(crate) bounds: Option<[u64; 4]>, // min_lat, max_lat, min_lon, max_lon
    pub(crate) region_hash: Option<[u8; DIGEST_BYTES]>,
    pub(crate) location_commitment: Option<[u8; DIGEST_BYTES]>,
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

pub(crate) type AssetOwnershipMerkleTree = MerkleTree<AssetOwnershipMerkleConfig>;

pub(crate) fn uint64_is_ge<F: Field>(
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

mod utils;
use utils::*;
pub use utils::{sample_asset_ownership, sample_location_region};

mod ops;
pub use ops::*;
