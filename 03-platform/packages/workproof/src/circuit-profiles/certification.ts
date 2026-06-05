/** Generic certification bit indices (profiles compose masks). */
export const CertificationBit = {
  RegionalCertification: 0,
  OriginAuthenticated: 1,
  RegulatoryExportLicense: 2,
} as const;

export function certificationBitMask(bit: number): number {
  return 1 << bit;
}

export function certificationMaskSatisfied(flags: number, requiredMask: number): boolean {
  return (flags & requiredMask) === requiredMask;
}
