# Guide: AI-Assisted Development

How to use AI effectively for code generation across the GTCX ecosystem.

---

## Philosophy

AI is a force multiplier, not a replacement for engineering judgment.

- **AI generates, humans decide.** The AI proposes code; you accept, modify, or reject it. You are the architect. The AI is the typist.
- **Every line of AI code gets the same scrutiny as human code.** There is no "the AI wrote it" exemption from code review, testing, or security standards.
- **AI accelerates the boring parts** so you can spend more time on the interesting parts: architecture, domain modeling, edge cases, and user experience.

---

## When to Use AI

### Good Uses

| Task                     | Why It Works                                  |
| ------------------------ | --------------------------------------------- |
| Scaffolding new services | Repetitive structure, well-defined patterns   |
| Writing tests            | Pattern-heavy, benefits from coverage breadth |
| Generating boilerplate   | Config files, module wiring, CRUD endpoints   |
| Refactoring              | Mechanical transformations across many files  |
| Documentation            | Summarizing code intent, generating API docs  |
| Data transformations     | Mapping, parsing, serialization logic         |

### Use with Extra Caution

| Task                                      | Why to Be Careful                                                                                         |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Security-critical auth logic              | Verify every branch, every edge case. AI often produces "looks right" auth code that has subtle bypasses. |
| Novel algorithms                          | AI tends to reproduce common patterns, not invent correct novel ones.                                     |
| Business logic requiring domain expertise | AI does not understand African commodity markets. You do.                                                 |
| Infrastructure/IAM configuration          | Overly permissive defaults are a common AI failure mode.                                                  |

---

## Prompt Patterns

### Context-First

Provide file paths, existing patterns, and constraints **before** asking for code.

```
Here is our existing NestJS module pattern:
- File: services/trade-api/src/modules/orders/orders.module.ts
- We use Prisma for data access
- All modules register their own providers and export their service
- Error handling uses our shared HttpExceptionFilter

Generate a new module for "settlements" following the same pattern.
```

### Incremental

Build up in small pieces. Do not ask for an entire service at once.

1. Generate the module shell and controller
2. Review and adjust
3. Generate the service layer
4. Review and adjust
5. Generate tests
6. Review and adjust

### Reference-Driven

Point the AI at existing code to match patterns.

```
Look at services/compliance-api/src/modules/reports/reports.service.ts.
Generate a similar service for the "audits" module. Match the error handling,
logging, and Prisma query patterns exactly.
```

### Constraint-Explicit

State your constraints up front. Do not assume the AI knows your stack.

```
Requirements:
- Use Vitest, not Jest
- Follow the NestJS module pattern
- Match existing error handling in src/common/filters/
- Use pnpm, not npm or yarn
- TypeScript strict mode
```

---

## Review Process for AI Code

Every piece of AI-generated code must pass through these six steps before merge.

### Step 1: Does it compile, lint, and pass types?

```bash
pnpm turbo build --filter=<service>
pnpm turbo lint --filter=<service>
pnpm turbo typecheck --filter=<service>
```

If it does not compile cleanly, fix or regenerate before continuing.

### Step 2: Does it follow project conventions?

Check against the relevant protocols:

- [protocols/code-standards/protocol.md](../protocols/code-standards/protocol.md) for style and structure
- [protocols/naming-conventions/protocol.md](../protocols/naming-conventions/protocol.md) for naming
- [protocols/testing/protocol.md](../protocols/testing/protocol.md) for test patterns

### Step 3: Are there hallucinated imports, APIs, or packages?

AI models frequently invent:

- Package names that do not exist on npm or PyPI
- Function signatures that do not match the actual library API
- Config options that are not real

**Verify every import.** Run `pnpm install` and confirm no resolution failures. Spot-check function calls against official documentation.

### Step 4: Security review

Look specifically for:

- SQL/NoSQL injection (raw queries, string interpolation)
- Authentication bypass (missing guards, incorrect middleware order)
- Data exposure (returning full objects instead of DTOs, leaking stack traces)
- Insecure defaults (permissive CORS, disabled CSRF, weak token expiry)

### Step 5: Does it handle edge cases or just the happy path?

AI-generated code tends to handle the sunny-day scenario well and ignore:

- Null/undefined inputs
- Empty arrays and objects
- Concurrent access
- Network failures and timeouts
- Malformed data

### Step 6: Are tests meaningful or just asserting the implementation?

Watch for tests that:

- Assert the exact implementation rather than the behavior
- Mock everything so nothing is actually tested
- Only cover the happy path
- Use hardcoded values that happen to match without validating logic

---

## Hallucination Prevention

### Package Verification

Before committing any AI-suggested dependency:

```bash
# npm
npm search <package-name>
npm info <package-name> version

# Python
pip index versions <package-name>
```

### API Signature Verification

Cross-check function signatures against the actual library documentation. Do not trust the AI's "memory" of an API.

### Common Hallucination Patterns

- **Confident-sounding fabricated function names**: The AI will invent `prisma.user.softDelete()` as if it exists. It does not.
- **Merged API versions**: The AI combines features from different versions of a library into code that works in none of them.
- **Plausible but nonexistent config options**: Config keys that look right but are not recognized by the tool.

### Content Generation (Ralph Agents)

When AI generates user-facing content, documentation, or training material, use the hallucination audit template to systematically verify claims and references.

---

## Session Workflow

A productive AI-assisted development session follows this flow:

1. **Start session** -- Open your AI tool, load project context (CLAUDE.md, relevant source files).
2. **Define objective** -- State clearly what you are building in this session. Write it down.
3. **Generate code** -- Use the prompt patterns above. Work incrementally.
4. **Review** -- Apply the six-step review process to every generated block.
5. **Test** -- Run tests locally. Add missing test cases.
6. **Commit** -- Follow the git workflow protocol. Use conventional commits.
7. **Session recap** -- Fill out the session recap template. Document what was built, decisions made, and next steps.

---

## Tools

| Tool              | Use Case                                                             |
| ----------------- | -------------------------------------------------------------------- |
| Claude Code CLI   | In-terminal code generation, refactoring, analysis                   |
| GitHub Copilot    | Inline completions during editing                                    |
| Project CLAUDE.md | Per-repo context file that gives AI tools project-specific knowledge |

Maintain your project's `CLAUDE.md` file. It is the single most effective way to improve AI code generation quality for your specific codebase.

---

## Anti-Patterns

| Anti-Pattern                                                   | Why It Is Dangerous                                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Accepting large generated blocks without reading them          | You are now maintaining code you do not understand                                                         |
| Skipping tests because "the AI wrote it correctly"             | AI code has the same bug rate as human code, sometimes higher                                              |
| Not checking if generated dependencies actually exist          | Phantom packages can be typosquat vectors or simply break your build                                       |
| Letting AI make architectural decisions without human approval | Architecture requires context the AI does not have: team skills, business constraints, operational reality |
| Copy-pasting AI output across repos without adaptation         | Each repo has its own patterns; blind reuse creates inconsistency                                          |

---

## Templates

- [Session Recap](../templates/session-docs/session-recap.md) -- Document what was accomplished in each AI-assisted session
- [Hallucination Audit](../templates/audits/hallucination-audit.md) -- Verify AI-generated content for fabricated claims
- [Code Quality Audit](../templates/audits/code-quality-audit.md) -- Structured review of AI-generated code quality
