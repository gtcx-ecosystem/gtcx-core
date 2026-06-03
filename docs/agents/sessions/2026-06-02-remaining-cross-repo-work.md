---
title: 'Remaining Cross-Repo Work — Master Tracker'
date: '2026-06-02'
from: 'gtcx-core'
to: 'all-downstream'
scope: 'All open cross-repo items after 10/10 internal milestones complete'
tags: ['handoff', 'gtcx-core', 'cross-repo', 'coordination', '10-10-moat']
status: 'open'
---

# Remaining Cross-Repo Work — Master Tracker

> **Context:** gtcx-core has completed all implementable 10/10 milestones (D1=10, D2=10, D6=10, D7=9, D10=9). Overall: **8.8/10**. Remaining gaps require external vendors or downstream action.

---

## Item 1 — gtcx-protocols: Consume `@gtcx/zkp-kat-vectors`

**Source handoff:** `2026-06-02-handoff-gtcxcore-gtcxprotocols.md`
**Status:** Open
**Priority:** P2
**Effort:** 2–4 hours

### What gtcx-core delivered

- `@gtcx/zkp-kat-vectors@1.0.0` published in workspace
- Exports 6 KAT artifacts (4 Groth16 + 2 Bulletproofs) as typed JSON
- Zero runtime dependencies

### What gtcx-protocols needs to do

1. Add dev dependency:
   ```json
   { "devDependencies": { "@gtcx/zkp-kat-vectors": "workspace:*" } }
   ```
2. In ZKP integration tests, import at least one KAT file and verify the proof through your abstraction layer:
   ```typescript
   import { groth16GciThreshold } from '@gtcx/zkp-kat-vectors';
   // Use groth16GciThreshold.proof_bytes, .public_inputs, .verifying_key_bytes
   ```
3. Acceptance: one protocol test loads a KAT file and verifies the proof

### Blockers

None. Package is ready.

---

## Item 2 — gtcx-infrastructure: SLSA Provenance CI Fix

**Source handoff:** `2026-06-02-handoff-gtcxcore-gtcxinfrastructure.md`
**Status:** Open
**Priority:** P1 if regulator-required; P2 otherwise
**Effort:** 1–2 days

### What gtcx-core reported

All published `@gtcx/*` packages lack `dist.attestations` on npm despite `--provenance` flag:

```
@gtcx/workproof@1.0.0     → no attestations
@gtcx/verification@3.1.0  → no attestations
@gtcx/resilience@0.2.0    → no attestations
```

### What gtcx-infrastructure needs to do

1. Confirm if Build L3 (provenance attestations) is a hard requirement for regulator submission
2. If yes: investigate CI pipeline
   - Is `id-token: write` granted to the publish job?
   - Does `actions/setup-node@v4` successfully exchange OIDC token with npm?
   - Does `changeset publish --provenance` forward `--provenance` to underlying `npm publish`?
   - Is registry URL in `.npmrc` pointing to `registry.npmjs.org`?
3. Acceptance: at least one `@gtcx/*` package published with `dist.attestations`

### Blockers

Awaiting Quality & Evidence lead priority decision.

---

## Item 3 — gtcx-infrastructure: EAP Auth-Keys ESO Refresh

**Source ticket:** `docs/gtm/inbound-tickets/from-gtcx-infrastructure-eap-auth-keys-sync-2026-06-02.md`
**Status:** Ready for execution
**Priority:** P1 (staging smoke)
**Effort:** 30 minutes

### What gtcx-core implemented

- `pnpm eap:sync-bundle` CLI rebuilds intelligence auth-keys bundle from EAP client secrets
- Writes to `gtcx/intelligence/staging/auth-keys` in AWS Secrets Manager

### What gtcx-infrastructure needs to do

1. After gtcx-core confirms bundle write, **force ESO refresh**
2. Verify K8s secret `gtcx-intelligence-staging-auth-keys` picks up new value
3. Confirm staging pods read `AUTH_API_KEYS` and `AUTH_KEY_ROLES`
4. Acknowledge in inbound ticket

### Execution command (for gtcx-core)

