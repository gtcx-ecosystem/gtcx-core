# API Reference Contract

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Generated API reference is intentionally kept out of the tracked `docs/` tree.

## How to Generate

```bash
pnpm docs
```

The Typedoc output is written to `artifacts/api-docs/`, which is ignored by git.

## Why

- Generated symbol pages violate the ecosystem naming convention by design.
- Generated docs should be reproducible from source, not treated as canonical source-of-truth material.
- The authoritative human-oriented API descriptions live in [`../specs/packages/`](../specs/packages/) and the package READMEs.

## What This Does NOT Cover

- Package semantics and integration rules. See [`../specs/core-spec.md`](../specs/core-spec.md) and [`../specs/packages/README.md`](../specs/packages/README.md).
