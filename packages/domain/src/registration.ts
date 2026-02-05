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

import { DomainEventFactory, nullEventEmitter, type IDomainEventEmitter } from './events';
import {
  AssetRegistrationDataSchema,
  RegistrationConfigSchema,
  safeParse,
  type ValidatedRegistrationData,
} from './schemas';
import type {
  AssetLot,
  WorkflowStep,
  RegistrationProgress,
  ValidationResult,
  CryptographicProof,
  AssetCertificate,
  ICryptoService,
  ILocationService,
  IStorageService,
} from './types';

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
      const messages = configResult.error.errors.map((issue) => issue.message);
      throw new Error(`Invalid registration config: ${messages.join(', ')}`);
    }
    const workflowSteps = configResult.data.workflowSteps?.map((step, index) => ({
      id: step.id,
      title: step.title,
      description: step.title,
      icon: 'check-circle',
      color: 'blue',
      duration: '1 min',
      isRequired: step.required,
      isCompleted: false,
      order: index + 1,
    }));

    this.config = { ...DEFAULT_CONFIG, ...configResult.data, workflowSteps };
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
        icon: 'map-pin',
        color: 'blue',
        duration: '2 min',
        isRequired: true,
        isCompleted: false,
        order: 1,
      },
      {
        id: 'photos',
        title: 'Photo Evidence',
        description: `Capture ${this.config.minPhotos}+ photos of the asset`,
        icon: 'camera',
        color: 'orange',
        duration: '5 min',
        isRequired: true,
        isCompleted: false,
        order: 2,
      },
      {
        id: 'details',
        title: 'Asset Details',
        description: 'Weight, quality, and commodity-specific attributes',
        icon: 'clipboard',
        color: 'purple',
        duration: '3 min',
        isRequired: true,
        isCompleted: false,
        order: 3,
      },
      {
        id: 'review',
        title: 'Review & Submit',
        description: 'Verify all information before registration',
        icon: 'check-circle',
        color: 'green',
        duration: '2 min',
        isRequired: true,
        isCompleted: false,
        order: 4,
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
        isValid: false,
        errors: schemaResult.error.errors.map((issue) => issue.message),
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
      isValid: errors.length === 0,
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
  calculateProgress(data: Partial<ValidatedRegistrationData>): RegistrationProgress {
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
    const requiredSteps = steps.filter((s) => s.isRequired).map((s) => s.id);
    const requiredComplete = requiredSteps
      .filter((id) => id !== 'review')
      .every((id) => completedSteps.includes(id));

    if (requiredComplete) {
      completedSteps.push('review');
    }

    const percentage = Math.round((completedSteps.length / steps.length) * 100);
    const nextStep = steps.find((step) => !completedSteps.includes(step.id))?.id ?? null;

    return {
      percentage,
      completedSteps,
      nextStep,
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
    this.eventEmitter.emit(this.eventFactory.registration('registration.started', startPayload));

    try {
      // Validate with Zod schema
      const schemaResult = safeParse(AssetRegistrationDataSchema, data);
      if (!schemaResult.success) {
        const messages = schemaResult.error.errors.map((issue) => issue.message);
        const error = new Error(`Validation failed: ${messages.join(', ')}`);
        this.eventEmitter.emit(
          this.eventFactory.registration('registration.failed', {
            commodityType: startPayload.commodityType,
            producerId: startPayload.producerId,
            error: error.message,
            validationErrors: messages,
          })
        );
        throw error;
      }

      const validData = schemaResult.data;

      // Business rule validation
      const validation = this.validateRegistrationData(validData);
      if (!validation.isValid) {
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
      const proofBase = await this.generateCryptoProof(validData);

      // Generate lot ID
      const lotId = this.generateLotId(validData);

      // Generate certificate
      const certificate = await this.generateCertificate(lotId, validData, proofBase);
      const cryptoProof: CryptographicProof = {
        hash: proofBase.hash,
        signature: proofBase.signature,
        certificate,
      };

      // Build asset lot
      const qualityGrade =
        validData.quality === 'high'
          ? 'A'
          : validData.quality === 'medium'
            ? 'B'
            : validData.quality === 'low'
              ? 'C'
              : 'ungraded';

      const assetLot: AssetLot = {
        id: lotId,
        commodityType: validData.commodityType,
        producerId: validData.producerId,
        discoveryLocation: {
          latitude: validData.discoveryLocation.latitude,
          longitude: validData.discoveryLocation.longitude,
          altitude: validData.discoveryLocation.altitude,
          accuracy: validData.discoveryLocation.accuracy,
          timestamp: validData.discoveryLocation.timestamp,
        },
        discoveryDate: validData.discoveryDate || new Date().toISOString(),
        weight: validData.estimatedWeight,
        weightUnit: validData.weightUnit,
        form: validData.form,
        purity: validData.purity,
        qualityGrade,
        status: 'registered',
        cryptoProof: cryptoProof.hash,
        certificateId: certificate.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          photos: validData.photos,
          assetDetails: validData.assetDetails || {},
          registrationSessionId: sessionId,
          cryptoProof,
        },
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
          estimatedWeight: assetLot.weight,
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
  ): Promise<{ hash: string; signature: string }> {
    const proofData = {
      commodityType: data.commodityType,
      producerId: data.producerId,
      location: data.discoveryLocation,
      weight: data.estimatedWeight,
      photoHashes: data.photos.map((p) => p.hash).filter(Boolean),
      timestamp: Date.now(),
    };

    const hash = await this.cryptoService.createHash(JSON.stringify(proofData));
    const signature = await this.cryptoService.sign(hash);

    return {
      hash,
      signature,
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
    proof: { hash: string; signature: string }
  ): Promise<AssetCertificate> {
    const certificateId = `CERT-${lotId}`;

    return {
      id: certificateId,
      lotId,
      hash: proof.hash,
      signature: proof.signature,
      timestamp: new Date().toISOString(),
      producerLicense: data.producerId,
      location: {
        latitude: data.discoveryLocation.latitude,
        longitude: data.discoveryLocation.longitude,
        accuracy: data.discoveryLocation.accuracy,
        altitude: data.discoveryLocation.altitude,
        timestamp: data.discoveryLocation.timestamp,
      },
      assetCharacteristics: data.assetDetails || {},
      verificationLevel: 'preliminary',
      issuedBy: 'GTCX Protocol',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

export default AssetLotRegistrationService;
