# Guide: Adding a New Service

Step-by-step process for adding a new service, application, or package to an existing GTCX monorepo.

---

## Prerequisites

- The monorepo is already set up per the [New Repository Setup guide](new-repo-checklist.md)
- You have the repo cloned and can run `pnpm install` successfully
- You know what the new service does and who consumes it

---

## Step 1: Decide Placement

Choose the correct top-level directory based on what you are building.

| Directory   | What Goes Here                                   | Examples                                                     |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `apps/`     | User-facing applications (web, mobile, desktop)  | `apps/web`, `apps/portal`, `apps/mobile`                     |
| `services/` | Backend APIs, workers, and background processors | `services/trade-api`, `services/notification-worker`         |
| `packages/` | Shared libraries consumed by apps and services   | `packages/config`, `packages/shared-types`, `packages/utils` |

### Decision Guide

Ask yourself:

1. **Does it serve HTTP to end users?** Put it in `apps/`.
2. **Does it serve an API to other services or frontends?** Put it in `services/`.
3. **Does it process background jobs?** Put it in `services/`.
4. **Is it a reusable library with no runtime of its own?** Put it in `packages/`.

If you are unsure, default to `services/` for anything with a runtime and `packages/` for anything without.

---

## Step 2: Scaffold

```bash
# Create the directory
mkdir -p services/<service-name>/src

# Initialize package.json
cd services/<service-name>
pnpm init
```

Edit `package.json`:

```json
{
  "name": "@gtcx/<service-name>",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/main.ts",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Create `tsconfig.json` extending the shared config:

```json
{
  "extends": "../../packages/config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "coverage"]
}
```

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: '.',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

---

## Step 3: Choose Framework

Select the right framework for the service type and install dependencies.

### API Service -- NestJS with Fastify Adapter

```bash
pnpm add @nestjs/core @nestjs/common @nestjs/platform-fastify fastify
pnpm add -D @nestjs/cli @nestjs/testing
```

Scaffold with: controller, service, module pattern. Add a health check endpoint at `GET /health`.

### Web Application -- Next.js 14 with App Router

```bash
pnpm add next react react-dom
pnpm add -D @types/react @types/react-dom
```

Use the App Router (`app/` directory). Configure `next.config.js` with `output: 'standalone'` for Docker deployments.

### Background Worker -- BullMQ

```bash
pnpm add bullmq ioredis
```

Create a worker entry point that connects to Redis and processes jobs. Include graceful shutdown handling.

### AI/ML Service -- Python FastAPI

```bash
# Use a separate Python project structure within the monorepo
mkdir -p services/<service-name>/{src,tests}
cd services/<service-name>

# Create pyproject.toml or requirements.txt
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
```

Add a `Makefile` or script entries so Turbo can still orchestrate `build`, `test`, and `lint` tasks.

---

## Step 4: Wire Up

### Workspace Configuration

If your `pnpm-workspace.yaml` uses globs (e.g., `services/*`), new directories are picked up automatically. If it lists packages explicitly, add the new service:

```yaml
packages:
  - 'services/<service-name>'
```

### Turbo Pipeline

The new service inherits pipeline tasks from `turbo.json` as long as its `package.json` scripts match the task names (`build`, `lint`, `test`, `typecheck`).

Verify:

```bash
# Should include the new service
pnpm turbo build --dry-run
```

### CI Matrix

If your CI workflow uses a matrix strategy for services, add the new service:

```yaml
strategy:
  matrix:
    service: [existing-api, existing-worker, <new-service>]
```

If CI runs `turbo` across the whole repo, no change is needed.

---

## Step 5: Database (If Needed)

### Prisma Setup

```bash
cd services/<service-name>
pnpm add @prisma/client
pnpm add -D prisma

# Initialize Prisma
pnpm exec prisma init
```

Edit `prisma/schema.prisma` with your models. Use a unique database name per service.

### Docker Compose

Add the database to `docker-compose.yml` at the repo root:

```yaml
services:
  <service-name>-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: <service_name>
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5433:5432' # Use a unique host port
    volumes:
      - <service-name>-db-data:/var/lib/postgresql/data

volumes:
  <service-name>-db-data:
```

### Generate and Migrate

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
```

---

## Step 6: Documentation

Create the service documentation structure:

```bash
SERVICE_GROUP="<group>"  # e.g., "trade", "compliance", "platform"
SERVICE_NAME="<service-name>"

mkdir -p "docs/specs/${SERVICE_GROUP}/${SERVICE_NAME}"/{01_context,02_requirements,03_architecture,04_data,05_api,06_security,07_testing,08_deployment,09_monitoring,10_internal}
```

Write the initial README at `docs/specs/<group>/<service>/README.md`:

```markdown
# <Service Name>

## Purpose

One paragraph describing what this service does and why it exists.

## Owner

Team or individual responsible.

## Status

Draft | In Development | Production

## Documentation

| Folder                               | Contents                                   |
| ------------------------------------ | ------------------------------------------ |
| [01_context/](01_context/)           | Business context and problem statement     |
| [02_requirements/](02_requirements/) | Functional and non-functional requirements |
| ...                                  | ...                                        |
```

---

## Step 7: Docker

Create a `Dockerfile` in the service directory:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
RUN corepack enable
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY services/<service-name>/package.json services/<service-name>/
RUN pnpm install --frozen-lockfile

COPY services/<service-name> services/<service-name>/
RUN pnpm --filter @gtcx/<service-name> build

# Production stage
FROM node:20-alpine AS runner
RUN addgroup -g 1001 -S app && adduser -S app -u 1001
WORKDIR /app

COPY --from=builder --chown=app:app /app/services/<service-name>/dist ./dist
COPY --from=builder --chown=app:app /app/services/<service-name>/package.json ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
```

Add the service to `docker-compose.yml`:

```yaml
services:
  <service-name>:
    build:
      context: .
      dockerfile: services/<service-name>/Dockerfile
    ports:
      - '3001:3000' # Use a unique host port
    env_file:
      - services/<service-name>/.env
    depends_on:
      - <service-name>-db # if applicable
```

---

## Step 8: Verify

Run through this checklist before creating your PR:

- [ ] `pnpm install` completes without errors from the repo root
- [ ] `pnpm turbo build` includes the new service and succeeds
- [ ] `pnpm turbo test --filter=@gtcx/<service-name>` runs and passes
- [ ] `pnpm turbo lint --filter=@gtcx/<service-name>` passes
- [ ] `docker compose up <service-name>` starts the service
- [ ] `curl http://localhost:<port>/health` returns 200
- [ ] Documentation folder exists with initial README
- [ ] Package name follows `@gtcx/<service-name>` convention

---

## Reference

- [protocols/code-standards/protocol.md](../protocols/code-standards/protocol.md)
- [templates/onboarding/service-overview.md](../templates/onboarding/service-overview.md)
