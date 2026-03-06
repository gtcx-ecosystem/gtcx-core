# Protocol: Git Workflow

## Version

1.0

## Branching Model

GTCX uses **trunk-based development** with short-lived feature branches off `main`.

- `main` is always deployable.
- Feature branches live for days, not weeks.
- No long-lived develop or staging branches.

## Branch Naming

| Prefix     | Use                                      |
| ---------- | ---------------------------------------- |
| `feature/` | New functionality                        |
| `fix/`     | Bug fixes                                |
| `chore/`   | Maintenance, dependency updates, tooling |
| `release/` | Release preparation and version tagging  |

See the [Naming Conventions Protocol](../naming-conventions/protocol.md) for full format.

## Commit Standards

1. **Conventional Commits** — `type(scope): description`
2. **Atomic commits** — each commit is a single logical change that compiles and passes tests.
3. **Present tense** — "add feature" not "added feature".
4. **No WIP commits on main** — squash before merging.

## Pull Request Process

1. **Create a PR** with a clear title and description.
2. **Link related issues** using GitHub keywords (`closes #123`, `fixes #456`).
3. **Request review** from at least one team member.
4. **All CI checks must pass** before merge is allowed.
5. **Squash merge to main** — keeps history clean.

### PR Description Must Include

- **What** — summary of the change
- **Why** — motivation or linked issue
- **How** — brief technical approach (if non-obvious)
- **Testing** — what was tested and how

## Code Review

- **Minimum 1 approval** required before merge.
- **Review within 24 hours** — do not block teammates.
- **Constructive feedback** — suggest improvements, explain reasoning, be kind.
- **Review the tests** — not just the implementation.

## Release Process

1. **Tag from main** — releases are always cut from the main branch.
2. **Semantic versioning** — `vMAJOR.MINOR.PATCH` (e.g., `v2.1.0`).
3. **Release notes required** — use GitHub Releases with a changelog summary.
4. **No hotfixes to old versions** unless explicitly maintaining an LTS branch.

## Merge Strategy

| Branch Type      | Merge Strategy                                          |
| ---------------- | ------------------------------------------------------- |
| Feature branches | **Squash merge** — collapses into a single clean commit |
| Release branches | **Merge commit** — preserves the release branch history |

## Reference

- Template: [`templates/onboarding/contributor-guide.md`](/templates/onboarding/contributor-guide.md)
- Template: [`templates/session-docs/git-commits.md`](/templates/session-docs/git-commits.md)
