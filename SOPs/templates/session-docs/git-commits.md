# Git Commits — {session-date}

## Session Info

| Field      | Value           |
| ---------- | --------------- |
| **Date**   | {session-date}  |
| **Branch** | {branch-name}   |
| **Author** | {author}        |
| **Scope**  | {scope-of-work} |

## Commits

| Hash   | Message          | Files Changed | Type   |
| ------ | ---------------- | ------------- | ------ |
| {hash} | {commit-message} | {count}       | {type} |

**Type values:** `feat` | `fix` | `chore` | `refactor` | `docs` | `test` | `ci`

## Conventional Commit Reference

Format: `type(scope): description`

```
feat(auth): add OAuth2 login flow
fix(api): handle null response from upstream
chore(deps): bump express to 4.19
refactor(db): extract query builder into utility
docs(readme): add deployment instructions
test(users): add edge case coverage for signup
ci(github): add staging deploy workflow
```

- **feat**: A new feature
- **fix**: A bug fix
- **chore**: Maintenance tasks, dependency updates
- **refactor**: Code restructuring without behavior change
- **docs**: Documentation only
- **test**: Adding or updating tests
- **ci**: CI/CD pipeline changes

## Summary

{what-was-accomplished-across-all-commits}

## Breaking Changes

- {breaking-change-description}

## Follow-up

- [ ] {commit-that-should-happen-next-session}
