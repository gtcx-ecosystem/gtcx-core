# Security Incident Response Runbook

This runbook governs internal response when a security incident is reported against `gtcx-core`. The reporter-facing disclosure policy is in [`SECURITY.md`](./SECURITY.md). This document is what the response team executes after a report lands at `security@gtcx.io`.

**Audience:** maintainers, on-call, designated incident commander
**Scope:** all `@gtcx/*` npm packages and `gtcx-*` Rust crates in this repository
**Last reviewed:** 2026-05-09
**Owner:** Cryptographic Security Engineer (`docs/agents/roles/crypto-security-engineer.md`)

---

## Severity Classification

| Severity     | Definition                                                                                             | Initial response | Fix target   | Public advisory                |
| ------------ | ------------------------------------------------------------------------------------------------------ | ---------------- | ------------ | ------------------------------ |
| **Critical** | Active exploitation, key extraction, signature forgery, or complete bypass of cryptographic guarantees | 24 hours         | 72 hours     | Within 7 days of fix           |
| **High**     | Vulnerability that allows trust-path compromise but requires specific conditions                       | 48 hours         | 7 days       | Within 14 days of fix          |
| **Medium**   | Vulnerability that weakens defense-in-depth but does not directly enable exploitation                  | 7 days           | 30 days      | Within 30 days of fix          |
| **Low**      | Hardening opportunities, documentation gaps, deprecation issues                                        | 14 days          | Next release | Coordinated with release notes |

The reporter sees these timelines via `SECURITY.md`. The incident commander owns honoring them.

---

## Phase 1 — Triage (first 4 hours)

The first responder to `security@gtcx.io` performs:

