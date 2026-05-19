---
'@gtcx/security': patch
---

Add rustls-webpki mitigation documentation, P1-free tracking, and coverage gap tests

- docs/security/RUSTSEC-rustls-webpki-mitigation.md: documents 3 RUSTSEC advisories,
  dependency path through AWS SDK, threat model assessment, and monitoring plan
- docs/quality/p1-free-tracking.md: starts 90-day P1-free clock with weekly checks
- packages/security/tests/coverage-gaps-2.test.ts: 16 targeted tests pushing branch
  coverage from 87.86% to 90.77%

Infrastructure-only release to trigger CI provenance generation (SLSA Build L3).
