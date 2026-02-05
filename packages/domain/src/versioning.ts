/**
 * API Versioning and Deprecation
 *
 * Explicit versioning strategy and deprecation markers.
 * Implements P10 (API Stability) principle.
 *
 * @package @gtcx/domain
 */

// ============================================================================
// API VERSION
// ============================================================================

/**
 * Current API version
 *
 * Follows semantic versioning:
 * - Major: Breaking changes
 * - Minor: New features (backward compatible)
 * - Patch: Bug fixes
 */
export const API_VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
  toString: () => '1.0.0',
  full: '1.0.0',
} as const;

/**
 * Minimum supported API version for clients
 */
export const MIN_SUPPORTED_VERSION = '1.0.0';

// ============================================================================
// DEPRECATION TRACKING
// ============================================================================

export interface DeprecationInfo {
  /** Feature/method being deprecated */
  feature: string;
  /** Version when deprecated */
  deprecatedIn: string;
  /** Version when it will be removed */
  removeIn: string;
  /** Replacement feature/method */
  replacement?: string;
  /** Migration guide or notes */
  migrationNotes?: string;
}

/**
 * Registry of deprecated features
 */
export const DEPRECATIONS: DeprecationInfo[] = [
  // Add deprecations here as they occur
  // Example:
  // {
  //   feature: 'TradingService.getPrice()',
  //   deprecatedIn: '1.1.0',
  //   removeIn: '2.0.0',
  //   replacement: 'TradingService.calculateFairPrice()',
  //   migrationNotes: 'The new method includes quality adjustments',
  // },
];

/**
 * Check if a feature is deprecated
 */
export function isDeprecated(feature: string): DeprecationInfo | undefined {
  return DEPRECATIONS.find((d) => d.feature === feature);
}

/**
 * Get all deprecations that will be removed in a specific version
 */
export function getUpcomingRemovals(version: string): DeprecationInfo[] {
  return DEPRECATIONS.filter((d) => d.removeIn === version);
}

// ============================================================================
// DEPRECATION DECORATOR
// ============================================================================

/**
 * Decorator to mark methods as deprecated
 * Logs warning when method is called
 */
export function deprecated(info: Omit<DeprecationInfo, 'feature'>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const feature = `${target.constructor.name}.${propertyKey}()`;

    // Register deprecation
    DEPRECATIONS.push({ feature, ...info });

    descriptor.value = function (...args: any[]) {
      console.warn(
        `[DEPRECATED] ${feature} is deprecated since ${info.deprecatedIn} ` +
          `and will be removed in ${info.removeIn}.` +
          (info.replacement ? ` Use ${info.replacement} instead.` : '')
      );
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// ============================================================================
// VERSION COMPATIBILITY
// ============================================================================

export interface VersionCompatibility {
  compatible: boolean;
  clientVersion: string;
  serverVersion: string;
  warnings?: string[];
  errors?: string[];
}

/**
 * Check if client version is compatible with server
 */
export function checkVersionCompatibility(clientVersion: string): VersionCompatibility {
  const result: VersionCompatibility = {
    compatible: true,
    clientVersion,
    serverVersion: API_VERSION.full,
    warnings: [],
    errors: [],
  };

  const [clientMajor = 0, clientMinor = 0] = clientVersion.split('.').map(Number);
  const [serverMajor = 0, serverMinor = 0] = API_VERSION.full.split('.').map(Number);

  // Major version mismatch = incompatible
  if (clientMajor !== serverMajor) {
    result.compatible = false;
    result.errors!.push(`Major version mismatch: client=${clientMajor}, server=${serverMajor}`);
    return result;
  }

  // Client minor version ahead = warn (using features that don't exist)
  if (clientMinor > serverMinor) {
    result.warnings!.push(
      `Client minor version (${clientMinor}) is ahead of server (${serverMinor}). ` +
        `Some features may not be available.`
    );
  }

  // Check for upcoming deprecations
  const deprecations = DEPRECATIONS.filter(
    (d) => compareVersions(d.removeIn, API_VERSION.full) <= 0
  );

  if (deprecations.length > 0) {
    result.warnings!.push(`${deprecations.length} deprecated feature(s) are scheduled for removal`);
  }

  return result;
}

/**
 * Compare two semver versions
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const diff = (aParts[i] || 0) - (bParts[i] || 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }

  return 0;
}

// ============================================================================
// API STABILITY MARKERS
// ============================================================================

export type StabilityLevel = 'stable' | 'beta' | 'alpha' | 'experimental' | 'internal';

export interface StabilityInfo {
  level: StabilityLevel;
  since: string;
  notes?: string;
}

/**
 * Stability levels for different parts of the API
 */
export const API_STABILITY: Record<string, StabilityInfo> = {
  // Core services - stable
  AssetLotRegistrationService: { level: 'stable', since: '1.0.0' },
  TradingService: { level: 'stable', since: '1.0.0' },
  UnifiedComplianceService: { level: 'stable', since: '1.0.0' },

  // Schemas - stable
  AssetRegistrationDataSchema: { level: 'stable', since: '1.0.0' },
  TradeRequestSchema: { level: 'stable', since: '1.0.0' },
  ComplianceReportOptionsSchema: { level: 'stable', since: '1.0.0' },

  // Events - stable
  DomainEvent: { level: 'stable', since: '1.0.0' },
  DomainEventFactory: { level: 'stable', since: '1.0.0' },

  // Migrations - beta
  SchemaMigrator: { level: 'beta', since: '1.0.0', notes: 'API may change' },

  // Metrics - beta
  InMemoryMetricsCollector: { level: 'beta', since: '1.0.0' },

  // Offline queue - experimental
  OfflineQueue: { level: 'experimental', since: '1.0.0', notes: 'Conflict resolution may change' },

  // Internal utilities - internal
  'internal/*': { level: 'internal', since: '1.0.0', notes: 'Not part of public API' },
};

/**
 * Get stability info for a feature
 */
export function getStability(feature: string): StabilityInfo | undefined {
  return API_STABILITY[feature];
}

/**
 * Check if feature is stable for production use
 */
export function isStable(feature: string): boolean {
  const stability = API_STABILITY[feature];
  return stability?.level === 'stable';
}

// ============================================================================
// CHANGELOG HELPER
// ============================================================================

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
    description: string;
  }[];
}

/**
 * Package changelog
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.0.0',
    date: '2025-01-22',
    changes: [
      { type: 'added', description: 'Initial release of @gtcx/domain' },
      { type: 'added', description: 'AssetLotRegistrationService with Zod validation' },
      { type: 'added', description: 'TradingService with price calculations' },
      { type: 'added', description: 'UnifiedComplianceService with pluggable frameworks' },
      { type: 'added', description: 'Domain events for observability' },
      { type: 'added', description: 'AI operation logging' },
      { type: 'added', description: 'Schema versioning and migrations' },
      { type: 'added', description: 'Metrics collection' },
      { type: 'added', description: 'Offline queue with conflict resolution' },
    ],
  },
];

/**
 * Get changelog since a specific version
 */
export function getChangelogSince(version: string): ChangelogEntry[] {
  return CHANGELOG.filter((entry) => compareVersions(entry.version, version) > 0);
}
