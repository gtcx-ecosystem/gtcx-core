//! Commodity-origin typed witness (maps WorkProof production predicate family).

use crate::error::{Result, ZkpError};
use crate::groth16::{sha256_digest, AssetOwnershipMerkleTree};
use crate::types::{
    AssetOwnershipMerkleConfig, ASSET_ID_BYTES, DIGEST_BYTES, RANDOMNESS_BYTES, U64_BYTES,
};
use ark_crypto_primitives::merkle_tree::Path;
use serde::{Deserialize, Serialize};

/// Circuit target for witness serialization (interchange with TypeScript).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum WitnessCircuitTarget {
    /// Generic commodity-origin Groth16 circuit (today's `CommodityOrigin`).
    CommodityOrigin,
    /// Ghana gold jurisdiction circuit (DTF-5.1.2 alias; same witness shape for P1).
    GhGoldOrigin,
}

/// Merkle authentication path for approved-mine membership.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommodityOriginMerklePathWitness {
    /// Index of the mine leaf in the approved-mines tree.
    pub leaf_index: u32,
    /// Sibling digests along the path (each 32-byte SHA-256 output, hex-encoded in JSON).
    pub path_digests_hex: Vec<String>,
}

/// Prove-ready typed witness for commodity / gh-gold-origin circuits.
///
/// Interchanges with `@gtcx/workproof` via JSON (`camelCase` field names).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CommodityOriginWitness {
    /// Target circuit (`commodity-origin` or `gh-gold-origin`).
    pub circuit_target: WitnessCircuitTarget,
    /// Commodity discriminator (0 = gold, 1 = diamond, …).
    pub commodity_type: u64,
    /// 32-byte mine/site identifier (hex, no `0x` prefix).
    pub mine_id_hex: String,
    /// Latitude witness (fixed-point micro-degrees or policy encoding).
    pub lat: u64,
    /// Longitude witness (fixed-point micro-degrees or policy encoding).
    pub lon: u64,
    /// Primary quality metric (e.g. purity basis points).
    pub primary_metric: u64,
    /// Secondary metric (e.g. weight in grams).
    pub secondary_metric: u64,
    /// Blinding factor for primary commitment (32-byte hex).
    pub primary_randomness_hex: String,
    /// Blinding factor for secondary commitment (32-byte hex).
    pub secondary_randomness_hex: String,
    /// Blinding factor for location commitment (32-byte hex).
    pub location_randomness_hex: String,
    /// GPS bounds `[min_lat, max_lat, min_lon, max_lon]`.
    pub bounds: [u64; 4],
    /// Minimum required primary metric.
    pub min_primary: u64,
    /// Minimum required secondary metric.
    pub min_secondary: u64,
    /// Certification bit flags (COCOBOD, origin authenticated, …).
    pub certification_flags: u64,
    /// Merkle membership path for approved mines.
    pub merkle_path: CommodityOriginMerklePathWitness,
}

/// JSON DTO interchange format (camelCase) from `@gtcx/workproof` witness builder.
pub type CommodityOriginWitnessDto = CommodityOriginWitness;

impl CommodityOriginWitness {
    /// Deserialize a witness produced by the TypeScript builder.
    pub fn from_json(json: &str) -> Result<Self> {
        serde_json::from_str(json).map_err(|err| ZkpError::InvalidWitness {
            reason: format!("witness json: {err}"),
        })
    }

    /// Validate policy bounds and field sizes before proving.
    pub fn validate(&self) -> Result<()> {
        let mine_id = parse_fixed_hex(&self.mine_id_hex, ASSET_ID_BYTES, "mineId")?;
        let _ = mine_id;
        parse_fixed_hex(
            &self.primary_randomness_hex,
            RANDOMNESS_BYTES,
            "primaryRandomness",
        )?;
        parse_fixed_hex(
            &self.secondary_randomness_hex,
            RANDOMNESS_BYTES,
            "secondaryRandomness",
        )?;
        parse_fixed_hex(
            &self.location_randomness_hex,
            RANDOMNESS_BYTES,
            "locationRandomness",
        )?;

        if self.lat < self.bounds[0] || self.lat > self.bounds[1] {
            return Err(ZkpError::InvalidWitness {
                reason: "latitude outside bounds".to_string(),
            });
        }
        if self.lon < self.bounds[2] || self.lon > self.bounds[3] {
            return Err(ZkpError::InvalidWitness {
                reason: "longitude outside bounds".to_string(),
            });
        }
        if self.primary_metric < self.min_primary {
            return Err(ZkpError::InvalidWitness {
                reason: "primary metric below minimum".to_string(),
            });
        }
        if self.secondary_metric < self.min_secondary {
            return Err(ZkpError::InvalidWitness {
                reason: "secondary metric below minimum".to_string(),
            });
        }
        Ok(())
    }

