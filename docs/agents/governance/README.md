---
title: 'AI CODEOWNER Governance'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 95
autonomy_level: 'sovereign'
tier: 'critical'
tags: ['documentation', 'agents']
review_cycle: 'on-change'
---

# AI CODEOWNER Governance

This directory contains the dual-AI CODEOWNER pattern that gates merges into security-sensitive paths in `gtcx-core`. The pattern uses GitHub CODEOWNERS to require two reviewers — one human (`@amanianai`), one AI (`@gtcx-agent`) — on every PR touching cryptographic, security, or verification code.

The bot does not approve. It surfaces findings against versioned, path-specific playbooks and posts a structured review comment. The human CODEOWNER retains sole approval authority.

---

## Files

| File                               | Purpose                                                                                                               |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `README.md`                        | This file                                                                                                             |
| `review-prompt.md`                 | System prompt for the bot, with seven hard constraints. Used by `gtcx-codeowner-action`                               |
| `review-schema.json`               | JSON Schema for review output. `decision` enum has no `APPROVE` value — never-approve is enforced at the schema level |
| `review-playbooks/crypto.md`       | 12 checks for `packages/crypto/`, `packages/crypto-native/`, `rust/gtcx-crypto/`, `rust/gtcx-zkp/`                    |
| `review-playbooks/security.md`     | 12 checks for `packages/security/`, `packages/identity/`                                                              |
| `review-playbooks/verification.md` | 12 checks for `packages/verification/`, `packages/workproof/`                                                         |

Two more playbooks (`ci.md`, `evidence.md`) ship in Sprint 3.

---

## How a review happens

1. PR opened or pushed against `gtcx-core`.
2. `gtcx-codeowner-action` (separate repo, GitHub Action) detects which CODEOWNER paths are touched.
3. Action selects playbooks per the path-prefix rules in `review-prompt.md`.
4. Action invokes Claude API with: `review-prompt.md` + selected playbooks + diff + context references.
5. Claude returns a JSON document conforming to `review-schema.json`.
6. Action validates output. Schema failure or `decision=APPROVE` → CI fails, security event logged, review not posted.
7. Action posts the review as a comment on the PR with `decision=COMMENT` or `decision=REQUEST_CHANGES`.
8. Review entry appended to `quality/ai-review-log/` (added Sprint 1).

The bot never approves. Even with `decision=COMMENT`, the human CODEOWNER must approve before merge.

---

## Why this is a moat (not a feature)

A funded team can copy the CODEOWNERS file in minutes and the GitHub Action skeleton in a week. They cannot copy:

- 90+ days of historical review-log showing what the bot caught
- The conference-circuit credibility for "first dual-AI-governance crypto library"
- Trust signals from regulators who reviewed the AI-review log as part of a sandbox application
- The compound effect of being the _attribution source_ — when others adopt the pattern, they point back to GTCX

The first three are functions of _time_, not funding. That is the only kind of moat that survives infinite capital.

---

## Hard rules — read before any change to this directory

1. **The bot must never approve.** This is enforced in three places: the schema (`decision` enum has no `APPROVE`), the action runner (rejects `APPROVE` if model emits it), and the prompt's first hard constraint. Any change to this directory that weakens any of those three is a critical finding under the `redaction-bypass` category and the security playbook check 4 (token lifecycle invariants — analogous reasoning).

2. **Playbook changes go through dual review.** A PR modifying any file in this directory is reviewed by `gtcx-agent` against the _previous_ version of the prompt and playbooks, plus a human CODEOWNER. Bootstrapping from zero is the only exception — the initial commit creating these files is reviewed by humans only.

3. **Review entries are append-only.** `quality/ai-review-log/` accepts new files. It does not accept modifications or deletions. Tampering with the log is a critical security event.

4. **Versioning is mandatory.** Every playbook and prompt has a Version field and a Changelog. Bumps are semver: major for new categories or schema changes, minor for new checks, patch for clarifications.

---

## Roadmap

Per `,full-audit-2026-05-09.md` Sprint plan:

| Sprint | Item                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------- |
| 1      | Document the pattern (this directory)                                                               |
| 2      | (no governance work)                                                                                |
| 3      | Build `gtcx-codeowner-action`, wire to CI as non-blocking, run against 5 real PRs, capture findings |
| 4      | (GTM focus)                                                                                         |
| 5      | Open-source `gtcx-codeowner-template` once track record exists                                      |
| 6      | Public review-log dashboard, conference talk submissions                                            |

---

## See also

- `.github/CODEOWNERS` — path-to-reviewer mapping
- `docs/agents/roles/crypto-security-engineer.md` — human role definition the bot's playbooks operationalize
- `docs/security/threat-model.md` — STRIDE table and threat control matrix the playbooks reference
- `,full-audit-2026-05-09.md` — full audit including the buildout proposal for this pattern
