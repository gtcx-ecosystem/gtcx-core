# Task Playbook: Add a TypeScript Package

**Owner**: Protocol Architect (design) + Quality & Evidence Lead (gates)
**Safety tier**: Requires human approval before proceeding

## When to Run This

Run this playbook when a new `@gtcx/*` package is being added to the workspace. This playbook covers the full lifecycle from approval through CI-passing state.

Do not begin implementation until human approval is confirmed. Adding a package changes `pnpm-workspace.yaml`, which is an approval-required file.

## Pre-Flight

Confirm with the human reviewer:

- Package name and scope (`@gtcx/<name>`)
- Responsibility: what this package does that no existing package does
- Dependency direction: what it may import from, what may import from it
- Whether it is security-sensitive (requires Cryptographic Security Engineer involvement)

Then read:

- `SOP/2-docs/2-specs/core-spec.md` — confirm the new package is within scope
- `SOP/2-docs/1-architecture/overview.md` — confirm the dependency direction is valid
- `SOP/2-docs/1-architecture/decisions/011-package-dependency-boundaries.md` — boundary rules
- `SOP/1-agents/safety-rules.md`

## Steps

### 1. Write the package spec

Before creating any code, write the package spec at:

`SOP/2-docs/2-specs/packages/<package-name>.md`

The spec must include:

- Purpose and responsibility
- What it may depend on (imports allowed)
- What may depend on it (downstream consumers)
- Public API surface (exports)
- Error types following ADR-012 taxonomy
- Test requirements

### 2. Write an ADR if the package changes architectural boundaries

If the new package introduces a new layer, a new dependency direction, or a new cross-package contract, write an ADR first. See `SOP/1-agents/tasks/write-adr.md`.

### 3. Scaffold the package

```bash
mkdir -p packages/<name>/src
```

Minimum required files:

```
packages/<name>/
  package.json          — name: "@gtcx/<name>", version: "0.1.0"
  tsconfig.json         — extends ../../tsconfig.base.json
  src/index.ts          — public exports only
  src/<name>.ts         — implementation
  tests/<name>.test.ts  — Vitest tests
  README.md             — package description and usage
```

`package.json` must include:

- `"main"`, `"types"`, `"exports"` fields
- All internal `@gtcx/*` deps declared — no phantom dependencies
- `"private": false` if it will be published; `"private": true` if internal only

### 4. Update `pnpm-workspace.yaml`

Add the new package to the packages array. This requires the human approval already confirmed in pre-flight.

### 5. Update `turbo.json` if the package has build outputs

Add the package's build pipeline if it differs from the default.

### 6. Update `tools/check-package-boundaries.mjs`

Add the new package's allowed dependency set. Do not grant broader permissions than the spec allows.

### 7. Update the spec-to-code traceability matrix

Add an entry in `SOP/2-docs/4-operations/compliance/spec-to-code-traceability.md` mapping the new package spec to its implementation module.

### 8. Update the ADR index and package spec index

- `SOP/2-docs/1-architecture/decisions/README.md` if an ADR was written
- `SOP/2-docs/2-specs/packages/README.md` — add the new package

### 9. Run all gates

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm api:check
```

All gates must pass before the package is considered complete.

## Post-Flight

- Package spec exists at `SOP/2-docs/2-specs/packages/<name>.md`
- ADR exists if architectural boundary was changed
- All CI gates pass
- `pnpm-workspace.yaml` updated (with prior human approval)
- `tools/check-package-boundaries.mjs` updated
- Traceability matrix updated
- Package spec index updated

## Hard Rules

- Never add a package without prior human approval
- Never create a package that imports from `@gtcx/crypto` without Protocol Architect and Cryptographic Security Engineer review
- Never publish a package that has not passed all CI gates
- Never allow a new package to create a circular dependency
