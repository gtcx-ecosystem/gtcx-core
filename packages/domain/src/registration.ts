/**
 * Asset Lot Registration Service
 * 
 * Commodity-agnostic business logic for registering asset discoveries.
 * Supports any commodity type (gold, cocoa, minerals, etc.) with
 * configurable validation rules and workflow steps.
 * 
 * Features:
 * - Runtime validation via Zod schemas (P2, P9)
 * - Event emission for observability (P12)
 * - Dependency injection for all externals (P4)
 * - Offline-first compatible (P8)
 * 
 * @package @gtcx/domain
 */

import type {
  AssetLot,
  AssetRegistrationData,
  WorkflowStep,
  RegistrationProgress,
  ValidationResult,
  CryptographicProof,
  AssetCertificate,
  ICryptoService,
  ILocationService,
  IStorageService,
  LocationWithAddress,
} from './types';

import {
  AssetRegistrationDataSchema,
  RegistrationConfigSchema,
  safeParse,
  type ValidatedRegistrationData,
} from './schemas';

import {
  DomainEventFactory,
  nullEventEmitter,
  type IDomainEventEmitter,
} from './events';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface RegistrationConfig {
  /** Minimum GPS accuracy required in meters */
  minGpsAccuracy: number;
  /** Minimum photos required */
  minPhotos: number;
  /** Maximum photos allowed */
  maxPhotos: number;
  /** Maximum age of discovery in days */
  maxDiscoveryAgeDays: number;
  /** Custom workflow steps (optional override) */
  workflowSteps?: WorkflowStep[];
  /** Required photo categories */
  requiredPhotoCategories?: string[];
  /** Verification endpoint base URL */
  verifyBaseUrl?: string;
}

const DEFAULT_CONFIG: RegistrationConfig = {
  minGpsAccuracy: 10,
  minPhotos: 2,
  maxPhotos: 10,
  maxDiscoveryAgeDays: 30,
  verifyBaseUrl: 'https://verify.gtcx.io',
};

// ============================================================================
// ASSET LOT REGISTRATION SERVICE
// ============================================================================

export class AssetLotRegistrationService {
  private cryptoService: ICryptoService;
  private locationService: ILocationService;
  private storageService: IStorageService;
  private eventEmitter: IDomainEventEmitter;
  private eventFactory: DomainEventFactory;
  private config: RegistrationConfig;

  constructor(
    dependencies: {
      cryptoService: ICryptoService;
      locationService: ILocationService;
      storageService: IStorageService;
      eventEmitter?: IDomainEventEmitter;
    },
    config: Partial<RegistrationConfig> = {}
  ) {
    this.cryptoService = dependencies.cryptoService;
    this.locationService = dependencies.locationService;
    this.storageService = dependencies.storageService;
    this.eventEmitter = dependencies.eventEmitter || nullEventEmitter;
    this.eventFactory = new DomainEventFactory();
    
    // Validate config at construction time
    const configResult = safeParse(RegistrationConfigSchema, config);
    if (!configResult.success) {
      throw new Error(`Invalid registration config: ${configResult.errors.join(', ')}`);
    }
    this.config = { ...DEFAULT_CONFIG, ...configResult.data };
  }

  // ==========================================================================
  // WORKFLOW MANAGEMENT
  // ==========================================================================

  /**
   * Get registration workflow steps
   * Override-able per commodity type
   */
  getWorkflowSteps(): WorkflowStep[] {
    if (this.config.workflowSteps) {
      return this.config.workflowSteps;
    }

    // Default commodity-agnostic workflow
    return [
      {
        id: 'location',
        title: 'Capture Location',
        description: 'GPS coordinates of discovery site',
        required: true,
        order: 1,
        icon: 'map-pin',
      },
      {
        id: 'photos',
        title: 'Photo Evidence',
        description: `Capture ${this.config.minPhotos}+ photos of the asset`,
        required: true,
        order: 2,
        icon: 'camera',
      },
      {
        id: 'details',
        title: 'Asset Details',
        description: 'Weight, quality, and commodity-specific attributes',
        required: true,
        order: 3,
        icon: 'clipboard',
      },
      {
        id: 'review',
        title: 'Review & Submit',
        description: 'Verify all information before registration',
        required: true,
        order: 4,
        icon: 'check-circle',
      },
    ];
  }

  // ==========================================================================
  // VALIDATION
  // ==========================================================================

  /**
   * Validate registration data with Zod schema
   * Returns detailed validation errors for UI feedback
   */
  validateRegistrationData(data: unknown): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Schema validation
    const schemaResult = safeParse(AssetRegistrationDataSchema, data);
    if (!schemaResult.success) {
      return {
        valid: false,
        errors: schemaResult.errors,
        warnings: [],
      };
    }

