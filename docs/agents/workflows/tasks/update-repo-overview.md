# Task: Update Repository Overview Document

> **Trigger:** After every master audit cycle, milestone completion, or material change to repo state.
> **Canonical prompt:** `gtcx-ecosystem/audit:repo-overview-prompt.md`
> **Output:** `docs/overview/README.md`
> **Verification gates:** `format:check`, `docs:check-links`, `quality:governance:check`, `architecture:check`

## Instructions

1. Read the canonical prompt: `gtcx-ecosystem/audit:repo-overview-prompt.md`
2. If running ad-hoc, use the shareable version: `gtcx-ecosystem/audit:repo-overview-prompt-RUN.md`
3. Follow the canonical prompt exactly — do not improvise structure or skip sections
4. Run all verification gates before committing

## Commit

```
docs(overview): update repo overview per gtcx-ecosystem/audit:repo-overview-prompt.md
```
