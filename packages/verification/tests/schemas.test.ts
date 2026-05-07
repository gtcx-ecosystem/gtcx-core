import { describe, expect, it } from 'vitest';

import { PredicateSchemaSchema } from '../src/types/schemas';

describe('PredicateSchemaSchema', () => {
  it('validates a flat predicate', () => {
    const result = PredicateSchemaSchema.safeParse({
      type: 'string',
      pattern: '^[A-Z]+$',
    });
    expect(result.success).toBe(true);
  });

  it('validates a nested predicate with recursive properties', () => {
    const result = PredicateSchemaSchema.safeParse({
      type: 'object',
      properties: {
        name: {
          type: 'string',
          min: 1,
          max: 100,
        },
        verified: {
          type: 'boolean',
        },
        nested: {
          type: 'object',
          properties: {
            score: {
              type: 'number',
              min: 0,
              max: 100,
            },
          },
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid predicate type', () => {
    const result = PredicateSchemaSchema.safeParse({
      type: 'invalid_type',
    });
    expect(result.success).toBe(false);
  });
});
