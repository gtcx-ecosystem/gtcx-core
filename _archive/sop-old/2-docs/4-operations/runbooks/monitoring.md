# Monitoring

Monitoring expectations for `gtcx-core`.

## Telemetry

- Structured logs must conform to `telemetry-schema.md`.
- Crypto operations emit traced logs via `@gtcx/crypto` traced helpers.
- Network events emit `p2p.*` telemetry via `@gtcx/network`.
- Domain events are emitted via `@gtcx/domain` and `@gtcx/events`.

## SLOs

- SLO targets are defined in `slo-targets.md`.
- Any release-critical change should include a note on its SLO impact.

## Alerting

- Alert on failing CI gates and benchmark regressions.
- Alert on repeated security/threat matrix failures.
- Tie alerts to runbooks and escalation paths.

## References

- `SOP/2-docs/4-operations/runbooks/telemetry-schema.md`
- `SOP/2-docs/4-operations/runbooks/slo-targets.md`
- `SOP/2-docs/4-operations/compliance/enterprise-quality-standard.md`
