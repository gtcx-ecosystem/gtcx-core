use criterion::{black_box, criterion_group, criterion_main, Criterion};
use gtcx_zkp::{
    bulletproofs_prove_amount_range, bulletproofs_verify_amount_range, groth16_generate_keys,
    groth16_prove_gci_threshold, groth16_verify, schnorr_prove_identity_attribute,
    schnorr_verify_identity_attribute, Groth16CircuitType, Groth16Keys,
};
use std::sync::OnceLock;
use std::time::Duration;

static GCI_KEYS: OnceLock<Groth16Keys> = OnceLock::new();

fn gci_keys() -> &'static Groth16Keys {
    GCI_KEYS.get_or_init(|| {
        groth16_generate_keys(Groth16CircuitType::GciThreshold)
            .expect("GCI threshold key generation should succeed")
    })
}

fn bench_groth16_gci_prove(c: &mut Criterion) {
    let keys = gci_keys();
    c.bench_function("zkp_groth16_gci_prove", |b| {
        b.iter(|| {
            let proof = groth16_prove_gci_threshold(black_box(92), black_box(80), keys)
                .expect("Groth16 proof generation should succeed");
            black_box(proof);
        })
    });
}

fn bench_groth16_gci_verify(c: &mut Criterion) {
    let keys = gci_keys();
    let proof =
        groth16_prove_gci_threshold(92, 80, keys).expect("Groth16 proof generation should succeed");
    c.bench_function("zkp_groth16_gci_verify", |b| {
        b.iter(|| {
            let valid = groth16_verify(black_box(&proof))
                .expect("Groth16 proof verification should succeed");
            black_box(valid);
        })
    });
}

fn bench_bulletproofs_amount_range_prove(c: &mut Criterion) {
    c.bench_function("zkp_bulletproofs_amount_range_prove", |b| {
        b.iter(|| {
            let bundle = bulletproofs_prove_amount_range(
                black_box(55),
                black_box(10),
                black_box(100),
                [7u8; 32],
            )
            .expect("Bulletproofs range proof should succeed");
            black_box(bundle);
        })
    });
}

fn bench_bulletproofs_amount_range_verify(c: &mut Criterion) {
    let bundle = bulletproofs_prove_amount_range(55, 10, 100, [7u8; 32])
        .expect("Bulletproofs range proof should succeed");
    c.bench_function("zkp_bulletproofs_amount_range_verify", |b| {
        b.iter(|| {
            let valid = bulletproofs_verify_amount_range(black_box(&bundle))
                .expect("Bulletproofs range verify should succeed");
            black_box(valid);
        })
    });
}

fn bench_schnorr_identity_prove(c: &mut Criterion) {
    let subject_hash = [3u8; 32];
    c.bench_function("zkp_schnorr_identity_prove", |b| {
        b.iter(|| {
            let bundle = schnorr_prove_identity_attribute(
                black_box(b"citizenship:GTX"),
                black_box(subject_hash),
            )
            .expect("Schnorr identity proof should succeed");
            black_box(bundle);
        })
    });
}

fn bench_schnorr_identity_verify(c: &mut Criterion) {
    let subject_hash = [3u8; 32];
    let bundle = schnorr_prove_identity_attribute(b"citizenship:GTX", subject_hash)
        .expect("Schnorr identity proof should succeed");
    c.bench_function("zkp_schnorr_identity_verify", |b| {
        b.iter(|| {
            let valid = schnorr_verify_identity_attribute(black_box(&bundle))
                .expect("Schnorr identity verification should succeed");
            black_box(valid);
        })
    });
}

fn zkp_bench_config() -> Criterion {
    Criterion::default()
        .sample_size(10)
        .warm_up_time(Duration::from_secs(1))
        .measurement_time(Duration::from_secs(5))
}

criterion_group! {
    name = zkp_benches;
    config = zkp_bench_config();
    targets = bench_groth16_gci_prove, bench_groth16_gci_verify,
        bench_bulletproofs_amount_range_prove, bench_bulletproofs_amount_range_verify,
        bench_schnorr_identity_prove, bench_schnorr_identity_verify
}
criterion_main!(zkp_benches);
