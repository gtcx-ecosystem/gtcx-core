//! Statistical side-channel timing tests for ZKP constraint generation.
//!
//! Run with: cargo test -p gtcx-zkp --lib --features sidechannel-bench

#![cfg(feature = "sidechannel-bench")]

use crate::groth16::uint64_is_ge;
use ark_bn254::Fr;
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::uint64::UInt64;
use ark_relations::r1cs::ConstraintSystem;
use rand::Rng;
use std::hint::black_box;
use std::time::Instant;

/// Default sample count for side-channel tests.
/// Override at runtime: `DUDECT_SAMPLES=1000000 cargo test ...`
/// CI default: 100_000 (~3 min). Deep analysis: 1_000_000 (~30 min).
fn sample_count() -> usize {
    std::env::var("DUDECT_SAMPLES")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(100_000)
}
const P_VALUE_THRESHOLD: f64 = 0.05;

/// Tests that `uint64_is_ge` constraint generation does not exhibit
/// statistically significant timing variation based on secret inputs.
///
/// Classification:
/// - Left distribution: a >= b (should evaluate to true)
/// - Right distribution: a < b  (should evaluate to false)
#[test]
fn test_uint64_is_ge_no_timing_leakage() {
    let mut rng = rand::thread_rng();
    let samples = sample_count();
    let mut left_times: Vec<u64> = Vec::with_capacity(samples / 2);
    let mut right_times: Vec<u64> = Vec::with_capacity(samples / 2);

    for _ in 0..samples {
        let a: u64 = rng.gen();
        let b: u64 = rng.gen();

        let start = Instant::now();
        let cs = ConstraintSystem::<Fr>::new_ref();
        let a_var = UInt64::new_witness(cs.clone(), || Ok(a)).unwrap();
        let b_var = UInt64::new_witness(cs.clone(), || Ok(b)).unwrap();
        let _result = uint64_is_ge(&a_var, &b_var).unwrap();
        black_box(&_result);
        let elapsed = start.elapsed().as_nanos() as u64;

        if a >= b {
            left_times.push(elapsed);
        } else {
            right_times.push(elapsed);
        }
    }

    let p_value = compute_welch_t_test(&left_times, &right_times);

    println!(
        "uint64_is_ge side-channel test: samples={}, left={}, right={}, p_value={:.6}",
        samples,
        left_times.len(),
        right_times.len(),
        p_value
    );

    assert!(
        p_value > P_VALUE_THRESHOLD,
        "p_value={} below threshold {} — possible timing leakage in uint64_is_ge",
        p_value,
        P_VALUE_THRESHOLD
    );
}

/// Computes Welch's t-test p-value for two independent samples.
/// A high p-value (> 0.05) indicates no statistically significant difference.
fn compute_welch_t_test(left: &[u64], right: &[u64]) -> f64 {
    if left.is_empty() || right.is_empty() {
        return 1.0;
    }

    let n1 = left.len() as f64;
    let n2 = right.len() as f64;

    let mean1 = left.iter().copied().map(|x| x as f64).sum::<f64>() / n1;
    let mean2 = right.iter().copied().map(|x| x as f64).sum::<f64>() / n2;

    let var1 = left
        .iter()
        .copied()
        .map(|x| {
            let d = x as f64 - mean1;
            d * d
        })
        .sum::<f64>()
        / (n1 - 1.0);
    let var2 = right
        .iter()
        .copied()
        .map(|x| {
            let d = x as f64 - mean2;
            d * d
        })
        .sum::<f64>()
        / (n2 - 1.0);

    let se = (var1 / n1 + var2 / n2).sqrt();
    if se == 0.0 {
        return 1.0;
    }

    let t_stat = (mean1 - mean2).abs() / se;

    // Two-tailed p-value using standard normal approximation
    // (valid for large degrees of freedom)
    let p_value = 2.0 * (1.0 - approx_cdf(t_stat));
    p_value.min(1.0)
}

/// Approximate standard normal CDF using the error function.
fn approx_cdf(x: f64) -> f64 {
    0.5 * (1.0 + erf(x / std::f64::consts::SQRT_2))
}

/// Error function approximation (Abramowitz and Stegun, formula 7.1.26).
fn erf(x: f64) -> f64 {
    let a1 = 0.254829592;
    let a2 = -0.284496736;
    let a3 = 1.421413741;
    let a4 = -1.453152027;
    let a5 = 1.061405429;
    let p = 0.3275911;

    let sign = if x < 0.0 { -1.0 } else { 1.0 };
    let x = x.abs();

    let t = 1.0 / (1.0 + p * x);
    let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * (-x * x).exp();

    sign * y
}