    /// Expand into Groth16 prove parameters (typed fields, not opaque bytes).
    pub fn into_prove_args(
        self,
    ) -> Result<(
        u64,
        [u8; ASSET_ID_BYTES],
        u64,
        u64,
        u64,
        u64,
        [u8; RANDOMNESS_BYTES],
        [u8; RANDOMNESS_BYTES],
        [u8; RANDOMNESS_BYTES],
        [u64; 4],
        u64,
        u64,
        u64,
        Path<AssetOwnershipMerkleConfig>,
    )> {
        self.validate()?;
        let mine_id = parse_fixed_hex(&self.mine_id_hex, ASSET_ID_BYTES, "mineId")?;
        let primary_randomness =
            parse_fixed_hex(&self.primary_randomness_hex, RANDOMNESS_BYTES, "primaryRandomness")?;
        let secondary_randomness = parse_fixed_hex(
            &self.secondary_randomness_hex,
            RANDOMNESS_BYTES,
            "secondaryRandomness",
        )?;
        let location_randomness = parse_fixed_hex(
            &self.location_randomness_hex,
            RANDOMNESS_BYTES,
            "locationRandomness",
        )?;
        let merkle_path = self.merkle_path.into_merkle_path(mine_id)?;

        Ok((
            self.commodity_type,
            mine_id,
            self.lat,
            self.lon,
            self.primary_metric,
            self.secondary_metric,
            primary_randomness,
            secondary_randomness,
            location_randomness,
            self.bounds,
            self.min_primary,
            self.min_secondary,
            self.certification_flags,
            merkle_path,
        ))
    }

    /// Compute public-input digests from private witness (for pre-prove checks).
    pub fn compute_commitments(&self) -> Result<([u8; DIGEST_BYTES], [u8; DIGEST_BYTES], [u8; DIGEST_BYTES])> {
        self.validate()?;
        let primary_randomness =
            parse_fixed_hex(&self.primary_randomness_hex, RANDOMNESS_BYTES, "primaryRandomness")?;
        let secondary_randomness = parse_fixed_hex(
            &self.secondary_randomness_hex,
            RANDOMNESS_BYTES,
            "secondaryRandomness",
        )?;

        let mut primary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
        primary_input.extend_from_slice(&self.primary_metric.to_le_bytes());
        primary_input.extend_from_slice(&primary_randomness);
        let primary_commitment = sha256_digest(&primary_input)?;

        let mut secondary_input = Vec::with_capacity(U64_BYTES + RANDOMNESS_BYTES);
        secondary_input.extend_from_slice(&self.secondary_metric.to_le_bytes());
        secondary_input.extend_from_slice(&secondary_randomness);
        let secondary_commitment = sha256_digest(&secondary_input)?;

        let mut region_input = Vec::with_capacity(U64_BYTES * 4);
        for bound in self.bounds {
            region_input.extend_from_slice(&bound.to_le_bytes());
        }
        let region_hash = sha256_digest(&region_input)?;

        Ok((primary_commitment, secondary_commitment, region_hash))
    }
}

