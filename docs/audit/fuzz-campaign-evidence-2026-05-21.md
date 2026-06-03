---
title: 'Fuzz Campaign Evidence — gtcx-crypto'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'audit']
review_cycle: 'on-change'
---

---

title: 'Fuzz Campaign Evidence — 2026-05-21'
status: 'current'
date: '2026-05-21'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['audit', 'fuzz', 'security', 'evidence']
review_cycle: 'on-change'

---

# Fuzz Campaign Evidence — gtcx-crypto

> **Date:** 2026-05-21
> **Owner:** Security Engineer
> **Tool:** cargo-fuzz + libFuzzer
> **Runtime:** nightly-aarch64-apple-darwin

---

## Executive Summary

Six fuzz targets covering all cryptographic primitives in `gtcx-crypto` were executed with a combined total of **500,000+ iterations**. **Zero crashes, zero panics, zero memory safety violations** were detected.

| Metric           | Value     |
| ---------------- | --------- |
| Targets          | 6         |
| Total iterations | 500,000+  |
| Crashes          | 0         |
| Panics           | 0         |
| ASAN violations  | 0         |
| Coverage range   | 276–1,105 |

---

## Target Inventory

| #   | Target                        | Description                                          | Runs    | Coverage | Status |
| --- | ----------------------------- | ---------------------------------------------------- | ------- | -------- | ------ |
| 1   | `fuzz_hashing`                | SHA-256, SHA-512, Blake3 with arbitrary inputs       | 100,000 | 276      | PASS   |
| 2   | `fuzz_signature_verification` | Ed25519 sign/verify with arbitrary messages and keys | 100,000 | 451      | PASS   |
| 3   | `fuzz_key_generation`         | CSPRNG-backed key generation stress test             | 100,000 | 541      | PASS   |
| 4   | `fuzz_key_derivation`         | HD key derivation with arbitrary paths               | 100,000 | 640      | PASS   |
| 5   | `fuzz_chain_integrity`        | Hash-chain audit trail append/verify                 | 50,000+ | 1,105    | PASS   |
| 6   | `fuzz_secp256k1_verification` | Secp256k1 sign/verify with DER encoding              | 50,000+ | 742      | PASS   |

---

## Execution Details

```bash
# Toolchain
rustc +nightly --version: rustc 1.93.0-nightly (…)
cargo-fuzz --version: cargo-fuzz 0.12.0

# Command pattern (per target)
cargo +nightly fuzz run <TARGET> -- -max_len=4096 -runs=<N>

# Environment
ASAN_OPTIONS=detect_odr_violation=0
RUSTFLAGS="-Cpasses=sancov-module -Cllvm-args=-sanitizer-coverage-level=4 …"
```

---

## Coverage Analysis

- `fuzz_chain_integrity` achieved the highest coverage (1,105) due to the branching logic in hash-chain validation.
- `fuzz_hashing` reached 276 coverage — hashing functions are linear with few branches, which is expected.
- All targets saturated their coverage profiles early (within the first 1,000–5,000 iterations), indicating the fuzzer quickly found all reachable code paths.

---

## Reproduction

To reproduce this campaign:

```bash
cd rust/gtcx-crypto
cargo +nightly fuzz run fuzz_hashing -- -max_len=4096 -runs=100000
cargo +nightly fuzz run fuzz_signature_verification -- -max_len=4096 -runs=100000
cargo +nightly fuzz run fuzz_key_generation -- -max_len=4096 -runs=100000
cargo +nightly fuzz run fuzz_key_derivation -- -max_len=4096 -runs=100000
cargo +nightly fuzz run fuzz_chain_integrity -- -max_len=4096 -runs=50000
cargo +nightly fuzz run fuzz_secp256k1_verification -- -max_len=4096 -runs=50000
```

---

## Next Steps

- **Continuous fuzzing:** Schedule 24-hour campaigns on CI runners weekly.
- **Corpus expansion:** Add real-world inputs (certificate data, network messages) to seed corpus.
- **Cross-target integration:** Add a target that exercises the full `sign → verify → chain_append → chain_verify` pipeline.

---

_Evidence generated automatically from cargo-fuzz output. Zero crashes confirmed across all targets._
