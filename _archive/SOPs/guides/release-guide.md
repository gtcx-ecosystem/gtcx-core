# Guide: Releasing

## Versioning

GTCX uses **Semantic Versioning** (semver): `MAJOR.MINOR.PATCH`

| Component | When to Bump                                                                       | Example            |
| --------- | ---------------------------------------------------------------------------------- | ------------------ |
| **MAJOR** | Breaking changes (API contract changes, removed features, incompatible migrations) | `1.0.0` to `2.0.0` |
| **MINOR** | New features, non-breaking additions                                               | `1.0.0` to `1.1.0` |
| **PATCH** | Bug fixes, security patches, documentation fixes                                   | `1.0.0` to `1.0.1` |

Pre-release versions use suffixes: `1.1.0-beta.1`, `1.1.0-rc.1`.

When in doubt, bump minor. If you have to ask whether it is breaking, it probably is — bump major.

## Pre-Release Checklist

Before starting the release process, confirm all of the following:

- [ ] All tests passing on `main`
- [ ] No critical or high security vulnerabilities (run `pnpm audit` / `pip audit`)
- [ ] Changelog or release notes drafted
- [ ] Production readiness review complete (required for major releases)
- [ ] Database migrations tested against a copy of production data
- [ ] Feature flags configured (new features behind flags for gradual rollout)
- [ ] Dependent services compatible with the new version

Do not proceed until every box is checked.

## Step 1: Prepare

1. **Create a release branch** from `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b release/v1.2.0
   ```

2. **Update version numbers** in `package.json` (or `pyproject.toml` for Python services):

   ```bash
   # For pnpm workspaces — update the relevant package(s)
   pnpm --filter @gtcx/service-name version 1.2.0
   ```

3. **Finalize release notes.** Summarize what changed, what is new, what is fixed. Use the release notes template.

4. **Open a PR** from the release branch to `main`. This PR gets a standard code review.

## Step 2: Test

1. **Run the full test suite** on the release branch:

   ```bash
   pnpm turbo run lint typecheck test build
   ```

2. **Deploy to staging.** Merge the release PR to `main`, and let CI deploy to the staging environment.

3. **Smoke test staging.** Walk through the critical user flows manually:
   - Can users log in?
   - Can users perform the core actions?
   - Do integrations with external services work?

4. **QA sign-off.** If the release includes user-facing changes, get explicit sign-off from QA or the product owner.

## Step 3: Tag

Once staging is verified:

```bash
git checkout main
git pull origin main
git tag -a v1.2.0 -m "Release v1.2.0"
git push origin v1.2.0
```

Tags are immutable. If you need to change something after tagging, create a new patch version.

## Step 4: Deploy

1. **CI/CD triggers on the tag** and deploys to production (Cloud Run).
2. **Verify health checks pass** — watch the deployment logs and confirm all instances are healthy.
3. **Watch for immediate errors** — monitor logs for the first 5-10 minutes.

Do not walk away from a deployment. Stay available until you are confident it is stable.

## Step 5: Verify

After deployment, confirm the release is healthy:

- **Error rates** — are they at or below pre-release levels?
- **Latency** — is response time normal?
- **Key metrics** — are core business metrics (transactions, sign-ups, API calls) tracking as expected?
- **Smoke test production** — perform the same critical flows you tested on staging.

If anything looks wrong, proceed to Rollback.

## Step 6: Announce

1. **Publish a GitHub Release** using the tag. Include the full release notes.
2. **Notify the team** in the appropriate channel with a summary of what shipped.
3. **Update the changelog** in the repository if maintained separately.

## Rollback

If issues are detected after deployment:

1. **Revert to the previous tag:**

   ```bash
   # Redeploy the previous version through CI, or:
   gcloud run deploy SERVICE_NAME --image IMAGE:previous-tag --region REGION
   ```

2. **Communicate** — notify the team that a rollback is in progress and why.

3. **Investigate** — understand what went wrong before attempting to re-release.

**Never push forward under pressure.** Rolling back is always safer than trying to fix a broken production deployment in real time.

## Hotfix Process

For urgent fixes to production (typically SEV1 or SEV2 incidents):

1. **Branch from the release tag:**

   ```bash
   git checkout -b hotfix/v1.2.1 v1.2.0
   ```

2. **Make the fix.** Keep it minimal — only the change needed to resolve the issue.

3. **Test.** Run the full test suite. Deploy to staging and verify.

4. **Tag the patch version:**

   ```bash
   git tag -a v1.2.1 -m "Hotfix: brief description of fix"
   git push origin v1.2.1
   ```

5. **Deploy.** CI triggers on the tag.

6. **Merge the fix back to `main`** so it is not lost.

Skip staging only for SEV1 incidents where production is actively down and the fix is well-understood.

## Reference

- [Release Notes Template](/templates/reports/release-notes.md)
- [Production Readiness Template](/templates/reports/production-readiness.md)
- [CI/CD Protocol](/protocols/ci-cd/protocol.md)
