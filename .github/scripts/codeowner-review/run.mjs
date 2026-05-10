#!/usr/bin/env node

/**
 * AI CODEOWNER review runner — closes the loop on the dual-AI CODEOWNER pattern
 * documented in docs/agents/governance/.
 *
 * Reads:
 *   - PR context from GITHUB_EVENT_PATH (workflow-injected)
 *   - System prompt from docs/agents/governance/review-prompt.md
 *   - Schema from docs/agents/governance/review-schema.json
 *   - Playbooks selected via select-playbooks.mjs based on changed files
 *   - Diff via `git diff <base>..<head>` (workflow checks out both refs)
 *
 * Calls Anthropic Claude (primary) with multi-provider fallback to OpenAI
 * when Anthropic is rate-limited, unreachable, or returns 5xx errors. The
 * fallback closes the "bus factor = 1 on AI CODEOWNER review" finding —
 * the dual-AI pattern is no longer single-provider-dependent.
 *
 * Validates output against schema. Hard-rejects any decision=APPROVE.
 * Posts a structured comment + review to the PR.
 *
 * Required env (at least one of the two AI providers):
 *   - ANTHROPIC_API_KEY     Anthropic Claude key (primary)
 *   - OPENAI_API_KEY        OpenAI key (fallback)
 *   - GITHUB_TOKEN          GitHub Actions token (for posting reviews)
 *   - GITHUB_EVENT_PATH     Path to event payload (set by GitHub Actions)
 *   - GITHUB_REPOSITORY     e.g. "gtcx-ecosystem/gtcx-core"
 *
 * Optional env:
 *   - GTCX_AI_PROVIDER      Force a specific provider: "anthropic" | "openai".
 *                           If unset, tries primary then falls back. Useful
 *                           for testing or for cost-driven routing.
 *
 * Exits non-zero only on infrastructure failure. Schema-validation failure
 * of the model output is logged and a fallback comment is posted; CI still
 * succeeds so a human reviewer is unblocked.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ANTHROPIC_MODEL = 'claude-opus-4-7';
const OPENAI_MODEL = 'gpt-4o';
const REPO_ROOT = process.cwd();
const PROMPT_PATH = path.join(REPO_ROOT, 'docs/agents/governance/review-prompt.md');
const SCHEMA_PATH = path.join(REPO_ROOT, 'docs/agents/governance/review-schema.json');
const SELECT_SCRIPT = path.join(REPO_ROOT, '.github/scripts/codeowner-review/select-playbooks.mjs');

// ---------------------------------------------------------------------------
// PR context
// ---------------------------------------------------------------------------

function loadEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH is not set — this script runs only in GitHub Actions');
  }
  return JSON.parse(fs.readFileSync(eventPath, 'utf8'));
}

function extractPrContext(event) {
  const pr = event.pull_request;
  if (!pr) {
    throw new Error('Event payload has no pull_request — this workflow only runs on PR events');
  }
  return {
    number: pr.number,
    title: pr.title,
    author: pr.user?.login ?? 'unknown',
    headSha: pr.head.sha,
    baseSha: pr.base.sha,
  };
}

// ---------------------------------------------------------------------------
// Diff + file selection
// ---------------------------------------------------------------------------

function getChangedFiles(baseSha, headSha) {
  const out = execFileSync('git', ['diff', '--name-only', `${baseSha}..${headSha}`], {
    encoding: 'utf8',
  });
  return out.split('\n').filter(Boolean);
}

function getUnifiedDiff(baseSha, headSha) {
  return execFileSync('git', ['diff', '--unified=5', `${baseSha}..${headSha}`], {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024, // 50 MB
  });
}

function selectPlaybooks(changedFiles) {
  const result = execFileSync(process.execPath, [SELECT_SCRIPT, ...changedFiles], {
    encoding: 'utf8',
  });
  return JSON.parse(result);
}

// ---------------------------------------------------------------------------
// Prompt assembly
// ---------------------------------------------------------------------------

function loadSystemPrompt() {
  const md = fs.readFileSync(PROMPT_PATH, 'utf8');
  // The system prompt lives in a fenced ``` block right after "## System Prompt".
  const match = md.match(/## System Prompt\n+```\n([\s\S]+?)\n```/);
  if (!match) {
    throw new Error('Could not extract system prompt from review-prompt.md');
  }
  return match[1];
}

function buildUserMessage({ pr, selection, diff }) {
  const playbookList = selection.playbooks.length
    ? selection.playbooks.join(', ')
    : '(no path-matched playbooks; nothing to review)';

  const playbookContents = Object.entries(selection.playbookContents)
    .map(([name, content]) => `### Playbook: ${name}\n\n${content}`)
    .join('\n\n---\n\n');

  return `PR #${pr.number} — ${pr.title}
Author: ${pr.author}
Base: ${pr.baseSha}
Head: ${pr.headSha}

Files changed in code-owned paths:
${selection.filesReviewed.map((f) => `  ${f}`).join('\n') || '  (none)'}

Selected playbooks (based on changed paths):
${playbookList}

==========================================================
PLAYBOOKS
==========================================================
${playbookContents || '(no playbooks supplied — emit COMMENT with empty findings)'}

==========================================================
DIFF
==========================================================
${diff}

==========================================================
CONTEXT REFERENCES (for \`references\` field only — not
to be re-quoted in findings)
==========================================================
- docs/security/threat-model.md
- docs/security/fips-validation-boundary.md
- docs/decisions/

Emit a single JSON document conforming to docs/agents/governance/review-schema.json. Nothing else.`;
}

// ---------------------------------------------------------------------------
// AI provider calls — Anthropic primary, OpenAI fallback
// ---------------------------------------------------------------------------

class ProviderError extends Error {
  constructor(message, { provider, status, retryable }) {
    super(message);
    this.name = 'ProviderError';
    this.provider = provider;
    this.status = status;
    this.retryable = retryable;
  }
}

function isRetryableStatus(status) {
  // 408 Request Timeout, 425 Too Early, 429 Too Many Requests, 5xx server errors.
  return status === 408 || status === 425 || status === 429 || (status >= 500 && status < 600);
}

async function callAnthropic({ system, user }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ProviderError('ANTHROPIC_API_KEY is not set', {
      provider: 'anthropic',
      status: 0,
      retryable: false,
    });
  }

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 8192,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
  } catch (err) {
    // Network errors (DNS, TLS, socket reset) — retryable in spirit.
    throw new ProviderError(`Anthropic network error: ${err.message}`, {
      provider: 'anthropic',
      status: 0,
      retryable: true,
    });
  }

  if (!response.ok) {
    const errBody = await response.text();
    throw new ProviderError(`Anthropic API error ${response.status}: ${errBody}`, {
      provider: 'anthropic',
      status: response.status,
      retryable: isRetryableStatus(response.status),
    });
  }

  const body = await response.json();
  const text = body.content?.[0]?.text ?? '';
  return { text, usage: body.usage, provider: 'anthropic', model: ANTHROPIC_MODEL };
}

async function callOpenAI({ system, user }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ProviderError('OPENAI_API_KEY is not set', {
      provider: 'openai',
      status: 0,
      retryable: false,
    });
  }

  let response;
  try {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        // The prompt instructs the model to emit a single JSON document.
        // response_format: json_object enforces this server-side.
        response_format: { type: 'json_object' },
        max_tokens: 8192,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
  } catch (err) {
    throw new ProviderError(`OpenAI network error: ${err.message}`, {
      provider: 'openai',
      status: 0,
      retryable: true,
    });
  }

  if (!response.ok) {
    const errBody = await response.text();
    throw new ProviderError(`OpenAI API error ${response.status}: ${errBody}`, {
      provider: 'openai',
      status: response.status,
      retryable: isRetryableStatus(response.status),
    });
  }

  const body = await response.json();
  const text = body.choices?.[0]?.message?.content ?? '';
  return { text, usage: body.usage, provider: 'openai', model: OPENAI_MODEL };
}

/**
 * Provider orchestration. Tries Anthropic first; on retryable failure,
 * falls back to OpenAI. The `GTCX_AI_PROVIDER` env var forces a specific
 * provider for testing or cost-driven routing.
 *
 * Closes the "bus factor = 1" finding on the AI CODEOWNER review — the
 * dual-AI pattern is no longer single-provider-dependent. If Anthropic is
 * down or throttling, OpenAI takes over automatically. The schema's
 * never-approve enforcement applies regardless of which provider responded.
 */
