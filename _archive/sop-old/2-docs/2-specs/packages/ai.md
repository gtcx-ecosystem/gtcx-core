# @gtcx/ai

AI integration stubs for traced operations and category logging. Provides lightweight no-op interfaces for compatibility across all GTCX runtimes.

## Scope

- `traced()` wrapper — no-op tracing decorator
- `withTrace()` helper — no-op trace context
- `createCategoryLogger()` — category-scoped no-op logger

## Notes

- This package is intentionally minimal and safe to use in any runtime environment.
- No external AI service calls — all exports are no-ops until wired to a real AI backend.
- The full AI implementation lives in `5-intelligence` (`gtcx-intelligence`).

## References

- `packages/ai/src/index.ts`
