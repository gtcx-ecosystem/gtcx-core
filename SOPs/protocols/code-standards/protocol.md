# Protocol: Code Standards

## Version

1.0

## TypeScript/JavaScript

- **Strict mode** — `"strict": true` in `tsconfig.json`, no exceptions.
- **No `any`** — use `unknown` and narrow, or define proper types.
- **Explicit return types on exports** — all exported functions must declare their return type.
- **ESM imports** — use `import`/`export`, not `require()`.
- **Path aliases** — use `@/*` mapped to `src/*` for clean imports. Configure in both `tsconfig.json` and bundler/test config.
- **Prefer `const`** — use `let` only when reassignment is necessary. Never use `var`.
- **Use `===`** — no loose equality.

## Python

- **Type hints** — all function signatures must have type annotations.
- **Ruff** — use ruff for both linting and formatting (replaces black, isort, flake8).
- **Pydantic** — use Pydantic models for validation at API boundaries.
- **Docstrings** — all public functions and classes get Google-style docstrings.

## General

- **Early returns over nested ifs** — reduce indentation depth, improve readability.
- **Small functions** — target under 30 lines. If a function is longer, it likely does too much.
- **Meaningful names** — variables and functions should reveal intent. No single-letter names except in trivial loops.
- **No magic numbers** — extract constants with descriptive names.
- **Handle errors explicitly** — no swallowed exceptions, no empty catch blocks. Log or propagate with context.
- **Comments explain why, not what** — code should be self-documenting for the "what."

## AI-Generated Code

AI-generated code is held to the same standard as human-written code:

1. **Must pass all linting and testing standards** — no exceptions.
2. **Review AI code like human code** — AI output is a starting point, not a finished product.
3. **Document AI-specific patterns** — when AI introduces a novel pattern, document it in the project's engineering docs or `project-insights/`.
4. **Verify edge cases** — AI often misses boundary conditions. Pay extra attention during review.

## File Organization

- **One export per file for components** — `Button.tsx` exports `Button`, nothing else.
- **Barrel exports for packages** — `index.ts` re-exports the public API of a package.
- **Co-locate tests with source** — `foo.ts` and `foo.test.ts` live in the same directory.
- **Group by feature, not by type** — prefer `user/UserCard.tsx` over `components/UserCard.tsx` at scale.

## Reference

- Template: [`templates/audits/code-quality-audit.md`](/templates/audits/code-quality-audit.md)
