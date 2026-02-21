# Monitoring

This document defines the monitoring expectations for gtcx-core.

## Telemetry

- Structured logs must conform to `telemetry-schema.md`.
- Metrics should include latency, error rates, and throughput for core services.
- Traces should include request IDs and correlation IDs where available.

## SLOs

- SLO targets are defined in `slo-targets.md`.
- Any service that impacts critical flows must report SLO compliance.

## Alerting

- Alert on SLO breaches, elevated error rates, and sustained latency spikes.
- Tie alerts to runbooks and escalation paths.

## References

- `telemetry-schema.md`
- `slo-targets.md`
