# Contributing to gtcx-core

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.15.0
- Rust 1.88.x (matches the workspace `rust-version`)

## Setup

```bash
git clone https://github.com/gtcx-ecosystem/gtcx-core.git
cd gtcx-core
pnpm install
pnpm build
pnpm test
```

## Development Workflow

### Run a single package

```bash
pnpm --filter @gtcx/crypto test
pnpm --filter @gtcx/crypto test:watch
pnpm --filter @gtcx/crypto lint
```

### Quality gates (must pass before commit)

```bash
pnpm architecture:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Pre-commit hooks enforce these automatically via Husky.

## Making Changes

1. Create a branch from `main`
2. Make your changes
3. Run quality gates locally
4. Open a PR against `main`

### Commit messages

Use conventional commits: `type(scope): subject`

```
fix(crypto): handle invalid hex in sign()
feat(domain): add batch validation for asset lots
test(security): add JWT audience mismatch test
chore(deps): bump vitest to 3.2
```

### Signed commits

`gtcx-core` enforces SLSA Source Level 2 on `main`. Signed commits are
required — unsigned commits are rejected by branch protection. See
[docs/security/slsa-attestation.md](./docs/security/slsa-attestation.md) for
verification commands and enforcement details.

**All contributors must configure commit signing before pushing.**

Supported signing approaches:

- SSH signing
- GPG signing
- Sigstore-backed signing for automation or service accounts

Recommended developer path: SSH signing if you already authenticate to GitHub
with SSH.

#### Option A: SSH signing

1. Generate a dedicated signing key if you do not already have one:

   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519_signing
   ```

2. Print the public key:

   ```bash
   cat ~/.ssh/id_ed25519_signing.pub
   ```

3. Add it to GitHub as a signing key:

   `https://github.com/settings/keys` -> `New SSH key` -> `Signing Key`

4. Configure git:

   ```bash
   git config --global gpg.format ssh
   git config --global user.signingkey ~/.ssh/id_ed25519_signing.pub
   git config --global commit.gpgsign true
   ```

5. Verify locally:

   ```bash
   git commit --allow-empty -m "test(signing): verify local commit signing"
   git log --show-signature -1
   ```

#### Option B: GPG signing

1. Generate a key:

   ```bash
   gpg --full-generate-key
   ```

2. Find the long key ID:

   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

3. Configure git:

   ```bash
   git config --global user.signingkey <long-key-id>
   git config --global commit.gpgsign true
   ```

4. Export the public key:

   ```bash
   gpg --armor --export <long-key-id>
   ```

5. Add the exported key to GitHub as a GPG signing key, then verify:

   ```bash
   git commit --allow-empty -m "test(signing): verify local commit signing"
   git log --show-signature -1
   ```

#### Automation and bot accounts

- `@gtcx-agent`, Dependabot, and any future automation that creates commits
  need a documented signing strategy before `required_signatures` is enabled.
- Review-only automation, including the AI CODEOWNER action, is unaffected
  because it does not create commits.

#### Before Source Level 2 enforcement is enabled

The following must be true:

- `@amanianai` has a verified signing key
- `@gtcx-agent` has a verified signing key
- bot/service-account commit strategy is chosen and documented
- branch protection is updated with `required_signatures: true`
- an unsigned test push is rejected as expected

### Changesets

For any user-facing change, add a changeset:

```bash
pnpm changeset
```

This creates a markdown file in `.changeset/` describing the change and its semver impact.

## Architecture Rules

- **No circular dependencies** between packages
- **No cross-package deep imports** (use the package, not `../../other-package/src/`)
- **Zod validation at boundaries** — all external input validated with schemas
- **workspace: protocol** for all internal `@gtcx/*` references
- Security-sensitive packages (`crypto`, `security`, `identity`, `verification`, `crypto-native`) require review from the Cryptographic Security Engineer role

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

Do not:

- Commit `.env` files or secrets
- Implement custom cryptographic primitives
- Skip CI gates (`--no-verify`)
- Force push to `main`

## Dependency Management (Dependabot)

### SLA

| Severity                       | Review SLA | Merge SLA |
| ------------------------------ | ---------- | --------- |
| Security ( Dependabot alerts ) | 72 hours   | 7 days    |
| Routine (version bumps)        | 2 weeks    | 4 weeks   |

### Process

1. **Review** — Assess changelog, breaking changes, and security impact.
2. **Test** — Run `pnpm test` and `pnpm build` in the affected workspace.
3. **Group** — Prefer grouped updates (e.g., `@gtcx/*` devDependencies) to reduce noise.
4. **Merge** — Only after all CI gates pass; never force-merge a Dependabot PR.

### Cleanup

Before each GA release, ensure:

- All open Dependabot security PRs are merged or explicitly deferred with a documented justification.
- No stale Dependabot branches remain open (> 30 days).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
