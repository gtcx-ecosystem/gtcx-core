// Core 12 Framework Schema
// The universal compliance framework harmonizing 120+ global standards
// Migrated from ComplianceOS to GTCX monorepo

// Import types and data
import { CORE12_DOMAINS } from './domains';
import type { Domain, Control } from './types';

// Re-export types
export type { Control, Domain, FrameworkMapping } from './types';

// Re-export domains
export { CORE12_DOMAINS };

// Helper functions
export function getDomain(domainId: string): Domain | undefined {
  return CORE12_DOMAINS.find((d) => d.id === domainId);
}

export function getControl(controlId: string): Control | undefined {
  for (const domain of CORE12_DOMAINS) {
    const control = domain.controls.find((c) => c.id === controlId);
    if (control) return control;
  }
  return undefined;
}

export function getAllControls(): Control[] {
  return CORE12_DOMAINS.flatMap((d) => d.controls);
}

export function getControlCount(): number {
  return getAllControls().length;
}

export function getPopulatedDomains(): Domain[] {
  return CORE12_DOMAINS.filter((d) => d.controls.length > 0);
}

export function isDomainPopulated(domainId: string): boolean {
  const domain = getDomain(domainId);
  return domain !== undefined && domain.controls.length > 0;
}
