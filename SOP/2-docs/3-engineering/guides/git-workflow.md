# Git Workflow — gtcx-core

Branching model, commit standards, PR process, and merge strategy for `gtcx-core`.

## Branching Model

`gtcx-core` uses **trunk-based development** with short-lived feature branches off `main`.

- `main` is always releasable.
- Feature branches live for days, not weeks.
- No long-lived develop or staging branches.

## Branch Naming

| Prefix      | Use                                      |
| ----------- | ---------------------------------------- |
| `feature/`  | New functionality                        |
| `fix/`      | Bug fixes and regressions                |
| `chore/`    | Maintenance, dependency updates, tooling |
| `release/v` | Release preparation and tagging          |

Full format: `feature/add-zkp-commitment-scheme`, `fix/crypto-key-derivation-edge-case`.

See [naming-conventions.md](../naming-conventions.md) for complete branch naming rules.

## Commit Standards

1. **Conventional Commits** — `type(scope): description`
2. **Atomic commits** — one logical change per commit; it must compile and pass tests.
3. **Lowercase present tense** — "add feature" not "Added feature".
4. **No WIP commits on main** — squash or fixup before merging.

### Commit Types

| Type       | When to Use                                                |
| ---------- | ---------------------------------------------------------- |
| `feat`     | New public API, new package, new capability                |
| `fix`      | Bug fix in existing functionality                          |
| `chore`    | Maintenance that doesn't affect functionality              |
| `refactor` | Internal restructure — no behavior change                  |
| `docs`     | SOP, README, inline doc changes                            |
| `test`     | Adding or correcting tests                                 |
| `ci`       | GitHub Actions, CI scripts, tooling                        |
| `perf`     | Performance improvement — benchmarks required              |
| `build`    | Build system (tsup, Turborepo, Cargo) or dependency change |

Full reference: [naming-conventions.md](../naming-conventions.md#commits).

## Pull Request Process

1. Create a PR against `main` with a clear title and description.
2. Link related issues with GitHub keywords (`closes #123`, `fixes #456`).
3. All CI gates must pass before merge — no exceptions.
4. Minimum one CODEOWNERS approval required.
5. **Squash merge to main** — collapses the branch into a single clean commit.

### PR Description Must Include

- **What** — summary of the change
- **Why** — motivation or linked issue
- **How** — technical approach if non-obvious
- **Testing** — what was tested and how (unit, integration, manual)
- **API surface impact** — if any public API changed, note whether it is additive, breaking, or deprecated

## Code Review Standards

- Review within 24 hours — do not block teammates.
- Review the tests, not just the implementation.
- For security-sensitive packages (`crypto`, `security`, `identity`), a second review is expected.
- Constructive feedback: suggest improvements, explain reasoning.

See [code-review.md](./code-review.md) for the full review checklist.

## Merge Strategy

| Branch Type      | Merge Strategy                                          |
| ---------------- | ------------------------------------------------------- |
| Feature branches | **Squash merge** — collapses into a single clean commit |
| Release branches | **Merge commit** — preserves release branch history     |

## Release Process

Releases are always cut from `main`. The full sequence is documented in:

- [tasks/cut-release.md](../../1-agents/tasks/cut-release.md) — agent task playbook
- [compliance/release-checklist.md](../../4-operations/compliance/release-checklist.md) — gate sequence and evidence

Summary:

1. All CI gates pass on `main`.
2. Version bump per [Semver policy](#versioning).
3. Tag `vMAJOR.MINOR.PATCH` from `main`.
4. GitHub Release with changelog summary.

## Versioning

`gtcx-core` uses **semantic versioning**:

| Change Type                 | Version Bump    |
| --------------------------- | --------------- |
| Breaking public API change  | Major (`X.0.0`) |
| New backward-compatible API | Minor (`x.Y.0`) |
| Bug fix, perf, internal     | Patch (`x.y.Z`) |

All packages in the monorepo are versioned together. A single root version applies across the workspace.

## References

- [naming-conventions.md](../naming-conventions.md)
- [code-review.md](./code-review.md)
- [tasks/cut-release.md](../../1-agents/tasks/cut-release.md)
- [compliance/release-checklist.md](../../4-operations/compliance/release-checklist.md)
