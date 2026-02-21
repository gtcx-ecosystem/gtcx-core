# Protocol: Naming Conventions

## Version

1.0

## Folders

- **Always lowercase, kebab-case.**
- No spaces, no underscores, no camelCase.
- Examples: `user-management/`, `api-gateway/`, `docs-structure/`

## Files

- **Markdown files:** lowercase kebab-case with `.md` extension.
  - Examples: `developer-setup.md`, `api-reference.md`
- **Exceptions (uppercase by convention):** `README.md`, `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`
- **Source code:** follow the language convention:
  - TypeScript/JavaScript: `camelCase.ts` for modules, `PascalCase.tsx` for React components
  - Python: `snake_case.py`
  - Rust: `snake_case.rs`

## Branches

```
feature/{ticket}-{description}
fix/{ticket}-{description}
chore/{description}
release/v{version}
```

Examples:

- `feature/VIA-003-adaptive-quiz-engine`
- `fix/COS-142-token-refresh-loop`
- `chore/update-dependencies`
- `release/v2.1.0`

## Commits

Conventional Commits format:

```
type(scope): description
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `ci`, `style`, `perf`

Examples:

- `feat(auth): add JWT refresh token rotation`
- `fix(api): handle null response from upstream service`
- `docs(readme): update setup instructions for Node 20`
- `test(quiz): add coverage for adaptive difficulty scaling`

## Packages

```
@{product-name}/{package-name}
```

- All lowercase, kebab-case.
- Examples: `@gtcx/design-system`, `@compliance-os/prisma-client`, `@sensei/kora-engine`

## Environment Variables

- **SCREAMING_SNAKE_CASE** always.
- Prefix with the service name where helpful.
- Examples: `DATABASE_URL`, `JWT_SECRET`, `VIA_API_PORT`, `REDIS_HOST`

## Database

- **Tables:** `snake_case`, plural.
  - Examples: `users`, `quiz_attempts`, `audit_logs`
- **Columns:** `snake_case`, singular.
  - Examples: `created_at`, `user_id`, `is_active`

## API Endpoints

```
/api/v{n}/{resource}
```

- Resources are **plural** and **kebab-case**.
- Examples: `/api/v1/users`, `/api/v1/quiz-attempts`, `/api/v2/compliance-reports`

## Reference

- Template: [`templates/hygiene/file-naming-hygiene.md`](/templates/hygiene/file-naming-hygiene.md)
