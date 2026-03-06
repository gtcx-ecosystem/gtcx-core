# Protocol: Repository Setup

## Version

1.0

## Summary

Standard configuration for every GTCX repository. Following this protocol ensures every repo is consistent, discoverable, and ready for collaboration from the first commit.

## Required Files

Every GTCX repo must contain:

| File            | Purpose                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `.gitignore`    | Language/framework-appropriate ignores (use gitignore.io as baseline)         |
| `.nvmrc`        | Pin the Node.js version (e.g., `20`)                                          |
| `.editorconfig` | Consistent formatting across editors (2-space indent, LF line endings, UTF-8) |
| `package.json`  | Must include an `engines` field specifying minimum Node.js version            |
| `README.md`     | Project overview, setup instructions, and architecture summary                |
| `LICENSE`       | Apache 2.0 unless otherwise specified for the project                         |

## Monorepo Structure

GTCX monorepos use **pnpm workspaces + Turborepo**.

Standard workspace layout:

```
/
  apps/         — Deployable applications (web, mobile, CLI)
  packages/     — Shared libraries (ui, utils, config, types)
  services/     — Backend services (APIs, workers, ML pipelines)
  docs/         — Documentation (follows docs-structure protocol)
  tools/        — Build tools, scripts, generators
```

Configure in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
```

## Package Naming

All packages use a scoped naming convention:

```
@{product}/{package-name}
```

Examples:

- `@compliance-os/api`
- `@sensei/maba-engine`
- `@gtcx/design-system`

The scope is the product name, all lowercase. The package name is kebab-case.

## Dev Tooling

Every repo must configure:

| Tool                           | Purpose                   | Config                                                              |
| ------------------------------ | ------------------------- | ------------------------------------------------------------------- |
| **ESLint + typescript-eslint** | Linting                   | `eslint.config.js` (flat config)                                    |
| **Prettier**                   | Formatting                | `.prettierrc`                                                       |
| **Husky**                      | Git hooks                 | `.husky/`                                                           |
| **lint-staged**                | Pre-commit checks         | `lint-staged` field in `package.json`                               |
| **commitlint**                 | Commit message validation | Conventional Commits enforced via `@commitlint/config-conventional` |

## CI/CD

- **Platform:** GitHub Actions
- **Required checks before merge:**
  - Lint passes
  - Type check passes
  - All tests pass
  - Build succeeds

See the [CI/CD Protocol](../ci-cd/protocol.md) for full pipeline details.

## Branch Protection

The `main` branch must be protected with:

1. **Require pull request reviews** — minimum 1 approval
2. **Require status checks to pass** — all CI checks must be green
3. **No direct pushes** — all changes go through PRs
4. **Require branches to be up-to-date** — before merging

## Reference

- Template: [`templates/readme/github.md`](/templates/readme/github.md)
- Template: [`templates/onboarding/developer-setup.md`](/templates/onboarding/developer-setup.md)
