use criterion::{criterion_group, criterion_main, Criterion};
use gtcx_crypto::keys::generate_keypair;
use gtcx_crypto::signing::ed25519::{sign, verify};

fn bench_key_generation(c: &mut Criterion) {
    c.bench_function("ed25519_keygen", |b| {
        b.iter(|| generate_keypair())
    });
}

fn bench_sign(c: &mut Criterion) {
    let (private_key, _) = generate_keypair();
    let message = b"benchmark message for signing operations";

    c.bench_function("ed25519_sign", |b| {
        b.iter(|| sign(message, &private_key))
    });
}

fn bench_verify(c: &mut Criterion) {
    let (private_key, public_key) = generate_keypair();
    let message = b"benchmark message for verification";
    let signature = sign(message, &private_key);

    c.bench_function("ed25519_verify", |b| {
        b.iter(|| verify(&signature, message, &public_key))
    });
}

fn bench_sign_verify_roundtrip(c: &mut Criterion) {
    let (private_key, public_key) = generate_keypair();
    let message = b"roundtrip benchmark message";

    c.bench_function("ed25519_sign_verify_roundtrip", |b| {
        b.iter(|| {
            let sig = sign(message, &private_key);
            verify(&sig, message, &public_key)
        })
    });
}

criterion_group!(
    benches,
    bench_key_generation,
    bench_sign,
    bench_verify,
    bench_sign_verify_roundtrip
);
criterion_main!(benches);
