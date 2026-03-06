# Naming Conventions — gtcx-core

Naming standards for files, folders, branches, commits, packages, and environment variables.

## Folders

- Lowercase, kebab-case always.
- No spaces, underscores, or camelCase.
- Examples: `crypto-native/`, `api-client/`, `docs-structure/`

## Files

| Type                 | Convention                 | Examples                                |
| -------------------- | -------------------------- | --------------------------------------- |
| Markdown             | lowercase kebab-case `.md` | `developer-setup.md`, `threat-model.md` |
| TypeScript modules   | `camelCase.ts`             | `keyDerivation.ts`, `syncEngine.ts`     |
| TypeScript tests     | `camelCase.test.ts`        | `keyDerivation.test.ts`                 |
| Rust                 | `snake_case.rs`            | `key_derivation.rs`, `sync_engine.rs`   |
| Uppercase exceptions | Always uppercase           | `README.md`, `LICENSE`, `CHANGELOG.md`  |

## Branches

```
feature/{description}
fix/{description}
chore/{description}
release/v{version}
```

Examples:

- `feature/ed25519-streaming-hash`
- `fix/sync-partial-upload-resume`
- `chore/update-napi-rs-2.18`
- `release/v1.4.0`

## Commits

Conventional Commits format: `type(scope): description`

- Lowercase subject line, imperative tense — "add X" not "added X"
- Atomic commits — one logical change per commit, compiles and passes tests
- Micro-commits — commit after each meaningful unit of work

| Type       | Use                                      |
| ---------- | ---------------------------------------- |
| `feat`     | New functionality                        |
| `fix`      | Bug fix                                  |
| `chore`    | Maintenance, tooling, deps               |
| `refactor` | Internal restructure, no behavior change |
| `docs`     | Documentation only                       |
| `test`     | Test additions or corrections            |
| `ci`       | CI/CD configuration                      |
| `perf`     | Performance improvement                  |

Examples:

```
feat(crypto): add blake3 streaming hash support
fix(sync): handle partial upload resume after timeout
chore(deps): update napi-rs to 2.18
docs(identity): clarify DID resolution fallback behavior
```

## Packages

```
@gtcx/{package-name}
```

- All lowercase, kebab-case.
- Examples: `@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/api-client`

## Environment Variables

- `SCREAMING_SNAKE_CASE` always.
- Prefix with the service or context where helpful.
- Examples: `GTCX_REQUIRE_NATIVE`, `GTCX_CRYPTO_NATIVE_PATH`, `DATABASE_URL`

## References

- `SOP/2-docs/3-engineering/guides/git-workflow.md`
- `SOP/2-docs/3-engineering/code-standards.md`
