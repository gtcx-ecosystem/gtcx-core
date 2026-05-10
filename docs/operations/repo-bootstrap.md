# Repository Operational Prerequisites

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Auto-generated from `tools/check-ops-prereqs.mjs`. Do not edit by hand — modify the script and run `node tools/check-ops-prereqs.mjs --emit-doc`.

Run `pnpm ops:check` to verify state. Run `pnpm ops:check --json` for machine-readable output.

## Checks

| ID | Description | Remediation |
|---|---|---|
| `gh-cli-available` | gh CLI authenticated | Install: https://cli.github.com/  Then: gh auth login |
| `anthropic-api-key` | ANTHROPIC_API_KEY org or repo secret is set (AI CODEOWNER primary provider) | Preferred: gh secret set ANTHROPIC_API_KEY --org gtcx-ecosystem --visibility all<br>Fallback:  gh secret set ANTHROPIC_API_KEY --repo gtcx-ecosystem/gtcx-core<br>UI: https://github.com/organizations/gtcx-ecosystem/settings/secrets/actions |
| `openai-api-key` | OPENAI_API_KEY org or repo secret is set (AI CODEOWNER fallback provider) | Preferred: gh secret set OPENAI_API_KEY --org gtcx-ecosystem --visibility all<br>Fallback:  gh secret set OPENAI_API_KEY --repo gtcx-ecosystem/gtcx-core  # closes bus-factor on ai codeowner review |
| `turbo-token` | TURBO_TOKEN org or repo secret is set | Preferred: gh secret set TURBO_TOKEN --org gtcx-ecosystem --visibility all<br>Fallback:  gh secret set TURBO_TOKEN --repo gtcx-ecosystem/gtcx-core  # generate at https://vercel.com/account/tokens |
| `turbo-team` | TURBO_TEAM org or repo variable is set | Preferred: gh variable set TURBO_TEAM --org gtcx-ecosystem --body "<team-slug>"<br>Fallback:  gh variable set TURBO_TEAM --repo gtcx-ecosystem/gtcx-core --body "<team-slug>" |
| `npm-token` | NPM_TOKEN org or repo secret is set (required for publish workflow) | Preferred: gh secret set NPM_TOKEN --org gtcx-ecosystem --visibility all<br>Fallback:  gh secret set NPM_TOKEN --repo gtcx-ecosystem/gtcx-core  # automation token from https://www.npmjs.com/settings/<user>/tokens |
| `gtcx-agent-org-member` | gtcx-agent is a member of gtcx-ecosystem org | gh api orgs/gtcx-ecosystem/invitations -X POST -f invitee_id=283082388 -f role=direct_member<br>(requires admin:org scope: gh auth refresh -s admin:org)<br>UI: https://github.com/orgs/gtcx-ecosystem/people |
| `branch-protection-main` | main branch protection is enabled | UI: https://github.com/gtcx-ecosystem/gtcx-core/settings/branches<br>Required: code owner review, status checks (CI workflows), no force push, no deletion<br>CLI: gh api repos/gtcx-ecosystem/gtcx-core/branches/main/protection -X PUT --input - <<EOF<br>(see docs/operations/repo-bootstrap.md for a templated payload) |
| `branch-protection-codeowner-review` | main branch protection requires code owner review | In branch protection, enable: "Require review from Code Owners" |
| `codeowners-accounts-exist` | all accounts referenced in .github/CODEOWNERS exist | Either create the missing account, remove the entry from .github/CODEOWNERS, or fix the typo |
| `signed-commits-required` | main branch requires signed commits (SLSA Source Level 2) | gh api repos/gtcx-ecosystem/gtcx-core/branches/main/protection/required_signatures -X POST<br>(requires admin access to the repository) |

## Required Token Scopes

The runner relies on `gh auth login` having sufficient scopes. To check secret + branch-protection state, the token needs:

- `repo` (covers branch protection, secrets read)
- `admin:org` (covers org membership listing)

Refresh: `gh auth refresh -s repo,admin:org`
