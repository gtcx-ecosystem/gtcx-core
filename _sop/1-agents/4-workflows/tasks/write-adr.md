# Task Playbook: Write an ADR

**Owner:** Protocol Architect
**Safety tier:** Autonomous (propose) / Requires approval (accept)

---

## When to Run This

Run when:

- A new architectural decision must be made that affects package boundaries, protocol behavior, cryptographic algorithm selection, or dependency policy
- An existing ADR needs to be superseded due to changed requirements
- A technical choice lacks documented rationale and a PR review is blocked on it

Do not write an ADR for implementation decisions that do not affect the architectural surface. If unsure, write the ADR — the cost of documentation is zero; the cost of an undocumented decision is future confusion or a broken architecture.

Security-sensitive ADRs (affecting crypto primitives, key management, ZKP circuits) require Cryptographic Security Engineer co-authorship.

---

## Pre-Flight

```bash
# Confirm architecture:check baseline before proposing a structural change
pnpm architecture:check

# Review existing ADRs to understand context and avoid contradictions
ls _sop/2-docs/3-engineering/6-decisions/ | sort
```

Read:

- `_sop/2-docs/3-engineering/6-decisions/README.md` — current index and numbering
- `_sop/2-docs/3-engineering/6-decisions/template.md` — mandatory template
- Any ADRs directly related to the decision area

---

## Steps

### 1. Assign ADR number

Check the current highest number in `_sop/2-docs/3-engineering/6-decisions/README.md`. Use the next available number: `NNN`.

---

### 2. Create the ADR file

File path: `_sop/2-docs/3-engineering/6-decisions/NNN-<kebab-case-title>.md`

Use `_sop/2-docs/3-engineering/6-decisions/template.md` exactly. Fill every section:

| Section                 | Required content                                                      |
| ----------------------- | --------------------------------------------------------------------- |
| Status                  | `Proposed` — always start here                                        |
| Context                 | What is happening, what problem exists, what constraints apply        |
| Decision                | The specific choice made — precise and unambiguous                    |
| Consequences            | What becomes easier, what becomes harder, what is now prohibited      |
| Alternatives considered | At least two alternatives with reasons for rejection                  |
| References              | Spec sections, prior ADRs, external standards (NIST, FIPS, W3C, etc.) |

---

### 3. Update the ADR index

Add the new ADR to `_sop/2-docs/3-engineering/6-decisions/README.md`:

```markdown
| [ADR-NNN](./NNN-title.md) | Brief description | Proposed |
```

---

### 4. If the ADR supersedes an existing decision

Update the superseded ADR's status field:

```markdown
**Status**: Superseded by [ADR-NNN](./NNN-title.md)
```

Add the superseded ADR to the new ADR's References section.

---

### 5. Link from affected specs

If the ADR affects a package spec in `_sop/2-docs/5-specs/4-backend/packages/`, add a reference to the relevant section of that spec.

---

### 6. Request human approval

ADRs in `Proposed` status are complete and reviewable. Do not change status to `Accepted`. Surface to the human reviewer with:

- The ADR file path
- A one-sentence summary of the decision
- The key trade-off that requires human judgment

---

## Post-Flight

- [ ] `_sop/2-docs/3-engineering/6-decisions/README.md` is updated
- [ ] New ADR file is at the correct path (`NNN-<kebab-case-title>.md`)
- [ ] Status is `Proposed`
- [ ] If superseding: old ADR is marked superseded
- [ ] `pnpm architecture:check` still passes

---

## Hard Rules

- Never mark status `Accepted` — that is a human decision
- Never write an ADR for a decision already rejected by a prior ADR without explicitly superseding the prior ADR
- Security-sensitive ADRs require Cryptographic Security Engineer co-authorship

---

## Reference

- [`_sop/2-docs/3-engineering/6-decisions/`](../../../2-docs/3-engineering/6-decisions/) — ADR index and template
- [`_sop/1-agents/2-roles/protocol-architect.md`](../../2-roles/protocol-architect.md) — Protocol Architect role
- [`_sop/1-agents/2-roles/crypto-security-engineer.md`](../../2-roles/crypto-security-engineer.md) — required for crypto ADRs
- [`_sop/1-agents/4-workflows/safety-rules.md`](../safety-rules.md) — approval requirements
