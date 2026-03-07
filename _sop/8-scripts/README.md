# Scripts

Automation scripts for repository hygiene and documentation checks.

## Contents

| File                                         | Description                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| [doc-hygiene-check.sh](doc-hygiene-check.sh) | Checks for missing READMEs, unfilled placeholders, and broken links across the repo |

## Usage

```bash
bash repo/8-scripts/doc-hygiene-check.sh
```

**Dependencies**: `rg` (ripgrep) required for placeholder checks — if not installed, that check is silently skipped.
