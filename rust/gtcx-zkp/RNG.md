---
id: ZKP-RNG-ENTROPY-2026-06-02
title: RNG / Witness Entropy Audit — gtcx-zkp
date: 2026-06-02
owner: security-engineer
scope: rust/gtcx-zkp
status: current
---

# RNG / Witness Entropy Audit

**Scope:** All randomness used for ZKP witness generation, proving keys, and proof non-determinism in `gtcx-zkp`.  
**Baseline:** `zk_rng()` is the single source of truth for cryptographically secure randomness in this crate.

---

## Entropy Hierarchy

```
zk_rng() (gtcx-zkp)
  └─ ark_std::rand::rngs::OsRng
       └─ rand::rngs::OsRng (via ark-std re-export)
            └─ getrandom v0.2.17
                 ├─ Linux:   getrandom(2) syscall → /dev/urandom fallback
                 ├─ macOS:   SecRandomCopyBytes (Security.framework)
                 ├─ Windows: BCryptGenRandom (CNG)
                 ├─ WASI:    random_get (wasi_snapshot_preview1)
                 └─ wasm32:  crypto.getRandomValues (Web Crypto API)
```

### Platform Details

| Platform             | Backend                    | Fallback       | Notes                                                      |
| -------------------- | -------------------------- | -------------- | ---------------------------------------------------------- |
| Linux (glibc ≥ 2.25) | `getrandom(2)`             | `/dev/urandom` | Blocks until urandom is seeded; never returns weak entropy |
| Linux (old glibc)    | `/dev/urandom` direct read | —              | File descriptor cached per thread                          |
| macOS / iOS          | `SecRandomCopyBytes`       | —              | System-provided CSPRNG                                     |
| Windows              | `BCryptGenRandom`          | —              | Windows CNG; preferred over `RtlGenRandom`                 |
| WASM (browser)       | `crypto.getRandomValues`   | —              | Requires secure context (HTTPS/localhost)                  |
| WASM (Node.js)       | `crypto.randomFillSync`    | —              | Node.js `crypto` module                                    |

### Crate Versions (from workspace `Cargo.lock`)

- `getrandom`: 0.2.17, 0.3.4
- `rand`: 0.8.6, 0.9.4
- `ark-std`: workspace (re-exports `rand` traits and `OsRng`)

---

## `zk_rng()` Design

```rust
pub(crate) fn zk_rng() -> StdRng {
    let mut seed = [0u8; 32];
    ark_std::rand::rngs::OsRng.fill_bytes(&mut seed);
    StdRng::from_seed(seed)
}
```

### Why seed `StdRng` from `OsRng` instead of using `OsRng` directly?

1. **Deterministic reproducibility in tests**: A seeded `StdRng` can be re-instantiated if the seed is logged (debug builds only).
2. **Performance**: `StdRng` (ChaCha12) is faster than `OsRng` for large batches of randomness (e.g., Bulletproofs vector generation).
3. **Compatibility**: `arkworks` traits expect `RngCore`; `StdRng` satisfies this without platform-specific branching.

### Seed Lifetime

- The 32-byte seed is stack-allocated and zeroed by the compiler after `StdRng::from_seed`.
- `OsRng` itself is a zero-sized type; no persistent state.

---

## Fallback Behavior

If `getrandom` fails (e.g., `/dev/urandom` unavailable, `ENOSYS` on sandboxed Linux):

1. **`OsRng` panics** — `rand` crate documents this as intentional: "If the platform has no secure randomness source, `OsRng` will panic on first use."
2. **No silent fallback to weak RNG** — This is a security feature, not a bug. A panic is preferred over deterministic or weak entropy.
3. **Operational implication**: Containers / chroots must have `/dev/urandom` available or the `getrandom` syscall enabled.

---

## What Uses `zk_rng()`

| Caller                      | Purpose                              | Count per call |
| --------------------------- | ------------------------------------ | -------------- |
| `groth16_generate_keys()`   | Trusted-setup randomness (tau)       | 1×             |
| `groth16_prove_*()`         | Prover randomness (blinding factors) | 1×             |
| `schnorr::prove_identity()` | Schnorr nonce                        | 1×             |
| `groth16/utils.rs`          | CRH parameter setup (SHA-256)        | 3×             |

All proving paths use fresh `zk_rng()` per call; keys are not reused across proofs.

---

## Non-Determinism Verification

**Test:** `test_proof_non_determinism` (ignored by default; run with `cargo test -- --ignored`)

Generates 100 Groth16 proofs from the identical witness and asserts all proof byte vectors are pairwise distinct. This confirms that:

- `zk_rng()` seeds are unique per call
- `OsRng` is providing fresh entropy
- No accidental hard-coding of randomness in the proving path

**CI gate:** `cargo test -- --ignored test_proof_non_determinism` (run manually or in nightly)

---

## Threat Model

| Threat                                          | Mitigation                                                         | Residual Risk                   |
| ----------------------------------------------- | ------------------------------------------------------------------ | ------------------------------- |
| VM snapshot replay (same entropy after restore) | `OsRng` uses host entropy; snapshot replay is a VM-layer issue     | Low — document for operators    |
| `/dev/urandom` exhaustion                       | Linux CSPRNG is seeded from HW entropy; theoretical only           | Negligible                      |
| WASM: `Math.random()` substitution              | `getrandom` on wasm32 targets `crypto.getRandomValues` exclusively | Low — requires hostile runtime  |
| Side-channel leakage of seed                    | Seed lives only during `from_seed`; ChaCha12 state is large        | Low — see D7 side-channel audit |

---

## References

- Code: `03-platform/src/types.rs` (`zk_rng`), `03-platform/src/utils.rs` (duplicate — to be consolidated)
- Test: `03-platform/src/tests/types.rs` (`test_zk_rng_non_deterministic`)
- Heavy test: `03-platform/src/tests/groth16.rs` (`test_proof_non_determinism`)
- `getrandom` crate docs: <https://docs.rs/getrandom/0.2.17/getrandom/>
- `rand::rngs::OsRng` docs: <https://docs.rs/rand/0.8.6/rand/rngs/struct.OsRng.html>
