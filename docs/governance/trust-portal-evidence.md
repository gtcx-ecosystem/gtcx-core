---
title: 'Trust portal — controls and evidence'
status: current
date: 2026-06-05
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['governance', 'trust-portal', 'evidence', 'compliance']
review_cycle: on-change
---

# Trust portal — controls matrix and evidence

> **Parent:** [trust-portal.md](./trust-portal.md)

## Controls matrix — gtcx-core controls mapped to recognized standards

| Control category            | NIST SP 800-53 ref | SOC 2 TSC ref | gtcx-core evidence                                                                                                                          |
| --------------------------- | ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Access control to source    | AC-2, AC-3, AC-6   | CC6.1-6.3     | `.github/CODEOWNERS`, branch protection on main, dual-AI review with a human reviewer plus `gtcx-agent`                                     |
| Cryptographic primitives    | SC-13, SC-12       | CC6.1, C1.1   | FIPS provider via aws-lc-rs CMVP #4816, Ed25519 via `@noble/curves`, content-hash allowlist                                                 |
| Key lifecycle               | SC-12, SC-17       | CC6.1, C1.1   | `KeyStore` trait with NIST SP 800-57 states (Created, Active, Rotated, Revoked, Destroyed)                                                  |
| Data classification         | RA-2, MP-2         | C1.1          | `redactSecrets` default sanitizer; threat model defines confidential categories                                                             |
| Secure software development | SA-11, SA-15       | CC8.1         | 21 CI gates; CodeQL, Trivy, cargo-audit, secret scan; architecture boundary enforcement                                                     |
| Supply chain                | SA-12, SR-3        | CC9.2         | `pnpm.overrides` exact-pinning; `tools/check-crypto-deps.mjs` integrity allowlist; SBOM (CycloneDX) on every build                          |
| Vulnerability management    | RA-5, SI-2         | CC7.1         | Dependabot, `pnpm audit` on every PR, cargo-audit on every PR, public disclosure policy                                                     |
| Incident response           | IR-4, IR-6         | CC7.3-7.5     | [`SECURITY-INCIDENT.md`](../security/security-incident-runbook.md) six-phase runbook with severity classification + bypass procedure        |
| Audit and monitoring        | AU-2, AU-12        | CC4.1, CC7.2  | Structured stderr JSON traces; `SpanEmitter` contract for OTel forwarding; sanitizer-override telemetry; provenance manifest on publish     |
| Change management           | CM-3, CM-4         | CC8.1         | Conventional commits, changesets, branch protection, required CODEOWNER review, API surface baseline at `quality/api-surface-baseline.json` |
| Risk assessment             | RA-3               | CC3.1-3.4     | STRIDE table, attack tree, threat actor table, residual risk analysis                                                                       |
| Reproducibility             | (n/a)              | CC8.1         | `pnpm build:reproducible` verifies bit-for-bit reproducibility per package                                                                  |

---

## Evidence by category

### Cryptographic correctness

- [Threat model TC-001-TC-002](../security/threat-model.md) — key generation, hash collision controls
- [Attack tree](../security/attack-tree-signing.md) — 4 branches, 20 leaf nodes, 5 mitigations tracked
- Property-based tests — 25 properties × 50-100 runs each in [`packages/crypto/tests/property-based.test.ts`](../../packages/crypto/tests/property-based.test.ts)
- [Fuzz campaign](../../quality/fuzz-results/campaign-summary.md) — 9.9M executions, 0 crashes, 6 targets, ASAN enabled
- [FIPS validation boundary](../security/fips-validation-boundary.md) — inheritance via aws-lc-rs CMVP #4816
- ZKP fail-closed-by-default (SA-002 closed) — `HashCommitmentZkpEngine.generate()` throws unless `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`
- Revocation pathway (SA-004 + AT-002 closed) — `RevocationChecker` interface required on `tracedVerifyCertificate()`
- [Circuit registry (profile IDs)](./trust-portal-zkp-circuit-registry.md) — semver lifecycle, off-circuit policy column, verify throughput evidence (DTF-5.4.1–5.4.3)

### Supply chain integrity

- [Crypto dependency allowlist](../../tools/check-crypto-deps.mjs) — pinned versions + sha512 integrity hashes for `@noble/*`
- [Reproducible-build verifier](../../tools/check-reproducible-build.mjs) — `pnpm build:reproducible`
- SBOM (CycloneDX) — generated on every CI build via Trivy
- Provenance manifest — `pnpm provenance:generate`; `--provenance` flag on publish
- [Threat model supply chain section](../security/threat-model.md#supply-chain-threats)

### Access control and governance

- [`.github/CODEOWNERS`](../../.github/CODEOWNERS) — dual-reviewer enforcement with `@amanianai` and `@gtcx-agent` on security-sensitive paths
- Branch protection on `main` — required CODEOWNER review, required status checks (ci, rust, codeql, security)
- [Dual-AI CODEOWNER governance](../agents/governance/README.md) — schema, system prompt, 3 path-specific playbooks
- AI CODEOWNER never approves — enforced in three layers (schema enum, prompt constraint, runner output filter)
- AI CODEOWNER multi-provider — Anthropic primary, OpenAI fallback (closes single-provider bus-factor)

### Audit and monitoring

- Structured stderr JSON for every traced operation; `SpanEmitter` contract for OTel/Datadog/Honeycomb forwarding
- Sanitizer-override telemetry — `event=sanitizer_override` fires when explicit sanitizer is wired
- [`pnpm ops:check`](../operations/repo-bootstrap.md) — auto-verified operational prerequisites with remediation commands
- KPI metrics export — `pnpm quality:kpi:export`

### Incident response

- [`SECURITY.md`](../../SECURITY.md) — public disclosure policy with severity-based response timelines
- [`SECURITY-INCIDENT.md`](../security/security-incident-runbook.md) — six-phase internal runbook: triage, containment, investigation, remediation, disclosure, and retrospective. Includes the AI bypass procedure plus three templates: acknowledgement, downstream notice, and public advisory.
- Coordinated disclosure window — 14 days from fix-merged to public for critical/high

### Compliance posture

- [SOC 2 Type 1 readiness gap analysis](../compliance/soc2-readiness.md) — TSC mapping + 7 documented gaps
- [GDPR assessment](../compliance/gdpr-assessment.md) — zero-PII determination, DPIA not required
- [PCI-DSS scope](../compliance/pci-dss-scope.md) — formal zero-CHD declaration
- [SOX controls](../compliance/sox-controls.md) — ITGC mapping for change management, access controls, program development

### Operational integrity

- [Quality runbook](../devops/runbooks/quality-runbook.md) — CI triage order
- [Release checklist](../devops/release-mgmt/release-checklist.md) — pre-release gate
- [Repo bootstrap](../operations/repo-bootstrap.md) — auto-generated from `tools/check-ops-prereqs.mjs`

---

## Live operational state

Run `pnpm ops:check` against this repo to see the current state. The checker uses `gh api` to verify runtime configuration (secrets, branch protection, org membership, CODEOWNERS validity) and reports pass/fail/warn/skip with remediation commands inline. The latest snapshot is reproducible by anyone with read access to the org.

The output is also auto-written to [`docs/operations/repo-bootstrap.md`](../operations/repo-bootstrap.md) via `pnpm ops:emit-doc`.

---
