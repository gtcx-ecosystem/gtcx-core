# Contributing to gtcx-core

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.15.0
- Rust >= 1.75.0 (for Rust crates)

## Setup

```bash
git clone https://github.com/gtcx-ecosystem/gtcx-core.git
cd gtcx-core
pnpm install
pnpm build
pnpm test
```

## Development Workflow

### Run a single package

```bash
pnpm --filter @gtcx/crypto test
pnpm --filter @gtcx/crypto test:watch
pnpm --filter @gtcx/crypto lint
```

### Quality gates (must pass before commit)

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Pre-commit hooks enforce these automatically via Husky.

## Making Changes

1. Create a branch from `main`
2. Make your changes
3. Run quality gates locally
4. Open a PR against `main`

### Commit messages

Use conventional commits: `type(scope): subject`

```
fix(crypto): handle invalid hex in sign()
feat(domain): add batch validation for asset lots
test(security): add JWT audience mismatch test
chore(deps): bump vitest to 3.2
```

### Changesets

For any user-facing change, add a changeset:

```bash
pnpm changeset
```

This creates a markdown file in `.changeset/` describing the change and its semver impact.

## Architecture Rules

- **No circular dependencies** between packages
- **No cross-package deep imports** (use the package, not `../../other-package/src/`)
- **Zod validation at boundaries** — all external input validated with schemas
- **workspace: protocol** for all internal `@gtcx/*` references
- Security-sensitive packages (`crypto`, `security`, `identity`, `verification`, `crypto-native`) require review from the Cryptographic Security Engineer role

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

Do not:

- Commit `.env` files or secrets
- Implement custom cryptographic primitives
- Skip CI gates (`--no-verify`)
- Force push to `main`

## Dependency Management (Dependabot)

### SLA

| Severity                       | Review SLA | Merge SLA |
| ------------------------------ | ---------- | --------- |
| Security ( Dependabot alerts ) | 72 hours   | 7 days    |
| Routine (version bumps)        | 2 weeks    | 4 weeks   |

### Process

1. **Review** — Assess changelog, breaking changes, and security impact.
2. **Test** — Run `pnpm test` and `pnpm build` in the affected workspace.
3. **Group** — Prefer grouped updates (e.g., `@gtcx/*` devDependencies) to reduce noise.
4. **Merge** — Only after all CI gates pass; never force-merge a Dependabot PR.

### Cleanup

Before each GA release, ensure:

- All open Dependabot security PRs are merged or explicitly deferred with a documented justification.
- No stale Dependabot branches remain open (> 30 days).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
