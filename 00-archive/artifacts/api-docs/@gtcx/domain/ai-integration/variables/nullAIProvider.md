[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / nullAIProvider

# Variable: nullAIProvider

> `const` **nullAIProvider**: [`IAIProvider`](../interfaces/IAIProvider.md)

Defined in: [03-platform/packages/domain/src/ai-integration.ts:209](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L209)

Null AI provider — intentional no-op for the foundation layer.

gtcx-core provides the IAIProvider interface as an extension point.
Real AI integration is injected by consuming packages:
  - 5-intelligence: ANISA cultural intelligence, Cortex pattern analysis
  - 6-platforms: underwriting, screening, trade analysis

This null implementation returns safe defaults (confidence: 0, empty
arrays) so services can operate without an AI backend configured.
All methods resolve — they never throw.
