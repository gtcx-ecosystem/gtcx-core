/**
 * AI Integration Interfaces
 * 
 * Hooks for AI-powered analysis and decision support.
 * Completes P5 (AI-Native) principle.
 * 
 * @package @gtcx/domain
 */

import type { AssetLot, Transaction, ComplianceRecord, TradingOpportunity } from './types';
import type { OperationLogEntry } from './ai-logging';
import type { DomainEvent } from './events';

// ============================================================================
// AI CONTEXT TYPES
// ============================================================================

/**
 * Context provided to AI for analysis
 */
export interface AIAnalysisContext {
  /** Current operation being performed */
  operation: string;
  /** Relevant entities */
  entities: {
    assetLots?: AssetLot[];
    transactions?: Transaction[];
    complianceRecords?: ComplianceRecord[];
    opportunities?: TradingOpportunity[];
  };
  /** Historical data */
  history?: {
    events: DomainEvent[];
    operations: OperationLogEntry[];
    timeRange: { start: number; end: number };
  };
  /** Market context */
  market?: {
    commodityType: string;
    currentPrice: number;
    priceHistory: { timestamp: number; price: number }[];
    volatility?: number;
  };
  /** User context */
  user?: {
    id: string;
    role: string;
    preferences?: Record<string, unknown>;
  };
}

/**
 * AI analysis result
 */
export interface AIAnalysisResult<T = unknown> {
  /** Analysis type */
  type: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Analysis result */
  result: T;
  /** Reasoning/explanation */
  reasoning?: string;
  /** Suggested actions */
  suggestedActions?: AIAction[];
  /** Anomalies detected */
  anomalies?: AIAnomaly[];
  /** Timestamp */
  timestamp: number;
}

/**
 * AI-suggested action
 */
export interface AIAction {
  /** Action identifier */
  id: string;
  /** Action type */
  type: 'registration' | 'trade' | 'compliance' | 'alert' | 'notification';
  /** Action description */
  description: string;
  /** Priority (1-10) */
  priority: number;
  /** Parameters for the action */
  params?: Record<string, unknown>;
  /** Confidence in this recommendation */
  confidence: number;
}

/**
 * AI-detected anomaly
 */
export interface AIAnomaly {
  /** Anomaly identifier */
  id: string;
  /** Anomaly type */
  type: 'price' | 'location' | 'pattern' | 'compliance' | 'fraud' | 'quality';
  /** Severity (1-10) */
  severity: number;
  /** Description */
  description: string;
  /** Evidence */
  evidence: Record<string, unknown>;
  /** Confidence score */
  confidence: number;
}

// ============================================================================
// AI PROVIDER INTERFACE
// ============================================================================

/**
 * Interface for AI analysis providers
 * Implement this to integrate with your AI backend
 */
export interface IAIProvider {
  /**
   * Analyze registration data for anomalies
   */
  analyzeRegistration(
    assetLot: AssetLot,
    context?: AIAnalysisContext
  ): Promise<AIAnalysisResult<{
    qualityAssessment: 'high' | 'medium' | 'low';
    priceEstimate: { min: number; max: number; expected: number };
    riskFactors: string[];
  }>>;
  
  /**
   * Analyze trading opportunity
   */
  analyzeTrade(
    opportunity: TradingOpportunity,
    context?: AIAnalysisContext
  ): Promise<AIAnalysisResult<{
    recommendation: 'buy' | 'sell' | 'hold' | 'avoid';
    fairPriceRange: { min: number; max: number };
    riskLevel: 'low' | 'medium' | 'high';
  }>>;
  
  /**
   * Analyze compliance patterns
   */
  analyzeCompliance(
    records: ComplianceRecord[],
    context?: AIAnalysisContext
  ): Promise<AIAnalysisResult<{
    trendDirection: 'improving' | 'stable' | 'declining';
    riskAreas: string[];
    recommendations: string[];
  }>>;
  
  /**
   * Detect fraud patterns
   */
  detectFraud(
    transactions: Transaction[],
    context?: AIAnalysisContext
  ): Promise<AIAnalysisResult<{
    suspiciousTransactions: string[];
    patterns: string[];
    riskScore: number;
  }>>;
  
  /**
   * Generate insights from operations
   */
  generateInsights(
    operations: OperationLogEntry[],
    context?: AIAnalysisContext
  ): Promise<AIAnalysisResult<{
    performanceInsights: string[];
    optimizationSuggestions: string[];
    alertConditions: string[];
  }>>;
}