1. **Acknowledge the reporter** within the initial-response window above. Use the [Acknowledgement template](#template-1--reporter-acknowledgement).
2. **Assign an incident ID** in the format `SEC-YYYY-NNNN` (e.g., `SEC-2026-0001`). Track in `quality/incidents/<id>/` (private branch — never on `main`).
3. **Classify severity** using the table above. When in doubt, classify higher.
4. **Designate an incident commander.** Defaults: maintainer first, Cryptographic Security Engineer for any cryptographic correctness or supply-chain finding.
5. **Open a private fork** if the reporter has not already done so. Never reproduce the vulnerability in a public branch or issue.
6. **Notify** the second CODEOWNER (`gtcx-agent` once active, or the human backup until then). Bus-factor mitigation is non-negotiable for incident response.

If the report includes proof-of-concept code, do not run it on infrastructure that has access to production keys, signing material, or the npm publishing token. Use an isolated environment.

---

## Phase 2 — Containment (Critical/High only)

For Critical and High severity, before remediation begins:

1. **Revoke any exposed credentials.** If a private key was leaked, treat all artifacts signed by that key as compromised. Rotate.
2. **Pause publication.** Add a maintenance note to the package readme; do not publish new versions until the fix is ready. Existing versions are not yanked unless they are actively exploitable — yanking is more disruptive than the advisory.
3. **Notify downstream consumers** identified in `docs/architecture/`:
   - `gtcx-protocols`
   - `gtcx-platforms`
   - `gtcx-mobile`
   - `gtcx-intelligence`
   - `gtcx-infrastructure`
   - Use the [Downstream notice template](#template-2--downstream-consumer-notice).
4. **Disable affected functionality** at the consumer level if technically feasible (feature flags, env-flag guards). For example, SA-002 was closed by flipping `HashCommitmentZkpEngine.generate()` to fail-closed; an analogous emergency-disable pattern applies to other primitives.

---

## Phase 3 — Investigation

The incident commander leads:

1. **Reproduce the issue** in the isolated environment.
2. **Map the impact surface.** Which packages, which versions, which downstream consumers are affected? Use the dependency graph in `docs/architecture/` and `quality/api-surface-baseline.json`.
3. **Identify the root cause.** Distinguish:
   - Implementation bug — fix in code
   - Specification gap — fix in code + spec + threat model
   - Cryptographic correctness gap — fix requires Cryptographic Security Engineer review and may require ADR
   - Supply chain compromise — fix requires content-pin allowlist update (`tools/check-crypto-deps.mjs`) and may require yanking dependency
4. **Document findings** in `quality/incidents/<id>/investigation.md` (private branch). Include: timeline, reproducer, affected versions, downstream impact map.

For cryptographic correctness issues, the soundness analysis discipline from `docs/agents/roles/crypto-security-engineer.md` applies. The 12,400-revocation-incident lesson encoded there is the reason this runbook exists in the first place.

---

## Phase 4 — Remediation

1. **Develop the fix on a private branch.** Never on `main` until coordinated disclosure.
2. **Add a regression test** that fails before the fix and passes after.
3. **Update the threat model.** Either close a gap, modify a mitigation, or add a new STRIDE row.
4. **Update audit findings.** Move the relevant `SA-*` / `AT-*` entry to `Closed` with a reference to the incident ID and the fix commit.
5. **Run the full quality gate** sequence locally (`docs/devops/runbooks/quality-runbook.md`) before any merge. Skipping `--no-verify` is a hard-rule violation per `CLAUDE.md`.
6. **Dual review** by both CODEOWNERS (human + gtcx-agent once active). For incidents that bypass the AI review (`bypass-ai-review` label per the AI CODEOWNER prompt's failure-mode handling), require **two human reviewers** instead.

---

## Phase 5 — Coordinated Disclosure

1. **Reserve a CVE** via GitHub Security Advisories. CVE assignment is required for Critical and High; recommended for Medium.
2. **Draft the advisory** using the [Advisory template](#template-3--public-advisory).
3. **Coordinate the disclosure window** with the reporter. Standard: 14 days from fix-merged to public advisory for Critical/High; 30 days for Medium.
4. **Publish the patch.** Use `pnpm publish --provenance` so the published artifact carries the provenance attestation.
5. **Ship the advisory.** GitHub Security Advisories + npm advisory + email to downstream consumers.
6. **Credit the reporter** in the advisory unless they request anonymity.

---

## Phase 6 — Post-Incident Review

Within 14 days of advisory publication:

1. **Blameless retrospective.** What went well? What didn't? What systemic change would prevent recurrence?
2. **Update this runbook** if the response surfaced gaps in the process.
3. **Update threat model + ADRs** if the root cause was a structural decision.
4. **Publish the retrospective summary** in `docs/security/incidents/<id>-retrospective.md` (public — sandbox regulators value this signal).
5. **Update `SECURITY-INCIDENT.md` changelog.**

Examples of root-cause patterns that have shaped this runbook:

- Soundness vs. correctness review distinction (Cryptographic Security Engineer role)
- Default-warn → default-throw flip (SA-002 closure)
- Required revocation pathway (SA-004 / AT-002 closure)

Each closure was preceded by an incident-style review even when no incident had occurred. The pattern works. Use it.

---

## AI Review Bypass Procedure

The AI CODEOWNER (`docs/agents/governance/review-prompt.md`) defines a `bypass-ai-review` label for emergency hot-fixes when the AI provider is unreachable or producing pathological output.

When a PR carries `bypass-ai-review`:

1. **Two human CODEOWNERS must review** — not one human + one AI. The bypass is operational, not a relaxation of review depth.
2. **The PR description must reference** an active incident ID or document why the bypass is necessary.
3. **A retrospective entry** must be added to `quality/incidents/<id>/bypass-log.md` within 7 days, describing the failure mode and any remediation needed for the AI review pipeline.
4. **The label is removed** before merge (audit trail).

Bypassing AI review is not a security event by itself. Bypassing AI review **without recording why** is.

---

## On-Call Rotation

Until formal on-call is established (Sprint 5+), the rotation is:

| Role                            | Contact      | Backup                                    |
| ------------------------------- | ------------ | ----------------------------------------- |
| Incident commander              | `@amanianai` | `@gtcx-agent` (once activated)            |
| Cryptographic Security Engineer | `@amanianai` | _vacancy — fill before any S5 deployment_ |
| Communication lead              | `@amanianai` | _vacancy_                                 |

Bus-factor = 1 is currently the **single highest-priority operational risk** in the audit (Phase 5). Activating `gtcx-agent` and recruiting a backup human is the unblock.

---

## Communication Channels

- **Primary:** `security@gtcx.io` (publicly listed)
- **Internal incident channel:** to be established with the second CODEOWNER
- **Downstream consumer notification:** repository owners of `gtcx-protocols`, `gtcx-platforms`, `gtcx-mobile`, `gtcx-intelligence`, `gtcx-infrastructure`
- **Public advisory:** GitHub Security Advisories + npm advisory + repo `CHANGELOG.md`

---

## Template 1 — Reporter Acknowledgement

```
Subject: Re: <reporter's subject> — Incident SEC-YYYY-NNNN

Thank you for the report. We have assigned incident ID <SEC-YYYY-NNNN> and
classified the severity as <Critical|High|Medium|Low> based on the initial
triage. The incident commander is <name>.

Per our security policy, we will follow up with a substantive response within
<24h|48h|7d|14d>. The fix target is <72h|7d|30d|next release>.

If you have additional information, please reply to this thread. Do not open
a public issue or pull request — we will coordinate disclosure together once
the fix is ready.

Thank you for reporting this responsibly.
```

---

## Template 2 — Downstream Consumer Notice

```
Subject: [SECURITY] gtcx-core incident SEC-YYYY-NNNN — <severity>

A security issue has been reported against gtcx-core that may affect this
project. Severity: <Critical|High|Medium|Low>.

Affected packages: <@gtcx/*>
Affected versions: <range>
Active exploitation: <Yes|No|Unknown>

Recommended action:
- <Specific mitigation>
- <Pin to known-good version if applicable>
- <Disable feature flag if applicable>

A patch is in development. Estimated availability: <date>.
Public advisory will follow within <window> of patch release.

This notice is confidential until the public advisory ships. Please limit
distribution to the people on your team who need to act on it.

Incident commander: <name>
Reply to: security@gtcx.io
```

---

## Template 3 — Public Advisory

```
# <CVE-YYYY-NNNNN> — <one-line summary>

**Severity:** <Critical|High|Medium|Low>
**Affected packages:** <@gtcx/*>
**Affected versions:** <range>
**Patched versions:** <range>
**Reported:** <YYYY-MM-DD>
**Disclosed:** <YYYY-MM-DD>

## Summary

<One paragraph describing the issue at the level of detail appropriate for
the severity. Critical advisories disclose enough for consumers to assess
exposure; they do not include reproducer code.>

## Impact

<Who is affected, under what conditions, and what an attacker can achieve.>

## Mitigation

1. Update to <patched version>: `pnpm add @gtcx/<package>@<version>`
2. <Configuration changes if any>
3. <Operational guidance — rotation, audit, etc.>

## Workaround

<If a workaround exists for consumers who cannot upgrade immediately.>

## Credit

Reported by <name|anonymous> on <date>. Thank you for the responsible
disclosure.

## References

- Commit: <hash>
- Threat model entry: <path>
- Audit finding: <SA-* / AT-*>
```

---

## Changelog

- **1.0.0** (2026-05-09) — Initial runbook. Six phases, three templates, AI-review bypass procedure.
