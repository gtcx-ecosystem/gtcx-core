use criterion::{criterion_group, criterion_main, Criterion};

fn signing_benchmark(c: &mut Criterion) {
    c.bench_function("placeholder", |b| {
        b.iter(|| {
            // Placeholder — real benchmarks to be added with signing API
            let _ = 1 + 1;
        })
    });
}

criterion_group!(benches, signing_benchmark);
criterion_main!(benches);
