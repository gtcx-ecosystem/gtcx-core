# Guide: Writing Documentation

How to write clear, useful documentation at GTCX. This guide covers voice, structure, naming, and common pitfalls.

---

## Voice & Tone

Write for someone joining the team tomorrow. They are smart but have zero context on your project.

- **Clear over clever.** Say what you mean. Avoid idioms, metaphors, and humor that does not translate.
- **Direct over diplomatic.** "This service handles X" beats "This service is primarily responsible for the facilitation of X."
- **Professional but not stuffy.** Contractions are fine. Conversational tone is fine. Jargon is not fine unless you define it.
- **Active voice.** "The service validates the request" not "The request is validated by the service."
- **Second person for instructions.** "Run `pnpm install`" not "One should run `pnpm install`."

---

## Structure Rules

### One Topic Per Document

Each document covers exactly one thing. If you find yourself writing about two unrelated topics, split them into two documents.

### Lead With the Most Important Information

The reader should know what the document is about and why they care within the first two sentences. Background and context come after, not before.

**Good:**

```markdown
# Trade Matching Algorithm

Matches buy and sell orders for commodity trades using a price-time priority queue.

## Background

The exchange processes approximately 10,000 trades per day...
```

**Bad:**

```markdown
# Trade Matching Algorithm

## Background

In 2023, the team decided to build a new matching engine because the old one was slow.
After several meetings and a design review...
```

### Use Headings as Scannable Navigation

Someone reading only your headings should understand the document's structure and be able to jump to what they need. Test this: collapse all sections and read just the headings.

### Tables Over Prose for Structured Data

**Good:**

| Field      | Type   | Required | Description             |
| ---------- | ------ | -------- | ----------------------- |
| `tradeId`  | string | yes      | Unique trade identifier |
| `quantity` | number | yes      | Amount in metric tons   |

**Bad:**

> The tradeId field is a required string that contains the unique trade identifier. The quantity field is a required number representing the amount in metric tons.

### Bulleted Lists Over Paragraphs for Lists

If you are listing more than two items, use bullets.

### Code Blocks With Language Tags

Always specify the language for syntax highlighting:

````markdown
```typescript
const result = await service.process(input);
```
````

Never use bare code blocks without a language tag.

---

## Naming

- All `.md` files use **lowercase kebab-case**: `trade-matching.md`, `api-reference.md`, `getting-started.md`
- The one exception: `README.md` is always uppercase
- Do not use spaces, underscores, or camelCase in filenames
- Be descriptive: `deployment-guide.md` not `guide.md`

---

## Linking

### Use Relative Paths

```markdown
<!-- Good -->

See [architecture overview](../architecture/overview.md)

<!-- Bad -->

See [architecture overview](/Users/dev/project/docs/architecture/overview.md)
```

### Link From READMEs to Children

Every `README.md` should link to every document in its folder and immediate subfolders.

### Never Duplicate Content

If two documents need the same information, one of them should link to the other. Pick the canonical location and link to it.

```markdown
<!-- Good -->

For authentication details, see [auth architecture](../architecture/auth.md).

<!-- Bad -->

[Copy-pasted paragraphs from auth.md]
```

---

## When to Create vs. Update

### Create a New Document When:

- The topic is genuinely new and does not fit in any existing document
- An existing document would become unfocused if you added your content to it
- The content serves a different audience than existing docs

### Update an Existing Document When:

- The topic is already covered but the information is incomplete or outdated
- Your addition naturally extends what is already there
- The existing document is the canonical source for this topic

### Never:

- Create a second document covering the same topic as an existing one
- Create a "v2" of a document instead of updating the original
- Leave outdated documents in place after creating updated replacements

---

## README Rules

Every folder in `docs/` gets a `README.md`. The README serves as navigation, not content.

A folder README should contain:

1. **One sentence** explaining what belongs in this folder
2. **A table or list** linking to every document in the folder
3. **Nothing else** -- the actual content lives in the linked documents

Example:

```markdown
# Architecture

System design documents, diagrams, and architectural decision records.

| Document                     | Description                           |
| ---------------------------- | ------------------------------------- |
| [overview.md](overview.md)   | High-level system architecture        |
| [data-flow.md](data-flow.md) | Data flow between services            |
| [decisions/](decisions/)     | Architectural Decision Records (ADRs) |
```

---

## Common Mistakes

| Mistake                                             | Why It Is a Problem                                              | Fix                                                                                                           |
| --------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Writing implementation details in architecture docs | Architecture docs become stale the moment code changes           | Keep implementation in code comments or specs; architecture docs describe the "why" and "what", not the "how" |
| Duplicating content across folders                  | Updates only happen in one place, the other becomes wrong        | Pick a canonical location, link from everywhere else                                                          |
| Leaving TODO/placeholder text in committed docs     | Readers do not know if it is a placeholder or the actual content | Remove TODOs before committing, or do not commit the file yet                                                 |
| Broken internal links after file moves              | Readers hit dead ends                                            | After moving files, search the repo for references and update them                                            |
| Using absolute paths instead of relative            | Links break when the repo is cloned to a different location      | Always use relative paths in markdown links                                                                   |
| Heading level skipping (h1 to h3)                   | Breaks document outline and accessibility                        | Use sequential heading levels: h1, h2, h3                                                                     |

---

## Quality Checklist

Before committing documentation, verify:

- [ ] **All links work.** Click every link in the document. Relative paths resolve correctly.
- [ ] **No placeholder text.** No `TODO`, `TBD`, `FIXME`, or `[fill in later]` markers.
- [ ] **Consistent heading hierarchy.** h1 only at the top, h2 for sections, h3 for subsections. No skipped levels.
- [ ] **No duplicate content.** Nothing copy-pasted from another document.
- [ ] **README updated.** If you added a new file, the folder's README links to it.
- [ ] **Code blocks have language tags.** Every fenced code block specifies a language.
- [ ] **Tables are formatted.** Columns align, headers are present.
- [ ] **File name is kebab-case.** No spaces, underscores, or camelCase (except `README.md`).

---

## Reference

- [protocols/docs-structure/protocol.md](../protocols/docs-structure/protocol.md)
- [templates/readme/repo-folders.md](../templates/readme/repo-folders.md)
- [templates/hygiene/documentation-hygiene.md](../templates/hygiene/documentation-hygiene.md)
