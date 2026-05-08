---
'@gtcx/ai': minor
---

Provenance-aware tracing helpers

- Add `attachProvenance(data, provenance)` to wrap AI output with `AgenticProvenance` envelope
- Add `createProvenanceLogger(category)` for structured provenance logging to stderr
- Add `ProvenancedResult<T>` type for results carrying provenance metadata
