use criterion::{criterion_group, criterion_main, BenchmarkId, Criterion};
use gtcx_crypto::hashing::{blake3, sha256, sha512};

fn bench_sha256(c: &mut Criterion) {
    let mut group = c.benchmark_group("sha256");
    for size in [32, 256, 1024, 4096].iter() {
        let data = vec![0xABu8; *size];
        group.bench_with_input(BenchmarkId::from_parameter(size), size, |b, _| {
            b.iter(|| sha256(&data))
        });
    }
    group.finish();
}

fn bench_sha512(c: &mut Criterion) {
    let mut group = c.benchmark_group("sha512");
    for size in [32, 256, 1024, 4096].iter() {
        let data = vec![0xABu8; *size];
        group.bench_with_input(BenchmarkId::from_parameter(size), size, |b, _| {
            b.iter(|| sha512(&data))
        });
    }
    group.finish();
}

fn bench_blake3(c: &mut Criterion) {
    let mut group = c.benchmark_group("blake3");
    for size in [32, 256, 1024, 4096].iter() {
        let data = vec![0xABu8; *size];
        group.bench_with_input(BenchmarkId::from_parameter(size), size, |b, _| {
            b.iter(|| blake3(&data))
        });
    }
    group.finish();
}

fn bench_hash_comparison(c: &mut Criterion) {
    let data = vec![0xABu8; 256];
    let mut group = c.benchmark_group("hash_comparison_256b");
    group.bench_function("sha256", |b| b.iter(|| sha256(&data)));
    group.bench_function("sha512", |b| b.iter(|| sha512(&data)));
    group.bench_function("blake3", |b| b.iter(|| blake3(&data)));
    group.finish();
}

criterion_group!(
    benches,
    bench_sha256,
    bench_sha512,
    bench_blake3,
    bench_hash_comparison
);
criterion_main!(benches);
