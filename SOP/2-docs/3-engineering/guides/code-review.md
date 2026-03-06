# Code Review — gtcx-core

Code review expectations for `gtcx-core` PRs.

## Before Reviewing

Do not start reading code until you understand what the PR is trying to do.

1. Read the PR description. If there is none, request one before reviewing.
2. Check linked specs. Open the referenced spec or ADR. Understand the expected behavior.
3. Look at the file list. Understand the scope before reading diffs.

## What to Review

| Area                        | Check                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| Architecture boundaries     | No circular deps, no phantom imports — run `pnpm architecture:check`                       |
| Type safety                 | Zero `any`, strict mode, explicit return types on exports                                  |
| Error handling              | ADR-012 taxonomy — typed codes, `cause` preserved, no swallowed exceptions                 |
| Tests                       | Coverage for changed paths, tests assert the spec not the implementation                   |
| Security-sensitive packages | Flag immediately — Cryptographic Security Engineer review required                         |
| AI-generated code           | Review with same rigour as human-written — verify edge cases, boundary conditions, imports |

## Security-Sensitive Packages

If a PR touches any of these, do not approve without Cryptographic Security Engineer review:

- `@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`
- `rust/gtcx-crypto`, `rust/gtcx-zkp`

## AI-Generated Code — Extra Scrutiny

AI output looks plausible and compiles but fails differently than human-written code.

- **Verify imports** — AI hallucinates package names and module paths. Confirm every import resolves to a real, installed dependency.
- **Check API signatures** — AI generates against outdated or imagined signatures. Verify method names, parameter order, and return types match the installed library version.
- **Read for subtle errors** — off-by-one, wrong async assumptions, incorrect default values. Do not skim.
- **Check test assertions** — AI tests often mirror the implementation rather than asserting behavior. A test that only confirms the mock was called is not a test.
- **Watch for over-engineering** — unnecessary abstractions, redundant wrappers, overly generic solutions for specific problems.

## Blocking vs. Non-Blocking

**Blocking** — must be resolved before approval:

- Broken architecture gate or CI failure
- Security finding in any package
- Breaking API change without a filed ADR
- Missing test coverage on critical paths (crypto, identity, sync)
- Protocol violation: `any`, swallowed error, skipped test

**Non-blocking** — mark explicitly as `nit:`:

- Style preferences within spec (e.g., `nit: prefer early return here`)
- Suggestions that do not affect correctness or safety

## Merge Criteria

- All CI gates green
- Minimum 1 approval
- No unresolved blocking comments
- ADR filed if the change affects architecture boundaries or a public package API

## References

- `SOP/2-docs/3-engineering/code-standards.md`
- `SOP/2-docs/3-engineering/naming-conventions.md`
- `SOP/2-docs/3-engineering/devops/ci-cd.md`
- `SOP/1-agents/safety-rules.md`
- `SOP/2-docs/1-architecture/decisions/011-architecture-boundary-enforcement.md`
- `SOP/2-docs/1-architecture/decisions/012-error-taxonomy-and-cause-propagation.md`
