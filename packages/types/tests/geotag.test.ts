import { describe, it, expect } from 'vitest';

import { migrateGeologicalContext, createResourceContext } from '../src/protocols/geotag';

describe('migrateGeologicalContext', () => {
  it('migrates legacy geological context with default commodity', () => {
    const legacy = {
      goldPotential: 'high' as const,
      formation: 'alluvial',
      confidence: 0.85,
      source: 'survey-2023',
    };
    const ctx = migrateGeologicalContext(legacy);
    expect(ctx.commodityPotential).toBe('high');
    expect(ctx.commodityType).toBe('gold');
    expect(ctx.formation).toBe('alluvial');
    expect(ctx.confidence).toBe(0.85);
    expect(ctx.source).toBe('survey-2023');
  });

  it('migrates with explicit commodity type', () => {
    const legacy = {
      goldPotential: 'medium' as const,
      confidence: 0.7,
    };
    const ctx = migrateGeologicalContext(legacy, 'cocoa');
    expect(ctx.commodityType).toBe('cocoa');
    expect(ctx.commodityPotential).toBe('medium');
    expect(ctx.formation).toBeUndefined();
  });
});

describe('createResourceContext', () => {
  it('creates a resource context with all fields', () => {
    const ctx = createResourceContext('cobalt', 'high', 0.9, {
      formation: 'sedimentary',
      source: 'drill-core',
    });
    expect(ctx.commodityType).toBe('cobalt');
    expect(ctx.commodityPotential).toBe('high');
    expect(ctx.confidence).toBe(0.9);
    expect(ctx.formation).toBe('sedimentary');
    expect(ctx.source).toBe('drill-core');
  });

  it('creates a minimal resource context without options', () => {
    const ctx = createResourceContext('diamond', 'low', 0.4);
    expect(ctx.commodityType).toBe('diamond');
    expect(ctx.commodityPotential).toBe('low');
    expect(ctx.confidence).toBe(0.4);
    expect(ctx.formation).toBeUndefined();
    expect(ctx.source).toBeUndefined();
  });
});
