---
'@gtcx/crypto': minor
'@gtcx/events': major
'@gtcx/identity': minor
'@gtcx/services': major
---

Baseline the reviewed 2026-05-06 public API surface for release readiness.

The current generated declarations expose additive exports in crypto and identity, and signature-level changes in events and services. This changeset records the required semver intent so release automation does not publish the updated API contract without the appropriate package version movement.
