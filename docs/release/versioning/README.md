# Release Versioning

Versioning policy for `@gtcx/*` packages — how breaking, additive, and patch changes map to npm semver releases, and how the `changesets` workflow enforces the policy at PR time.

| File                                             | Purpose                                                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| [`versioning-policy.md`](./versioning-policy.md) | Canonical semver discipline for the 21 published packages, linked-group rules, time-bound sign-off conventions |

**Audience:** every PR author touching package source; downstream consumers planning version pins; release engineers running `pnpm release`.

Operational counterparts: [`docs/release/api-change-migration-policy.md`](../api-change-migration-policy.md) for migration guidance and [`docs/devops/release-mgmt/npm-publish-runbook.md`](../../devops/release-mgmt/npm-publish-runbook.md) for execution.