async function callProvider({ system, user }) {
  const forced = process.env.GTCX_AI_PROVIDER;
  if (forced === 'openai') return callOpenAI({ system, user });
  if (forced === 'anthropic') return callAnthropic({ system, user });

  // Default: Anthropic primary, OpenAI fallback on retryable errors.
  try {
    return await callAnthropic({ system, user });
  } catch (err) {
    if (!(err instanceof ProviderError) || !err.retryable) {
      // Non-retryable Anthropic failure (auth, quota, bad request) — surface.
      // Or a non-ProviderError unexpected exception.
      throw err;
    }
    if (!process.env.OPENAI_API_KEY) {
      // No fallback configured — surface the original Anthropic error
      // augmented with the bus-factor context.
      throw new ProviderError(
        `${err.message} (no OPENAI_API_KEY fallback configured — bus-factor risk)`,
        { provider: 'anthropic', status: err.status, retryable: false }
      );
    }
    console.error(
      `Anthropic failed (${err.status}: ${err.message}); falling back to OpenAI`
    );
    return await callOpenAI({ system, user });
  }
}

// ---------------------------------------------------------------------------
// Output validation
// ---------------------------------------------------------------------------

function parseAndValidate(rawText) {
  // Tolerate markdown wrapping despite the prompt forbidding it
  const stripped = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  let parsed;
  try {
    parsed = JSON.parse(stripped);
  } catch (err) {
    throw new Error(`Model returned non-JSON output: ${err.message}`);
  }

  // Hard never-approve enforcement (constraint #1 in review-prompt.md)
  if (parsed.decision === 'APPROVE') {
    throw new Error('SECURITY EVENT: model emitted decision=APPROVE — schema explicitly forbids this');
  }

  if (!['COMMENT', 'REQUEST_CHANGES'].includes(parsed.decision)) {
    throw new Error(`Invalid decision: ${parsed.decision}`);
  }

  // Light schema sanity checks (full ajv validation is overkill for a prototype)
  if (!Array.isArray(parsed.findings)) {
    throw new Error('findings must be an array');
  }
  if (typeof parsed.summary !== 'string') {
    throw new Error('summary must be a string');
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// PR review posting
// ---------------------------------------------------------------------------

async function postReview({ prNumber, review }) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;
  if (!token || !repo) {
    throw new Error('GITHUB_TOKEN or GITHUB_REPOSITORY missing');
  }

  const body = formatReviewBody(review);
  const event = review.decision === 'REQUEST_CHANGES' ? 'REQUEST_CHANGES' : 'COMMENT';

  const response = await fetch(
    `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews`,
    {
      method: 'POST',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
      },
      body: JSON.stringify({ body, event }),
    }
  );

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`GitHub review POST failed ${response.status}: ${errBody}`);
  }

  return response.json();
}

