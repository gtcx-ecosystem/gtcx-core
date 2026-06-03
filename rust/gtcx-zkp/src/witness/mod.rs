//! Typed witnesses for Groth16 circuits (DTF-5.1.1).
//!
//! WorkProof predicate evidence maps to structured witness values — no raw
//! `Vec<u8>` blobs in the public builder API.

mod commodity_origin;

pub use commodity_origin::{
    CommodityOriginMerklePathWitness, CommodityOriginWitness, CommodityOriginWitnessDto,
    WitnessCircuitTarget,
};
