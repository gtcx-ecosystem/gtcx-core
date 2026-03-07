# Task Playbook: Add a Rust Crate

**Owner:** Frontier Infrastructure Engineer or Cryptographic Security Engineer (depending on crate type)
**Safety tier:** Requires human approval before proceeding

---

## When to Run This

Run when a new Rust crate is being added to the `rust/` workspace. This covers:

- New cryptographic primitive crates — owner: Cryptographic Security Engineer
- New native binding targets — owner: Frontier Infrastructure Engineer
- New network or edge runtime crates — owner: Frontier Infrastructure Engineer

Do not begin until human approval is confirmed. All Rust crate additions require explicit approval.

---

## Pre-Flight

Confirm with the human reviewer:

- Crate name (`gtcx-<name>`)
- Type: cryptographic / native binding / network / edge
- Whether it exposes NAPI bindings (affects `rust/gtcx-node`)
- Whether it introduces a new FIPS boundary (requires Cryptographic Security Engineer sign-off)

Then read:

- `_sop/2-docs/5-specs/4-backend/packages/rust/README.md` — existing crate inventory
- `_sop/2-docs/3-engineering/6-decisions/001-rust-for-cryptographic-primitives.md` — why Rust, what it covers
- The relevant crate spec if the new crate extends an existing one
- `_sop/1-agents/4-workflows/safety-rules.md`

If the crate implements any cryptographic operation: Cryptographic Security Engineer must be involved from the start — non-negotiable.

---

## Steps

### 1. Write the crate spec

Before creating any code, write the crate spec at:

```
_sop/2-docs/5-specs/4-backend/packages/rust/<crate-name>.md
```

The spec must include:

- Purpose and responsibility
- Cryptographic algorithms used (if any) — reference NIST approval status
- NAPI binding surface (if applicable)
- Performance budget targets
- Test vector sources (for cryptographic crates)
- Cargo dependencies — justify each one

---

### 2. Write an ADR if the crate establishes a new protocol boundary

If the crate introduces a new cryptographic algorithm, a new native binding contract, or a new FIPS boundary, write an ADR before any code. See `_sop/1-agents/4-workflows/tasks/write-adr.md`.

---

### 3. Scaffold the crate

```bash
mkdir -p rust/<crate-name>/src
```

Minimum required files:

```
rust/<crate-name>/
  Cargo.toml     — name: "gtcx-<name>", version: "0.1.0"
  src/lib.rs     — public API
  tests/         — integration tests
  benches/       — if performance-sensitive
```

`Cargo.toml` requirements:

- No unnecessary dependencies — every dep must be justified in the spec
- `[profile.release]` optimizations documented if non-default
- Feature flags documented if used

---

### 4. Update `rust/Cargo.toml` workspace members

Add the new crate to the workspace `members` array.

---

### 5. If the crate exposes NAPI bindings

Coordinate with the owner of `rust/gtcx-node` and `@gtcx/crypto-native`. The binding surface must be reviewed by the Cryptographic Security Engineer before any binding is exposed.

Update `_sop/2-docs/5-specs/4-backend/packages/rust/gtcx-node.md` to document the new binding dependency.

---

### 6. Update the crate spec index

Add the new crate to `_sop/2-docs/5-specs/4-backend/packages/rust/README.md`.

---

### 7. Update the spec-to-code traceability matrix

Add an entry in `_sop/2-docs/3-engineering/5-compliance/spec-to-code-traceability.md`.

---

### 8. Run Rust gates

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

- [ ] Crate spec exists at `_sop/2-docs/5-specs/4-backend/packages/rust/<crate-name>.md`
- [ ] ADR exists if a new protocol boundary was established
- [ ] Crate listed in `_sop/2-docs/5-specs/4-backend/packages/rust/README.md`
- [ ] `rust/Cargo.toml` workspace members updated
- [ ] All Rust gates pass
- [ ] All workspace gates pass
- [ ] Traceability matrix updated

---

## Hard Rules

- Never add a cryptographic crate without Cryptographic Security Engineer co-ownership from day one
- Never use an unaudited cryptographic library — check `_sop/2-docs/3-engineering/7-security/` for approved libraries
- Never implement a custom cryptographic primitive — use existing audited implementations in `rust/gtcx-crypto`
- Never expose a NAPI binding without security review of the FFI surface
- Never add a crate without prior human approval

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/rust/`](../../../2-docs/5-specs/4-backend/packages/rust/) — Rust crate specs
- [`_sop/2-docs/3-engineering/6-decisions/`](../../../2-docs/3-engineering/6-decisions/) — ADR index
- [`_sop/1-agents/4-workflows/tasks/write-adr.md`](./write-adr.md) — ADR workflow
- [`_sop/2-docs/3-engineering/7-security/`](../../../2-docs/3-engineering/7-security/) — approved cryptographic libraries
- [`_sop/1-agents/4-workflows/safety-rules.md`](../safety-rules.md) — approval requirements
