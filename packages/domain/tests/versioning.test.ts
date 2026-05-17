import { describe, it, expect, vi } from 'vitest';

import {
  API_VERSION,
  DEPRECATIONS,
  isDeprecated,
  getUpcomingRemovals,
  deprecated,
  checkVersionCompatibility,
  compareVersions,
  API_STABILITY,
  getStability,
  isStable,
  CHANGELOG,
  getChangelogSince,
} from '../src/versioning';

// ---------------------------------------------------------------------------
// API_VERSION
// ---------------------------------------------------------------------------

describe('API_VERSION', () => {
  it('has correct major, minor, patch', () => {
    expect(API_VERSION.major).toBe(1);
    expect(API_VERSION.minor).toBe(0);
    expect(API_VERSION.patch).toBe(0);
  });

  it('toString returns version string', () => {
    expect(API_VERSION.toString()).toBe('1.0.0');
  });

  it('full matches toString', () => {
    expect(API_VERSION.full).toBe('1.0.0');
  });
});

// ---------------------------------------------------------------------------
// compareVersions
// ---------------------------------------------------------------------------

describe('compareVersions', () => {
  it('returns 0 for equal versions', () => {
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    expect(compareVersions('2.3.4', '2.3.4')).toBe(0);
  });

  it('returns 1 when a > b (major)', () => {
    expect(compareVersions('2.0.0', '1.0.0')).toBe(1);
  });

  it('returns -1 when a < b (major)', () => {
    expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
  });

  it('compares minor versions', () => {
    expect(compareVersions('1.2.0', '1.1.0')).toBe(1);
    expect(compareVersions('1.0.0', '1.1.0')).toBe(-1);
  });

  it('compares patch versions', () => {
    expect(compareVersions('1.0.2', '1.0.1')).toBe(1);
    expect(compareVersions('1.0.0', '1.0.1')).toBe(-1);
  });

  it('handles missing parts', () => {
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
    expect(compareVersions('1', '1.0.0')).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// checkVersionCompatibility
// ---------------------------------------------------------------------------

describe('checkVersionCompatibility', () => {
  it('returns compatible for matching major version', () => {
    const result = checkVersionCompatibility('1.0.0');
    expect(result.compatible).toBe(true);
    expect(result.clientVersion).toBe('1.0.0');
    expect(result.serverVersion).toBe(API_VERSION.full);
  });

  it('returns incompatible for different major version', () => {
    const result = checkVersionCompatibility('2.0.0');
    expect(result.compatible).toBe(false);
    expect(result.errors!.length).toBeGreaterThan(0);
    expect(result.errors![0]).toContain('Major version mismatch');
  });

  it('warns when client minor version is ahead', () => {
    const result = checkVersionCompatibility('1.5.0');
    expect(result.compatible).toBe(true);
    expect(result.warnings!.some((w) => w.includes('ahead'))).toBe(true);
  });

  it('returns compatible for same major, lower minor', () => {
    const result = checkVersionCompatibility('1.0.0');
    expect(result.compatible).toBe(true);
  });

  it('warns about deprecations scheduled for removal', () => {
    DEPRECATIONS.push({
      feature: 'test-feature',
      deprecatedIn: '1.0.0',
      removeIn: API_VERSION.full,
    });

    const result = checkVersionCompatibility('1.0.0');
    expect(result.warnings!.some((w) => w.includes('deprecated'))).toBe(true);

    const idx = DEPRECATIONS.findIndex((d) => d.feature === 'test-feature');
    if (idx >= 0) DEPRECATIONS.splice(idx, 1);
  });
});

// ---------------------------------------------------------------------------
// isDeprecated / getUpcomingRemovals
// ---------------------------------------------------------------------------

describe('isDeprecated', () => {
  it('returns undefined for non-deprecated features', () => {
    expect(isDeprecated('SomeRandomFeature')).toBeUndefined();
  });
});

describe('getUpcomingRemovals', () => {
  it('returns empty array when no removals for version', () => {
    expect(getUpcomingRemovals('99.0.0')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// deprecated decorator
// ---------------------------------------------------------------------------

describe('deprecated decorator', () => {
  it('logs warning and calls original method when applied manually', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Apply the decorator manually (legacy decorator signature)
    class TestService {
      oldMethod(x: number): number {
        return x * 2;
      }
    }

    const descriptor: PropertyDescriptor = {
      value: TestService.prototype.oldMethod,
      writable: true,
      enumerable: false,
      configurable: true,
    };

    const decoratorFn = deprecated({
      deprecatedIn: '1.0.0',
      removeIn: '2.0.0',
      replacement: 'TestService.newMethod()',
    });
    decoratorFn(TestService.prototype, 'oldMethod', descriptor);
    TestService.prototype.oldMethod = descriptor.value;

    const svc = new TestService();
    const result = svc.oldMethod(5);

    expect(result).toBe(10);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).toContain('[DEPRECATED]');
    expect(msg).toContain('TestService.oldMethod()');
    expect(msg).toContain('1.0.0');
    expect(msg).toContain('2.0.0');
    expect(msg).toContain('TestService.newMethod()');

    warnSpy.mockRestore();

    // Clean up: remove from global DEPRECATIONS so it doesn't affect other tests
    const idx = DEPRECATIONS.findIndex((d) => d.feature === 'TestService.oldMethod()');
    if (idx >= 0) DEPRECATIONS.splice(idx, 1);
  });

  it('works without replacement', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    class Svc2 {
      legacy(): string {
        return 'ok';
      }
    }

    const descriptor: PropertyDescriptor = {
      value: Svc2.prototype.legacy,
      writable: true,
      enumerable: false,
      configurable: true,
    };

    const decoratorFn = deprecated({ deprecatedIn: '1.0.0', removeIn: '3.0.0' });
    decoratorFn(Svc2.prototype, 'legacy', descriptor);
    Svc2.prototype.legacy = descriptor.value;

    const svc = new Svc2();
    expect(svc.legacy()).toBe('ok');

    const msg = warnSpy.mock.calls[0]![0] as string;
    expect(msg).not.toContain('Use');

    warnSpy.mockRestore();

    const idx = DEPRECATIONS.findIndex((d) => d.feature === 'Svc2.legacy()');
    if (idx >= 0) DEPRECATIONS.splice(idx, 1);
  });
});

// ---------------------------------------------------------------------------
// API_STABILITY / getStability / isStable
// ---------------------------------------------------------------------------

describe('API_STABILITY', () => {
  it('marks core services as stable', () => {
    expect(API_STABILITY['AssetLotRegistrationService']!.level).toBe('stable');
    expect(API_STABILITY['TradingService']!.level).toBe('stable');
    expect(API_STABILITY['UnifiedComplianceService']!.level).toBe('stable');
  });

  it('marks SchemaMigrator as beta', () => {
    expect(API_STABILITY['SchemaMigrator']!.level).toBe('beta');
  });

  it('marks OfflineQueue as experimental', () => {
    expect(API_STABILITY['OfflineQueue']!.level).toBe('experimental');
  });
});

describe('getStability', () => {
  it('returns stability info for known features', () => {
    const info = getStability('TradingService');
    expect(info).toBeDefined();
    expect(info!.level).toBe('stable');
    expect(info!.since).toBe('1.0.0');
  });

  it('returns undefined for unknown features', () => {
    expect(getStability('NonExistentFeature')).toBeUndefined();
  });
});

describe('isStable', () => {
  it('returns true for stable features', () => {
    expect(isStable('TradingService')).toBe(true);
  });

  it('returns false for beta features', () => {
    expect(isStable('SchemaMigrator')).toBe(false);
  });

  it('returns false for unknown features', () => {
    expect(isStable('UnknownFeature')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CHANGELOG / getChangelogSince
// ---------------------------------------------------------------------------

describe('CHANGELOG', () => {
  it('has at least one entry', () => {
    expect(CHANGELOG.length).toBeGreaterThan(0);
  });

  it('entries have required fields', () => {
    for (const entry of CHANGELOG) {
      expect(entry.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.changes.length).toBeGreaterThan(0);
    }
  });
});

describe('getChangelogSince', () => {
  it('returns entries newer than given version', () => {
    const entries = getChangelogSince('0.9.0');
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]!.version).toBe('1.0.0');
  });

  it('returns empty for current or future version', () => {
    expect(getChangelogSince('1.0.0')).toEqual([]);
    expect(getChangelogSince('99.0.0')).toEqual([]);
  });
});
