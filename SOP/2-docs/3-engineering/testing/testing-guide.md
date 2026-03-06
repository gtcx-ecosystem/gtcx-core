# Testing Guide — gtcx-core

Test framework, patterns, coverage targets, and organization for `gtcx-core`.

## Framework

| Language   | Framework                           |
| ---------- | ----------------------------------- |
| TypeScript | **Vitest** (all packages)           |
| Rust       | `cargo test` (unit and integration) |

## Coverage Targets

### Aggregate (TypeScript)

| Metric     | Minimum |
| ---------- | ------- |
| Statements | ≥ 85%   |
| Lines      | ≥ 85%   |
| Branches   | ≥ 80%   |
| Functions  | ≥ 75%   |

### Critical Packages

The following packages have stricter enforcement through `pnpm test:coverage:critical`:

| Package              | Why                                              |
| -------------------- | ------------------------------------------------ |
| `@gtcx/crypto`       | Cryptographic primitives — correctness is safety |
| `@gtcx/domain`       | Core domain logic consumed by all platform repos |
| `@gtcx/security`     | Auth, audit, offline credentials                 |
| `@gtcx/services`     | Registration, trading, compliance workflows      |
| `@gtcx/verification` | Certificate and proof bundle generation          |

### Rust

Run `cargo test --workspace --lib` as part of every CI cycle. Coverage reporting is not enforced, but all public functions must have at least one test.

## Test Types

### Unit Tests

- Isolated from external systems.
- Mock file systems, network, and clock.
- Should run in milliseconds per test — the full suite should complete in seconds.
- One behavioral assertion focus per test; multiple related assertions are fine.

### Integration Tests

Live in `tests/integration/`. Test real interactions between packages.

- Use in-memory state — no external services required.
- Reset state between tests; no test may depend on another's side effects.
- Run as part of `pnpm test`.

### Rust Unit Tests

Live in the same file as the code under test (`#[cfg(test)] mod tests`). Integration tests live in `rust/<crate>/tests/`.

## Naming

Use `describe` blocks for context and `it`/`test` for behavior:

```typescript
describe('KeyManager', () => {
  describe('when generating an Ed25519 keypair', () => {
    it('should return a 32-byte public key', () => {
      // ...
    });

    it('should return a 64-byte private key', () => {
      // ...
    });
  });
});
```

Test names should read as sentences: _"KeyManager, when generating an Ed25519 keypair, should return a 32-byte public key."_

## Test Organization

- **Co-located**: `crypto.ts` has tests in `crypto.test.ts` in the same directory.
- **Shared fixtures**: place in `__fixtures__/` at the nearest common ancestor.
- **Test utilities**: place in `src/test/` or `tests/` (helpers, factories, custom matchers).

## What Must Be Tested

| Area                                     | Why                                           |
| ---------------------------------------- | --------------------------------------------- |
| All public API functions                 | These are the package contract                |
| Cryptographic operations                 | Correctness failures are security failures    |
| Error paths and rejection cases          | Callers depend on correct error types         |
| Schema validation (Zod)                  | Invalid inputs must be caught at the boundary |
| Proof bundle generation and verification | Core protocol correctness                     |
| State machines and workflow transitions  | Consistency guarantees                        |
| Serialization and deserialization        | Data format contract                          |

## What Can Skip Tests

| Area                            | Reason                                         |
| ------------------------------- | ---------------------------------------------- |
| Pure configuration files        | No logic to test                               |
| Type definition files (`.d.ts`) | Types are verified by the compiler             |
| Barrel exports (`index.ts`)     | Only re-exports; underlying modules are tested |

## Cryptographic Test Patterns

Cryptographic code requires additional discipline beyond standard unit testing:

1. **Use known vectors.** Where NIST, RFC, or W3C test vectors exist, use them. Do not rely solely on round-trip tests.
2. **Test rejection cases.** Verify that malformed keys, truncated signatures, and wrong-curve inputs are rejected.
3. **Test constant-time invariants where possible.** If a function claims to be constant-time, document that claim and test with timing-sensitive inputs.
4. **Do not test randomness.** Randomness cannot be deterministically unit tested — test the properties of the output (length, distribution), not the exact value.

## Commands

```bash
# Run all tests
pnpm test

# Run tests for a single package
pnpm turbo test --filter=@gtcx/crypto

# Run critical coverage check
pnpm test:coverage:critical

# Run Rust tests
cargo test --workspace --lib

# Run integration tests only
pnpm test --project=integration
```

## References

- [quality-standards.md](./quality-standards.md) — CI gate thresholds and enforcement
- [code-standards.md](../code-standards.md) — test co-location rules
- [quality-runbook.md](../../4-operations/runbooks/quality-runbook.md) — triage order when gates fail
