---
title: "Task Playbook: Add a Secondary-Language Component"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "agents"]
review_cycle: "on-change"
---

---
title: 'Add Secondary Component'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'agentic']
review_cycle: 'on-change'
---

# Task Playbook: Add a Secondary-Language Component

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Owner:** Frontier Infrastructure Engineer or Cryptographic Security Engineer (depending on crate type)
**Safety tier:** Requires human approval before proceeding

---

## When to Run This

Run when a new Rust crate is being added to the `rust/` workspace. This covers:

- New cryptographic primitive crates — owner: Cryptographic Security Engineer
- New native binding targets — owner: Frontier Infrastructure Engineer
- New network or edge runtime crates — owner: Frontier Infrastructure Engineer

See [`add-rust-crate.md`](./add-rust-crate.md) for the full gtcx-core-specific Rust playbook. This document covers the general pattern.

Do not begin until human approval is confirmed. All secondary-language component additions require explicit approval.

---

## Pre-Flight

Confirm with the human reviewer:

- Crate name (`gtcx-<name>`)
- Type: cryptographic / native binding / network / edge
- Whether it exposes NAPI bindings (affects `rust/gtcx-node`)
- Whether it introduces a new FIPS boundary (requires Cryptographic Security Engineer sign-off)

Then read:

- `docs/specs/packages/rust/README.md` — existing crate inventory
- ADR-001 (`001-rust-for-cryptography.md`) — why Rust, what it covers
- The relevant component spec if the new component extends an existing one
- `docs/agents/workflows/safety-rules.md`

---

## Steps

### 1. Write the component spec

Before creating any code, write the crate spec at:

```
docs/specs/packages/rust/<crate-name>.md
```

The spec must include:

- Purpose and responsibility
- Algorithms or protocols used (if applicable) — reference standards and approval status
- Binding surface to primary language (if applicable)
- Performance budget targets
- Test requirements and test vector sources (if applicable)
- Dependencies — justify each one

---

### 2. Write an ADR if the component establishes a new protocol boundary

If the component introduces a new algorithm, a new binding contract, or a new security boundary, write an ADR before any code. See `docs/agents/workflows/tasks/write-adr.md`.

---

### 3. Scaffold the component

Minimum required files:

```
rust/<crate-name>/
  Cargo.toml     — name: "gtcx-<name>", version: "0.1.0"
  src/lib.rs     — public API
  tests/         — integration tests
  benches/       — if performance-sensitive
```

Requirements:

- No unnecessary dependencies — every dep must be justified in the spec
- Feature flags documented if used

---

### 4. Update the workspace manifest

Add the new crate to `rust/Cargo.toml` workspace `members` array.

---

### 5. If the component exposes bindings to the primary language

Coordinate with the owner of the binding layer. The binding surface must be reviewed before any binding is exposed. Update the relevant spec to document the new binding dependency.

---

### 6. Update the component spec index

Add the new crate to `docs/specs/packages/rust/README.md`.

---

### 7. Update the spec-to-code traceability matrix

Add an entry in `docs/compliance/spec-to-code-traceability.md`.

---

### 8. Run component gates

```bash
cargo build --release --manifest-path rust/<crate-name>/Cargo.toml
cargo test --manifest-path rust/<crate-name>/Cargo.toml
cargo clippy --manifest-path rust/<crate-name>/Cargo.toml -- -D warnings
```

For cryptographic crates: run against known test vectors before marking complete.

---

### 9. Run full workspace gates

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## Post-Flight

- [ ] Crate spec exists at `docs/specs/packages/rust/<crate-name>.md`
- [ ] ADR exists if a new protocol boundary was established
- [ ] Crate listed in `docs/specs/packages/rust/README.md`
- [ ] `rust/Cargo.toml` workspace members updated
- [ ] All Rust gates pass
- [ ] All workspace gates pass
- [ ] Traceability matrix updated

---

## Hard Rules

- Never add a cryptographic crate without Cryptographic Security Engineer co-ownership from day one
- Never use an unaudited cryptographic library — check `docs/security/` for approved libraries
- Never implement a custom cryptographic primitive — use existing audited implementations in `rust/gtcx-crypto`
- Never expose a NAPI binding without security review of the FFI surface
- Never add a crate without prior human approval

---

## Reference

- [`docs/specs/packages/`](../../../specs/packages/) — component specifications
- [`docs/decisions/`](../../../decisions/) — ADR index
- [`docs/agents/workflows/tasks/write-adr.md`](./write-adr.md) — ADR workflow
- [`docs/agents/workflows/safety-rules.md`](../safety-rules.md) — approval requirements
