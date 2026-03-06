# Protocol: Testing

## Version

1.0

## Framework

| Language   | Framework                                          |
| ---------- | -------------------------------------------------- |
| TypeScript | **Vitest** (preferred) or Jest for legacy projects |
| Python     | **pytest**                                         |
| E2E (web)  | **Playwright**                                     |

## Coverage Targets

- **Minimum 80% line coverage** across the codebase.
- **100% coverage for critical paths:**
  - Authentication and authorization flows
  - Payment processing
  - Data mutations (create, update, delete)
  - State machines and workflow transitions

## Test Types

### Unit Tests

- Isolated from external systems.
- Fast — the full suite should run in seconds.
- Mock external dependencies (databases, APIs, file systems).
- One assertion focus per test (multiple related assertions are fine).

### Integration Tests

- Test real interactions between components.
- Use **testcontainers** or a dedicated test database for data layer tests.
- Reset state between tests — no test should depend on another's side effects.

### End-to-End Tests

- **Playwright** for web applications.
- Test critical user journeys, not every UI interaction.
- Run in CI against a staging-like environment.
- Keep the suite small and focused — E2E tests are expensive.

## Naming

Use `describe` blocks for context and `it`/`test` for behavior:

```typescript
describe('TokenService', () => {
  describe('when token is expired', () => {
    it('should return 401 and clear the session', () => {
      // ...
    });
  });
});
```

Test names should read as a sentence: _"TokenService, when token is expired, should return 401 and clear the session."_

## Test Organization

- **Co-located:** `foo.ts` has its tests in `foo.test.ts` in the same directory.
- **Shared fixtures:** place in a `__fixtures__/` directory at the nearest common ancestor.
- **Test utilities:** place in a `src/test/` or `test/` directory (helpers, factories, custom matchers).

## What Must Be Tested

- API endpoints (request/response, error cases, auth)
- State machines and workflow transitions
- Business logic and domain rules
- Authentication and authorization flows
- Data transformations and serialization

## What Can Skip Tests

- Pure configuration files (`eslint.config.js`, `tailwind.config.ts`)
- Type definitions (`.d.ts` files, interfaces-only files)
- Barrel exports (`index.ts` that only re-exports)

## Reference

- Template: [`templates/audits/code-quality-audit.md`](/templates/audits/code-quality-audit.md)
