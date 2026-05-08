---
'@gtcx/types': minor
'@gtcx/schemas': minor
---

Agentic Provenance types and schemas

- Add `AgenticProvenance` interface with `trustLevel`, `confidence`, `evidenceRefs`, `methodologyVersion`, `requiresHumanReview`, `decisionProvenance`
- Add `ReviewThreshold` with 4 default gates: `high_impact_compliance`, `model_uncertainty`, `stale_or_partial_evidence`, `jurisdictional_edge_case`
- Add `ProvenancePolicy` and `evaluateProvenancePolicy()` for machine-readable policy gates
- Add `shouldRequireHumanReview()` helper
- Add Zod schemas in `@gtcx/schemas` for runtime validation
