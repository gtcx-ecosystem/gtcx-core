// Core 12 Framework Types
// Shared types for the Core 12 compliance framework

export interface Control {
  id: string;
  name: string;
  description: string;
  evidenceRequirements: {
    primary: string[];
    supporting: string[];
  };
  verificationMethod: string;
  scoringCriteria: {
    complete: string;
    partial: string;
    gap: string;
  };
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  controls: Control[];
}

export interface FrameworkMapping {
  frameworkId: string;
  frameworkName: string;
  clause: string;
  mappingType: 'direct' | 'partial' | 'interpretive';
  notes: string;
}
