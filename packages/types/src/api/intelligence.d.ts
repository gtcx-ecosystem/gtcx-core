export interface PanxVerifyRequest {
    eventType: string;
    payload: Record<string, unknown>;
    signatures: VerifierSignature[];
    requiredConfidence?: number;
}
export interface VerifierSignature {
    verifierId: string;
    signature: string;
    publicKey: string;
    timestamp: number;
    weight?: number;
}
export interface PanxVerifyResponse {
    eventId: string;
    verified: boolean;
    confidence: number;
    consensus: ConsensusResult;
    timestamp: number;
    attestation?: string;
}
export interface ConsensusResult {
    totalWeight: number;
    threshold: number;
    agreeing: number;
    dissenting: number;
    abstaining: number;
    breakdown: VerifierVote[];
}
export interface VerifierVote {
    verifierId: string;
    vote: 'agree' | 'disagree' | 'abstain';
    weight: number;
    reason?: string;
}
export interface CortexIngestRequest {
    events: CortexEvent[];
    source: string;
    batchId?: string;
}
export interface CortexEvent {
    type: string;
    timestamp: number;
    actorId?: string;
    subjectId?: string;
    subjectType?: string;
    data: Record<string, unknown>;
    location?: {
        latitude: number;
        longitude: number;
    };
}
export interface CortexIngestResponse {
    accepted: number;
    rejected: number;
    batchId: string;
    errors?: Array<{
        index: number;
        message: string;
    }>;
}
export interface CortexAnomalyAlert {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedEntity: {
        type: string;
        id: string;
    };
    detectedAt: number;
    evidence: Record<string, unknown>;
    recommendedActions?: string[];
}
export interface CortexAnalyticsQuery {
    metric: string;
    dimensions?: string[];
    filters?: Record<string, unknown>;
    timeRange: {
        start: number;
        end: number;
        granularity?: 'hour' | 'day' | 'week' | 'month';
    };
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
export interface CortexAnalyticsResponse {
    metric: string;
    data: Array<{
        timestamp: number;
        value: number;
        dimensions?: Record<string, string>;
    }>;
    summary: {
        total: number;
        average: number;
        min: number;
        max: number;
    };
}
export interface AnisaContextRequest {
    userId: string;
    location?: {
        country: string;
        region?: string;
    };
    language?: string;
    interactionType: string;
    previousContext?: string;
}
export interface AnisaContextResponse {
    contextId: string;
    culturalContext: CulturalContext;
    recommendations: CulturalRecommendation[];
    adaptations: UIAdaptation[];
}
export interface CulturalContext {
    locale: string;
    language: string;
    region: string;
    culturalNorms: string[];
    communicationStyle: string;
    formalityLevel: 'formal' | 'semi_formal' | 'informal';
    timeOrientation: string;
    trustFactors: string[];
}
export interface CulturalRecommendation {
    type: string;
    priority: number;
    recommendation: string;
    rationale: string;
}
export interface UIAdaptation {
    element: string;
    adaptation: string;
    value: unknown;
}
export interface AnisaInsightRequest {
    topic: string;
    context: {
        userId?: string;
        region?: string;
        industry?: string;
    };
    depth?: 'brief' | 'detailed' | 'comprehensive';
}
export interface AnisaInsightResponse {
    insightId: string;
    topic: string;
    summary: string;
    insights: Insight[];
    sources?: string[];
    confidence: number;
}
export interface Insight {
    title: string;
    content: string;
    relevance: number;
    actionable: boolean;
    suggestedActions?: string[];
}
//# sourceMappingURL=intelligence.d.ts.map