```bash
cd packages/eap
EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 pnpm eap:sync-bundle
```

---

## Item 4 — baseline-os: External Vendor Tracking

**Source handoff:** `2026-06-02-handoff-gtcxcore-baselineos.md`
**Status:** Open
**Priority:** P1 (blocks final 1.2 points)

### External dependencies for 10/10 completion

| Dimension              | Resource Needed                       | ETA       | Status                           |
| ---------------------- | ------------------------------------- | --------- | -------------------------------- |
| D8 Formal Verification | Z3/Coq consultant                     | 2–3 weeks | Not started                      |
| D9 Third-Party Audit   | Crypto audit vendor                   | 4–6 weeks | RFP drafted, vendor not selected |
| D7 M7.5 Side-Channel   | External lab                          | 2–3 weeks | Not started                      |
| D10 M10.3 Regulator    | African regulator / NIST CMVP liaison | 2 weeks   | Not started                      |

### What baseline-os needs to do

1. **D9 audit vendor:** Select vendor from RFP responses (`docs/security/pen-test-rfp-2026.md`)
2. **D8 consultant:** Source Z3/Coq formal-methods consultant
3. **D7 lab:** Source side-channel analysis lab (can be same as D9 vendor if they offer it)
4. **D10 liaison:** Route to GTM Lead for African regulator introduction; Protocol Architect for NIST CMVP
5. Track all SOWs in `baseline-os/workstream/coordination/`

---

## Item 5 — baseline-os: Zimbabwe Email Gate Routing

**Source handoff:** `2026-06-02-handoff-gtcxcore-baselineos.md`
**Status:** Open (human gates)
**Priority:** P1

### Remaining gates (6 of 8)

| Gate                             | Owner              | Action                        |
| -------------------------------- | ------------------ | ----------------------------- |
| Recipient address verified       | GTM Lead           | Verify `sandbox@rbz.co.zw`    |
| Engagement-lead name designated  | GTM Lead           | Insert name in template       |
| Sender name + title designated   | Protocol Architect | Insert sender identity        |
| Pen-test SoW state confirmed     | Security Lead      | Confirm signed vs pre-signing |
| SOC 2 CPA letter state confirmed | Compliance Lead    | Confirm signed vs pre-signing |
| Protocol Architect approval      | Protocol Architect | Final sign-off before send    |

### What baseline-os needs to do

Route each gate to the owner above. No technical work — all human verification/approval.

---

## Item 6 — gtcx-protocols: D3 M3.2 Trusted-Setup Transcript Verification

**Status:** Not started
**Priority:** P2 (release-gated)
**Effort:** 1 day

### Context

D3 Trusted-Setup Reduction is at 9.5/10. M3.2 requires CI test that re-derives verifying key from published transcript and confirms VK hash matches KAT.

### What gtcx-core will deliver

- Publish trusted-setup transcript (when ceremony complete)
- `cargo test --features trusted-setup-verify` that:
  1. Reads transcript
  2. Re-derives VK
  3. Compares hash to KAT artifact

### What gtcx-protocols needs to do

- Nothing directly — but this gates D3 completion which affects protocol-layer proof verification assumptions
- Ensure protocol docs reference the canonical VK hash

---

## Summary Table

| #   | To                  | Item                            | Priority | Effort   | Blocker                     |
| --- | ------------------- | ------------------------------- | -------- | -------- | --------------------------- |
| 1   | gtcx-protocols      | Consume `@gtcx/zkp-kat-vectors` | P2       | 2–4 hrs  | None                        |
| 2   | gtcx-infrastructure | SLSA provenance CI fix          | P1/P2    | 1–2 days | Priority decision           |
| 3   | gtcx-infrastructure | EAP ESO refresh                 | P1       | 30 min   | Awaiting gtcx-core sync run |
| 4   | baseline-os         | External vendor tracking        | P1       | Ongoing  | Vendor selection            |
| 5   | baseline-os         | Zimbabwe email routing          | P1       | 1 day    | Human approvals             |
| 6   | gtcx-protocols      | D3 transcript verification      | P2       | 1 day    | Ceremony completion         |