    const validData = schemaResult.data;

    // Business rule validation
    
    // GPS accuracy check
    if (
      validData.discoveryLocation.accuracy &&
      validData.discoveryLocation.accuracy > this.config.minGpsAccuracy
    ) {
      errors.push(
        `GPS accuracy (${validData.discoveryLocation.accuracy}m) exceeds maximum allowed (${this.config.minGpsAccuracy}m)`
      );
    }

    // Photo count check
    if (validData.photos.length < this.config.minPhotos) {
      errors.push(
        `Minimum ${this.config.minPhotos} photos required, got ${validData.photos.length}`
      );
    }

    if (validData.photos.length > this.config.maxPhotos) {
      errors.push(
        `Maximum ${this.config.maxPhotos} photos allowed, got ${validData.photos.length}`
      );
    }

    // Discovery age check
    if (validData.discoveryDate) {
      const discoveryDate = new Date(validData.discoveryDate);
      const maxAge = this.config.maxDiscoveryAgeDays * 24 * 60 * 60 * 1000;
      const age = Date.now() - discoveryDate.getTime();

      if (age > maxAge) {
        errors.push(
          `Discovery date exceeds maximum age of ${this.config.maxDiscoveryAgeDays} days`
        );
      }
    }

    // Weight validation with warnings
    if (validData.estimatedWeight > 10000) {
      warnings.push('Large weight detected - consider verification by multiple parties');
    }

