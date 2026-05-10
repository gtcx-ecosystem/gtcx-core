# Security

Security policies, threat models, and vulnerability management.

## Contents

| File                                                   | Description                                                                                                                                        |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`security-policy.md`](security-policy.md)             | Access control, encryption, vulnerability management, dependency audits, pen testing                                                               |
| [`security-architecture.md`](security-architecture.md) | Defense in depth layers, auth architecture, RBAC/ABAC, data classification, DLP, network segmentation, SIEM, incident response, secrets management |
| [`security-framework.md`](security-framework.md)       | Security architecture and controls overview                                                                                                        |
| [`threat-model.md`](threat-model.md)                   | STRIDE analysis, DREAD scoring, attack trees, threat actors, security controls mapping, risk heat map                                              |
| [`threat-control-matrix.md`](threat-control-matrix.md) | 12 threat controls with evidence references                                                                                                        |
| [`fips-assessment.md`](fips-assessment.md)             | FIPS 140-2/3 cryptographic inventory, compliance status, and migration pathway                                                                     |
| [`nist-800-53-mapping.md`](nist-800-53-mapping.md)     | NIST SP 800-53 Rev 5 control mapping (AC, AU, IA, SC, SI, CM, SA families)                                                                         |
| [`defense-readiness.md`](defense-readiness.md)         | Air-gap capability, telemetry audit, SBOM/provenance, CMMC Level 2 mapping, S6 gap analysis                                                        |
| [`stig-compliance.md`](stig-compliance.md)             | DISA STIG compliance mapping — Application Security V5R3, Node.js, Rust                                                                            |

## What belongs here

- **Security policies** — Access control standards, data handling rules, and encryption requirements
- **Threat models** — Attack surface analysis, risk assessments, and mitigation strategies
- **Vulnerability management processes** — CVE tracking, patch timelines, and remediation workflows
- **Penetration testing guidelines** — Scope definitions, testing schedules, and finding templates
- **Dependency audit procedures** — Supply chain security, license compliance, and update policies

## What does NOT belong here

- **Authentication architecture** — Auth flows, token strategies, and identity provider design. See `../2-system-design/`.
- **Compliance requirements** — Regulatory frameworks, audit evidence, and certification tracking. See `../5-compliance/`.

---
