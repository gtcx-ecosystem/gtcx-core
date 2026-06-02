//! Groth16 public API: key generation, proving, and verification.

use super::*;
use crate::types::CommodityOriginPublicInputs;
use tracing::instrument;

/// Generate proving and verifying keys for a Groth16 circuit.
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
        Groth16CircuitType::CommodityOrigin => {
            let mut rng = zk_rng();
            let sample = sample_commodity_origin()?;
            let circuit_impl = CommodityOriginCircuit {
                mine_id: Some(sample.mine_id),
                lat: Some(sample.lat),
                lon: Some(sample.lon),
                purity: Some(sample.purity),
                weight: Some(sample.weight),
                purity_randomness: Some(sample.purity_randomness),
                weight_randomness: Some(sample.weight_randomness),
                location_randomness: Some(sample.location_randomness),
                bounds: Some(sample.bounds),
                min_purity: Some(sample.min_purity),
                min_weight: Some(sample.min_weight),
                region_hash: Some(sample.region_hash),
                purity_commitment: Some(sample.purity_commitment),
                weight_commitment: Some(sample.weight_commitment),
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

/// Generate a Groth16 proof for the commodity origin circuit.
#[instrument]
pub fn groth16_prove_commodity_origin(
    mine_id: [u8; ASSET_ID_BYTES],
    lat: u64,
    lon: u64,
    purity: u64,
    weight: u64,
    purity_randomness: [u8; RANDOMNESS_BYTES],
    weight_randomness: [u8; RANDOMNESS_BYTES],
    location_randomness: [u8; RANDOMNESS_BYTES],
    bounds: [u64; 4],
    min_purity: u64,
    min_weight: u64,
    merkle_path: Path<AssetOwnershipMerkleConfig>,
    keys: &Groth16Keys,
) -> Result<(Groth16ProofBundle, CommodityOriginPublicInputs)> {
    if keys.circuit != Groth16CircuitType::CommodityOrigin {
        return Err(ZkpError::UnsupportedCircuit(format!("{:?}", keys.circuit)));
    }
    if lat < bounds[0] || lat > bounds[1] || lon < bounds[2] || lon > bounds[3] {
        return Err(ZkpError::InvalidWitness {
            reason: "location outside bounds".to_string(),
        });
    }
    if purity < min_purity {
        return Err(ZkpError::InvalidWitness {
            reason: "purity below minimum".to_string(),
        });
    }
    if weight < min_weight {
        return Err(ZkpError::InvalidWitness {
            reason: "weight below minimum".to_string(),
        });
    }

    // Compute commitments and hashes
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

    let tree = AssetOwnershipMerkleTree::new(&(), &(), leaves.iter().map(|leaf| leaf.as_slice()))
        .map_err(map_proof_system_error)?;
    let mines_root = vec_to_digest(tree.root())?;

    let leaf = make_leaf(mine_id);
    let root_vec = tree.root();
    let is_member = merkle_path
        .verify(&(), &(), &root_vec, leaf.as_slice())
        .map_err(map_proof_system_error)?;
    if !is_member {
        return Err(ZkpError::InvalidWitness {
            reason: "mine not in approved set".to_string(),
        });
    }

    let pk: ProvingKey<Bn254> = deserialize(&keys.proving_key)?;
    let mut rng = zk_rng();
    let circuit = CommodityOriginCircuit {
        mine_id: Some(mine_id),
        lat: Some(lat),
        lon: Some(lon),
        purity: Some(purity),
        weight: Some(weight),
        purity_randomness: Some(purity_randomness),
        weight_randomness: Some(weight_randomness),
        location_randomness: Some(location_randomness),
        bounds: Some(bounds),
        min_purity: Some(min_purity),
        min_weight: Some(min_weight),
        region_hash: Some(region_hash),
        purity_commitment: Some(purity_commitment),
        weight_commitment: Some(weight_commitment),
        mines_root: Some(mines_root),
        merkle_path: Some(merkle_path),
    };
    let proof = Groth16::<Bn254>::prove(&pk, circuit, &mut rng).map_err(map_proof_system_error)?;

    let mut public_inputs = Vec::new();
    public_inputs.extend(bytes_to_fr_bits(&region_hash));
    public_inputs.extend(bytes_to_fr_bits(&purity_commitment));
    public_inputs.extend(bytes_to_fr_bits(&weight_commitment));
    public_inputs.extend(bytes_to_fr_bits(&mines_root));
    public_inputs.extend(u64_to_fr_bits(min_purity));
    public_inputs.extend(u64_to_fr_bits(min_weight));

    let inputs = CommodityOriginPublicInputs {
        region_hash,
        purity_commitment,
        weight_commitment,
        mines_root,
        min_purity,
        min_weight,
    };

    Ok((
        Groth16ProofBundle {
            circuit: Groth16CircuitType::CommodityOrigin,
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
        Groth16CircuitType::GciThreshold | Groth16CircuitType::AssetOwnership | Groth16CircuitType::LocationRegion | Groth16CircuitType::CommodityOrigin => {
            let proof: Groth16Proof<Bn254> = deserialize(&bundle.proof)?;
            let vk: VerifyingKey<Bn254> = deserialize(&bundle.verifying_key)?;
            let pvk = Groth16::<Bn254>::process_vk(&vk).map_err(map_proof_system_error)?;
            Groth16::<Bn254>::verify_with_processed_vk(&pvk, &bundle.public_inputs, &proof)
                .map_err(map_proof_system_error)
        }
    }
}
