# Incident Response — gtcx-core

Runbook for detecting, triaging, and resolving incidents that affect `gtcx-core` or downstream ecosystem repos.

## Severity Levels

| Severity            | Description                                                                   | Examples                                                                                         | Response Time        |
| ------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------- |
| **SEV1 — Critical** | `main` broken, API contract violated, security breach, data integrity failure | Crypto primitive producing wrong output, architecture gate failing on main, credential exposure  | Immediate, all hands |
| **SEV2 — Major**    | Blocking regression affecting downstream repos                                | Build failure in a package, performance budget exceeded by >20%, API breaking change without ADR | Within 1 hour        |
| **SEV3 — Minor**    | Non-critical failure, workaround exists                                       | Test flake on non-critical path, non-blocking CI warning                                         | Within 4 hours       |
| **SEV4 — Low**      | Documentation gap, cosmetic issue                                             | Broken link in SOP, misleading error message                                                     | Next session         |

When in doubt, escalate to the higher severity.

## Step 1: Detect

`gtcx-core` incidents surface through:

- **CI gate failure** — architecture check, typecheck, test, API baseline, performance budget
- **Downstream breakage** — a consumer repo reports a regression introduced by a `gtcx-core` change
- **Security finding** — a review or audit surfaces a cryptographic or auth vulnerability
- **Human observation** — a team member catches a problem during review or testing

**First action:** Acknowledge within 15 minutes. Confirm you are investigating. Do not wait for answers before communicating.

## Step 2: Triage

1. Assess severity against the table above. When in doubt, go higher.
2. For SEV1/SEV2: assign an incident commander who owns the incident until resolution.
3. For security findings: notify the Cryptographic Security Engineer immediately.
4. Log the detection time and the initial symptom description.

## Step 3: Investigate

Work methodically. Document findings as you go — do not rely on memory.

1. **Check recent commits.** What changed in the last few commits? Run `git log --oneline -10`.
2. **Reproduce the failure.** Run the failing gate locally: `pnpm architecture:check`, `pnpm test`, `pnpm api:check`, etc.
3. **Narrow the scope.** Which package or crate? Which test or gate? Which commit introduced it?
4. **Check API baseline.** Run `pnpm api:check` — a breaking change is often the root cause.
5. **For security findings:** Do not attempt to investigate cryptographic vulnerabilities without Cryptographic Security Engineer involvement.

## Step 4: Mitigate

Stop the breakage. Restoring the gate takes priority over finding the root cause.

- **Recent commit caused it?** Revert: `git revert <commit>`. Do not debug on `main`.
- **API breaking change?** Revert or file an ADR and notify downstream repos immediately.
- **Security issue?** Rotate any affected credentials. Block affected code paths. Notify human immediately.
- **Performance regression?** Revert the offending commit if the regression exceeds budget. Do not merge a budget-busting change.

If the mitigation makes things worse, revert the mitigation immediately.

## Step 5: Resolve

1. Confirm the mitigation is stable — run the full gate sequence from `SOP/2-docs/4-operations/runbooks/quality-runbook.md`.
2. Apply the permanent fix or schedule it with a linked ticket.
3. Verify the original symptoms are gone.

## Step 6: Communicate

| Severity | Who to notify                                | When                                       |
| -------- | -------------------------------------------- | ------------------------------------------ |
| SEV1     | All roles + human owner                      | Immediately on detection and on resolution |
| SEV2     | Engineering lead + affected downstream teams | Within 1 hour of detection                 |
| SEV3     | Assigned engineer tracks internally          | On resolution                              |
| SEV4     | No escalation required                       | —                                          |

### Notification Templates

**Incident open:**

```
INCIDENT: [Brief description]
SEVERITY: SEV[1-4]
DETECTED: [Time] UTC
STATUS: Investigating
IMPACT: [What is broken and what depends on it]
INCIDENT COMMANDER: [Name/role]
```

**Resolution:**

```
INCIDENT RESOLVED: [Brief description]
SEVERITY: SEV[1-4]
DETECTED / RESOLVED: [Time] UTC / [Time] UTC
ROOT CAUSE: [One-sentence summary]
FIX: [Commit or PR link]
FOLLOW-UP: [Post-mortem / ticket / none required]
```

## Step 7: Post-Mortem

Required for all SEV1 and SEV2 incidents, within 48 hours.

- Blameless. Focus on systems, process gaps, and missing gates — not individuals.
- Identify action items with owners.
- Document in `SOP/4-sessions/` and link from the PR or incident ticket.

## References

- `SOP/2-docs/4-operations/runbooks/quality-runbook.md`
- `SOP/1-agents/safety-rules.md`
- `SOP/1-agents/coordination.md`
- `SOP/2-docs/3-engineering/security/threat-control-matrix.md`
