# Guide: Incident Response

## Severity Levels

| Severity            | Description                                 | Examples                                                                  | Response Time        |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------------- | -------------------- |
| **SEV1 — Critical** | Service down, data loss, or security breach | Production outage, database corruption, credential leak                   | Immediate, all hands |
| **SEV2 — Major**    | Degraded service or partial outage          | One service down but others running, significantly elevated error rates   | Within 1 hour        |
| **SEV3 — Minor**    | Non-critical bug affecting users            | Feature broken for subset of users, slow performance on non-critical path | Within 4 hours       |
| **SEV4 — Low**      | Cosmetic issue or minor inconvenience       | UI misalignment, misleading error message, typo in user-facing text       | Next business day    |

When in doubt, escalate to the higher severity. It is easier to downgrade than to explain why you waited.

## Step 1: Detect

Incidents are detected through:

- **Monitoring alerts** — Cloud Run health checks, error rate thresholds, latency spikes.
- **User reports** — Support tickets, direct messages, social media.
- **Automated checks** — Scheduled synthetic tests, dependency health monitors.
- **Team observation** — Someone notices something wrong during development or testing.

**First responder action:** Acknowledge the incident within 15 minutes. Confirm you are looking at it. Do not wait until you have answers.

## Step 2: Triage

1. **Assess severity** using the table above. When in doubt, go higher.
2. **Assign an incident commander.** This person owns the incident until resolution. For SEV1/SEV2, this should be a senior engineer or team lead.
3. **Create an incident channel or thread.** All communication about this incident happens in one place. Name it clearly (e.g., `#inc-2026-02-19-payment-api-down`).
4. **Log the start time.** Write down when the incident was first detected and when you started responding.

## Step 3: Communicate

Silence is worse than bad news. Communicate early, communicate often.

- **Notify stakeholders** — use the initial notification template below.
- **Update the status page** (if applicable) — mark the affected service as degraded or down.
- **Set expectations for updates** — "We will provide updates every 30 minutes until resolved."
- **For SEV1/SEV2** — notify executive stakeholders immediately.

## Step 4: Investigate

Work methodically. Document everything in the incident report as you go.

1. **Check recent deployments.** Was anything deployed in the last few hours? This is the most common root cause.
2. **Check logs.** Look for errors, stack traces, and unusual patterns in Cloud Run logs and application logs.
3. **Check metrics.** CPU, memory, request rates, error rates, latency. Look for when the anomaly started.
4. **Check recent configuration changes.** Environment variables, feature flags, infrastructure changes.
5. **Check external dependencies.** Is a third-party API down? Is the database healthy? Is Redis reachable?
6. **Correlate the timeline.** When did it start? What changed around that time?

Write down your findings as you go. Do not rely on memory.

## Step 5: Mitigate

Stop the bleeding. The goal is to restore service, not to fix the root cause (that comes later).

- **Recent deploy caused it?** Roll back to the previous version. Do not debug in production.
- **Capacity issue?** Scale up Cloud Run instances. Increase database connection pool.
- **Security issue?** Rotate compromised credentials. Block malicious traffic. Revoke affected sessions.
- **External dependency down?** Enable fallback behavior. Return cached responses. Degrade gracefully.
- **Data issue?** Stop writes to prevent further corruption. Take a backup before making changes.

If the mitigation makes things worse, revert the mitigation immediately.

## Step 6: Resolve

Once the bleeding has stopped:

1. **Confirm the mitigation is holding.** Monitor for at least 30 minutes after the fix.
2. **Identify the root cause** (if not already clear from mitigation).
3. **Apply the permanent fix** — or schedule it if the mitigation is stable and the fix requires more work.
4. **Verify the fix** — run tests, check metrics, confirm the original symptoms are gone.

## Step 7: Communicate Resolution

- **Update the status page** — mark the service as operational.
- **Notify stakeholders** — use the resolution notification template below.
- **Confirm with affected users** (if applicable) — let them know the issue is resolved and whether any action is needed on their end.

## Step 8: Post-Mortem

Conduct a post-mortem **within 48 hours** while the incident is still fresh.

- Use the **post-mortem template**.
- **Blameless.** Focus on systems, processes, and gaps — not on individuals.
- **Identify action items** with owners and deadlines.
- **Share the post-mortem** with the full team. Everyone learns from every incident.

The post-mortem is not optional. Every SEV1 and SEV2 gets one. SEV3 incidents get one if there are lessons worth capturing.

## Escalation Matrix

| Severity | First Responder   | Escalate To                                | Executive Notify  |
| -------- | ----------------- | ------------------------------------------ | ----------------- |
| **SEV1** | On-call engineer  | Engineering lead + all available engineers | CTO immediately   |
| **SEV2** | On-call engineer  | Engineering lead                           | CTO within 1 hour |
| **SEV3** | Assigned engineer | Team lead (if unresolved in 4 hours)       | Not required      |
| **SEV4** | Assigned engineer | Not required                               | Not required      |

## Communication Templates

### Initial Notification

```
INCIDENT: [Brief description]
SEVERITY: SEV[1-4]
DETECTED: [Time] UTC
STATUS: Investigating
IMPACT: [What users are experiencing]
NEXT UPDATE: [Time] UTC

Incident commander: [Name]
Channel: [Link to incident thread]
```

### Status Update

```
INCIDENT UPDATE: [Brief description]
STATUS: [Investigating / Identified / Mitigating / Monitoring]
SUMMARY: [What we know so far and what we are doing]
NEXT UPDATE: [Time] UTC
```

### Resolution Notification

```
INCIDENT RESOLVED: [Brief description]
SEVERITY: SEV[1-4]
DETECTED: [Time] UTC
RESOLVED: [Time] UTC
DURATION: [X hours Y minutes]
ROOT CAUSE: [One-sentence summary]
IMPACT: [What was affected and for how long]
FOLLOW-UP: Post-mortem scheduled for [date]
```

## Reference

- [Incident Report Template](/templates/incidents/incident-report.md)
- [Post-Mortem Template](/templates/incidents/post-mortem.md)
- [Root Cause Analysis Template](/templates/incidents/rca.md)
