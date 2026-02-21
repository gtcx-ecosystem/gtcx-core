# Guide: New Repository Setup

Step-by-step process for creating a new GTCX repository from scratch, fully configured to ecosystem standards.

---

## Prerequisites

Before starting, confirm you have:

- [ ] GitHub org access (`gtcx-ecosystem` or the relevant org)
- [ ] Node.js 20 LTS installed (`node -v`)
- [ ] pnpm 9 installed (`pnpm -v`)
- [ ] Docker and Docker Compose installed
- [ ] Git configured with your signing key
- [ ] The `gh` CLI authenticated (`gh auth status`)

---

## Step 1: Create Repository

```bash
# Create the repo on GitHub and clone it
gh repo create gtcx-ecosystem/<repo-name> --private --clone
cd <repo-name>

# Initial commit
git commit --allow-empty -m "chore: initial commit"
git push -u origin main
```

Choose a name that follows [naming conventions](../protocols/naming-conventions/protocol.md): lowercase, kebab-case, descriptive.

---

## Step 2: Apply Protocols

Walk through each protocol and configure the repo accordingly.

### Naming Conventions

Create `.editorconfig`:

```ini
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### Repo Setup

Add the foundational files:

```bash
# .nvmrc
echo "20" > .nvmrc

# .gitignore (use GitHub's Node template as a base, then add project-specific entries)
curl -sL https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore > .gitignore
echo -e "\n# Project\n.env\n.env.*\n!.env.example\ndist/\ncoverage/" >> .gitignore
```

Set `engines` in `package.json`:

```json
{
  "name": "@gtcx/<repo-name>",
  "private": true,
  "engines": {
    "node": ">=20",
    "pnpm": ">=9"
  },
  "packageManager": "pnpm@9.15.0"
}
```

Add a `LICENSE` file appropriate for the project (private repos typically use `UNLICENSED`).

### Git Workflow

Configure branch protection and conventional commits:

```bash
# Install commitlint and husky
pnpm add -D @commitlint/cli @commitlint/config-conventional husky

# Set up husky
pnpm exec husky init

# Configure commitlint
cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
EOF

# Add commit-msg hook
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
chmod +x .husky/commit-msg
```

Set up branch protection via GitHub (or `gh api`):

- Require PR reviews (at least 1)
- Require status checks to pass
- Require branches to be up to date before merge

### Code Standards

```bash
# Install linting and formatting
pnpm add -D eslint prettier typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "exclude": ["node_modules", "dist", "coverage"]
}
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
EOF
```

Create `.eslintrc.json` matching [code standards protocol](../protocols/code-standards/protocol.md).

### Testing

```bash
pnpm add -D vitest @vitest/coverage-v8
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

### CI/CD

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test -- --coverage
      - run: pnpm build
```

### Security

Create `.env.example` with all required environment variables (values blanked out). Never commit `.env` files.

---

## Step 3: Create Documentation Structure

Run the standard directory creation command:

```bash
mkdir -p docs/{architecture,specs,guides,decisions,runbooks,api}
```

Copy the docs README template and populate it with links to each subfolder:

```bash
cat > docs/README.md << 'EOF'
# Documentation

| Folder | Contents |
|--------|----------|
| [architecture/](architecture/) | System design, diagrams, ADRs |
| [specs/](specs/) | Feature and service specifications |
| [guides/](guides/) | How-to guides and tutorials |
| [decisions/](decisions/) | Decision records |
| [runbooks/](runbooks/) | Operational procedures |
| [api/](api/) | API documentation |
EOF
```

See [protocols/docs-structure/protocol.md](../protocols/docs-structure/protocol.md) for the full standard.

---

## Step 4: Set Up Monorepo (If Applicable)

If this repo will contain multiple packages or services:

```bash
# pnpm workspace config
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'services/*'
  - 'packages/*'
EOF

# Turborepo
pnpm add -D turbo

cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF
```

Create shared config packages in `packages/config/` for shared tsconfigs and ESLint configs.

---

## Step 5: First Service

Scaffold the first application or service:

```bash
# Example: a NestJS API service
mkdir -p services/my-api/src
cd services/my-api

pnpm init
# Edit package.json: set name to @gtcx/my-api, add scripts
# Add framework dependencies
# Create tsconfig.json extending the shared config
# Add vitest.config.ts
# Write a health check endpoint
```

Wire it into the Turbo pipeline by ensuring the `package.json` scripts match the task names in `turbo.json` (`build`, `lint`, `test`, `typecheck`).

---

## Step 6: Verify

Run through this checklist before considering setup complete:

- [ ] `pnpm install` completes without errors
- [ ] `pnpm lint` passes (or `pnpm turbo lint` for monorepos)
- [ ] `pnpm test` runs and passes
- [ ] `pnpm build` succeeds
- [ ] Pushing to a branch triggers CI
- [ ] CI pipeline passes
- [ ] `docs/` structure exists with populated README
- [ ] `.env.example` is present and documented
- [ ] Branch protection is enabled on `main`

---

## Step 7: First PR

Create an initial PR with all the setup work:

```bash
git checkout -b chore/initial-setup
git add -A
git commit -m "chore: initial repository setup

- Configure pnpm, TypeScript, ESLint, Prettier
- Add Vitest, Husky, commitlint
- Set up CI pipeline
- Create documentation structure
- Scaffold first service"
git push -u origin chore/initial-setup
gh pr create --title "chore: initial repository setup" --body "Sets up repo per GTCX ecosystem standards."
```

---

## Quick Start Command

> **Placeholder for future automation.** A CLI tool or script that runs Steps 2-3 automatically is planned. For now, follow the manual steps above.

```bash
# Future: npx @gtcx/create-repo my-new-repo
# This does not exist yet. Follow the steps above manually.
```

---

## Reference

- [protocols/repo-setup/protocol.md](../protocols/repo-setup/protocol.md)
- [templates/readme/github.md](../templates/readme/github.md)