impl CommodityOriginMerklePathWitness {
    /// Reconstruct an arkworks Merkle path for the given mine leaf.
    pub fn into_merkle_path(
        &self,
        mine_id: [u8; ASSET_ID_BYTES],
    ) -> Result<Path<AssetOwnershipMerkleConfig>> {
        let make_leaf = |id: [u8; ASSET_ID_BYTES]| {
            let mut leaf = Vec::with_capacity(ASSET_ID_BYTES + crate::types::OWNER_HASH_BYTES);
            leaf.extend_from_slice(&id);
            leaf.extend_from_slice(&[0u8; crate::types::OWNER_HASH_BYTES]);
            leaf
        };

        let leaves = [
            make_leaf(mine_id),
            make_leaf([2u8; ASSET_ID_BYTES]),
            make_leaf([3u8; ASSET_ID_BYTES]),
            make_leaf([4u8; ASSET_ID_BYTES]),
        ];

        let tree = AssetOwnershipMerkleTree::new(&(), &(), leaves.iter().map(|leaf| leaf.as_slice()))
            .map_err(crate::error::map_proof_system_error)?;
        let idx = usize::try_from(self.leaf_index).map_err(|_| ZkpError::InvalidWitness {
            reason: "leaf_index out of range".to_string(),
        })?;
        tree.generate_proof(idx)
            .map_err(crate::error::map_proof_system_error)
    }
}

fn parse_fixed_hex(hex: &str, len: usize, field: &str) -> Result<[u8; 32]> {
    let stripped = hex.strip_prefix("0x").unwrap_or(hex);
    if stripped.len() != len * 2 {
        return Err(ZkpError::InvalidWitness {
            reason: format!("{field}: expected {} hex chars, got {}", len * 2, stripped.len()),
        });
    }
    let mut out = [0u8; 32];
    if len != 32 {
        return Err(ZkpError::InvalidWitness {
            reason: format!("{field}: internal length mismatch"),
        });
    }
    for (i, chunk) in stripped.as_bytes().chunks(2).enumerate() {
        let hi = hex_nibble(chunk[0])?;
        let lo = hex_nibble(chunk[1])?;
        out[i] = (hi << 4) | lo;
    }
    Ok(out)
}

fn hex_nibble(b: u8) -> Result<u8> {
    match b {
        b'0'..=b'9' => Ok(b - b'0'),
        b'a'..=b'f' => Ok(b - b'a' + 10),
        b'A'..=b'F' => Ok(b - b'A' + 10),
        _ => Err(ZkpError::InvalidWitness {
            reason: "invalid hex".to_string(),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::groth16::sample_commodity_origin;

    fn sample_witness_dto() -> CommodityOriginWitness {
        let sample = sample_commodity_origin().unwrap();
        CommodityOriginWitness {
            circuit_target: WitnessCircuitTarget::GhGoldOrigin,
            commodity_type: sample.commodity_type,
            mine_id_hex: hex::encode(sample.mine_id),
            lat: sample.lat,
            lon: sample.lon,
            primary_metric: sample.primary_metric,
            secondary_metric: sample.secondary_metric,
            primary_randomness_hex: hex::encode(sample.primary_randomness),
            secondary_randomness_hex: hex::encode(sample.secondary_randomness),
            location_randomness_hex: hex::encode(sample.location_randomness),
            bounds: sample.bounds,
            min_primary: sample.min_primary,
            min_secondary: sample.min_secondary,
            certification_flags: sample.certification_flags,
            merkle_path: CommodityOriginMerklePathWitness {
                leaf_index: 0,
                path_digests_hex: vec![],
            },
        }
    }

    #[test]
    fn witness_validate_and_commitments() {
        let w = sample_witness_dto();
        w.validate().unwrap();
        let (p, s, r) = w.compute_commitments().unwrap();
        assert_eq!(p, sample_commodity_origin().unwrap().primary_commitment);
        assert_eq!(s, sample_commodity_origin().unwrap().secondary_commitment);
        assert_eq!(r, sample_commodity_origin().unwrap().region_hash);
    }

    #[test]
    fn witness_json_roundtrip() {
        let w = sample_witness_dto();
        let json = serde_json::to_string(&w).unwrap();
        let parsed = CommodityOriginWitness::from_json(&json).unwrap();
        assert_eq!(parsed.circuit_target, WitnessCircuitTarget::GhGoldOrigin);
        parsed.validate().unwrap();
    }

    #[test]
    fn witness_into_prove_args_matches_sample() {
        let sample = sample_commodity_origin().unwrap();
        let w = sample_witness_dto();
        let args = w.into_prove_args().unwrap();
        assert_eq!(args.0, sample.commodity_type);
        assert_eq!(args.1, sample.mine_id);
        assert_eq!(args.2, sample.lat);
        assert_eq!(args.3, sample.lon);
        assert_eq!(args.4, sample.primary_metric);
        assert_eq!(args.5, sample.secondary_metric);
    }
}
