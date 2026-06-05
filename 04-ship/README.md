# Deploy

This directory contains deployment references and infrastructure pointers for **gtcx-core**.

## Where is the actual infrastructure?

Kubernetes manifests, Helm charts, and Terraform modules live in the dedicated infrastructure repository:

**`gtcx-infrastructure`** — contact the Platform/DevOps team for access.

## Contents

| File                 | Purpose                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `k8s-reference.yaml` | Stub manifest referencing the actual K8s resources in `gtcx-infrastructure`. Used for local validation and schema linting only. |

## Usage

Do **not** apply manifests from this directory to any cluster. They are reference stubs.

For real deployments, use the CI/CD pipelines documented in [`01-docs/devops/ci-cd/README.md`](../01-docs/devops/ci-cd/README.md) and the infrastructure repo.
