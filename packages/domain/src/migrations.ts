/**
 * Schema Versioning and Migrations
 * 
 * Handles data evolution across schema versions.
 * Implements P11 (Data Evolution) principle.
 * 
 * @package @gtcx/domain
 */

// ============================================================================
// VERSION TYPES
// ============================================================================

export interface SchemaVersion {
  major: number;
  minor: number;
  patch: number;
}

export type EntityType = 
  | 'asset_lot'
  | 'transaction'
  | 'trader'
  | 'producer'
  | 'compliance_record'
  | 'certificate';

export interface VersionedEntity<T = unknown> {
  /** Entity data */
  data: T;
  /** Schema version */
  _schemaVersion: string;
  /** Entity type */
  _entityType: EntityType;
  /** Migration history */
  _migrations?: string[];
}

export interface Migration {
  /** Migration ID (semver format) */
  id: string;
  /** Source version */
  fromVersion: string;
  /** Target version */
  toVersion: string;
  /** Entity types this migration applies to */
  entityTypes: EntityType[];
  /** Migration description */
  description: string;
  /** Migration function */
  migrate: (data: unknown) => unknown;
  /** Rollback function (optional) */
  rollback?: (data: unknown) => unknown;
}

// ============================================================================
// CURRENT SCHEMA VERSIONS
// ============================================================================

export const SCHEMA_VERSIONS: Record<EntityType, string> = {
  asset_lot: '1.1.0',
  transaction: '1.1.0',
  trader: '1.0.0',
  producer: '1.0.0',
  compliance_record: '1.0.0',
  certificate: '1.0.0',
};

// ============================================================================
// MIGRATIONS REGISTRY
// ============================================================================

const migrations: Migration[] = [
  // Asset Lot: 1.0.0 -> 1.1.0
  {
    id: 'asset_lot_1.0.0_to_1.1.0',
    fromVersion: '1.0.0',
    toVersion: '1.1.0',
    entityTypes: ['asset_lot'],
    description: 'Add weightUnit field, rename minerId to producerId',
    migrate: (data: any) => {
      const migrated = { ...data };
      
      // Rename minerId to producerId
      if ('minerId' in migrated && !('producerId' in migrated)) {
        migrated.producerId = migrated.minerId;
        delete migrated.minerId;
      }
      
      // Add weightUnit default
      if (!migrated.weightUnit) {
        migrated.weightUnit = 'g';
      }
      
      // Rename goldDetails to assetDetails
      if ('goldDetails' in migrated && !('assetDetails' in migrated)) {
        migrated.assetDetails = migrated.goldDetails;
        delete migrated.goldDetails;
      }
      
      return migrated;
    },
    rollback: (data: any) => {
      const rolled = { ...data };
      
      if ('producerId' in rolled) {
        rolled.minerId = rolled.producerId;
        delete rolled.producerId;
      }
      
      if ('assetDetails' in rolled) {
        rolled.goldDetails = rolled.assetDetails;
        delete rolled.assetDetails;
      }
      
      delete rolled.weightUnit;
      
      return rolled;
    },
  },
  
  // Transaction: 1.0.0 -> 1.1.0
  {
    id: 'transaction_1.0.0_to_1.1.0',
    fromVersion: '1.0.0',
    toVersion: '1.1.0',
    entityTypes: ['transaction'],
    description: 'Add quantityUnit field, add cryptoProof',
    migrate: (data: any) => {
      const migrated = { ...data };
      
      // Add quantityUnit default
      if (!migrated.quantityUnit) {
        migrated.quantityUnit = 'g';
      }
      
      // Ensure cryptoProof exists
      if (!migrated.cryptoProof) {
        migrated.cryptoProof = null;
      }
      
      return migrated;
    },
    rollback: (data: any) => {
      const rolled = { ...data };
      delete rolled.quantityUnit;
      delete rolled.cryptoProof;
      return rolled;
    },
  },
];

// ============================================================================
// SCHEMA MIGRATOR
// ============================================================================

export class SchemaMigrator {
  private migrations: Migration[] = [];
  
  constructor(customMigrations?: Migration[]) {
    this.migrations = [...migrations, ...(customMigrations || [])];
  }
  
  /**
   * Register a new migration
   */
  registerMigration(migration: Migration): void {
    // Prevent duplicates
    if (this.migrations.some(m => m.id === migration.id)) {
      return;
    }
    this.migrations.push(migration);
  }
  
  /**
   * Get current schema version for entity type
   */
  getCurrentVersion(entityType: EntityType): string {
    return SCHEMA_VERSIONS[entityType];
  }
  