    // Purity warnings
    if (validData.purity && validData.purity > 99) {
      warnings.push('Very high purity claimed - lab verification recommended');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ==========================================================================
  // PROGRESS TRACKING
  // ==========================================================================

  /**
   * Calculate registration progress
   */
  calculateProgress(data: Partial<AssetRegistrationData>): RegistrationProgress {
    const steps = this.getWorkflowSteps();
    const completedSteps: string[] = [];

    // Check location
    if (data.discoveryLocation?.latitude && data.discoveryLocation?.longitude) {
      completedSteps.push('location');
    }

    // Check photos
    if (data.photos && data.photos.length >= this.config.minPhotos) {
      completedSteps.push('photos');
    }

    // Check details
    if (data.estimatedWeight && data.commodityType) {
      completedSteps.push('details');
    }

    // Review is complete when all required steps are done
    const requiredSteps = steps.filter((s) => s.required).map((s) => s.id);
    const requiredComplete = requiredSteps
      .filter((id) => id !== 'review')
      .every((id) => completedSteps.includes(id));

    if (requiredComplete) {
      completedSteps.push('review');
    }

    const percentage = Math.round((completedSteps.length / steps.length) * 100);

    return {
      currentStep: completedSteps[completedSteps.length - 1] || steps[0].id,
      completedSteps,
      totalSteps: steps.length,
      percentage,
      canSubmit: percentage === 100,
    };
  }

  // ==========================================================================
  // REGISTRATION
  // ==========================================================================

  /**
   * Register a new asset lot
   * Performs validation, generates cryptographic proof, and stores the lot
   */
  async registerAssetLot(data: unknown): Promise<AssetLot> {
    const sessionId = this.generateSessionId();
    this.eventFactory.setCorrelationId(sessionId);

    // Emit start event
    const startPayload = {
      commodityType: (data as any)?.commodityType || 'unknown',
      producerId: (data as any)?.producerId || 'unknown',
      sessionId,
    };
    this.eventEmitter.emit(
      this.eventFactory.registration('registration.started', startPayload)
    );

    try {
      // Validate with Zod schema
      const schemaResult = safeParse(AssetRegistrationDataSchema, data);
      if (!schemaResult.success) {
        const error = new Error(`Validation failed: ${schemaResult.errors.join(', ')}`);
        this.eventEmitter.emit(
          this.eventFactory.registration('registration.failed', {
            commodityType: startPayload.commodityType,
            producerId: startPayload.producerId,
            error: error.message,
            validationErrors: schemaResult.errors,
          })
        );
        throw error;
      }

      const validData = schemaResult.data;

      // Business rule validation
      const validation = this.validateRegistrationData(validData);
      if (!validation.valid) {
        const error = new Error(`Business validation failed: ${validation.errors.join(', ')}`);
        this.eventEmitter.emit(
          this.eventFactory.registration('registration.failed', {
            commodityType: validData.commodityType,
            producerId: validData.producerId,
            error: error.message,
            validationErrors: validation.errors,
          })
        );
        throw error;
      }

      // Emit validated event
      this.eventEmitter.emit(
        this.eventFactory.registration('registration.validated', {
          commodityType: validData.commodityType,
          producerId: validData.producerId,
          sessionId,
        })
      );

      // Generate cryptographic proof
      const cryptoProof = await this.generateCryptoProof(validData);

      // Generate lot ID
      const lotId = this.generateLotId(validData);

      // Generate certificate
      const certificate = await this.generateCertificate(lotId, validData, cryptoProof);

      // Build asset lot
      const assetLot: AssetLot = {
        id: lotId,
        commodityType: validData.commodityType,
        producerId: validData.producerId,
        discoveryLocation: {
          latitude: validData.discoveryLocation.latitude,
          longitude: validData.discoveryLocation.longitude,
          altitude: validData.discoveryLocation.altitude,
          accuracy: validData.discoveryLocation.accuracy,
          timestamp: validData.discoveryLocation.timestamp || new Date().toISOString(),
        },
        photos: validData.photos.map((p) => ({
          id: p.id,
          uri: p.uri,
          timestamp: p.timestamp,
          hash: p.hash,
        })),
        estimatedWeight: validData.estimatedWeight,
        weightUnit: validData.weightUnit,
        form: validData.form,
        purity: validData.purity,
        qualityGrade: validData.qualityGrade,
        discoveryDate: validData.discoveryDate || new Date().toISOString(),
        assetDetails: validData.assetDetails || {},
        
        // Verification
        cryptoProof,
        certificateId: certificate.id,
        verificationStatus: 'pending',
        
        // Metadata
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        registrationSessionId: sessionId,
      };

      // Store asset lot
      await this.storageService.saveAssetLot(assetLot);
      await this.storageService.saveCertificate(certificate);

      // Emit completed event
      this.eventEmitter.emit(
        this.eventFactory.registration('registration.completed', {
          assetLotId: assetLot.id,
          commodityType: assetLot.commodityType,
          producerId: assetLot.producerId,
          certificateId: certificate.id,
          estimatedWeight: assetLot.estimatedWeight,
          weightUnit: assetLot.weightUnit,
        })
      );

      return assetLot;
    } catch (error) {
      // Ensure failure event is emitted for any error
      if (!(error instanceof Error && error.message.startsWith('Validation'))) {
        this.eventEmitter.emit(
          this.eventFactory.registration('registration.failed', {
            commodityType: startPayload.commodityType,
            producerId: startPayload.producerId,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        );
      }
      throw error;
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  /**
   * Generate cryptographic proof for asset data
   */
  protected async generateCryptoProof(
    data: ValidatedRegistrationData
  ): Promise<CryptographicProof> {
    const proofData = {
      commodityType: data.commodityType,
      producerId: data.producerId,
      location: data.discoveryLocation,
      weight: data.estimatedWeight,
      photoHashes: data.photos.map((p) => p.hash).filter(Boolean),
      timestamp: Date.now(),
    };

    const dataHash = await this.cryptoService.createHash(JSON.stringify(proofData));
    const signature = await this.cryptoService.sign(dataHash);

    return {
      version: '1.0',
      algorithm: 'Ed25519-SHA256',
      dataHash,
      signature,
      publicKey: await this.cryptoService.getPublicKey?.() || 'system',
      timestamp: Date.now(),
      proofType: 'registration',
    };
  }

  /**
   * Generate unique lot ID
   */
  protected generateLotId(data: ValidatedRegistrationData): string {
    const prefix = data.commodityType.substring(0, 3).toUpperCase();
    const lat = Math.abs(data.discoveryLocation.latitude).toFixed(2).replace('.', '');
    const lng = Math.abs(data.discoveryLocation.longitude).toFixed(2).replace('.', '');
    const time = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${prefix}-${lat}-${lng}-${time}-${random}`;
  }

  /**
   * Generate session ID for tracing
   */
  protected generateSessionId(): string {
    return `reg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Generate asset certificate
   */
  protected async generateCertificate(
    lotId: string,
    data: ValidatedRegistrationData,
    proof: CryptographicProof
  ): Promise<AssetCertificate> {
    const certificateId = `CERT-${lotId}`;

    return {
      id: certificateId,
      assetLotId: lotId,
      issuer: 'GTCX Protocol',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      commodityType: data.commodityType,
      producerId: data.producerId,
      weight: data.estimatedWeight,
      weightUnit: data.weightUnit,
      location: {
        latitude: data.discoveryLocation.latitude,
        longitude: data.discoveryLocation.longitude,
      },
      cryptoProofHash: proof.dataHash,
      verifyUrl: `${this.config.verifyBaseUrl}/${certificateId}`,
      qrData: JSON.stringify({
        id: certificateId,
        verify: `${this.config.verifyBaseUrl}/${certificateId}`,
        hash: proof.dataHash.substring(0, 16),
      }),
    };
  }
}

export default AssetLotRegistrationService;