// ============================================================================
// NULL AI PROVIDER
// ============================================================================

/**
 * Null AI provider for when AI is not configured
 */
export const nullAIProvider: IAIProvider = {
  async analyzeRegistration() {
    return {
      type: 'registration_analysis',
      confidence: 0,
      result: {
        qualityAssessment: 'medium' as const,
        priceEstimate: { min: 0, max: 0, expected: 0 },
        riskFactors: [],
      },
      timestamp: Date.now(),
    };
  },
  
  async analyzeTrade() {
    return {
      type: 'trade_analysis',
      confidence: 0,
      result: {
        recommendation: 'hold' as const,
        fairPriceRange: { min: 0, max: 0 },
        riskLevel: 'medium' as const,
      },
      timestamp: Date.now(),
    };
  },
  
  async analyzeCompliance() {
    return {
      type: 'compliance_analysis',
      confidence: 0,
      result: {
        trendDirection: 'stable' as const,
        riskAreas: [],
        recommendations: [],
      },
      timestamp: Date.now(),
    };
  },
  
  async detectFraud() {
    return {
      type: 'fraud_detection',
      confidence: 0,
      result: {
        suspiciousTransactions: [],
        patterns: [],
        riskScore: 0,
      },
      timestamp: Date.now(),
    };
  },
  
  async generateInsights() {
    return {
      type: 'insights',
      confidence: 0,
      result: {
        performanceInsights: [],
        optimizationSuggestions: [],
        alertConditions: [],
      },
      timestamp: Date.now(),
    };
  },
};

// ============================================================================
// AI HOOKS FOR SERVICES
// ============================================================================

/**
 * AI hooks that can be injected into services
 */
export interface AIServiceHooks {
  /** Called before registration */
  onBeforeRegistration?: (data: unknown) => Promise<{
    proceed: boolean;
    warnings?: string[];
    modifications?: Record<string, unknown>;
  }>;
  
  /** Called after registration */
  onAfterRegistration?: (assetLot: AssetLot) => Promise<void>;
  
  /** Called before trade execution */
  onBeforeTrade?: (request: unknown) => Promise<{
    proceed: boolean;
    warnings?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  }>;
  
  /** Called after trade execution */
  onAfterTrade?: (transaction: Transaction) => Promise<void>;
  
  /** Called when compliance violation detected */
  onComplianceViolation?: (record: ComplianceRecord) => Promise<{
    escalate: boolean;
    alertRecipients?: string[];
  }>;
  
  /** Called periodically for pattern analysis */
  onAnalysisCycle?: () => Promise<AIAnalysisResult[]>;
}

/**
 * Default AI hooks (no-op)
 */
export const defaultAIHooks: AIServiceHooks = {
  onBeforeRegistration: async () => ({ proceed: true }),
  onAfterRegistration: async () => {},
  onBeforeTrade: async () => ({ proceed: true }),
  onAfterTrade: async () => {},
  onComplianceViolation: async () => ({ escalate: false }),
  onAnalysisCycle: async () => [],
};

// ============================================================================
// AI CONTEXT BUILDER
// ============================================================================

/**
 * Helper to build AI analysis context
 */
export class AIContextBuilder {
  private context: Partial<AIAnalysisContext> = {};
  
  operation(op: string): this {
    this.context.operation = op;
    return this;
  }
  
  withAssetLots(lots: AssetLot[]): this {
    this.context.entities = { ...this.context.entities, assetLots: lots };
    return this;
  }
  
  withTransactions(txs: Transaction[]): this {
    this.context.entities = { ...this.context.entities, transactions: txs };
    return this;
  }
  
  withComplianceRecords(records: ComplianceRecord[]): this {
    this.context.entities = { ...this.context.entities, complianceRecords: records };
    return this;
  }
  
  withMarket(market: AIAnalysisContext['market']): this {
    this.context.market = market;
    return this;
  }
  
  withUser(user: AIAnalysisContext['user']): this {
    this.context.user = user;
    return this;
  }
  
  withHistory(events: DomainEvent[], operations: OperationLogEntry[], days = 7): this {
    const now = Date.now();
    const start = now - days * 24 * 60 * 60 * 1000;
    this.context.history = {
      events: events.filter(e => e.timestamp >= start),
      operations: operations.filter(o => o.startTime >= start),
      timeRange: { start, end: now },
    };
    return this;
  }
  
  build(): AIAnalysisContext {
    return {
      operation: this.context.operation || 'unknown',
      entities: this.context.entities || {},
      ...this.context,
    };
  }
}
