---
title: "Disaster Recovery Runbook"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "devops"]
review_cycle: "on-change"
---

---
title: 'Disaster Recovery Runbook'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'frontier-infra-engineer'
tier: 'critical'
tags: ['dr', 'bcp', 'runbook', 'recovery']
review_cycle: 'quarterly'
---

# Disaster Recovery Runbook

> **Scope:** `gtcx-core` library foundation. DR concerns here are source-code integrity, cryptographic key continuity, and downstream consumer protection — not service restoration.

---

## 1. RTO / RPO Definitions

| Metric                             | Target    | Rationale                                                                                                                                   |
| ---------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **RTO (Recovery Time Objective)**  | 4 hours   | Time to restore main branch CI and verified builds after a repository compromise                                                            |
| **RPO (Recovery Point Objective)** | 0 minutes | All code and release artifacts are immutable (Git commits signed, npm packages immutable, provenance attested). No data loss is acceptable. |

---

## 2. Scenario Catalog

### Scenario A: GitHub Repository Compromise

**Trigger:** Unauthorized push to `main`, leaked admin credentials, or forced push detected.

**Response:**

1. **Freeze** — Immediately disable push access via GitHub branch protection emergency override
2. **Assess** — `git reflog` + `git fsck` to identify unauthorized objects
3. **Restore** — Force-reset `main` to last known-good signed commit (verified GPG signature)
4. **Verify** — Run full gate sequence: `pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
5. **Communicate** — Post incident notice to `docs/security/security-incident-runbook.md` §5

**Verification command:**

```bash
git verify-commit $(git rev-parse HEAD) && \
  pnpm architecture:check && pnpm lint && pnpm format:check && \
  pnpm typecheck && pnpm test && pnpm build && \
  pnpm docs:check-links && pnpm docs:check-frontmatter && \
  pnpm quality:governance:check && \
  cd rust && cargo test --workspace && cargo clippy --workspace --all-targets && \
  cargo fmt --all -- --check && cargo test --features fips
```

### Scenario B: npm Package Compromise

**Trigger:** Published package hash does not match provenance attestation, or unauthorized version detected on registry.

**Response:**

1. **Yank** — `npm deprecate @gtcx/<package>@<version> "Security compromise — do not use"`
2. **Audit** — Compare local build hash against published hash: `pnpm build:reproducible --canonicalize`
3. **Republish** — Increment patch version, rebuild from clean tree, publish with SLSA provenance
4. **Notify** — Post security advisory to `SECURITY.md` and downstream repos

**Verification command:**

```bash
npm view @gtcx/crypto@latest --json | jq '.dist.integrity' && \
  cat packages/crypto/dist/*.tgz.sha256
```

### Scenario C: Cryptographic Key Compromise (Signing Keys)

**Trigger:** Leaked private signing key, unauthorized certificate, or HSM breach.

**Response:**

1. **Revoke** — Add revoked key ID to `packages/crypto/src/revoked-keys.ts`
2. **Rotate** — Generate new key pair via `rust/gtcx-crypto` keygen with new key ID
3. **Re-sign** — Re-sign all active release artifacts with new key
4. **Publish** — Push revocation registry update as emergency patch release

**Verification command:**

```bash
cargo test --features fips -- key_rotation && \
  pnpm test -- packages/crypto/tests/revocation.test.ts
```

### Scenario D: CI/CD Pipeline Compromise

**Trigger:** Malicious workflow injection, compromised runner, or unauthorized secret access.

**Response:**

1. **Pause** — Disable all workflows via GitHub UI
2. **Audit** — Review `.github/workflows/` diff against last signed commit
3. **Rotate** — Rotate all repository secrets (`NPM_TOKEN`, `TURBO_TOKEN`, etc.)
4. **Restore** — Re-enable workflows after clean review

---

## 3. Recovery Evidence Checklist

After any DR activation, the following must be true before declaring recovery complete:

- [ ] `main` branch HEAD is a GPG-signed commit by a CODEOWNER
- [ ] Full gate sequence passes: `pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- [ ] `cargo test --features fips` passes (30 tests)
- [ ] `cargo audit` passes (exceptions documented in `rust/.cargo/audit.toml` if any)
- [ ] `pnpm docs:check-links` passes
- [ ] All release artifacts have valid SLSA provenance (if published)
- [ ] Incident post-mortem written in `docs/security/security-incident-runbook.md`

---

## 4. DR Drill Schedule

| Frequency | Drill                                         | Owner                    | Last Drilled | Next Due   |
| --------- | --------------------------------------------- | ------------------------ | ------------ | ---------- |
| Quarterly | Scenario A (repo compromise restore)          | Protocol Architect       | —            | 2026-06-30 |
| Quarterly | Scenario B (npm yank + republish)             | Frontier Infra Engineer  | —            | 2026-06-30 |
| Annually  | Scenario C (key rotation)                     | Crypto Security Engineer | —            | 2026-12-31 |
| Annually  | Scenario D (CI pipeline audit)                | Quality & Evidence Lead  | —            | 2026-12-31 |
| Quarterly | Scenario E (cross-repo dependency compromise) | Protocol Architect       | —            | 2026-06-30 |

---

## 5. Cross-Repo Considerations

`gtcx-core` is consumed by `gtcx-protocols`, `gtcx-intelligence`, `gtcx-markets`, and `gtcx-infrastructure`. A compromise in gtcx-core affects all downstream repos.

**Cross-repo response:**

1. **Assess downstream impact** — Check which commits from the compromised window are referenced in downstream repos
2. **Freeze downstream pipelines** — Pause CI in `gtcx-protocols` and other repos until gtcx-core is restored
3. **Coordinate recovery** — Downstream repos rebase to the restored gtcx-core commit
4. **Verify transitive trust** — Run cross-repo test matrix (`pnpm test` in gtcx-core + gtcx-protocols)

## 6. Contact Escalation

| Role               | Primary                 | Secondary                |
| ------------------ | ----------------------- | ------------------------ |
| Incident Commander | Protocol Architect      | Crypto Security Engineer |
| Communications     | Quality & Evidence Lead | Protocol Architect       |
| Technical Recovery | Frontier Infra Engineer | Crypto Security Engineer |
| Cross-Repo Coord   | Protocol Architect      | Frontier Infra Engineer  |
