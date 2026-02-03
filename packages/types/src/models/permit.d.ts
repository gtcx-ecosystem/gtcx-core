export interface Permit {
    id: string;
    permitNumber: string;
    type: PermitType;
    jurisdiction: string;
    applicant: PermitApplicant;
    scope: PermitScope;
    conditions: PermitCondition[];
    workflow: PermitWorkflow;
    status: PermitStatus;
    fees: PermitFee[];
    documents: PermitDocument[];
    issuedAt?: number;
    expiresAt?: number;
    createdAt: number;
    updatedAt: number;
}
export type PermitType = 'mining_license' | 'small_scale_mining' | 'artisanal_mining' | 'exploration' | 'processing' | 'trading' | 'export' | 'import' | 'transport' | 'environmental';
export interface PermitApplicant {
    tradePassId: string;
    name: string;
    type: 'individual' | 'organization';
    organizationId?: string;
    contactInfo: {
        email?: string;
        phone?: string;
        address?: string;
    };
}
export interface PermitScope {
    commodity: string[];
    regions: string[];
    sites?: string[];
    volumeLimit?: {
        amount: number;
        unit: string;
        period: 'daily' | 'monthly' | 'yearly' | 'total';
    };
    activities: string[];
}
export interface PermitCondition {
    id: string;
    type: string;
    description: string;
    mandatory: boolean;
    verificationMethod?: string;
    compliance?: {
        status: 'compliant' | 'non_compliant' | 'pending';
        lastChecked?: number;
        notes?: string;
    };
}
export interface PermitWorkflow {
    currentStep: string;
    steps: WorkflowStep[];
    history: WorkflowEvent[];
}
export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    assignedTo?: string;
    requiredApprovals: number;
    approvals: WorkflowApproval[];
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped';
    dueDate?: number;
}
export interface WorkflowApproval {
    approverId: string;
    approverName: string;
    decision: 'approved' | 'rejected' | 'pending';
    comments?: string;
    decidedAt?: number;
}
export interface WorkflowEvent {
    id: string;
    type: string;
    actor: string;
    description: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}
export type PermitStatus = 'draft' | 'submitted' | 'under_review' | 'pending_approval' | 'approved' | 'issued' | 'active' | 'suspended' | 'expired' | 'revoked' | 'rejected';
export interface PermitFee {
    id: string;
    type: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'waived' | 'refunded';
    dueDate?: number;
    paidAt?: number;
    receipt?: string;
}
export interface PermitDocument {
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: number;
    uploadedBy: string;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: number;
}
//# sourceMappingURL=permit.d.ts.map