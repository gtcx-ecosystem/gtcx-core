# Downstream Production-Readiness Checklist

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

Use this before adopting a `gtcx-core` release in a production downstream system.

---

## Trust and Runtime

- [ ] Required packages and versions are pinned intentionally
- [ ] Native crypto requirement has been decided explicitly
- [ ] Fallback behavior has been reviewed for the target deployment
- [ ] Public API changes were reviewed in `quality/api-surface-report.json`

## Resilience and Storage

- [ ] Offline queue behavior was tested under the consumer’s persistence model
- [ ] Secure-storage lockout and recovery were tested on target devices
- [ ] Clock-skew and restart behavior were validated for legally consequential flows
- [ ] Queue/storage corruption handling was reviewed for fail-safe behavior

## Operational Readiness

- [ ] Release evidence artifacts were reviewed
- [ ] SBOM and provenance artifacts were archived according to consumer policy
- [ ] Rollback/deprecation procedure is understood before adoption
- [ ] Monitoring or application logging is in place for integration failures

## Validation

- [ ] Consumer integration tests passed against the exact release candidate
- [ ] Any required compliance or legal review for cryptographic software distribution is complete
- [ ] Deployment owners accepted any remaining external or field-only risks
