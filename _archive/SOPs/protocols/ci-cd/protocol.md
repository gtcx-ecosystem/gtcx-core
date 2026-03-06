# Protocol: CI/CD

## Version

1.0

## Platform

**GitHub Actions** is the CI/CD platform for all GTCX repositories.

## Required Pipeline Stages

Every PR and push to `main` must run through these stages in order:

```
lint → typecheck → test → build → (deploy on main)
```

| Stage         | What It Does                              | Failure Blocks Merge |
| ------------- | ----------------------------------------- | -------------------- |
| **Lint**      | ESLint + Prettier check                   | Yes                  |
| **Typecheck** | `tsc --noEmit`                            | Yes                  |
| **Test**      | Run full test suite with coverage         | Yes                  |
| **Build**     | Production build completes without errors | Yes                  |
| **Deploy**    | Deploy to target environment (main only)  | N/A                  |

## PR Checks

- **All stages must pass** before a PR can be merged.
- **No merge with failing checks** — no exceptions, no overrides.
- **Branch must be up-to-date** with `main` before merging.

## Deployment

- **Platform:** Google Cloud Run (primary), with GitHub Actions orchestrating deployments.
- **Environment promotion:** `staging` then `production`. Never deploy directly to production.
- **Process:**
  1. Merge to `main` triggers deploy to **staging**.
  2. Manual approval (or automated smoke tests) promotes to **production**.
  3. Tagged releases (`v*`) trigger production deployments for versioned services.

## Docker

All containerized services follow these rules:

- **Multi-stage builds** — separate build and runtime stages to minimize image size.
- **Non-root user** — containers run as a non-root user (`USER node` or equivalent).
- **Healthcheck instruction** — every Dockerfile includes a `HEALTHCHECK` instruction.
- **No secrets in image layers** — use runtime injection via environment variables or secret mounts.
- **Pin base image versions** — use digest or specific version tags, not `latest`.

## Secrets

- **GitHub Actions secrets** for CI/CD pipeline variables.
- **GCP Secret Manager** for application runtime secrets.
- **Never in code** — no secrets in source code, Dockerfiles, or committed `.env` files.
- **Rotate secrets** on a defined schedule and immediately after any exposure.

## Monitoring

- **Deployment notifications** — post to the team channel on deploy start and completion.
- **Health check after deploy** — automated health check within 60 seconds of deployment.
- **Automatic rollback on failure** — if the health check fails, roll back to the previous version.
- **Deployment logs** — retain logs for all deployments for audit purposes.

## Reference

- Template: [`templates/reports/production-readiness.md`](/templates/reports/production-readiness.md)
