## Repository

`gtcx-core` — shared TypeScript and Rust protocol foundation for cryptography, identity, verification, resilience, and downstream GTCX integrations.

## Stack

- TypeScript packages under `packages/*`, built with `tsup`, tested with `vitest`, orchestrated by `turbo`.
- Rust crates under `rust/*`, built and tested with Cargo.
- Package manager: `pnpm@9.15.0`.
- Runtime baseline: Node.js 20+ and Rust 1.91+.

## Non-Negotiables

1. **Conventional commits** — `type(scope): subject`, lowercase, imperative.
2. **No emojis** unless explicitly requested.
3. **No going in circles** — read this file + the repo's own docs before exploring.
4. **Session start (ALL terminals / LLMs)** — run `pnpm agent:session-start` before implementation; then `pnpm agent:next-work` is included. Never ask which roadmap story to pick; refresh `.baseline/memory/session.md` after each story. Verify: `pnpm agent:work-selection:check` · `pnpm agent:protocols:check`.

## Build & Run

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm architecture:check
pnpm docs:check-links
pnpm docs:check-frontmatter
pnpm bundle:check-budgets
```
