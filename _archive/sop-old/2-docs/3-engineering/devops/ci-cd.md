# CI/CD

CI/CD expectations for `gtcx-core`.

## CI — Every PR

The following checks must pass on every pull request:

| Gate                      | Command                   | Blocks   |
| ------------------------- | ------------------------- | -------- |
| Lint                      | `pnpm lint`               | PR merge |
| Type check                | `pnpm typecheck`          | PR merge |
| Tests                     | `pnpm test`               | PR merge |
| Architecture boundaries   | `pnpm architecture:check` | PR merge |
| Native binding smoke test | Native CI step            | PR merge |

## Release Workflow

Before a release:

| Gate                | Command                   | Action on Failure                                                  |
| ------------------- | ------------------------- | ------------------------------------------------------------------ |
| API baseline        | `pnpm api:check`          | Run `pnpm api:update-baseline` and get review                      |
| Performance budgets | `pnpm perf:check-budgets` | Investigate regression before releasing                            |
| UAT evidence        | Manual review             | Update UAT evidence log in `SOP/3-agile/`                          |
| Release checklist   | Manual review             | Complete `SOP/2-docs/4-operations/compliance/release-checklist.md` |

## Native Binding CI

Native bindings require platform-specific matrix builds:

- Linux x86_64
- Linux aarch64
- macOS x86_64
- macOS aarch64 (Apple Silicon)

Artifacts are cached per platform. Integration tests requiring `GTCX_REQUIRE_NATIVE=1` only run after the artifact is staged.

## References

- `SOP/2-docs/3-engineering/guides/build-and-test.md`
- `SOP/2-docs/4-operations/compliance/release-checklist.md`
- `SOP/2-docs/1-architecture/decisions/011-architecture-boundary-enforcement.md`
- `SOP/2-docs/1-architecture/decisions/013-api-baseline-and-performance-budget-gates.md`