  /**
   * Check if entity needs migration
   */
  needsMigration<T>(entity: VersionedEntity<T>): boolean {
    const currentVersion = SCHEMA_VERSIONS[entity._entityType];
    return this.compareVersions(entity._schemaVersion, currentVersion) < 0;
  }
  
  /**
   * Migrate entity to current schema version
   */
  migrate<T>(entity: VersionedEntity<T>): VersionedEntity<T> {
    if (!this.needsMigration(entity)) {
      return entity;
    }
    
    let currentData = entity.data;
    let currentVersion = entity._schemaVersion;
    const appliedMigrations: string[] = [...(entity._migrations || [])];
    const targetVersion = SCHEMA_VERSIONS[entity._entityType];
    
    // Find and apply migrations in order
    const applicableMigrations = this.getMigrationPath(
      entity._entityType,
      currentVersion,
      targetVersion
    );
    
    for (const migration of applicableMigrations) {
      currentData = migration.migrate(currentData) as T;
      currentVersion = migration.toVersion;
      appliedMigrations.push(migration.id);
    }
    
    return {
      data: currentData as T,
      _schemaVersion: currentVersion,
      _entityType: entity._entityType,
      _migrations: appliedMigrations,
    };
  }
  
  /**
   * Migrate multiple entities
   */
  migrateMany<T>(entities: VersionedEntity<T>[]): VersionedEntity<T>[] {
    return entities.map(entity => this.migrate(entity));
  }
  
  /**
   * Wrap raw data as versioned entity
   */
  wrap<T>(
    data: T,
    entityType: EntityType,
    version?: string
  ): VersionedEntity<T> {
    return {
      data,
      _schemaVersion: version || SCHEMA_VERSIONS[entityType],
      _entityType: entityType,
    };
  }
  
  /**
   * Unwrap versioned entity to raw data
   */
  unwrap<T>(entity: VersionedEntity<T>): T {
    return entity.data;
  }
  
  /**
   * Validate entity against current schema
   */
  validate<T>(
    entity: VersionedEntity<T>,
    validator: (data: T) => boolean
  ): { valid: boolean; migrated: boolean; errors?: string[] } {
    const migrated = this.needsMigration(entity);
    const toValidate = migrated ? this.migrate(entity) : entity;
    
    try {
      const valid = validator(toValidate.data);
      return { valid, migrated };
    } catch (error) {
      return {
        valid: false,
        migrated,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }
  
  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================
  
  private getMigrationPath(
    entityType: EntityType,
    fromVersion: string,
    toVersion: string
  ): Migration[] {
    const applicable = this.migrations
      .filter(m => m.entityTypes.includes(entityType))
      .filter(m => this.compareVersions(m.fromVersion, fromVersion) >= 0)
      .filter(m => this.compareVersions(m.toVersion, toVersion) <= 0)
      .sort((a, b) => this.compareVersions(a.fromVersion, b.fromVersion));
    
    // Build path from fromVersion to toVersion
    const path: Migration[] = [];
    let current = fromVersion;
    
    while (this.compareVersions(current, toVersion) < 0) {
      const next = applicable.find(m => m.fromVersion === current);
      if (!next) break;
      path.push(next);
      current = next.toVersion;
    }
    
    return path;
  }
  
  private compareVersions(a: string, b: string): number {
    const parseVersion = (v: string): number[] => 
      v.split('.').map(n => parseInt(n, 10) || 0);
    
    const aParts = parseVersion(a);
    const bParts = parseVersion(b);
    
    for (let i = 0; i < 3; i++) {
      const diff = (aParts[i] || 0) - (bParts[i] || 0);
      if (diff !== 0) return diff;
    }
    
    return 0;
  }
}

// ============================================================================
// DEFAULT MIGRATOR INSTANCE
// ============================================================================

export const defaultMigrator = new SchemaMigrator();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if data is a versioned entity
 */
export function isVersionedEntity(data: unknown): data is VersionedEntity {
  return (
    typeof data === 'object' &&
    data !== null &&
    '_schemaVersion' in data &&
    '_entityType' in data &&
    'data' in data
  );
}

/**
 * Ensure data is wrapped as versioned entity
 */
export function ensureVersioned<T>(
  data: T | VersionedEntity<T>,
  entityType: EntityType
): VersionedEntity<T> {
  if (isVersionedEntity(data)) {
    return data as VersionedEntity<T>;
  }
  return defaultMigrator.wrap(data, entityType);
}

/**
 * Migrate and unwrap in one step
 */
export function migrateAndUnwrap<T>(
  data: T | VersionedEntity<T>,
  entityType: EntityType
): T {
  const versioned = ensureVersioned(data, entityType);
  const migrated = defaultMigrator.migrate(versioned);
  return defaultMigrator.unwrap(migrated);
}
