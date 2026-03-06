# ADR-009: TypeScript Fallback When Rust Bindings Unavailable

## Status

Accepted

## Date

2025-01-15

## Context

The Rust cryptographic foundation (ADR-001) provides optimal performance, but native bindings require:

- Platform-specific pre-built binaries (macOS/Linux/Windows × x86_64/aarch64)
- Rust toolchain for compilation from source
- NAPI-RS runtime for Node.js, WASM compilation for browsers

Not all environments have native bindings available:

- CI environments may not have pre-built binaries for every platform
- Development machines may not have the Rust toolchain installed
- Browser environments need WASM, which may not be built yet
- Edge environments have strict binary size constraints

If the system hard-requires native bindings, a missing binary would be a fatal error — blocking development, testing, and deployment in any environment that lacks the exact platform match.

## Decision

TypeScript packages (`@gtcx/crypto`) provide the developer-facing API and automatically fall back to pure-JavaScript implementations when native Rust bindings are unavailable.

The fallback strategy:

1. At import time, attempt to load `@gtcx/crypto-native` (NAPI-RS bindings)
2. If loading fails (missing binary, wrong platform, not installed), fall back to `@noble/curves` (Ed25519) and `@noble/hashes` (SHA-256, Blake3)
3. The public API (`sign()`, `verify()`, `hash()`, `generateKeyPair()`) is identical regardless of backend
4. A `getBackend()` function reports which implementation is active ("native" or "js")
5. Performance characteristics differ (15x–120x slower in JS mode) but correctness is identical

The `@noble/*` libraries were chosen as the JS fallback because:

- Audited, well-maintained, and widely used
- Zero dependencies
- Constant-time implementations (side-channel resistant)
- Produce identical outputs to the Rust implementations (same algorithms, same curves)

## Consequences

### Positive

- System never fails due to missing native bindings — graceful degradation
- Developers can work without installing the Rust toolchain
- CI environments work out of the box on any platform
- Browser builds work before WASM compilation is set up
- Identical API surface regardless of backend — no conditional imports in consumer code

### Negative

- Must maintain test parity between Rust and JS implementations (same inputs → same outputs)
- JS fallback is 15x–120x slower — unsuitable for production validators processing high volumes
- Two codebases implementing the same algorithms increases maintenance surface
- Subtle behavioral differences could emerge if implementations diverge

### Neutral

- Production deployments should always use native bindings for performance
- The fallback is primarily for development, testing, and edge cases
- `getBackend()` allows consumers to warn or fail if JS fallback is active in production
