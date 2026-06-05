---
id: AUDIT-UINT64-IS-GE-2026-06-02
title: 'Side-Channel Audit: uint64_is_ge Bit-Decomposition Path'
date: 2026-06-02
owner: crypto-security-engineer
role: crypto-security-engineer
status: current
tier: standard
tags: ['side-channel', 'zkp', 'uint64-is-ge', 'audit', 'm7-2']
review_cycle: on-change
---

# Side-Channel Audit: `uint64_is_ge` Bit-Decomposition Path

## Scope

Function under audit: `uint64_is_ge` in `rust/gtcx-zkp/03-platform/src/groth16/mod.rs` (lines 96–116).

This function implements `>=` comparison for two `UInt64<Fr>` values via bit decomposition in R1CS. It is invoked 6 times per `CommodityOriginCircuit` constraint generation (GPS bounds × 4, primary metric × 1, secondary metric × 1) and once per `GciThresholdCircuit`.

## Attacker Model

- **Local attacker** with ability to measure timing of constraint generation on the same device.
- **Goal:** infer secret witness values (score, metric, GPS coordinates) from timing variations.

## Analysis

### 1. Bit decomposition (`to_bits_le`)

```rust
let lhs_bits = lhs.to_bits_le();
let rhs_bits = rhs.to_bits_le();
```

`UInt64::to_bits_le()` returns `self.bits.to_vec()` — a clone of the internally stored 64-element `Boolean` array. No runtime bit decomposition occurs; the bits are allocated at witness-construction time.

**Timing:** Constant with respect to the secret value.

### 2. Comparison loop

```rust
for i in (0..lhs_bits.len()).rev() {
    let l = lhs_bits[i].clone();
    let r = rhs_bits[i].clone();
    let l_and_not_r = l.and(&r.not())?;
    let greater_if_equal = equal.and(&l_and_not_r)?;
    greater = greater.or(&greater_if_equal)?;
    let bits_equal = l.xor(&r)?.not();
    equal = equal.and(&bits_equal)?;
}
```

- **Iteration count:** Fixed at 64. No early termination.
- **Operations per iteration:** Fixed sequence of `and`, `or`, `xor`, `not`, `clone`.
- **Branching:** None. The loop body contains no `if` statements conditioned on secret values.
- **Memory access pattern:** Sequential access through `lhs_bits` and `rhs_bits` (indices 63 → 0). Independent of bit values.

### 3. Return value

```rust
greater.or(&equal)
```

Single `or` operation. Constant time.

## Findings

| Check                          | Result              | Evidence                                                                                           |
| ------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------- |
| Secret-dependent branches      | **None found**      | Loop body is straight-line R1CS arithmetic; all 64 iterations execute identical operation sequence |
| Variable iteration count       | **None found**      | `lhs_bits.len()` is constant `64`                                                                  |
| Secret-dependent memory access | **None found**      | Array indices descend 63→0 regardless of values                                                    |
| Witness-assignment timing      | **Acceptable risk** | `UInt64::new_witness` closure returns constant; arkworks witness assignment is value-agnostic      |

## Risk Assessment

| Risk                              | Level                | Rationale                                                                                                                                             |
| --------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Timing leakage via `uint64_is_ge` | **Low / acceptable** | No secret-dependent code paths. Constraint-generation time is dominated by SHA-256 gadget evaluation, which dwarfs the comparison loop.               |
| Power-analysis leakage            | **Low / acceptable** | Same rationale. R1CS constraint addition is arithmetic-heavy; power signature is dominated by curve operations in SHA-256, not the 64-bit comparison. |

## Conclusion

`uint64_is_ge` is **acceptable as-is** from a side-channel perspective. The bit-decomposition comparison path has no secret-dependent branches, no variable iteration count, and no secret-dependent memory access. The function executes a fixed 64-iteration loop of R1CS boolean operations regardless of input values.

## Recommendations

1. **No code changes required** for `uint64_is_ge`.
2. **If future hardening is desired:** replace with a `subtle`-style constant-time comparison in the witness-assignment layer (native Rust, outside R1CS). This would protect the witness-generation phase but is unnecessary for the constraint-generation phase audited here.
3. **Monitor:** if `ark-r1cs-std` `UInt64` internals change in a future version, re-audit `to_bits_le()`.

## References

- `rust/gtcx-zkp/03-platform/src/groth16/mod.rs` lines 96–116
- `ark-r1cs-std` v0.4.0 `03-platform/src/bits/uint.rs` line 82 (`to_bits_le` implementation)
- `01-docs/09-security/zkp-sidechannels.md` — threat model and attacker model
