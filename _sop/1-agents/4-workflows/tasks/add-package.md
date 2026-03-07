# Task Playbook: Add a TypeScript Package

**Owner:** Protocol Architect (design) + Quality & Evidence Lead (gates)
**Safety tier:** Requires human approval before proceeding

---

## When to Run This

Run when a new `@gtcx/*` package is being added to the workspace. This playbook covers the full lifecycle from approval through CI-passing state.

Do not begin implementation until human approval is confirmed. Adding a package modifies `pnpm-workspace.yaml`, which is an approval-required file.

---

## Pre-Flight

Confirm with the human reviewer:

- Package name and scope (`@gtcx/<name>`)
- Responsibility: what this package does that no existing package does
- Dependency direction: what it may import from, what may import from it
- Whether it is security-sensitive (if yes: Cryptographic Security Engineer must be involved from the start)

Then read:

- `_sop/2-docs/5-specs/4-backend/core-spec.md` — confirm the new package is within scope
- `_sop/2-docs/3-engineering/2-system-design/overview.md` — confirm the dependency direction is valid
- `_sop/2-docs/3-engineering/6-decisions/011-package-dependency-boundaries.md` — boundary rules
- `_sop/1-agents/4-workflows/safety-rules.md`

---

## Steps

### 1. Write the package spec

Before creating any code, write the package spec at:

```
_sop/2-docs/5-specs/4-backend/packages/<package-name>.md
```

The spec must include:

- Purpose and responsibility
- What it may depend on (imports allowed)
- What may depend on it (downstream consumers)
- Public API surface (exports)
- Error types following ADR-012 taxonomy
- Test requirements

---

### 2. Write an ADR if the package changes architectural boundaries

If the new package introduces a new layer, a new dependency direction, or a new cross-package contract, write an ADR before any code. See `_sop/1-agents/4-workflows/tasks/write-adr.md`.

---

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
- `"private": false` if publishable; `"private": true` if internal only

---

### 4. Update `pnpm-workspace.yaml`

Add the new package to the packages array. Human approval confirmed in pre-flight covers this step.

---

### 5. Update `turbo.json` if the package has build outputs

Add the package's build pipeline if it differs from the default.

---

### 6. Update `tools/check-package-boundaries.mjs`

Add the new package's allowed dependency set. Do not grant broader permissions than the spec allows. Requires human approval.

---

### 7. Update the spec-to-code traceability matrix

Add an entry in `_sop/2-docs/3-engineering/5-compliance/spec-to-code-traceability.md` mapping the new package spec to its implementation module.

---

### 8. Update indexes

- `_sop/2-docs/3-engineering/6-decisions/README.md` — if an ADR was written
- `_sop/2-docs/5-specs/4-backend/packages/README.md` — add the new package

---

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

---

## Post-Flight

- [ ] Package spec exists at `_sop/2-docs/5-specs/4-backend/packages/<name>.md`
- [ ] ADR exists if architectural boundary was changed
- [ ] All CI gates pass
- [ ] `pnpm-workspace.yaml` updated (with prior human approval)
- [ ] `tools/check-package-boundaries.mjs` updated (with prior human approval)
- [ ] Traceability matrix updated
- [ ] Package spec index updated

---

## Hard Rules

- Never add a package without prior human approval
- Never create a package that imports from `@gtcx/crypto` without Protocol Architect and Cryptographic Security Engineer review
- Never publish a package that has not passed all CI gates
- Never allow a new package to create a circular dependency

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../../../2-docs/5-specs/4-backend/core-spec.md) — scope and constraints
- [`_sop/2-docs/3-engineering/6-decisions/`](../../../2-docs/3-engineering/6-decisions/) — ADR index
- [`_sop/1-agents/4-workflows/tasks/write-adr.md`](./write-adr.md) — ADR workflow
- [`_sop/1-agents/4-workflows/safety-rules.md`](../safety-rules.md) — approval requirements
