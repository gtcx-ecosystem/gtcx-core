//! Bulletproofs amount range proofs.

use crate::error::{map_proof_system_error, Result, ZkpError};
use crate::types::{BulletproofsRangeProofBundle, COMMITMENT_BYTES, ristretto_point_from_bytes};
use bulletproofs::{BulletproofGens, PedersenGens, RangeProof};
use curve25519_dalek::scalar::Scalar;
use merlin::Transcript;
use tracing::instrument;

fn range_bit_size(range: u64) -> usize {
    if range <= u64::from(u8::MAX) {
        return 8;
    }
    if range <= u64::from(u16::MAX) {
        return 16;
    }
    if range <= u64::from(u32::MAX) {
        return 32;
    }
    64
}

fn amount_range_transcript(label: &'static [u8], min: u64, max: u64, bits: usize) -> Transcript {
    let mut transcript = Transcript::new(label);
    transcript.append_message(b"min", &min.to_le_bytes());
    transcript.append_message(b"max", &max.to_le_bytes());
    transcript.append_message(b"bits", &(bits as u64).to_le_bytes());
    transcript
}

/// Generate a Bulletproofs range proof that an amount lies within [min, max].
#[instrument]
pub fn bulletproofs_prove_amount_range(
    amount: u64,
    min: u64,
    max: u64,
    randomness: [u8; COMMITMENT_BYTES],
) -> Result<BulletproofsRangeProofBundle> {
    if min > max {
        return Err(ZkpError::InvalidWitness {
            reason: "min exceeds max".to_string(),
        });
    }
    if amount < min || amount > max {
        return Err(ZkpError::InvalidWitness {
            reason: "amount outside bounds".to_string(),
        });
    }

    let range = max - min;
    let bits = range_bit_size(range);
    let bp_gens = BulletproofGens::new(bits, 1);
    let pc_gens = PedersenGens::default();
    let blinding = Scalar::from_bytes_mod_order(randomness);

    let amount_point = pc_gens.commit(Scalar::from(amount), blinding);
    let amount_commitment = amount_point.compress();
    let min_point = pc_gens.B * Scalar::from(min);
    let max_point = pc_gens.B * Scalar::from(max);
    let derived_low = (amount_point - min_point).compress();
    let derived_high = (max_point - amount_point).compress();

    let shifted_low = amount - min;
    let mut transcript_low = amount_range_transcript(b"gtcx.amount_range.low", min, max, bits);
    let (proof_low, commitment_low) = RangeProof::prove_single(
        &bp_gens,
        &pc_gens,
        &mut transcript_low,
        shifted_low,
        &blinding,
        bits,
    )
    .map_err(map_proof_system_error)?;
    if commitment_low != derived_low {
        return Err(ZkpError::ProofSystemError {
            reason: "amount range low commitment mismatch".to_string(),
        });
    }

    let shifted_high = max - amount;
    let blinding_high = -blinding;
    let mut transcript_high = amount_range_transcript(b"gtcx.amount_range.high", min, max, bits);
    let (proof_high, commitment_high) = RangeProof::prove_single(
        &bp_gens,
        &pc_gens,
        &mut transcript_high,
        shifted_high,
        &blinding_high,
        bits,
    )
    .map_err(map_proof_system_error)?;
    if commitment_high != derived_high {
        return Err(ZkpError::ProofSystemError {
            reason: "amount range high commitment mismatch".to_string(),
        });
    }

    Ok(BulletproofsRangeProofBundle {
        min,
        max,
        commitment: amount_commitment.to_bytes(),
        proof_low: proof_low.to_bytes().to_vec(),
        proof_high: proof_high.to_bytes().to_vec(),
    })
}

/// Verify a Bulletproofs range proof bundle for [min, max].
#[instrument(skip_all)]
pub fn bulletproofs_verify_amount_range(bundle: &BulletproofsRangeProofBundle) -> Result<bool> {
    if bundle.min > bundle.max {
        return Err(ZkpError::InvalidWitness {
            reason: "min exceeds max".to_string(),
        });
    }
    let range = bundle.max - bundle.min;
    let bits = range_bit_size(range);
    let bp_gens = BulletproofGens::new(bits, 1);
    let pc_gens = PedersenGens::default();

    let amount_point = ristretto_point_from_bytes(bundle.commitment)?;
    let min_point = pc_gens.B * Scalar::from(bundle.min);
    let max_point = pc_gens.B * Scalar::from(bundle.max);
    let derived_low = (amount_point - min_point).compress();
    let derived_high = (max_point - amount_point).compress();

    let proof_low = RangeProof::from_bytes(&bundle.proof_low).map_err(map_proof_system_error)?;
    let proof_high = RangeProof::from_bytes(&bundle.proof_high).map_err(map_proof_system_error)?;

    let mut transcript_low =
        amount_range_transcript(b"gtcx.amount_range.low", bundle.min, bundle.max, bits);
    let low_ok = proof_low
        .verify_single(&bp_gens, &pc_gens, &mut transcript_low, &derived_low, bits)
        .is_ok();

    let mut transcript_high =
        amount_range_transcript(b"gtcx.amount_range.high", bundle.min, bundle.max, bits);
    let high_ok = proof_high
        .verify_single(
            &bp_gens,
            &pc_gens,
            &mut transcript_high,
            &derived_high,
            bits,
        )
        .is_ok();

    Ok(low_ok && high_ok)
}
