// ============================================================================
// CIRCUIT REGISTRY (DTF-5.4.1) — semver policy packs over CommodityOrigin R1CS
// System-of-record for profile IDs, versions, and lifecycle (not separate circuits).
// ============================================================================

/** Semver `major.minor.patch` (no pre-release in production entries). */
export type CircuitProfileVersion = `${number}.${number}.${number}`;

export type CircuitProfileLifecycleStatus = 'active' | 'deprecated' | 'retired';

export type CircuitRegistryErrorCode =
  | 'UNKNOWN_PROFILE'
  | 'DEPRECATED_PROFILE'
  | 'RETIRED_PROFILE'
  | 'INVALID_SEMVER';

export interface CircuitRegistryEntry {
  profileId: string;
  version: CircuitProfileVersion;
  status: CircuitProfileLifecycleStatus;
  underlyingCircuit: 'CommodityOrigin';
  jurisdictionCode: string;
  /** Sprint or milestone that introduced this registry row. */
  introducedIn: string;
  /** ISO date when status moved to deprecated (if applicable). */
  deprecatedAt?: string;
  /** ISO date when status moved to retired (if applicable). */
  retiredAt?: string;
  /** Replacement profile ID when deprecated or retired. */
  supersededBy?: string;
}

export interface ResolveProfileOptions {
  /** Allow prove/verify on deprecated profiles (default false). */
  allowDeprecated?: boolean;
}

export class CircuitRegistryError extends Error {
  readonly code: CircuitRegistryErrorCode;
  readonly profileId: string;
  readonly supersededBy?: string;

  constructor(
    code: CircuitRegistryErrorCode,
    profileId: string,
    message: string,
    supersededBy?: string
  ) {
    super(message);
    this.name = 'CircuitRegistryError';
    this.code = code;
    this.profileId = profileId;
    if (supersededBy !== undefined) {
      this.supersededBy = supersededBy;
    }
  }
}

const SEMVER_RE = /^\d+\.\d+\.\d+$/;

/** Profile IDs that map to native Groth16 prove/verify (subset of registry). */
export const NATIVE_PROVABLE_PROFILE_IDS = [
  'gh-gold-origin',
  'gh-cocoa-origin',
  'zw-diamond-origin',
] as const;

export type NativeProvableProfileId = (typeof NATIVE_PROVABLE_PROFILE_IDS)[number];

const REGISTRY_ENTRIES: CircuitRegistryEntry[] = [
  {
    profileId: 'gh-gold-origin',
    version: '1.0.0',
    status: 'active',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: 'GH',
    introducedIn: 'S-T5-1',
  },
  {
    profileId: 'zw-diamond-origin',
    version: '1.0.0',
    status: 'active',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: 'ZW',
    introducedIn: 'S-T5-2',
  },
  {
    profileId: 'gh-cocoa-origin',
    version: '1.0.0',
    status: 'active',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: 'GH',
    introducedIn: 'S-T5-3',
  },
  {
    profileId: 'commodity-origin',
    version: '0.1.0',
    status: 'active',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: '*',
    introducedIn: 'S-T5-1',
  },
  {
    profileId: 'gh-gold-origin-preview',
    version: '0.9.0',
    status: 'deprecated',
    underlyingCircuit: 'CommodityOrigin',
    jurisdictionCode: 'GH',
    introducedIn: 'S-T5-1',
    deprecatedAt: '2026-06-01',
    supersededBy: 'gh-gold-origin',
  },
];

function assertSemver(version: string, profileId: string): void {
  if (!SEMVER_RE.test(version)) {
    throw new CircuitRegistryError(
      'INVALID_SEMVER',
      profileId,
      `Invalid semver for profile ${profileId}: ${version}`
    );
  }
}

function indexEntries(): Map<string, CircuitRegistryEntry> {
  const map = new Map<string, CircuitRegistryEntry>();
  for (const entry of REGISTRY_ENTRIES) {
    assertSemver(entry.version, entry.profileId);
    map.set(entry.profileId, entry);
  }
  return map;
}

const ENTRY_INDEX = indexEntries();

export class CircuitRegistry {
  /** All registry rows (immutable snapshot). */
  list(): readonly CircuitRegistryEntry[] {
    return REGISTRY_ENTRIES;
  }

  /** Active profile IDs only. */
  listActiveIds(): string[] {
    return REGISTRY_ENTRIES.filter((e) => e.status === 'active').map((e) => e.profileId);
  }

  has(profileId: string): boolean {
    return ENTRY_INDEX.has(profileId);
  }

  get(profileId: string): CircuitRegistryEntry | undefined {
    return ENTRY_INDEX.get(profileId);
  }

  /**
   * Resolve a profile for prove/verify/policy use.
   * @throws {CircuitRegistryError} unknown, retired, or deprecated (unless allowed)
   */
  resolve(profileId: string, options: ResolveProfileOptions = {}): CircuitRegistryEntry {
    const entry = ENTRY_INDEX.get(profileId);
    if (!entry) {
      throw new CircuitRegistryError(
        'UNKNOWN_PROFILE',
        profileId,
        `Unknown commodity origin profile: ${profileId}`
      );
    }

    if (entry.status === 'retired') {
      throw new CircuitRegistryError(
        'RETIRED_PROFILE',
        profileId,
        `Profile ${profileId} is retired${entry.supersededBy ? `; use ${entry.supersededBy}` : ''}`,
        entry.supersededBy
      );
    }

    if (entry.status === 'deprecated' && !options.allowDeprecated) {
      throw new CircuitRegistryError(
        'DEPRECATED_PROFILE',
        profileId,
        `Profile ${profileId} is deprecated${entry.supersededBy ? `; use ${entry.supersededBy}` : ''}`,
        entry.supersededBy
      );
    }

    return entry;
  }

  /** Whether ID is in the native provable subset (active or deprecated-with-flag). */
  isNativeProvable(profileId: string, options?: ResolveProfileOptions): boolean {
    const entry = this.resolve(profileId, options);
    return (NATIVE_PROVABLE_PROFILE_IDS as readonly string[]).includes(entry.profileId);
  }
}

/** Singleton registry (DTF-5.4.1 policy SoR). */
export const circuitRegistry = new CircuitRegistry();

export function resolveCircuitProfile(
  profileId: string,
  options?: ResolveProfileOptions
): CircuitRegistryEntry {
  return circuitRegistry.resolve(profileId, options);
}
