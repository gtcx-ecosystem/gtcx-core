//! Groth16 circuits and operations (arkworks).

use crate::error::{map_proof_system_error, Result, ZkpError};
use crate::types::{
    AssetOwnershipMerkleConfig, AssetOwnershipPublicInputs,
    DIGEST_BYTES, Groth16CircuitType, Groth16Keys, Groth16ProofBundle, LocationRegionPublicInputs,
    ASSET_ID_BYTES, OWNER_HASH_BYTES, RANDOMNESS_BYTES, U64_BYTES, zk_rng,
};
use ark_bn254::{Bn254, Fr};
use ark_crypto_primitives::crh::sha256::constraints::{DigestVar, Sha256Gadget, UnitVar};
use ark_crypto_primitives::crh::sha256::Sha256;
use ark_crypto_primitives::crh::{CRHScheme, CRHSchemeGadget, TwoToOneCRHScheme};
use ark_crypto_primitives::merkle_tree::constraints::{BytesVarDigestConverter, ConfigGadget, PathVar};
use ark_crypto_primitives::merkle_tree::{MerkleTree, Path};
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

use std::io::Cursor;
use tracing::instrument;

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

type AssetOwnershipMerkleTree = MerkleTree<AssetOwnershipMerkleConfig>;

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

pub(crate) struct AssetOwnershipSample {
    pub(crate) asset_id: [u8; ASSET_ID_BYTES],
    pub(crate) owner_hash: [u8; OWNER_HASH_BYTES],
    pub(crate) randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) ownership_root: [u8; DIGEST_BYTES],
    pub(crate) merkle_path: Path<AssetOwnershipMerkleConfig>,
    pub(crate) asset_commitment: [u8; DIGEST_BYTES],
}

pub(crate) struct LocationRegionSample {
    pub(crate) lat: u64,
    pub(crate) lon: u64,
    pub(crate) timestamp: u64,
    pub(crate) randomness: [u8; RANDOMNESS_BYTES],
    pub(crate) bounds: [u64; 4],
    pub(crate) region_hash: [u8; DIGEST_BYTES],
    pub(crate) location_commitment: [u8; DIGEST_BYTES],
}

pub(crate) fn sample_asset_ownership() -> Result<AssetOwnershipSample> {
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

pub(crate) fn sample_location_region() -> Result<LocationRegionSample> {
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
