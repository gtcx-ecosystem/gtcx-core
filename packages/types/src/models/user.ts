// ============================================================================
// USER MODEL
// ============================================================================

export interface User {
  id: string;
  tradePassId: string;
  email?: string;
  phone?: string;
  profile: UserProfile;
  roles: UserRole[];
  status: UserStatus;
  preferences: UserPreferences;
  createdAt: number;
  updatedAt: number;
  lastActiveAt?: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName?: string;
  avatar?: string;
  locale: string;
  timezone: string;
  organization?: OrganizationRef;
}

export interface OrganizationRef {
  id: string;
  name: string;
  type: OrganizationType;
  role?: string;
}

export type OrganizationType =
  | 'mining_cooperative'
  | 'collection_center'
  | 'transport_company'
  | 'refinery'
  | 'trading_house'
  | 'government_agency'
  | 'ngo'
  | 'financial_institution';

export interface UserRole {
  role: string;
  scope?: string;
  grantedAt: number;
  grantedBy?: string;
  expiresAt?: number;
}

export type UserStatus =
  | 'pending_verification'
  | 'active'
  | 'suspended'
  | 'deactivated';

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  types: string[];
}

export interface PrivacyPreferences {
  showProfile: boolean;
  showActivity: boolean;
  allowAnalytics: boolean;
}
