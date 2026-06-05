import type { IComplianceRepository, Transaction } from './types';
import { checkKYCCompliance, checkProducerLicense, checkTraderLicense } from './validators';

export class VerificationMethods {
  constructor(private complianceRepo: IComplianceRepository | undefined) {}

  async checkProducerLicense(producerId: string) {
    return checkProducerLicense(producerId, this.complianceRepo);
  }

  async checkTraderLicense(traderId: string) {
    return checkTraderLicense(traderId, this.complianceRepo);
  }

  async checkKYCCompliance(transaction: Transaction) {
    return checkKYCCompliance(transaction, this.complianceRepo);
  }
}
