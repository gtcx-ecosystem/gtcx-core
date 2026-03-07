# AI-Assisted Development — gtcx-core

How to use AI effectively for code generation in `gtcx-core`.

## Philosophy

AI is a force multiplier, not a replacement for engineering judgment.

- **AI generates, humans decide.** The AI proposes code; you accept, modify, or reject it. You are the architect. The AI is the typist.
- **Every line of AI code gets the same scrutiny as human code.** There is no "the AI wrote it" exemption from code review, testing, or security standards.
- **AI accelerates the boring parts** — boilerplate, scaffolding, test stubs — so you can spend more time on the interesting parts: cryptographic protocol design, edge cases, and performance.

## When to Use AI

### Good Uses

| Task                     | Why It Works                                  |
| ------------------------ | --------------------------------------------- |
| Scaffolding new packages | Repetitive structure, well-defined patterns   |
| Writing test stubs       | Pattern-heavy, benefits from coverage breadth |
| Generating boilerplate   | Module wiring, barrel exports, config files   |
| Refactoring              | Mechanical transformations across many files  |
| Documentation            | Summarizing code intent, generating API docs  |
| Data transformations     | Schema mapping, serialization, parsing logic  |

### Use with Extra Caution

| Task                              | Why to Be Careful                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Cryptographic implementations     | AI reproduces patterns, not proofs. Verify against RFCs and test vectors — not just round-trip tests. |
| ZKP circuit logic                 | AI has no concept of proof correctness or circuit soundness. Human review is mandatory.               |
| FFI boundary code (Rust ↔ TS)     | Incorrect memory layout, lifetime assumptions, or null handling can cause silent corruption.          |
| Security-critical auth logic      | AI often produces "looks right" auth code with subtle bypasses. Verify every branch.                  |
| Novel consensus or protocol logic | AI reproduces common patterns — not novel correct ones. Reference the ADRs and specs directly.        |

## Prompt Patterns

### Context-First

Provide file paths, existing patterns, and constraints **before** asking for code.

```
Here is our @gtcx/crypto key generation pattern:
- File: packages/crypto/src/keys.ts
- We use the Rust gtcx-crypto crate via NAPI-RS for performance
- TypeScript fallback lives in packages/crypto/src/fallback/
- All functions return Result<T, GtcxError> — never throw

Generate a new key derivation function following this pattern.
```

### Incremental

Build up in small pieces. Do not ask for an entire package at once.

1. Generate the module scaffold and type signatures
2. Review and adjust
3. Generate the implementation
4. Review and adjust
5. Generate tests
6. Review and adjust

### Reference-Driven

Point the AI at existing code to match patterns.

```
Look at packages/crypto/src/signing.ts.
Generate a similar module for key agreement (ECDH).
Match the error handling, GtcxError taxonomy, and NAPI-RS fallback pattern exactly.
```

### Constraint-Explicit

State constraints up front. Do not assume the AI knows your stack.

```
Requirements:
- Use Vitest, not Jest
- Follow the @gtcx/* package pattern (barrel exports, co-located tests)
- Use TypeScript strict mode — no any, explicit return types
- Error handling via ADR-012 GtcxError taxonomy
- ESM modules only
- pnpm workspace — do not add npm/yarn commands
```

## Review Process for AI Code

Every piece of AI-generated code must pass through these steps before merge.

### Step 1: Does it compile, lint, and pass types?

```bash
pnpm turbo build --filter=<package>
pnpm turbo lint --filter=<package>
pnpm turbo typecheck --filter=<package>
```

If it does not compile cleanly, fix or regenerate before continuing.

### Step 2: Does it follow project conventions?

Check against:

- [code-standards.md](../code-standards.md) — TypeScript and Rust rules
- [naming-conventions.md](../naming-conventions.md) — naming and structure
- [testing-guide.md](../testing/testing-guide.md) — test patterns

### Step 3: Are there hallucinated imports, APIs, or packages?

AI models frequently invent:

- Package names that don't exist on npm or crates.io
- Function signatures that don't match the actual library API
- Config options that are not real

