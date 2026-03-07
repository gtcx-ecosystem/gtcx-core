# Task Playbook: Write an ADR

**Owner**: Protocol Architect
**Safety tier**: Autonomous (propose) / Requires approval (accept)

## When to Run This

Run this playbook when:

- A new architectural decision must be made that affects package boundaries, protocol behavior, cryptographic algorithm selection, or dependency policy
- An existing ADR needs to be superseded due to changed requirements
- A tech choice lacks documented rationale and a PR review is blocked on it

Do not write an ADR for implementation decisions that do not affect the architectural surface. If unsure, write the ADR — the cost of documentation is zero; the cost of an undocumented decision is future confusion or a broken architecture.

## Pre-Flight

```bash
# Confirm architecture:check baseline before proposing a structural change
pnpm architecture:check

# Read existing ADRs to understand context and avoid contradictions
ls SOP/2-docs/1-architecture/decisions/
```

Read:

- `SOP/2-docs/1-architecture/decisions/README.md` — current index and numbering
- `SOP/2-docs/1-architecture/decisions/template.md` — mandatory template
- Any ADRs directly related to the decision area

## Steps

### 1. Assign ADR number

Check the current highest number in `SOP/2-docs/1-architecture/decisions/README.md`. Use the next available number: `NNN`.

### 2. Create the ADR file

File path: `SOP/2-docs/1-architecture/decisions/NNN-<kebab-case-title>.md`

Use `SOP/2-docs/1-architecture/decisions/template.md` exactly. Fill every section:

| Section                 | Required content                                                      |
| ----------------------- | --------------------------------------------------------------------- |
| Status                  | `Proposed` — always start here                                        |
| Context                 | What is happening, what problem exists, what constraints apply        |
| Decision                | The specific choice made — precise and unambiguous                    |
| Consequences            | What becomes easier, what becomes harder, what is now prohibited      |
| Alternatives considered | At least two alternatives with reasons for rejection                  |
| References              | Spec sections, prior ADRs, external standards (NIST, FIPS, W3C, etc.) |

### 3. Update the ADR index

Add the new ADR to `SOP/2-docs/1-architecture/decisions/README.md`:

```markdown
| [ADR-NNN](./NNN-title.md) | Brief description | Proposed |
```

### 4. If the ADR supersedes an existing decision

Update the superseded ADR's status field:

```markdown
**Status**: Superseded by [ADR-NNN](./NNN-title.md)
```

Add the superseded ADR to the new ADR's References section.

### 5. Link from affected specs

If the ADR affects a package spec in `SOP/2-docs/2-specs/packages/`, add a reference to the relevant section.

### 6. Request human approval

ADRs in `Proposed` status are complete and reviewable. Do not change status to `Accepted`. Surface the ADR to the human reviewer with:

- The ADR file path
- A one-sentence summary of the decision
- The key trade-off that requires human judgment

## Post-Flight

- `SOP/2-docs/1-architecture/decisions/README.md` is updated
- New ADR file is at the correct path
- Status is `Proposed`
- If superseding: old ADR is marked superseded
- Architecture check still passes: `pnpm architecture:check`

## Hard Rules

- Never mark status `Accepted` — that is a human decision
- Never write an ADR for a decision that has already been rejected by a prior ADR without explicitly superseding the prior ADR
- Security-sensitive ADRs (affecting crypto primitives, key management, ZKP circuits) require Cryptographic Security Engineer co-authorship