function formatReviewBody(review) {
  const lines = [];
  lines.push(`**AI CODEOWNER review** — ${review.decision}`);
  lines.push('');
  lines.push(review.summary);

  if (review.findings.length > 0) {
    lines.push('');
    lines.push('---');
    lines.push('');
    lines.push('### Findings');
    for (const f of review.findings) {
      lines.push('');
      lines.push(`- **[${f.severity}] ${f.title}** (\`${f.playbookRef}\`)`);
      lines.push(`  - File: \`${f.file}${f.line ? `:${f.line}` : ''}\``);
      lines.push(`  - Rationale: ${f.rationale}`);
      if (f.recommendation) lines.push(`  - Recommendation: ${f.recommendation}`);
    }
  }

  lines.push('');
  lines.push('---');
  lines.push('_This review was generated by the AI CODEOWNER. The bot never approves — a human CODEOWNER must approve before merge. See [`docs/agents/governance/`](../../docs/agents/governance/)._');

  return lines.join('\n');
}

async function postFallbackComment({ prNumber, error }) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY;

  const body = [
    '**AI CODEOWNER review — failed**',
    '',
    `The AI review pipeline encountered an error: \`${error.message}\``,
    '',
    'Per `SECURITY-INCIDENT.md` § AI Review Bypass Procedure: if Claude API is unreachable or returning malformed output, two human CODEOWNERS must review instead. Apply the `bypass-ai-review` label and reference an incident ID before merge.',
  ].join('\n');

  await fetch(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`, {
    method: 'POST',
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
    },
    body: JSON.stringify({ body }),
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const event = loadEvent();
  const pr = extractPrContext(event);

  console.log(`Reviewing PR #${pr.number} (${pr.headSha} from ${pr.baseSha})`);

  const changedFiles = getChangedFiles(pr.baseSha, pr.headSha);
  console.log(`Changed files: ${changedFiles.length}`);

  const selection = selectPlaybooks(changedFiles);
  console.log(`Applicable playbooks: ${selection.playbooks.join(', ') || '(none)'}`);

  if (selection.playbooks.length === 0) {
    console.log('No code-owned paths touched — skipping AI review');
    return;
  }

  const diff = getUnifiedDiff(pr.baseSha, pr.headSha);
  console.log(`Diff size: ${diff.length} bytes`);

  const system = loadSystemPrompt();
  const user = buildUserMessage({ pr, selection, diff });

  let review;
  let providerUsed;
  let modelUsed;
  try {
    const { text, usage, provider, model } = await callProvider({ system, user });
    providerUsed = provider;
    modelUsed = model;
    console.log(`Provider: ${provider} (${model}); usage: ${JSON.stringify(usage)}`);
    review = parseAndValidate(text);
  } catch (err) {
    console.error(`AI review failed: ${err.message}`);
    await postFallbackComment({ prNumber: pr.number, error: err });
    return;
  }

  // Augment review with metadata before posting
  review.pr = { ...review.pr, number: pr.number, headSha: pr.headSha, baseSha: pr.baseSha };
  review.reviewedAt = new Date().toISOString();
  review.reviewer = {
    account: 'gtcx-codeowner-action',
    model: modelUsed,
    provider: providerUsed,
    actionVersion: '0.2.0-multi-provider',
    playbookVersions: {},
  };
  review.playbooksApplied = selection.playbooks;
  review.filesReviewed = selection.filesReviewed;
  review.filesSkipped = selection.filesSkipped;
  review.schemaVersion = '1.0.0';

  await postReview({ prNumber: pr.number, review });
  console.log(`Posted review: ${review.decision} (${review.findings.length} findings)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
