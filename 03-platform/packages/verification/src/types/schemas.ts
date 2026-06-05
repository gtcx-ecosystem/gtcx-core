// ============================================================================
// SCHEMAS (backward-compatible barrel)
//
// This file re-exports all schemas from the domain-specific modules in
// `./schemas/` so downstream imports continue to work without modification.
//
// New code should prefer importing from the domain modules directly:
//   import { ClaimSchema } from '@gtcx/verification/types/schemas/entities';
// ============================================================================

export * from './schemas/enums';
export * from './schemas/primitives';
export * from './schemas/entities';
export * from './schemas/commodity';
