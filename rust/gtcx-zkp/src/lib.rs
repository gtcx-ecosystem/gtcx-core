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

mod bulletproofs;
mod commitment;
mod error;
mod groth16;
mod schnorr;
mod types;

#[cfg(test)]
mod tests;

pub use bulletproofs::{
    bulletproofs_prove_amount_range, bulletproofs_prove_commodity_range,
    bulletproofs_verify_amount_range, bulletproofs_verify_commodity_range,
};
pub use commitment::{commit, generate_proof, prove_and_verify, verify_proof};
pub use error::{Result, ZkpError};
pub use groth16::{
    groth16_generate_keys, groth16_prove_asset_ownership, groth16_prove_commodity_origin,
    groth16_prove_gci_threshold, groth16_prove_location_region, groth16_verify,
    sample_commodity_origin,
};
pub use schnorr::{
    schnorr_attribute_hash, schnorr_prove_identity_attribute, schnorr_verify_identity_attribute,
};
pub use types::{
    AssetOwnershipDigestConverter, AssetOwnershipMerkleConfig, AssetOwnershipPublicInputs,
    BulletproofsCommodityRangeBundle, BulletproofsRangeProofBundle, CircuitType,
    CommodityOriginPublicInputs, Groth16CircuitType, Groth16Keys,
    Groth16ProofBundle, LocationRegionPublicInputs, Proof, PublicInputs,
    SchnorrIdentityProofBundle, Witness, ASSET_ID_BYTES, COMMITMENT_BYTES, DIGEST_BYTES,
    MAX_WITNESS_SIZE, OWNER_HASH_BYTES, RANDOMNESS_BYTES, U64_BYTES,
};
