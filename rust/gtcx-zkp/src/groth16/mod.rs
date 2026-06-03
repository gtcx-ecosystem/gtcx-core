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

/// Commodity origin circuit — commodity-agnostic proof that a mine is in an approved set,
/// within a licensed region, and meets quality thresholds, without revealing the exact
/// mine ID, GPS coordinates, or measurements.
///
/// Primary and secondary metrics are interpreted by the verifier based on `commodity_type`
/// (e.g., 0 = gold: purity/weight, 1 = diamond: clarity/carat).
/// Certification flags are enforced off-chain by the verifier.
#[derive(Clone)]
pub(crate) struct CommodityOriginCircuit {
    pub(crate) commodity_type: Option<u64>,
    pub(crate) mine_id: Option<[u8; ASSET_ID_BYTES]>,
    pub(crate) lat: Option<u64>,
    pub(crate) lon: Option<u64>,
    pub(crate) primary_metric: Option<u64>,
    pub(crate) secondary_metric: Option<u64>,
    pub(crate) primary_randomness: Option<[u8; RANDOMNESS_BYTES]>,
    pub(crate) secondary_randomness: Option<[u8; RANDOMNESS_BYTES]>,
    pub(crate) location_randomness: Option<[u8; RANDOMNESS_BYTES]>,
    pub(crate) bounds: Option<[u64; 4]>,
    pub(crate) min_primary: Option<u64>,
    pub(crate) min_secondary: Option<u64>,
    pub(crate) certification_flags: Option<u64>,
    pub(crate) region_hash: Option<[u8; DIGEST_BYTES]>,
    pub(crate) primary_commitment: Option<[u8; DIGEST_BYTES]>,
    pub(crate) secondary_commitment: Option<[u8; DIGEST_BYTES]>,
    pub(crate) mines_root: Option<[u8; DIGEST_BYTES]>,
    pub(crate) merkle_path: Option<Path<AssetOwnershipMerkleConfig>>,
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

impl ConstraintSynthesizer<Fr> for CommodityOriginCircuit {
    fn generate_constraints(
        self,
        cs: ConstraintSystemRef<Fr>,
    ) -> std::result::Result<(), SynthesisError> {
        // Public inputs
        let _commodity_type = UInt64::new_input(cs.clone(), || {
            self.commodity_type.ok_or(SynthesisError::AssignmentMissing)
        })?;
        let region_hash = DigestVar::new_input(cs.clone(), || {
            self.region_hash
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let primary_commitment = DigestVar::new_input(cs.clone(), || {
            self.primary_commitment
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let secondary_commitment = DigestVar::new_input(cs.clone(), || {
            self.secondary_commitment
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let mines_root = DigestVar::new_input(cs.clone(), || {
            self.mines_root
                .map(|v| v.to_vec())
                .ok_or(SynthesisError::AssignmentMissing)
        })?;
        let min_primary = UInt64::new_input(cs.clone(), || {
            self.min_primary.ok_or(SynthesisError::AssignmentMissing)
        })?;
        let min_secondary = UInt64::new_input(cs.clone(), || {
            self.min_secondary.ok_or(SynthesisError::AssignmentMissing)
        })?;
        let _certification_flags = UInt64::new_input(cs.clone(), || {
            self.certification_flags
                .ok_or(SynthesisError::AssignmentMissing)
        })?;

        // Witness: mine_id
        let mine_id_bytes: Vec<UInt8<Fr>> = (0..ASSET_ID_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.mine_id
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        // Witness: GPS coordinates
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

        // Witness: primary and secondary metrics
        let primary_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.primary_metric
                        .map(|v| u64_to_le_bytes(v)[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;
        let secondary_bytes: Vec<UInt8<Fr>> = (0..U64_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.secondary_metric
                        .map(|v| u64_to_le_bytes(v)[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        // Witness: randomness values
        let primary_randomness_bytes: Vec<UInt8<Fr>> = (0..RANDOMNESS_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.primary_randomness
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;
        let secondary_randomness_bytes: Vec<UInt8<Fr>> = (0..RANDOMNESS_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.secondary_randomness
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;
        let location_randomness_bytes: Vec<UInt8<Fr>> = (0..RANDOMNESS_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    self.location_randomness
                        .map(|v| v[i])
                        .ok_or(SynthesisError::AssignmentMissing)
                })
            })
            .collect::<std::result::Result<_, _>>()?;

        // Witness: bounds
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

        // Reconstruct UInt64s for comparisons
        let lat = uint64_from_le_bytes(&lat_bytes)?;
        let lon = uint64_from_le_bytes(&lon_bytes)?;
        let min_lat = uint64_from_le_bytes(&min_lat_bytes)?;
        let max_lat = uint64_from_le_bytes(&max_lat_bytes)?;
        let min_lon = uint64_from_le_bytes(&min_lon_bytes)?;
        let max_lon = uint64_from_le_bytes(&max_lon_bytes)?;
        let primary_metric = uint64_from_le_bytes(&primary_bytes)?;
        let secondary_metric = uint64_from_le_bytes(&secondary_bytes)?;

        // 1. GPS within bounds
        let lat_ge_min = uint64_is_ge(&lat, &min_lat)?;
        let max_ge_lat = uint64_is_ge(&max_lat, &lat)?;
        let lon_ge_min = uint64_is_ge(&lon, &min_lon)?;
        let max_ge_lon = uint64_is_ge(&max_lon, &lon)?;
        lat_ge_min.enforce_equal(&Boolean::constant(true))?;
        max_ge_lat.enforce_equal(&Boolean::constant(true))?;
        lon_ge_min.enforce_equal(&Boolean::constant(true))?;
        max_ge_lon.enforce_equal(&Boolean::constant(true))?;

        // 2. Primary metric >= min_primary
        let primary_ge_min = uint64_is_ge(&primary_metric, &min_primary)?;
        primary_ge_min.enforce_equal(&Boolean::constant(true))?;

        // 3. Secondary metric >= min_secondary
        let secondary_ge_min = uint64_is_ge(&secondary_metric, &min_secondary)?;
        secondary_ge_min.enforce_equal(&Boolean::constant(true))?;

        // 4. Verify primary_commitment = SHA-256(primary_metric || primary_randomness)
        let unit = UnitVar::new_constant(cs.clone(), ())?;
        let mut primary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
        primary_input.extend_from_slice(&primary_bytes);
        primary_input.extend_from_slice(&primary_randomness_bytes);
        let computed_primary_commitment =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &primary_input)?;
        computed_primary_commitment.enforce_equal(&primary_commitment)?;

        // 5. Verify secondary_commitment = SHA-256(secondary_metric || secondary_randomness)
        let mut secondary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
        secondary_input.extend_from_slice(&secondary_bytes);
        secondary_input.extend_from_slice(&secondary_randomness_bytes);
        let computed_secondary_commitment =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &secondary_input)?;
        computed_secondary_commitment.enforce_equal(&secondary_commitment)?;

        // 6. Verify location_commitment = SHA-256(lat || lon || location_randomness)
        let mut location_input = Vec::with_capacity(U64_BYTES * 2 + RANDOMNESS_BYTES);
        location_input.extend_from_slice(&lat_bytes);
        location_input.extend_from_slice(&lon_bytes);
        location_input.extend_from_slice(&location_randomness_bytes);
        let computed_location_commitment =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &location_input)?;
        let location_commitment_bytes: Vec<UInt8<Fr>> = (0..DIGEST_BYTES)
            .map(|i| {
                UInt8::new_witness(cs.clone(), || {
                    let mut hasher_input = Vec::with_capacity(U64_BYTES * 2 + RANDOMNESS_BYTES);
                    hasher_input.extend_from_slice(&u64_to_le_bytes(
                        self.lat.ok_or(SynthesisError::AssignmentMissing)?,
                    ));
                    hasher_input.extend_from_slice(&u64_to_le_bytes(
                        self.lon.ok_or(SynthesisError::AssignmentMissing)?,
                    ));
                    hasher_input.extend_from_slice(
                        &self
                            .location_randomness
                            .ok_or(SynthesisError::AssignmentMissing)?,
                    );
                    let hash = sha256_digest(&hasher_input)
                        .map_err(|_| SynthesisError::AssignmentMissing)?;
                    Ok(hash[i])
                })
            })
            .collect::<std::result::Result<_, _>>()?;
        let location_commitment_var = DigestVar(location_commitment_bytes);
        computed_location_commitment.enforce_equal(&location_commitment_var)?;

        // 7. Verify region_hash = SHA-256(bounds)
        let mut region_input = Vec::with_capacity(U64_BYTES * 4);
        region_input.extend_from_slice(&min_lat_bytes);
        region_input.extend_from_slice(&max_lat_bytes);
        region_input.extend_from_slice(&min_lon_bytes);
        region_input.extend_from_slice(&max_lon_bytes);
        let computed_region =
            <Sha256Gadget<Fr> as CRHSchemeGadget<Sha256, Fr>>::evaluate(&unit, &region_input)?;
        computed_region.enforce_equal(&region_hash)?;

        // 8. Merkle membership: mine_id is in approved mines tree
        // Build leaf: mine_id || [0u8; 32] to match AssetOwnershipMerkleConfig leaf size
        let padding_bytes: Vec<UInt8<Fr>> = (0..OWNER_HASH_BYTES)
            .map(|_i| UInt8::new_witness(cs.clone(), || Ok(0u8)))
            .collect::<std::result::Result<_, _>>()?;
        let mut leaf_bytes = Vec::with_capacity(ASSET_ID_BYTES + OWNER_HASH_BYTES);
        leaf_bytes.extend_from_slice(&mine_id_bytes);
        leaf_bytes.extend_from_slice(&padding_bytes);

        let path = PathVar::<AssetOwnershipMerkleConfig, Fr, AssetOwnershipMerkleConfigGadget>::new_witness(
            cs.clone(),
            || self.merkle_path.ok_or(SynthesisError::AssignmentMissing),
        )?;
        let is_member = path.verify_membership(&unit, &unit, &mines_root, leaf_bytes.as_slice())?;
        is_member.enforce_equal(&Boolean::constant(true))?;

        Ok(())
    }
}

mod utils;
pub(crate) use utils::sha256_digest;
#[cfg(test)]
pub use utils::sample_diamond_origin;
use utils::*;
pub(crate) use utils::serialize;
pub use utils::{sample_asset_ownership, sample_commodity_origin, sample_location_region};

mod ops;
pub use ops::*;
