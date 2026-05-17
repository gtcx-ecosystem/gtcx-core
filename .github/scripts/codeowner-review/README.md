# AI CODEOWNER Review Action — Prototype

This directory contains the operational implementation of the dual-AI CODEOWNER pattern documented in [`docs/agents/governance/`](../../../docs/agents/governance/).

## What it does

On every pull request, the workflow at [`.github/workflows/ai-codeowner-review.yml`](../../workflows/ai-codeowner-review.yml):

1. Detects which files changed in the PR
2. Selects applicable playbooks via [`select-playbooks.mjs`](./select-playbooks.mjs) — path-prefix matching against `crypto/`, `security/`, `verification/`, `ci/`, `evidence/`
3. Loads the system prompt from `docs/agents/governance/review-prompt.md` (the seven hard constraints, including never-approve)
4. Calls Anthropic Claude API with: prompt + selected playbooks + unified diff
5. Validates the JSON response. **Hard-rejects any `decision=APPROVE`** as a security event (the bot is structurally forbidden from approving).
6. Posts a structured PR review:
   - `REQUEST_CHANGES` if any critical finding, two+ high findings, or any finding in the change-blocking categories (cryptographic-correctness, fips-boundary, redaction-bypass, revocation-path, supply-chain)
   - `COMMENT` otherwise

If anything in the pipeline fails (Claude API down, malformed response, schema mismatch), a fallback comment is posted referencing `SECURITY-INCIDENT.md` § AI Review Bypass Procedure. CI succeeds either way — a broken AI pipeline must not block human reviewers.

## Files

| File                   | Purpose                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `run.mjs`              | Main runner. Pulls PR context, selects playbooks, calls Claude, validates, posts review |
| `select-playbooks.mjs` | Standalone playbook selector — path-prefix rules. Outputs JSON.                         |
| `README.md`            | This file                                                                               |

The runner uses Node.js builtins only (no `node_modules` dependency) so it can be lifted out of this repo into its own action repo without dependency surgery.

## Required secrets

The workflow requires at least one AI provider key:

- **`ANTHROPIC_API_KEY`** — Anthropic Claude API key (primary provider)
- **`OPENAI_API_KEY`** — OpenAI API key (fallback when Anthropic is rate-limited or down)

Set in repo secrets at Settings → Secrets → Actions, or via `gh secret set`.

The `GITHUB_TOKEN` is provided automatically by the workflow runner.

### Why two providers

Closes the "bus factor = 1 on AI CODEOWNER review" finding. With only Anthropic configured, an Anthropic outage means PRs touching security-sensitive paths can't get an AI review until the provider recovers — that's exactly the single-point-of-failure the dual-AI pattern is supposed to prevent.

The orchestration:

1. Try Anthropic Claude (`claude-opus-4-7`) first.
2. On retryable failures (HTTP 429, 5xx, network errors), fall back to OpenAI (`gpt-4o`).
3. The schema's never-approve enforcement applies regardless of which provider responded — both providers receive the same prompt forbidding `decision=APPROVE`, and the runner rejects it at parse time anyway.
4. The review's `reviewer.provider` field records which provider answered, so audit trails can surface fallback events.

`GTCX_AI_PROVIDER=anthropic` or `GTCX_AI_PROVIDER=openai` forces a specific provider — useful for testing or cost-driven routing.

If only `ANTHROPIC_API_KEY` is configured and Anthropic is down, the action exits with a non-blocking comment referencing the bus-factor risk. CI still succeeds; human reviewers are unblocked.

## Running locally

For end-to-end testing without a PR:

```bash
# Stub the workflow event payload
cat > /tmp/event.json <<EOF
{
  "pull_request": {
    "number": 1,
    "title": "test",
    "user": { "login": "test-user" },
    "head": { "sha": "$(git rev-parse HEAD)" },
    "base": { "sha": "$(git rev-parse HEAD~1)" }
  }
}
EOF

GITHUB_EVENT_PATH=/tmp/event.json \
GITHUB_REPOSITORY=gtcx-ecosystem/gtcx-core \
GITHUB_TOKEN=<token> \
ANTHROPIC_API_KEY=<key> \
node .github/scripts/codeowner-review/run.mjs
```

The selector can be tested without API calls:

```bash
echo "packages/crypto/src/zkp.ts
packages/security/src/audit/events.ts" | node .github/scripts/codeowner-review/select-playbooks.mjs | jq '.playbooks'
# → ["crypto", "security"]
```

## Extraction path (Sprint 5)

This is a prototype hosted in `gtcx-core` for the first 30+ PRs. Once the track record exists, extract to `gtcx-ecosystem/gtcx-codeowner-action` per the audit's Sprint 5 plan:

1. Move `run.mjs` and `select-playbooks.mjs` to the new repo's `src/`
2. Add `action.yml` with input/output declarations
3. Add `dist/index.js` bundle (esbuild) so consumers don't need to clone
4. Update consumers (`gtcx-core` and downstream repos) to use `uses: gtcx-ecosystem/gtcx-codeowner-action@v1`
5. Bring the playbooks along (or reference them from gtcx-core via `uses` config)

The MVP is intentionally limited:

- No caching of playbook reads (cheap enough)
- No retry logic on API failures (covered by `continue-on-error: true` + fallback comment)
- No structured review-log artifact yet — posting reviews to PRs is the v1 record
- No CODEOWNERS-based playbook activation (uses path prefixes; CODEOWNERS-driven selection is v2)

## Hard constraints (mirror the prompt's never-approve rule)

The runner enforces never-approve in three places:

1. The schema (`docs/agents/governance/review-schema.json`) restricts `decision` to `["COMMENT", "REQUEST_CHANGES"]`
2. The prompt's first hard constraint forbids `APPROVE` output
3. **`run.mjs:parseAndValidate()`** explicitly rejects any `decision=APPROVE` as a security event, even if the model emits it (defense in depth)

If any of these three layers is removed, the dual-AI CODEOWNER pattern degrades to single-reviewer.

## Bypass procedure

When the AI pipeline is broken or producing pathological output:

1. Apply the `bypass-ai-review` label to the PR
2. Reference an incident ID in the PR description (or document why bypass is necessary)
3. Two human CODEOWNERS review instead of human + AI
4. Add a retrospective entry to `quality/incidents/<id>/bypass-log.md` within 7 days

Full procedure in [`SECURITY-INCIDENT.md`](../../../docs/security/security-incident-runbook.md) § AI Review Bypass.

## See also

- [`docs/agents/governance/review-prompt.md`](../../../docs/agents/governance/review-prompt.md) — system prompt with seven hard constraints
- [`docs/agents/governance/review-schema.json`](../../../docs/agents/governance/review-schema.json) — output schema with never-approve enum
- [`docs/agents/governance/review-playbooks/`](../../../docs/agents/governance/review-playbooks/) — three path-specific playbooks
- [`SECURITY-INCIDENT.md`](../../../docs/security/security-incident-runbook.md) — bypass procedure, response runbook
