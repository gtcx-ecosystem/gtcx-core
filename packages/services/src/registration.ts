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
 * Package: @gtcx/services
 */

import {
  DomainEventFactory,
  ServiceMetrics,
  nullEventEmitter,
  nullMetricsCollector,
  nullOperationLogger,
  type IDomainEventEmitter,
  type IMetricsCollector,
  type IOperationLogger,
  AssetRegistrationDataSchema,
  RegistrationConfigSchema,
  safeParse,
  type ValidatedRegistrationData,
  type AssetLot,
  type WorkflowStep,
  type RegistrationProgress,
  type ICryptoService,
  type ILocationService,
  type IStorageService,
} from '@gtcx/domain';

import {
  buildAssetLot,
  generateCertificate,
  generateCryptoProof,
  generateLotId,
  generateSessionId,
} from './registration/helpers';
import { ValidationError, DEFAULT_CONFIG } from './registration/types';
import type { RegistrationConfig } from './registration/types';
import {
  createBusinessValidationError,
  createValidationError,
  validateRegistrationData,
} from './registration/validation';

export { ValidationError };
export type { RegistrationConfig };

// ============================================================================
// ASSET LOT REGISTRATION SERVICE
// ============================================================================

export class AssetLotRegistrationService {
  private cryptoService: ICryptoService;
  private locationService: ILocationService;
  private storageService: IStorageService;
  private eventEmitter: IDomainEventEmitter;
  private metrics: ServiceMetrics;
  private operationLogger: IOperationLogger;
  private eventFactory: DomainEventFactory;
  private config: RegistrationConfig;

  constructor(
    dependencies: {
      cryptoService: ICryptoService;
      locationService: ILocationService;
      storageService: IStorageService;
      eventEmitter?: IDomainEventEmitter;
      metricsCollector?: IMetricsCollector;
      operationLogger?: IOperationLogger;
    },
    config: Partial<RegistrationConfig> = {}
  ) {
    this.cryptoService = dependencies.cryptoService;
    this.locationService = dependencies.locationService;
    this.storageService = dependencies.storageService;
    this.eventEmitter = dependencies.eventEmitter || nullEventEmitter;
    this.metrics = new ServiceMetrics(
      dependencies.metricsCollector || nullMetricsCollector,
      'registration'
    );
    this.operationLogger = dependencies.operationLogger || nullOperationLogger;
    this.eventFactory = new DomainEventFactory();

    // Validate config at construction time
    const configResult = safeParse(RegistrationConfigSchema, config);
    if (!configResult.success) {
      const messages = configResult.error.errors.map((issue) => issue.message);
      throw new ValidationError(`Invalid registration config: ${messages.join(', ')}`);
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

    this.config = { ...DEFAULT_CONFIG, ...configResult.data, workflowSteps } as RegistrationConfig;
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
  validateRegistrationData(data: unknown) {
    return validateRegistrationData(data, this.config);
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
    const sessionId = generateSessionId();

    const dataRecord =
      data != null && typeof data === 'object' ? (data as Record<string, unknown>) : {};
    const startPayload = {
      commodityType:
        typeof dataRecord['commodityType'] === 'string' ? dataRecord['commodityType'] : 'unknown',
      producerId:
        typeof dataRecord['producerId'] === 'string' ? dataRecord['producerId'] : 'unknown',
      sessionId,
    };
    this.eventEmitter.emit(
      this.eventFactory.registration('registration.started', startPayload, sessionId)
    );

    try {
      const validData = await this.validateRegistration(data, startPayload, sessionId);
      const proofBase = await generateCryptoProof(validData, this.cryptoService);
      const lotId = generateLotId(validData);
      const certificate = await generateCertificate(lotId, validData, proofBase);
      const cryptoProof = { hash: proofBase.hash, signature: proofBase.signature, certificate };
      const assetLot = buildAssetLot(lotId, validData, cryptoProof, certificate, sessionId);

      await this.storageService.saveAssetLot(assetLot);
      await this.storageService.saveCertificate(certificate);

      this.eventEmitter.emit(
        this.eventFactory.registration(
          'registration.completed',
          {
            assetLotId: assetLot.id,
            commodityType: assetLot.commodityType,
            producerId: assetLot.producerId,
            certificateId: certificate.id,
            estimatedWeight: assetLot.weight,
            weightUnit: assetLot.weightUnit,
          },
          sessionId
        )
      );

      return assetLot;
    } catch (error) {
      if (!(error instanceof ValidationError)) {
        this.eventEmitter.emit(
          this.eventFactory.registration(
            'registration.failed',
            {
              commodityType: startPayload.commodityType,
              producerId: startPayload.producerId,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            sessionId
          )
        );
      }
      throw error;
    }
  }

  // ==========================================================================
  // REGISTRATION HELPERS
  // ==========================================================================

  private async validateRegistration(
    data: unknown,
    startPayload: { commodityType: string; producerId: string },
    sessionId: string
  ): Promise<ValidatedRegistrationData> {
    const schemaResult = safeParse(AssetRegistrationDataSchema, data);
    if (!schemaResult.success) {
      const messages = schemaResult.error.errors.map((issue) => issue.message);
      const error = createValidationError(messages);
      this.eventEmitter.emit(
        this.eventFactory.registration(
          'registration.failed',
          {
            commodityType: startPayload.commodityType,
            producerId: startPayload.producerId,
            error: error.message,
            validationErrors: messages,
          },
          sessionId
        )
      );
      throw error;
    }

    const validData = schemaResult.data;

    const validation = this.validateRegistrationData(validData);
    if (!validation.isValid) {
      const error = createBusinessValidationError(validation.errors);
      this.eventEmitter.emit(
        this.eventFactory.registration(
          'registration.failed',
          {
            commodityType: validData.commodityType,
            producerId: validData.producerId,
            error: error.message,
            validationErrors: validation.errors,
          },
          sessionId
        )
      );
      throw error;
    }

    this.eventEmitter.emit(
      this.eventFactory.registration(
        'registration.validated',
        {
          commodityType: validData.commodityType,
          producerId: validData.producerId,
          sessionId,
        },
        sessionId
      )
    );

    return validData;
  }
}
