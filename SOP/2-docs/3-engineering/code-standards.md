# Code Standards — gtcx-core

Coding standards for TypeScript packages and Rust crates in `gtcx-core`.

## TypeScript

| Rule             | Standard                                                       |
| ---------------- | -------------------------------------------------------------- |
| Strict mode      | `"strict": true` in `tsconfig.json` — no exceptions            |
| No `any`         | Use `unknown` and narrow, or define a proper type              |
| Return types     | Explicit return types on all exported functions                |
| Imports          | ESM only — `import`/`export`, never `require()`                |
| Constants        | `const` by default — `let` only when reassignment is necessary |
| Barrel exports   | Every package exposes its public API through `index.ts`        |
| Test co-location | `foo.ts` and `foo.test.ts` in the same directory               |

## Rust

| Rule             | Standard                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Linting          | `cargo clippy -- -D warnings` must pass — no suppression without justification                |
| Formatting       | `cargo fmt` enforced in CI                                                                    |
| Unsafe blocks    | No `unsafe` in `@gtcx/*`-adjacent binding code without Cryptographic Security Engineer review |
| Public functions | All `pub` functions have doc comments                                                         |
| Panic safety     | Document any `unwrap()` or `expect()` call at the FFI boundary                                |

## Error Handling

Per ADR-012: all errors in public paths use typed codes and preserve `cause`.

```typescript
import { GtcxError, ErrorCode } from '@gtcx/types';

throw new GtcxError(ErrorCode.ValidationFailed, 'message', { cause: err });
```

No swallowed exceptions. No empty catch blocks. Errors must be logged or propagated — never silently dropped.

## General

- **Early returns over nested ifs** — reduce indentation depth.
- **Small functions** — target under 30 lines. If longer, it likely does too much.
- **Meaningful names** — reveal intent. No single-letter variables outside trivial loops.
- **No magic numbers** — extract named constants.
- **Comments explain why, not what** — the code is the what.

## AI-Generated Code

AI-generated code is held to the same standard as human-written code. It must pass all linting, type-checking, and test gates before merge.

Additional scrutiny required:

- Verify all imports resolve to real, installed packages at the correct version.
- Check API signatures against the actual library — AI frequently generates against outdated or hallucinated signatures.
- Read it as carefully as a junior engineer's first PR — AI output looks plausible and compiles but can be subtly wrong at boundaries and edge cases.
- Verify test assertions are meaningful, not just implementation mirrors.

## References

- `SOP/2-docs/1-architecture/decisions/012-error-taxonomy-and-cause-propagation.md`
- `SOP/2-docs/3-engineering/testing/quality-standards.md`
- `SOP/2-docs/3-engineering/guides/code-review.md`
