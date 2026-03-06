# Protocol: Documentation Structure

## Version

1.0

## Summary

Every GTCX repo uses a 6-folder `docs/` structure. This ensures consistency across the ecosystem — any developer can navigate any repo's documentation without learning a new layout.

## The Standard

```
docs/
  architecture/   — How is the system designed?
  specs/          — What are we building? (project-specific names live here)
  engineering/    — How do we build and maintain it?
  operations/     — How do we run it in production?
  reference/      — Quick-lookup material (glossaries, cheatsheets, indexes)
  gitbook/        — Published documentation assets and GitBook sync
```

### What Each Folder Answers

| Folder          | Core Question                    | Examples                                                   |
| --------------- | -------------------------------- | ---------------------------------------------------------- |
| `architecture/` | How is the system designed?      | System diagrams, ADRs, data models, integration maps       |
| `specs/`        | What are we building?            | PRDs, user stories, acceptance criteria, API contracts     |
| `engineering/`  | How do we build and maintain it? | Setup guides, coding standards, migration playbooks        |
| `operations/`   | How do we run it in production?  | Runbooks, incident response, monitoring, deployment guides |
| `reference/`    | Where do I look things up?       | Glossaries, cheatsheets, quick-reference indexes           |
| `gitbook/`      | What gets published externally?  | GitBook assets, hero diagrams, icon libraries              |

## Folder Rules

1. **Every folder has a README.md** — describes the folder's purpose and lists its contents.
2. **Empty folders tracked with `.gitkeep`** — no folder is left untracked.
3. **All lowercase, kebab-case** — no exceptions for folder or file names within docs.
4. **`specs/` is the ONLY folder with project-specific names** — all other folders use generic, reusable names.
5. **Per-service documentation uses the 10-folder convention:**
   - `01_context/` — business context and stakeholders
   - `02_constraints/` — technical and business constraints
   - `03_scope/` — what is in and out of scope
   - `04_solution/` — solution design and architecture
   - `05_building_blocks/` — component breakdown
   - `06_runtime/` — runtime behavior and sequences
   - `07_deployment/` — deployment topology
   - `08_crosscutting/` — security, logging, error handling
   - `09_decisions/` — architecture decision records
   - `10_internal/` — internal notes and working documents

## Adoption

Create the structure in any repo:

```bash
mkdir -p docs/{architecture,specs,engineering,operations,reference,gitbook}
```

Add README.md to each folder and `.gitkeep` to empty ones:

```bash
for dir in docs/architecture docs/specs docs/engineering docs/operations docs/reference docs/gitbook; do
  touch "$dir/.gitkeep"
done
```

## Reference

- Template: [`templates/readme/docs-folder.md`](/templates/readme/docs-folder.md)
