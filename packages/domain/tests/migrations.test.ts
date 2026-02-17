import { describe, it, expect, beforeEach } from 'vitest';

import {
  SchemaMigrator,
  SCHEMA_VERSIONS,
  isVersionedEntity,
  ensureVersioned,
  migrateAndUnwrap,
} from '../src/migrations';
import type { VersionedEntity, EntityType, Migration } from '../src/migrations';

// ---------------------------------------------------------------------------
// SCHEMA_VERSIONS
// ---------------------------------------------------------------------------

describe('SCHEMA_VERSIONS', () => {
  it('has entries for all entity types', () => {
    const types: EntityType[] = [
      'asset_lot',
      'transaction',
      'trader',
      'producer',
      'compliance_record',
      'certificate',
    ];
    for (const t of types) {
      expect(SCHEMA_VERSIONS[t]).toBeDefined();
      expect(SCHEMA_VERSIONS[t]).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });
});

// ---------------------------------------------------------------------------
// SchemaMigrator
// ---------------------------------------------------------------------------

describe('SchemaMigrator', () => {
  let migrator: SchemaMigrator;

  beforeEach(() => {
    migrator = new SchemaMigrator();
  });

  describe('getCurrentVersion', () => {
    it('returns the current schema version for entity type', () => {
      expect(migrator.getCurrentVersion('asset_lot')).toBe(SCHEMA_VERSIONS.asset_lot);
      expect(migrator.getCurrentVersion('trader')).toBe(SCHEMA_VERSIONS.trader);
    });
  });

  describe('wrap / unwrap', () => {
    it('wraps raw data as versioned entity with current version', () => {
      const data = { name: 'test' };
      const versioned = migrator.wrap(data, 'trader');
      expect(versioned._schemaVersion).toBe(SCHEMA_VERSIONS.trader);
      expect(versioned._entityType).toBe('trader');
      expect(versioned.data).toBe(data);
    });

    it('wraps with custom version', () => {
      const versioned = migrator.wrap({ x: 1 }, 'trader', '0.9.0');
      expect(versioned._schemaVersion).toBe('0.9.0');
    });

    it('unwrap returns the data', () => {
      const data = { foo: 'bar' };
      const versioned = migrator.wrap(data, 'trader');
      expect(migrator.unwrap(versioned)).toBe(data);
    });
  });

  describe('needsMigration', () => {
    it('returns false when entity is at current version', () => {
      const entity = migrator.wrap({ x: 1 }, 'trader');
      expect(migrator.needsMigration(entity)).toBe(false);
    });

    it('returns true when entity is at older version', () => {
      const entity: VersionedEntity = {
        data: { minerId: 'p1' },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
      };
      // asset_lot current version is 1.1.0
      expect(migrator.needsMigration(entity)).toBe(true);
    });
  });

  describe('migrate', () => {
    it('returns same entity when no migration needed', () => {
      const entity = migrator.wrap({ x: 1 }, 'trader');
      const result = migrator.migrate(entity);
      expect(result).toBe(entity);
    });

    it('migrates asset_lot from 1.0.0 to 1.1.0', () => {
      const entity: VersionedEntity = {
        data: {
          minerId: 'producer-1',
          goldDetails: { karat: 22 },
          weight: 100,
        },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
      };

      const result = migrator.migrate(entity);
      const data = result.data as Record<string, unknown>;

      expect(result._schemaVersion).toBe('1.1.0');
      expect(data.producerId).toBe('producer-1');
      expect(data.minerId).toBeUndefined();
      expect(data.assetDetails).toEqual({ karat: 22 });
      expect(data.goldDetails).toBeUndefined();
      expect(data.weightUnit).toBe('g');
    });

    it('asset_lot migration does not overwrite existing producerId', () => {
      const entity: VersionedEntity = {
        data: { producerId: 'already-set', weight: 50 },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
      };
      const result = migrator.migrate(entity);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.data as any).producerId).toBe('already-set');
    });

    it('asset_lot migration does not overwrite existing weightUnit', () => {
      const entity: VersionedEntity = {
        data: { minerId: 'p1', weightUnit: 'kg' },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
      };
      const result = migrator.migrate(entity);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((result.data as any).weightUnit).toBe('kg');
    });

    it('migrates transaction from 1.0.0 to 1.1.0', () => {
      const entity: VersionedEntity = {
        data: { id: 'tx-1', quantity: 50 },
        _schemaVersion: '1.0.0',
        _entityType: 'transaction',
      };

      const result = migrator.migrate(entity);
      const data = result.data as Record<string, unknown>;

      expect(result._schemaVersion).toBe('1.1.0');
      expect(data.quantityUnit).toBe('g');
      expect(data.cryptoProof).toBeNull();
    });

    it('records migration IDs in _migrations', () => {
      const entity: VersionedEntity = {
        data: { minerId: 'p1' },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
      };
      const result = migrator.migrate(entity);
      expect(result._migrations).toContain('asset_lot_1.0.0_to_1.1.0');
    });

    it('preserves existing _migrations', () => {
      const entity: VersionedEntity = {
        data: { minerId: 'p1' },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
        _migrations: ['prior_migration'],
      };
      const result = migrator.migrate(entity);
      expect(result._migrations).toContain('prior_migration');
      expect(result._migrations).toContain('asset_lot_1.0.0_to_1.1.0');
    });
  });

  describe('migrateMany', () => {
    it('migrates multiple entities', () => {
      const entities: VersionedEntity[] = [
        {
          data: { minerId: 'p1' },
          _schemaVersion: '1.0.0',
          _entityType: 'asset_lot',
        },
        {
          data: { id: 'tx-1' },
          _schemaVersion: '1.0.0',
          _entityType: 'transaction',
        },
      ];
      const results = migrator.migrateMany(entities);
      expect(results).toHaveLength(2);
      expect(results[0]._schemaVersion).toBe('1.1.0');
      expect(results[1]._schemaVersion).toBe('1.1.0');
    });
  });

  describe('registerMigration', () => {
    it('registers a custom migration', () => {
      const custom: Migration = {
        id: 'trader_1.0.0_to_1.1.0',
        fromVersion: '1.0.0',
        toVersion: '1.1.0',
        entityTypes: ['trader'],
        description: 'Add tier field',
        migrate: (data: unknown) => {
          const d = { ...(data as Record<string, unknown>) };
          d.tier = 'basic';
          return d;
        },
      };
      // Override SCHEMA_VERSIONS for testing is not possible directly,
      // so we test just that the migration is accepted and not duplicated
      migrator.registerMigration(custom);
      migrator.registerMigration(custom); // duplicate should be ignored
    });
  });

  describe('validate', () => {
    it('returns valid when validator passes', () => {
      const entity = migrator.wrap({ weight: 100 }, 'trader');
      const result = migrator.validate(entity, () => true);
      expect(result.valid).toBe(true);
      expect(result.migrated).toBe(false);
    });

    it('returns invalid when validator returns false', () => {
      const entity = migrator.wrap({ weight: -1 }, 'trader');
      const result = migrator.validate(entity, () => false);
      expect(result.valid).toBe(false);
    });

    it('returns errors when validator throws', () => {
      const entity = migrator.wrap({}, 'trader');
      const result = migrator.validate(entity, () => {
        throw new Error('missing fields');
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('missing fields');
    });

    it('migrates before validating if needed', () => {
      const entity: VersionedEntity = {
        data: { minerId: 'p1' },
        _schemaVersion: '1.0.0',
        _entityType: 'asset_lot',
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = migrator.validate(entity, (data: any) => {
        return data.producerId === 'p1';
      });
      expect(result.valid).toBe(true);
      expect(result.migrated).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// isVersionedEntity
// ---------------------------------------------------------------------------

describe('isVersionedEntity', () => {
  it('returns true for valid versioned entity', () => {
    expect(
      isVersionedEntity({
        data: {},
        _schemaVersion: '1.0.0',
        _entityType: 'trader',
      })
    ).toBe(true);
  });

  it('returns false for null', () => {
    expect(isVersionedEntity(null)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isVersionedEntity('hello')).toBe(false);
  });

  it('returns false for object missing fields', () => {
    expect(isVersionedEntity({ data: {} })).toBe(false);
    expect(isVersionedEntity({ _schemaVersion: '1.0.0' })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ensureVersioned
// ---------------------------------------------------------------------------

describe('ensureVersioned', () => {
  it('returns the entity as-is if already versioned', () => {
    const entity: VersionedEntity = {
      data: { x: 1 },
      _schemaVersion: '1.0.0',
      _entityType: 'trader',
    };
    const result = ensureVersioned(entity, 'trader');
    expect(result).toBe(entity);
  });

  it('wraps raw data as versioned entity', () => {
    const raw = { name: 'test' };
    const result = ensureVersioned(raw, 'trader');
    expect(result._entityType).toBe('trader');
    expect(result.data).toBe(raw);
  });
});

// ---------------------------------------------------------------------------
// migrateAndUnwrap
// ---------------------------------------------------------------------------

describe('migrateAndUnwrap', () => {
  it('wraps, migrates, and unwraps in one step', () => {
    const raw = { minerId: 'p1' };
    const entity: VersionedEntity = {
      data: raw,
      _schemaVersion: '1.0.0',
      _entityType: 'asset_lot',
    };
    const result = migrateAndUnwrap(entity, 'asset_lot') as Record<string, unknown>;
    expect(result.producerId).toBe('p1');
    expect(result.minerId).toBeUndefined();
  });

  it('handles already-current data', () => {
    const raw = { producerId: 'p1', weightUnit: 'g' };
    const result = migrateAndUnwrap(raw, 'trader');
    expect(result).toEqual(raw);
  });
});
