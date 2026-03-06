# Guide: Code Review

## Purpose

Code review exists to:

- **Catch bugs** before they reach users.
- **Enforce standards** so the codebase stays consistent.
- **Share knowledge** across the team (everyone learns from every PR).
- **Improve code quality** through constructive collaboration.

Every pull request gets reviewed. No exceptions.

## Before Reviewing

Do not start reading code until you understand what the PR is trying to do.

1. **Read the PR description.** If there is no description, request one before reviewing.
2. **Understand the context.** What problem does this solve? What user story or task does it address?
3. **Check linked issues and specs.** Open the referenced issue, spec, or design doc. Understand the expected behavior.
4. **Look at the file list.** Get a sense of scope before diving into diffs.

## Review Checklist

Work through each category for every PR.

### Correctness

- Does the code do what the PR description claims?
- Are edge cases handled (empty inputs, null values, concurrent access, boundary values)?
- Is error handling present and meaningful (not just swallowed exceptions)?
- Are database transactions used where multiple writes must succeed or fail together?

### Standards

- Does it follow GTCX protocols? (naming conventions, project structure, testing requirements)
- Is the linter clean? (`eslint`, `ruff`, `prettier` — no warnings, no suppression without justification)
- Are types correct and specific? (no `any` in TypeScript, type hints in Python)
- Are imports organized and using path aliases where configured?

### Security

- No SQL/NoSQL injection vectors (parameterized queries, ORM usage)?
- Authentication and authorization checked on every protected endpoint?
- No secrets, API keys, or credentials in the code?
- User input validated and sanitized at API boundaries?
- No sensitive data logged or exposed in error messages?

### Performance

- No N+1 query patterns (look for database calls inside loops)?
- No unbounded loops or recursive calls without depth limits?
- No memory leaks (unclosed connections, growing caches, unsubscribed listeners)?
- No unnecessary re-renders in React components (missing memoization on expensive computations)?
- Pagination used for list endpoints?

### Tests

- Do tests exist for new and changed functionality?
- Do tests verify meaningful behavior, not implementation details?
- Are edge cases covered (not just the happy path)?
- Do tests follow the Arrange-Act-Assert pattern?
- Is test data realistic and well-named?

### Readability

- Are names clear and descriptive? Can you understand the code without the PR description?
- Are functions a reasonable length (under 30 lines as a guideline)?
- Are comments present where the "why" is not obvious — and absent where the code speaks for itself?
- Is the code organized logically (related things together, consistent ordering)?

## AI-Generated Code — Extra Scrutiny

A significant amount of GTCX code is AI-generated. This is fine, but AI-generated code requires additional vigilance because it fails differently than human-written code.

### Verify imports exist

AI models hallucinate package names and module paths. Check that every import resolves to a real, installed dependency at the correct version.

### Check API signatures

AI often generates code against outdated or imagined API signatures. Verify that method names, parameter orders, and return types match the actual library version in `package.json` or `pyproject.toml`.

### Look for "confident but wrong" patterns

AI-generated code looks plausible. It compiles. It might even pass a superficial review. But it can be subtly wrong — off-by-one errors, incorrect assumptions about async behavior, wrong default values. Read it as carefully as you would read a junior developer's first PR.

### Ensure it matches project patterns

AI tends to generate generic patterns from its training data rather than the specific patterns used in this project. Check that it follows GTCX conventions: our directory structure, our naming patterns, our error handling approach.

### Watch for over-engineering

AI tends to add unnecessary abstractions — extra interfaces, redundant wrapper functions, overly generic solutions for specific problems. Simpler is better.

### Verify test assertions are meaningful

AI-generated tests often parrot the implementation. A test that just confirms `add(2, 3)` returns `5` is fine. A test that mocks everything and then asserts the mocks were called in a specific order is testing nothing. Check that tests would actually fail if the code broke.

## Giving Feedback

- **Be constructive.** Critique the code, not the person.
- **Explain why, not just what.** "This could cause an N+1 query because each iteration hits the database" is better than "Fix this."
- **Suggest alternatives.** If you see a problem, propose a solution (or at least a direction).
- **Distinguish blocking vs. non-blocking.** Be explicit about what must change before approval vs. what is a suggestion.
- **Use the `nit:` prefix** for style nitpicks that do not block approval. Example: `nit: prefer const here`.
- **Acknowledge good work.** If something is well done, say so.

## Turnaround

- **Review within 24 hours** of being requested. Stale PRs slow everyone down.
- **Respond to review comments within 24 hours.** If you cannot address feedback immediately, acknowledge it and give a timeline.
- If you cannot review within 24 hours, say so and reassign.

## When to Approve

Approve the PR when:

- All blocking comments have been addressed.
- CI passes (lint, typecheck, test, build).
- You would be comfortable maintaining this code.
- The code does what the PR description says it does.

You do not need to agree with every design choice to approve. If the code is correct, safe, tested, and maintainable, approve it.

## When to Request Changes

Request changes when:

- There is a **security issue** (injection, auth bypass, exposed secrets).
- **Functionality is broken** (the code does not do what it claims).
- **Tests are missing** for critical paths (auth, payments, data mutations).
- **Protocol violations** are present (no types, swallowed errors, skipped test categories).
- The code would be **dangerous to deploy** in its current state.

Be clear about what needs to change and why.

## Reference

- [Code Standards Protocol](/protocols/code-standards/protocol.md)
- [Testing Protocol](/protocols/testing/protocol.md)
