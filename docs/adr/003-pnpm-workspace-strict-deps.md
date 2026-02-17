# ADR-003: pnpm Workspaces with Strict Dependency Resolution

## Status

Accepted

## Date

2025-01-15

## Context

GTCX Core is a monorepo containing 15+ TypeScript packages under the `@gtcx/` scope, plus shared configuration packages. Package managers handle dependency resolution differently:

- **npm** — Flat `node_modules` with hoisting. Packages can accidentally import dependencies they don't declare (phantom dependencies). Non-deterministic resolution in edge cases.
- **Yarn (v1/classic)** — Similar hoisting behavior to npm. Yarn v2+ (Berry) uses Plug'n'Play which breaks many tools.
- **pnpm** — Content-addressable store with strict isolation. Each package can only access dependencies it explicitly declares. Deterministic installs via lockfile.

Phantom dependencies are a security and reliability risk: a package may work in development (where a transitive dependency is hoisted) but fail in production (where it's not). In a security-sensitive system like GTCX, this is unacceptable.

## Decision

Use pnpm workspaces with strict dependency resolution for the entire monorepo.

- `pnpm@9.15.0` pinned via `packageManager` field in root `package.json`
- Workspace protocol (`workspace:*`) for all internal dependencies
- Turborepo for parallel builds, type-checking, linting, and testing
- `pnpm-workspace.yaml` defines the package topology
- `shamefully-hoist: false` (default) — strict mode enforced

## Consequences

### Positive

- Zero phantom dependencies — every import must be explicitly declared
- Deterministic installs across all environments (dev, CI, production)
- Disk-efficient: content-addressable store deduplicates across packages
- Fast installs: hard links instead of copies, excellent caching
- Workspace protocol ensures internal packages always resolve to local versions

### Negative

- Some third-party packages assume npm-style hoisting and may need workarounds
- Developers unfamiliar with pnpm need to learn `pnpm add`, `pnpm -w`, workspace syntax
- `node_modules/.pnpm` structure is less intuitive to debug than flat `node_modules`

### Neutral

- Turborepo caching integrates well with pnpm workspaces (both use content hashing)
- CI uses `actions/setup-node@v4` with pnpm caching for fast pipeline execution
