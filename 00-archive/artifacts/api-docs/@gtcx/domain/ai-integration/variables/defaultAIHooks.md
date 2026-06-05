[**GTCX Core API Reference**](../../../../README.md)

***

[GTCX Core API Reference](../../../../README.md) / [@gtcx/domain](../../README.md) / [ai-integration](../README.md) / defaultAIHooks

# Variable: defaultAIHooks

> `const` **defaultAIHooks**: [`AIServiceHooks`](../interfaces/AIServiceHooks.md)

Defined in: [03-platform/packages/domain/src/ai-integration.ts:324](https://github.com/gtcx-ecosystem/gtcx-core/blob/3ba6b52766dfe45fb9673e3b808e08e184b9256d/03-platform/packages/domain/src/ai-integration.ts#L324)

Default AI hooks — null implementations for the foundation layer.

These hooks allow services to function without AI integration.
Real AI hooks are injected by consuming packages (5-intelligence,
6-platforms) via the AIServiceHooks interface. This ensures
gtcx-core has zero AI service dependencies.

All hooks return permissive defaults: proceed=true, escalate=false.
