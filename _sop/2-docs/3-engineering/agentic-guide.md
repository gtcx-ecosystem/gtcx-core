# Engineering Documentation Standard — gtcx-core

Authoring standard for all documentation under `_sop/2-docs/3-engineering/`.

---

## Scope

Applies to agents and contributors authoring or updating engineering docs in this repo. This governs structure, ownership, path conventions, and review cadence for the `3-engineering/` subtree.

---

## Folder Structure

Each subfolder answers a specific engineering question:

| Folder                | Answers                                                             |
| --------------------- | ------------------------------------------------------------------- |
| `1-system-design/`    | How does the system work? Architecture, components, data flows      |
| `2-security/`         | What are the trust boundaries, threat model, and security controls? |
| `3-technology-stack/` | What technologies are used and why?                                 |
| `4-deployment/`       | How are packages published and released?                            |
| `5-compliance/`       | What regulatory and security standards must the library meet?       |
| `6-decisions/`        | Why were key decisions made? (ADRs)                                 |

---

## Authoring Rules

- **Scope explicitly** — state at the top of every doc what it covers and what it does not
- **Use stable links** — relative paths from the file's location; avoid absolute paths
- **No duplication** — link to the authoritative source rather than copying content
- **Date-stamp major docs** — include version and date in the document header
- **Be concrete** — name actual packages, crates, tools, and commands; never use `{placeholders}`
- **Source from archive** — when rewriting docs, use `_archive/docs/` and `_sop-old/` as source material, not the template verbatim

---

## ADR Process

Architecture Decision Records live in `6-decisions/`. When to write one:

- A new technology dependency is introduced (especially in crypto or networking)
- An existing approach is replaced or significantly changed
- A decision has non-obvious security, compliance, or performance implications
- A cross-package or cross-crate boundary is established or changed

Use the template at `6-decisions/adr-template.md`. See `6-decisions/adr-guide.md` for the full process.

ADRs require Protocol Architect authorship and Cryptographic Security Engineer review if crypto-sensitive.

---

## Review Cadence

| Document Type                     | Review Cadence                     |
| --------------------------------- | ---------------------------------- |
| Technology stack                  | Every major phase (Phase 4+)       |
| Security architecture             | Quarterly                          |
| Compliance requirements           | Quarterly                          |
| ADRs                              | Immutable once accepted            |
| Deployment / publishing procedure | After each release workflow change |
| System design / overview          | After major architectural changes  |

---

## Ownership

| Folder                | Primary Owner                   | Reviewer                        |
| --------------------- | ------------------------------- | ------------------------------- |
| `1-system-design/`    | Protocol Architect              | All roles                       |
| `2-security/`         | Cryptographic Security Engineer | Protocol Architect              |
| `3-technology-stack/` | Protocol Architect              | Cryptographic Security Engineer |
| `4-deployment/`       | Quality & Evidence Lead         | Protocol Architect              |
| `5-compliance/`       | Protocol Architect              | Cryptographic Security Engineer |
| `6-decisions/`        | Protocol Architect (author)     | Cryptographic Security Engineer |

---

## What Does Not Belong Here

- Product strategy, pricing, or market docs → `_sop/2-docs/1-product/` (N/A for this repo)
- Devops runbooks, CI/CD, environments → `_sop/2-docs/4-devops/`
- Package-level specs → `_sop/2-docs/5-specs/`
- Sprint plans, backlogs, retrospectives → `_sop/3-agile/`
