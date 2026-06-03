//! Differential testing — independent verifier agrees with gtcx-zkp verifier.
//!
//! Run with: cargo test -p gtcx-zkp --lib --features differential

#![cfg(feature = "differential")]

use crate::groth16::{
    groth16_generate_keys, groth16_prove_gci_threshold, groth16_verify,
};
use crate::types::{Groth16CircuitType, Groth16ProofBundle};
use ark_bn254::Bn254;
use ark_groth16::{Groth16, Proof, VerifyingKey};
use ark_serialize::CanonicalDeserialize;
use ark_snark::SNARK;
use rand::Rng;

const VALID_PROOFS: usize = 5;
const TAMPERED_PER_PROOF: usize = 19;
const TOTAL_VERIFICATIONS: usize = VALID_PROOFS * (1 + TAMPERED_PER_PROOF); // 100

/// Differential test for GciThreshold: our verifier and raw arkworks must agree
/// on all 100 witnesses (5 valid proofs + 95 tampered variants).
///
/// We generate only 5 proofs to keep runtime reasonable (~30s total),
/// then create 19 tampered variants per proof by flipping different bytes.
#[test]
fn test_differential_gci_threshold_100_witnesses() {
    let keys = groth16_generate_keys(Groth16CircuitType::GciThreshold).unwrap();
    let mut rng = rand::thread_rng();

    let mut our_accepts = 0;
    let mut our_rejects = 0;
    let mut ark_accepts = 0;
    let mut ark_rejects = 0;
    let mut disagreements = 0;

    for proof_idx in 0..VALID_PROOFS {
        let threshold: u64 = rng.gen_range(1..=100);
        let score: u64 = rng.gen_range(threshold..=1000);

        let base_bundle = groth16_prove_gci_threshold(score, threshold, &keys).unwrap();

        // --- Verify valid proof: both must ACCEPT ---
        {
            let our_result = groth16_verify(&base_bundle).unwrap();
            let ark_result = verify_with_arkworks(&base_bundle);

            if our_result != ark_result {
                disagreements += 1;
                eprintln!(
                    "DISAGREE valid proof {}: score={} threshold={} ours={} ark={}",
                    proof_idx, score, threshold, our_result, ark_result
                );
            }
            if our_result { our_accepts += 1; } else { our_rejects += 1; }
            if ark_result { ark_accepts += 1; } else { ark_rejects += 1; }
        }

        // --- Verify tampered variants: both must REJECT ---
        for t in 0..TAMPERED_PER_PROOF {
            let mut bundle = base_bundle.clone();
            // Flip a different byte for each tampered variant
            let byte_idx = (t * 7) % bundle.proof.len(); // stride 7 to spread across proof
            bundle.proof[byte_idx] ^= 0xFF;

            let our_result = groth16_verify(&bundle).unwrap_or(false);
            let ark_result = verify_with_arkworks(&bundle);

            if our_result != ark_result {
                disagreements += 1;
                eprintln!(
                    "DISAGREE tampered proof {}.{}: byte={} ours={} ark={}",
                    proof_idx, t, byte_idx, our_result, ark_result
                );
            }
            if our_result { our_accepts += 1; } else { our_rejects += 1; }
            if ark_result { ark_accepts += 1; } else { ark_rejects += 1; }
        }
    }

    println!(
        "Differential test: total={}, our_accepts={}, our_rejects={}, ark_accepts={}, ark_rejects={}, disagreements={}",
        TOTAL_VERIFICATIONS, our_accepts, our_rejects, ark_accepts, ark_rejects, disagreements
    );

    assert_eq!(
        disagreements, 0,
        "{} disagreements between gtcx-zkp and arkworks verifiers",
        disagreements
    );

    assert_eq!(
        our_accepts, VALID_PROOFS,
        "Expected {} accepts (valid proofs), got {}",
        VALID_PROOFS, our_accepts
    );
    assert_eq!(
        our_rejects, VALID_PROOFS * TAMPERED_PER_PROOF,
        "Expected {} rejects (tampered proofs), got {}",
        VALID_PROOFS * TAMPERED_PER_PROOF, our_rejects
    );
}

/// Verify a Groth16ProofBundle using ONLY raw arkworks (no gtcx-zkp code).
fn verify_with_arkworks(bundle: &Groth16ProofBundle) -> bool {
    let proof = match Proof::<Bn254>::deserialize_compressed(&mut &bundle.proof[..]) {
        Ok(p) => p,
        Err(_) => return false,
    };
    let vk = match VerifyingKey::<Bn254>::deserialize_compressed(&mut &bundle.verifying_key[..]) {
        Ok(v) => v,
        Err(_) => return false,
    };

    let public_inputs = match bundle.circuit {
        Groth16CircuitType::GciThreshold => {
            // public_inputs is a Vec<Fr>; for GciThreshold, it contains 64 bits of threshold.
            // But our bundle.public_inputs is already constructed by groth16_prove_gci_threshold.
            bundle.public_inputs.clone()
        }
        _ => return false,
    };

    let pvk = match Groth16::<Bn254>::process_vk(&vk) {
        Ok(p) => p,
        Err(_) => return false,
    };

    Groth16::<Bn254>::verify_with_processed_vk(&pvk, &public_inputs, &proof).unwrap_or(false)
}
