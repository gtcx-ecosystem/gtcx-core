import {
  JurisdictionConfigSchema,
  IdentitySchema,
  RegulatorySchema,
  CommoditySchema,
  GeoTagSchema,
  DeploymentSchema,
  loadJurisdictionConfig,
  validateJurisdictionConfig,
} from '../src';
import type { JurisdictionConfig } from '../src';

// ---------------------------------------------------------------------------
// Fixture: a complete valid jurisdiction config
// ---------------------------------------------------------------------------
const validConfig: JurisdictionConfig = {
  identity: {
    countryCode: 'XX',
    countryCode3: 'XXX',
    name: {
      official: 'Republic of Testland',
      common: 'Testland',
      local: { tl: 'Testilandi' },
    },
    timezone: 'Africa/Testland',
    region: 'west_africa',
  },
  regulatory: {
    primaryAuthority: {
      name: 'Minerals Commission',
      abbreviation: 'MC',
      website: 'https://mc.testland.gov',
    },
    licensing: {
      producerLicenses: [
        { type: 'Small-Scale Mining', code: 'SSM', renewalYears: 3, requiredForGTCX: true },
      ],
      buyerLicenses: [{ type: 'Licensed Buying Agent', code: 'LBA', requiredForGTCX: true }],
      exportLicenses: [{ type: 'Precious Minerals Export', code: 'PME', requiredForGTCX: true }],
    },
    compliance: {
      mercuryRestrictions: 'restricted',
      communityConsentRequired: true,
      childLaborProhibition: true,
      royaltyRate: 5,
      exportDutyRate: 3,
      chainOfCustodyRequired: true,
      assayRequiredForExport: true,
    },
    dataSovereignty: {
      dataResidencyRequired: true,
      governmentDataAccess: 'on_request',
    },
  },
  commodities: [
    {
      type: 'gold',
      enabled: true,
      config: {
        weightUnit: 'gram',
        purityStandard: 'fineness',
        minimumPurityForExport: 0.995,
        pricingReference: 'lbma',
        localPremiumPercent: -3,
      },
    },
  ],
  localization: {
    officialLanguages: ['en'],
    supportedLanguages: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        rtl: false,
        channels: { app: true, ussd: true, sms: true, voice: true },
      },
    ],
    defaultLanguage: 'en',
    numberFormat: { decimalSeparator: '.', thousandsSeparator: ',' },
    dateFormat: { short: 'DD/MM/YYYY', long: 'D MMMM YYYY', time: '12h' },
  },
  financial: {
    currency: { code: 'TLD', symbol: 'T$', name: 'Testland Dollar', decimalPlaces: 2 },
    mobileMoneyProviders: [
      {
        name: 'TestPay',
        code: 'TPY',
        ussdCode: '*123#',
        apiAvailable: true,
        marketSharePercent: 60,
      },
    ],
    limits: { maxCashTransactionUSD: 5000, mobileMoneyDailyLimitUSD: 1000 },
  },
  telecom: {
    operators: [
      {
        name: 'TestCell',
        code: 'TC',
        marketSharePercent: 55,
        coverage: { population2G: 95, population4G: 45 },
        ussdPartnership: { available: true, shortCode: '*900#' },
      },
    ],
    connectivity: { smartphonePenetration: 60, internetPenetration: 50 },
  },
  tradePass: {
    nationalId: { systemName: 'TestID', format: 'TLD-XXXXXXXX-X', apiAvailable: false },
    card: {
      branding: { sovereignLogoRequired: true, primaryLanguage: 'en' },
      numbering: { prefix: 'TLD', sequenceLength: 8 },
    },
    biometrics: { fingerprintRequired: true, templateStorageLocation: 'device_only' },
    kycTiers: { tier1LimitUSD: 500, tier2LimitUSD: 5000 },
  },
  hardware: {
    certifiedDevices: [
      {
        manufacturer: 'TestTech',
        model: 'TT-100',
        certificationLevel: 'certified',
        retailPriceUSD: 150,
      },
    ],
    scales: {
      certificationRequired: true,
      recertificationMonths: 12,
      approvedBrands: ['ScaleCo'],
    },
    seals: { prefix: 'TLD', supplier: 'sicpa' },
  },
  geoTag: {
    accuracyMeters: 10,
    spoofDetection: 'enhanced',
    satelliteProvider: 'planet',
    droneOperationsPermitted: false,
  },
  custody: {
    seals: { required: true, prefix: 'TLD-SEAL', maxValidityDays: 30 },
    chain: { minimumCheckpoints: 3, maxHoursBetweenCheckpoints: 24 },
  },
  support: {
    channels: {
      ussdCode: '*100#',
      smsShortcode: '1234',
      whatsappNumber: '+1234567890',
      voiceNumber: '+1234567891',
    },
    hours: { businessStart: '08:00', businessEnd: '18:00', emergency24x7: true },
    rco: { location: 'Testland City', minimumStaff: 5 },
    peerRewards: { currency: 'TLD', answerAccepted: 10, articleContribution: 50 },
  },
  gci: {
    weights: {
      identity: 15,
      location: 15,
      documentation: 15,
      environmental: 15,
      labor: 15,
      financial: 10,
      traceability: 15,
    },
    thresholds: { minimumForTrading: 40, minimumForExport: 60, minimumForPremium: 80 },
  },
  deployment: {
    status: 'pilot_active',
    targets: { month3Users: 500, month6Users: 2000, year1Users: 10000, buyingStations: 20 },
    readiness: {
      regulatoryApproval: true,
      partnerContracts: true,
      rcoEstablished: true,
      hardwareOrdered: false,
    },
  },
};