**Verify every import.** Run `pnpm install` and confirm no resolution failures. For Rust: `cargo check` before running tests. Spot-check function calls against official documentation.

### Step 4: Security review

For `gtcx-core`, look specifically for:

- Cryptographic operations using incorrect key sizes, weak curves, or missing authentication tags
- FFI boundary handling that could cause use-after-free or buffer overflow in Rust bindings
- Authentication bypass (missing guards, incorrect middleware order)
- Data exposure in error messages (stack traces with key material, raw secret bytes)
- Insecure defaults in key generation or signing parameters

### Step 5: Does it handle edge cases or just the happy path?

AI-generated code tends to handle the sunny-day scenario and ignore:

- Empty inputs, zero-length buffers, null bytes in data
- Concurrent access to shared key material
- Network failures during verification requests
- Malformed or truncated cryptographic structures
- Version mismatches in protocol messages

### Step 6: Are tests meaningful or just asserting the implementation?

Watch for tests that:

- Only test with known-good inputs (no rejection cases)
- Mock the crypto layer entirely, so nothing cryptographic is actually tested
- Assert the exact implementation rather than the behavior
- Use hardcoded values that happen to match without validating correctness

## Hallucination Prevention

### Package Verification

Before committing any AI-suggested dependency:

```bash
# npm
npm info <package-name> version

# Rust
cargo search <crate-name>
```

### API Signature Verification

Cross-check function signatures against official documentation. Do not trust the AI's memory of an API — especially for NAPI-RS, which has a less common pattern.

### Common Hallucination Patterns in gtcx-core Context

- **Invented crate names**: The AI will invent `gtcx-zkp-utils` as if it exists in crates.io. It does not.
- **Wrong NAPI-RS patterns**: The AI may generate incorrect `#[napi]` annotations or wrong type mappings.
- **Merged cryptographic library versions**: The AI combines features from different versions of a crypto library into code that compiles in none of them.
- **Fabricated ZKP APIs**: The AI will invent plausible-sounding circuit compilation APIs that don't exist.

## Autonomous Agent Workflow

When running longer autonomous tasks in this repo:

### Before Starting

1. CLAUDE.md is current and accurate.
2. Memory files are up to date: `.claude/memory/MEMORY.md`.
3. Objective is clearly defined — write it down before starting.
4. Reference patterns are identified (which existing file should the new code match?).
5. Test infrastructure is confirmed working (`pnpm test` passes on main).

### During Execution

- Work incrementally — commit at each verifiable checkpoint.
- Run `pnpm test && pnpm typecheck` at each checkpoint.
- Stop at decision points that affect public API contracts or shared types.
- Document decisions in commit messages or a session recap.

### After Completing

1. Run full gate sequence: `pnpm test && pnpm build && pnpm lint && pnpm typecheck`.
2. Run critical coverage check: `pnpm test:coverage:critical`.
3. Write session recap to `SOP/4-sessions/`.
4. Update memory files if new patterns were confirmed.

## Anti-Patterns

| Anti-Pattern                                            | Why It Is Dangerous                                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Accepting large cryptographic blocks without reading    | You are now maintaining crypto code you don't understand — a security liability         |
| Skipping tests because "the AI wrote it correctly"      | AI crypto code has the same error rate as human crypto code, sometimes higher           |
| Not checking if generated Rust dependencies exist       | Phantom crates can break the build or, worse, be typosquatting vectors                  |
| Letting AI make architectural decisions without review  | Architecture requires ADR context and security tradeoffs the AI cannot access           |
| Trusting AI for ZKP circuit correctness                 | Circuit soundness is a formal property — AI cannot verify it                            |
| Copy-pasting AI output across packages without adapting | Each package has its own patterns and error taxonomy; blind reuse creates inconsistency |

## References

- [code-standards.md](../code-standards.md)
- [code-review.md](./code-review.md)
- [testing-guide.md](../testing/testing-guide.md)
- [context-recovery.md](../../1-agents/context-recovery.md)
- [safety-rules.md](../../1-agents/safety-rules.md)
- ADR-012: [Error Taxonomy](../../2-docs/1-architecture/decisions/012-error-taxonomy-and-cause-propagation.md)
