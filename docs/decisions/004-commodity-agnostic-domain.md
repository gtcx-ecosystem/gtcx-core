---
title: "ADR-004: Commodity-Agnostic Domain Model"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 60
autonomy_level: "permissioned"
tier: "standard"
tags: ["documentation", "decisions"]
review_cycle: "on-change"
---

---
title: '004 Commodity Agnostic Domain'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# ADR-004: Commodity-Agnostic Domain Model

## Status

Accepted

## Date

2025-01-15

## Context

GTCX was initially designed for gold commodity verification. However, the verification infrastructure (identity, provenance, compliance, quality assurance) applies equally to other commodities: coffee, cobalt, lithium, diamonds, timber, etc.

Two design approaches were considered:

1. **Commodity-specific models** — Separate data models per commodity (GoldAsset, CoffeeAsset, CobaltAsset) with commodity-specific fields, validation rules, and workflows.
2. **Commodity-agnostic models** — A single abstract asset model with `commodityType: string`, where commodity-specific behavior is injected via configuration rather than code.

Building commodity-specific models into core would require code changes for every new commodity, increase test surface proportionally, and create coupling between the foundation layer and domain-specific logic.

## Decision

All `@gtcx/*` packages use commodity-agnostic models. The domain model uses `commodityType: string` rather than gold-specific types. Commodity-specific configuration (measurement units, quality thresholds, compliance domains, certification requirements) is registered at runtime via configuration, not compiled into core.

Key design elements:

- `@gtcx/domain` defines `AssetLot`, `Measurement`, `QualityAssessment` as generic types
- `@gtcx/schemas` validates against configurable rules, not hardcoded commodity logic
- `@gtcx/services` orchestrates commodity-neutral workflows (registration, trading, compliance)
- Downstream repos inject commodity configuration: units, thresholds, display labels

## Consequences

### Positive

- Adding a new commodity (coffee, cobalt, lithium) requires zero code changes in `@gtcx/core`
- Core test suite remains stable regardless of commodity count
- Single codebase serves multiple commodity markets simultaneously
- Reduces coupling between foundation and application layers

### Negative

- Less type safety for commodity-specific fields (string-based rather than enum-typed)
- Commodity-specific validation requires runtime configuration rather than compile-time checks
- Debugging requires awareness of which commodity configuration is active

### Neutral

- The `@gtcx/schemas` Core12 compliance framework works across all commodity types — regulatory domains (legal, environmental, labor, financial) are universal
- Downstream protocol repos (gtcx-protocols) handle commodity-specific workflows