// ---------------------------------------------------------------------------
// Full schema validation
// ---------------------------------------------------------------------------
describe('JurisdictionConfigSchema', () => {
  it('accepts a valid complete config', () => {
    const result = JurisdictionConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it('rejects an empty object', () => {
    const result = JurisdictionConfigSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects null', () => {
    const result = JurisdictionConfigSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('contains all 13 top-level sections', () => {
    const shape = JurisdictionConfigSchema.shape;
    const keys = Object.keys(shape);
    expect(keys).toHaveLength(13);
    expect(keys).toEqual(
      expect.arrayContaining([
        'identity',
        'regulatory',
        'commodities',
        'localization',
        'financial',
        'telecom',
        'tradePass',
        'hardware',
        'geoTag',
        'custody',
        'support',
        'gci',
        'deployment',
      ])
    );
  });
});

// ---------------------------------------------------------------------------
// Section schemas
// ---------------------------------------------------------------------------
describe('IdentitySchema', () => {
  it('rejects countryCode with wrong length', () => {
    const result = IdentitySchema.safeParse({ ...validConfig.identity, countryCode: 'ABC' });
    expect(result.success).toBe(false);
  });

  it('validates region enum', () => {
    const result = IdentitySchema.safeParse({ ...validConfig.identity, region: 'antarctica' });
    expect(result.success).toBe(false);
  });
});

describe('RegulatorySchema', () => {
  it('rejects invalid mercury restriction', () => {
    const modified = {
      ...validConfig.regulatory,
      compliance: { ...validConfig.regulatory.compliance, mercuryRestrictions: 'unknown' },
    };
    const result = RegulatorySchema.safeParse(modified);
    expect(result.success).toBe(false);
  });

  it('accepts optional website field', () => {
    const modified = {
      ...validConfig.regulatory,
      primaryAuthority: { name: 'MC', abbreviation: 'MC' },
    };
    const result = RegulatorySchema.safeParse(modified);
    expect(result.success).toBe(true);
  });
});

describe('CommoditySchema', () => {
  it('rejects unknown commodity type', () => {
    const result = CommoditySchema.safeParse({
      type: 'uranium',
      enabled: true,
      config: {
        weightUnit: 'gram',
        pricingReference: 'lbma',
        localPremiumPercent: 0,
      },
    });
    expect(result.success).toBe(false);
  });

  it('accepts commodity without optional purity fields', () => {
    const result = CommoditySchema.safeParse({
      type: 'cocoa',
      enabled: true,
      config: {
        weightUnit: 'kilogram',
        pricingReference: 'local_exchange',
        localPremiumPercent: 2,
      },
    });
    expect(result.success).toBe(true);
  });
});

describe('DeploymentSchema', () => {
  it('validates all status enum values', () => {
    const statuses = [
      'prospect',
      'engaged',
      'mou_signed',
      'pilot_preparing',
      'pilot_active',
      'scaling',
      'production',
    ];
    for (const status of statuses) {
      const result = DeploymentSchema.safeParse({
        ...validConfig.deployment,
        status,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe('GeoTagSchema', () => {
  it('validates spoof detection levels', () => {
    for (const level of ['basic', 'enhanced', 'strict']) {
      const result = GeoTagSchema.safeParse({ ...validConfig.geoTag, spoofDetection: level });
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Loader
// ---------------------------------------------------------------------------
describe('loadJurisdictionConfig', () => {
  it('returns success with parsed config for valid input', () => {
    const outcome = loadJurisdictionConfig(validConfig);
    expect(outcome.success).toBe(true);
    if (outcome.success) {
      expect(outcome.config.identity.countryCode).toBe('XX');
    }
  });

  it('returns errors for invalid input', () => {
    const outcome = loadJurisdictionConfig({});
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      expect(outcome.errors.length).toBeGreaterThan(0);
    }
  });

  it('returns descriptive error paths', () => {
    const outcome = loadJurisdictionConfig({ identity: { countryCode: 'TOOLONG' } });
    expect(outcome.success).toBe(false);
    if (!outcome.success) {
      const identityError = outcome.errors.find((e) => e.startsWith('identity.'));
      expect(identityError).toBeDefined();
    }
  });
});

describe('validateJurisdictionConfig', () => {
  it('returns true for valid config', () => {
    expect(validateJurisdictionConfig(validConfig)).toBe(true);
  });

  it('returns false for invalid config', () => {
    expect(validateJurisdictionConfig({})).toBe(false);
  });
});
