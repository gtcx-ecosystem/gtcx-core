# Contributor Guide — gtcx-core

---

## Getting Started

Complete the [Developer Setup](developer-setup.md) before contributing. Ensure all verification checks pass.

---

## Branching Strategy

**Base branch:** `main`

**Branch naming convention:**

| Prefix      | Use Case                                | Example                         |
| ----------- | --------------------------------------- | ------------------------------- |
| `feature/`  | New functionality                       | `feature/user-notifications`    |
| `fix/`      | Bug fixes                               | `fix/login-timeout-error`       |
| `chore/`    | Maintenance, dependencies, config       | `chore/upgrade-typescript-5`    |
| `docs/`     | Documentation changes                   | `docs/update-api-reference`     |
| `refactor/` | Code restructuring (no behavior change) | `refactor/extract-auth-service` |
| `test/`     | Adding or updating tests                | `test/add-payment-edge-cases`   |

```bash
# Create a new branch
git checkout main
git pull origin main
git checkout -b feature/{short-description}
```

---

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

**Format:** `type(scope): description`

| Type       | When to Use                             |
| ---------- | --------------------------------------- |
| `feat`     | A new feature                           |
| `fix`      | A bug fix                               |
| `docs`     | Documentation only                      |
| `style`    | Formatting, missing semicolons          |
| `refactor` | Code change that neither fixes nor adds |
| `test`     | Adding or correcting tests              |
| `chore`    | Build process, dependencies             |
| `perf`     | Performance improvement                 |
| `ci`       | CI configuration changes                |

**Examples:**

```
feat(crypto): add ed25519 batch verification
fix(identity): handle null DID resolution response
docs(readme): update local setup instructions
refactor(security): extract validation logic to shared util
test(verification): add edge cases for expired credentials
```

**Breaking changes:** Add `!` after the type or include `BREAKING CHANGE:` in the footer.

```
feat(api)!: change authentication endpoint response format
```

---

## Pull Request Process

1. **Create your branch** following the naming convention above
2. **Make your changes** with clear, atomic commits
3. **Write or update tests** for any changed behavior
4. **Run the full test suite** locally before pushing
5. **Push and open a PR** against `main`
6. **Fill out the PR template** completely
7. **Request review** from at least 1 reviewer
8. **Address review feedback** with new commits (do not force-push during review)
9. **Merge** once approved and all CI checks pass

**PR expectations:**

- Title follows conventional commit format
- Description explains what and why (not just how)
- Linked to relevant issue(s) where applicable
- No unrelated changes bundled in

**CI checks that must pass:**

- [ ] Architecture check (`pnpm architecture:check`)
- [ ] Lint
- [ ] Type check
- [ ] Unit tests
- [ ] Coverage thresholds
- [ ] Build
- [ ] API compatibility check (if applicable)

---

## Code Style

**Linter:** ESLint — configuration in per-package `eslint.config.js`

**Formatter:** Prettier — configuration in `.prettierrc`

```bash
# Check linting
pnpm lint

# Auto-fix lint issues (per package — no workspace-level fix script)
pnpm --filter <package-name> exec eslint src/ --fix

# Format code
pnpm format

# Check formatting without writing
pnpm format:check
```

**Configure auto-formatting on save** in your editor to avoid style-only commits.

---

## Testing Requirements

- All new features must include tests
- All bug fixes must include a regression test
- Coverage thresholds enforced per package: 85% statements, 80% branches, 75% functions, 85% lines
- Tests must pass on CI before merge

**Test naming convention:**

```
describe('ModuleName', () => {
  it('should <expected-behavior> when <condition>', () => {
    // ...
  });
});
```

**What needs tests:**

- All cryptographic operations — include test vectors from recognized standards (NIST, RFC)
- All public API surface in exported packages
- Error handling and edge cases
- Security-sensitive code paths (see CLAUDE.md for the list)

---

## Review Checklist

Reviewers should evaluate PRs against the following:

- [ ] Code is readable and well-structured
- [ ] Changes match the stated intent of the PR
- [ ] Tests cover the new or changed behavior
- [ ] No hardcoded secrets, tokens, or credentials
- [ ] Error handling is present and appropriate
- [ ] No performance regressions — check benchmarks if touching crypto or networking
- [ ] API changes are backward-compatible (or breaking change is documented and a major version bump is planned)
- [ ] Documentation is updated if behavior changes
- [ ] No leftover debugging code (console.log, TODO hacks)
- [ ] Security-sensitive packages have the Cryptographic Security Engineer as co-reviewer

---

## Release Process

gtcx-core uses [Changesets](https://github.com/changesets/changesets) for versioned package releases.

1. Changes are merged to `main`
2. CI validates all quality gates
3. Include a changeset file in your PR: `pnpm changeset` — select affected packages and bump type
4. When ready to release: `pnpm version-packages` bumps all versions and updates changelogs
5. `pnpm release` publishes updated packages to the registry

Breaking changes require a `major` bump and explicit sign-off from the Protocol Architect.

---

## Getting Help

| Channel            | Use For                                              |
| ------------------ | ---------------------------------------------------- |
| GitHub Issues      | Bug reports, feature requests, questions             |
| GitHub PR comments | Code review feedback, design discussions             |
| CLAUDE.md          | Repo-specific rules, role assignments, quality gates |

If you are unsure about an approach, open a draft PR early and ask for guidance.
