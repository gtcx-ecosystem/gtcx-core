# GTCX Core Engineering Standards

Foundational mandates for the `gtcx-core` repository. These standards ensure infrastructure-grade reliability (10/10) for global trade systems.

## 1. Error Taxonomy (ADR-012)

- All custom error classes in service and verification layers **MUST** inherit from `GtcxException` (from `@gtcx/types`).
- Use standardized `ErrorCode` values to ensure consistent cross-ecosystem error handling.
- Always preserve the causal chain by passing the `cause` option to the constructor.

## 2. Cryptographic Security & Sanitization

- **Mandatory Sanitization**: Before any object is logged or passed to a tracing callback, it **MUST** be sanitized using `sanitizeSecrets` from `@gtcx/security`.
- **Prohibited Data**: Never log raw private keys, seeds, mnemonics, or full unmasked API keys.
- **Revocation**: Verification logic for any signed credential (Certificates, DID Documents) **MUST** perform a revocation check using `checkRevocationStatus` or `assertNotRevoked`.

## 3. Mathematical Verification (10/10 Standards)

- **Rust Fuzzing**: All native cryptographic implementations (`rust/gtcx-crypto`, `rust/gtcx-zkp`) **MUST** include a `fuzz` target in the isolated fuzz workspace. Use `cargo-fuzz` with the nightly toolchain.
- **TS Property Testing**: Core mathematical abstractions in TypeScript **MUST** use `fast-check` for property-based verification. At minimum, prove the Legitimacy Axiom (valid inputs always pass) and Forgery Axiom (modified inputs never pass).

## 4. API & Architecture Boundaries

- **Baseline Protocol**: Any change to the public API surface requires an update to the baseline via `pnpm api:update-baseline`.
- **Layering Enforcement**: Circular dependencies and layering violations are blocked by `pnpm architecture:check`. Never use `--no-verify` to bypass these gates.
