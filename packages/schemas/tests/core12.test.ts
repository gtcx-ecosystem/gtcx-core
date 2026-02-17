import {
  getDomain,
  getControl,
  getAllControls,
  getControlCount,
  CORE12_DOMAINS,
} from '../src/core12';
import type { Domain } from '../src/core12';

// ---------------------------------------------------------------------------
// getDomain
// ---------------------------------------------------------------------------
describe('getDomain', () => {
  it('returns Governance & Ethics for D01', () => {
    const domain = getDomain('D01');
    expect(domain).toBeDefined();
    expect(domain!.id).toBe('D01');
    expect(domain!.name).toBe('Governance & Ethics');
  });

  it.each([
    ['D01', 'Governance & Ethics'],
    ['D02', 'Environmental Management'],
    ['D03', 'Labor & Human Rights'],
    ['D04', 'Health & Safety'],
    ['D05', 'Community Relations'],
    ['D06', 'Supply Chain'],
    ['D07', 'Security & Conflict'],
    ['D08', 'Legal Compliance'],
    ['D09', 'Financial Transparency'],
    ['D10', 'Product Integrity'],
    ['D11', 'Data & Privacy'],
    ['D12', 'Continuous Improvement'],
  ])('returns a valid domain object for %s (%s)', (domainId, expectedName) => {
    const domain = getDomain(domainId);
    expect(domain).toBeDefined();
    expect(domain!.id).toBe(domainId);
    expect(domain!.name).toBe(expectedName);
    expect(typeof domain!.description).toBe('string');
    expect(domain!.description.length).toBeGreaterThan(0);
    expect(Array.isArray(domain!.controls)).toBe(true);
  });

  it('returns undefined for an invalid domain ID', () => {
    expect(getDomain('invalid')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(getDomain('')).toBeUndefined();
  });

  it('returns undefined for a domain ID with wrong casing', () => {
    expect(getDomain('d01')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getControl
// ---------------------------------------------------------------------------
describe('getControl', () => {
  it('returns Board ESG Oversight for CORE12-D01-C01', () => {
    const control = getControl('CORE12-D01-C01');
    expect(control).toBeDefined();
    expect(control!.id).toBe('CORE12-D01-C01');
    expect(control!.name).toBe('Board ESG Oversight');
  });

  it('returns Anti-Corruption Policy for CORE12-D01-C02', () => {
    const control = getControl('CORE12-D01-C02');
    expect(control).toBeDefined();
    expect(control!.id).toBe('CORE12-D01-C02');
    expect(control!.name).toBe('Anti-Corruption Policy');
  });

  it('returns undefined for an invalid control ID', () => {
    expect(getControl('invalid')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(getControl('')).toBeUndefined();
  });

  it('returns undefined for a non-existent control in a valid domain pattern', () => {
    expect(getControl('CORE12-D01-C99')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getAllControls
// ---------------------------------------------------------------------------
describe('getAllControls', () => {
  it('returns an array', () => {
    const controls = getAllControls();
    expect(Array.isArray(controls)).toBe(true);
  });

  it('returns all controls from every domain', () => {
    const controls = getAllControls();
    const expectedCount = CORE12_DOMAINS.reduce((sum, d) => sum + d.controls.length, 0);
    expect(controls.length).toBe(expectedCount);
  });

  it('includes every control retrievable by getControl', () => {
    const controls = getAllControls();
    for (const control of controls) {
      expect(getControl(control.id)).toBe(control);
    }
  });
});

// ---------------------------------------------------------------------------
// getControlCount
// ---------------------------------------------------------------------------
describe('getControlCount', () => {
  it('returns a number', () => {
    expect(typeof getControlCount()).toBe('number');
  });

  it('matches the length of getAllControls()', () => {
    expect(getControlCount()).toBe(getAllControls().length);
  });

  it('matches the sum of controls across all domains', () => {
    const sum = CORE12_DOMAINS.reduce((acc, d) => acc + d.controls.length, 0);
    expect(getControlCount()).toBe(sum);
  });
});

// ---------------------------------------------------------------------------
// Domain structure validation
// ---------------------------------------------------------------------------
describe('Domain structure', () => {
  it('has exactly 12 domains', () => {
    expect(CORE12_DOMAINS).toHaveLength(12);
  });

  it.each(CORE12_DOMAINS.map((d) => [d.id, d]))('domain %s has required fields', (_id, domain) => {
    const d = domain as Domain;
    expect(typeof d.id).toBe('string');
    expect(d.id.length).toBeGreaterThan(0);
    expect(typeof d.name).toBe('string');
    expect(d.name.length).toBeGreaterThan(0);
    expect(typeof d.description).toBe('string');
    expect(d.description.length).toBeGreaterThan(0);
    expect(Array.isArray(d.controls)).toBe(true);
  });

  it('contains all 12 domain IDs from D01 to D12', () => {
    const expectedIds = Array.from({ length: 12 }, (_, i) => `D${String(i + 1).padStart(2, '0')}`);
    const actualIds = CORE12_DOMAINS.map((d) => d.id);
    expect(actualIds).toEqual(expect.arrayContaining(expectedIds));
    expect(actualIds).toHaveLength(12);
  });

  it('has no duplicate domain IDs', () => {
    const ids = CORE12_DOMAINS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// Control structure validation
// ---------------------------------------------------------------------------
describe('Control structure', () => {
  const allControls = getAllControls();

  it('every control has all required fields', () => {
    for (const control of allControls) {
      expect(typeof control.id).toBe('string');
      expect(control.id.length).toBeGreaterThan(0);
      expect(typeof control.name).toBe('string');
      expect(control.name.length).toBeGreaterThan(0);
      expect(typeof control.description).toBe('string');
      expect(control.description.length).toBeGreaterThan(0);

      // evidenceRequirements
      expect(control.evidenceRequirements).toBeDefined();
      expect(Array.isArray(control.evidenceRequirements.primary)).toBe(true);
      expect(control.evidenceRequirements.primary.length).toBeGreaterThan(0);
      expect(Array.isArray(control.evidenceRequirements.supporting)).toBe(true);

      // verificationMethod
      expect(typeof control.verificationMethod).toBe('string');
      expect(control.verificationMethod.length).toBeGreaterThan(0);

      // scoringCriteria
      expect(control.scoringCriteria).toBeDefined();
      expect(typeof control.scoringCriteria.complete).toBe('string');
      expect(control.scoringCriteria.complete.length).toBeGreaterThan(0);
      expect(typeof control.scoringCriteria.partial).toBe('string');
      expect(control.scoringCriteria.partial.length).toBeGreaterThan(0);
      expect(typeof control.scoringCriteria.gap).toBe('string');
      expect(control.scoringCriteria.gap.length).toBeGreaterThan(0);
    }
  });

  it('every control ID follows the CORE12-DXX-CXX pattern', () => {
    const pattern = /^CORE12-D\d{2}-C\d{2}$/;
    for (const control of allControls) {
      expect(control.id).toMatch(pattern);
    }
  });

  it('has no duplicate control IDs across all domains', () => {
    const ids = allControls.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each control ID references its parent domain', () => {
    for (const domain of CORE12_DOMAINS) {
      for (const control of domain.controls) {
        expect(control.id).toContain(domain.id);
      }
    }
  });
});
