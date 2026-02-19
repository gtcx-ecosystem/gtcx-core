# TradePass Identity Core

| Attribute    | Value                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Type**     | Protocol Specification                                                                                                    |
| **Status**   | Publication-Ready                                                                                                         |
| **Priority** | P0 (Foundation)                                                                                                           |
| **Related**  | [Data Models](./data-models.md), [Security Framework](./security-framework.md), [@gtcx/identity](../packages/identity.md) |

## Overview

TradePass™ is the universal identity container linking real-world individuals and organizations to their verifiable credentials. Every participant in the GTCX ecosystem holds a TradePass™ identity that:

- Establishes cryptographic identity
- Links to role-based credentials (Producer ID™, Trader ID™, etc.)
- Enables biometric authentication
- Supports progressive verification levels

---

## Dependencies

**Required**:

- A-01: Database Schema (identities table)
- A-02: Authentication (session management)
- A-03: Cryptographic Primitives (key generation, signing)

**Used By**:

- B-02: Credential Schema Registry
- B-03: Credential Issuance
- All operator credentials (Producer ID™, Trader ID™, etc.)

---

## Identity Architecture

### DID Structure

```
did:gtcx:tp:{uuid}

Examples:
did:gtcx:tp:550e8400-e29b-41d4-a716-446655440000  (Individual)
did:gtcx:tp:6ba7b810-9dad-11d1-80b4-00c04fd430c8  (Organization)
did:gtcx:tp:6ba7b814-9dad-11d1-80b4-00c04fd430c8  (Government)
```

### Verification Levels

| Level | Name           | Requirements               | Capabilities        |
| ----- | -------------- | -------------------------- | ------------------- |
| L0    | Unverified     | Phone/email only           | View only           |
| L1    | Basic          | Government ID uploaded     | Hold T3 credentials |
| L2    | Verified       | ID + liveness check        | Hold T2 credentials |
| L3    | Fully Verified | ID + biometric + in-person | Hold T1 credentials |
| L4    | Government     | Government enrollment      | Issue credentials   |

---

## Data Models

### TradePass™ Identity

```typescript
interface TradePassIdentity {
  // Core identification
  id: UUID;
  did: string; // did:gtcx:tp:{uuid}
  type: 'INDIVIDUAL' | 'ORGANIZATION' | 'GOVERNMENT';

  // Verification
  verificationLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  verifiedAt?: ISODateTime;
  verifiedBy?: TradePassId;

  // Personal data (INDIVIDUAL)
  person?: {
    givenName: string;
    familyName: string;
    otherNames?: string;
    dateOfBirth?: ISODate;
    gender?: 'M' | 'F' | 'O';
    nationality?: CountryCode;
    nationalId?: {
      type: string; // 'PASSPORT', 'NATIONAL_ID', 'VOTER_ID'
      number: string; // Encrypted
      country: CountryCode;
      expiresAt?: ISODate;
      verifiedAt?: ISODateTime;
    };
  };

  // Organization data (ORGANIZATION, GOVERNMENT)
  organization?: {
    legalName: string;
    tradingName?: string;
    type: 'COMPANY' | 'COOPERATIVE' | 'ASSOCIATION' | 'GOVERNMENT_AGENCY';
    registrationNumber?: string;
    registrationCountry?: CountryCode;
    incorporationDate?: ISODate;
    taxId?: string;
    representatives: TradePassId[]; // Authorized signers
  };

  // Contact
  contact: {
    phone?: string; // E.164 format
    phoneVerified?: boolean;
    email?: string;
    emailVerified?: boolean;
    address?: PhysicalAddress;
    preferredLanguage?: string; // ISO 639-1
  };

  // Cryptographic identity
  keys: {
    current: KeyPair;
    previous?: KeyPair[];
    rotatedAt?: ISODateTime;
  };

  // Biometrics (hashed references)
  biometrics?: {
    fingerprint?: BiometricEnrollment;
    face?: BiometricEnrollment;
    voice?: BiometricEnrollment;
  };

  // Credentials held
  credentials: CredentialReference[];

  // Jurisdiction
  primaryJurisdiction: JurisdictionCode;
  additionalJurisdictions?: JurisdictionCode[];

  // Status
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED' | 'PENDING';
  statusReason?: string;
  statusChangedAt?: ISODateTime;

  // Metadata
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  lastActiveAt?: ISODateTime;
}

interface KeyPair {
  id: string; // kid for JWT
  algorithm: 'ED25519' | 'SECP256K1';
  publicKey: string; // Base64
  createdAt: ISODateTime;
  expiresAt?: ISODateTime;
}

interface BiometricEnrollment {
  templateHash: string; // Hash of biometric template
  enrolledAt: ISODateTime;
  deviceId: string;
  quality: number; // 0-100
}

interface CredentialReference {
  id: CredentialId;
  type: CredentialType;
  subtype: OperatorSubtype;
  status: CredentialStatus;
  issuedAt: ISODateTime;
  expiresAt: ISODateTime;
}
```

### DID Document

```typescript
interface DIDDocument {
  '@context': ['https://www.w3.org/ns/did/v1', 'https://gtcx.org/contexts/tradepass/v2'];
  id: string; // did:gtcx:tp:{uuid}

  verificationMethod: [
    {
      id: string; // did:gtcx:tp:{uuid}#key-1
      type: string; // Ed25519VerificationKey2020
      controller: string; // did:gtcx:tp:{uuid}
      publicKeyMultibase: string;
    },
  ];

  authentication: [string]; // References to verificationMethod
  assertionMethod: [string];
  capabilityDelegation?: [string];

  service?: [
    {
      id: string;
      type: string;
      serviceEndpoint: string;
    },
  ];
}
```

---

## API Endpoints

### Identity Management

```yaml
POST /identities:
  description: Create new TradePass™ identity
  request:
    type: string (INDIVIDUAL | ORGANIZATION)
    person?: object
    organization?: object
    contact: object
    jurisdiction: string
  response:
    identity: TradePassIdentity
    did: string
    recovery_codes: string[] (one-time display)
  validations:
    - Phone or email required
    - Jurisdiction must be valid ISO 3166-2

GET /identities/{id}:
  description: Get identity details
  params:
    id: UUID or DID
  response:
    identity: TradePassIdentity
  authorization:
    - Self (full access)
    - Government (full access in jurisdiction)
    - Verifier (limited public fields)

PATCH /identities/{id}:
  description: Update identity
  request:
    person?: object (partial update)
    organization?: object (partial update)
    contact?: object (partial update)
  response:
    identity: TradePassIdentity
  authorization:
    - Self only

DELETE /identities/{id}:
  description: Deactivate identity (soft delete)
  authorization:
    - Self (with confirmation)
    - Government (with legal order)
```

### Verification

```yaml
POST /identities/{id}/verify/phone:
  description: Initiate phone verification
  request:
    phone: string (E.164)
  response:
    verification_id: string
    expires_in: number (seconds)

POST /identities/{id}/verify/phone/confirm:
  description: Confirm phone with OTP
  request:
    verification_id: string
    code: string (6 digits)
  response:
    verified: boolean

POST /identities/{id}/verify/document:
  description: Submit identity document for verification
  request:
    document_type: string (PASSPORT | NATIONAL_ID | VOTER_ID)
    document_country: string
    front_image: string (base64)
    back_image?: string (base64)
  response:
    verification_id: string
    status: PENDING | APPROVED | REJECTED

POST /identities/{id}/verify/liveness:
  description: Perform liveness check
  request:
    video: string (base64, 5-10 seconds)
    challenge_response: string (spoken words)
  response:
    verified: boolean
    confidence: number (0-100)
```

### Key Management

```yaml
POST /identities/{id}/keys/rotate:
  description: Rotate cryptographic keys
  request:
    reason?: string
  response:
    new_key: KeyPair
    previous_key: KeyPair (for transition period)
  authorization:
    - Self (with MFA)

GET /identities/{id}/did-document:
  description: Get DID Document for identity
  response: DIDDocument
```

### Credentials

```yaml
GET /identities/{id}/credentials:
  description: List all credentials held by identity
  params:
    status?: string (ACTIVE | ALL)
    type?: string[]
  response:
    credentials: CredentialReference[]

GET /identities/{id}/credentials/{credential_id}:
  description: Get specific credential details
  response:
    credential: FullCredential
```

---

## Business Logic

### Identity Creation Service

```ruby
class IdentityCreationService
  def create(params)
    ActiveRecord::Base.transaction do
      # 1. Validate input
      validate_params!(params)

      # 2. Check for duplicates
      check_duplicate_identity!(params)

      # 3. Generate DID
      did = generate_did

      # 4. Generate key pair
      key_pair = generate_key_pair

      # 5. Create identity record
      identity = Identity.create!(
        did: did,
        type: params[:type],
        person_data: encrypt_pii(params[:person]),
        organization_data: params[:organization],
        contact_data: params[:contact],
        primary_jurisdiction: params[:jurisdiction],
        verification_level: 'L0',
        keys: { current: key_pair },
        status: 'PENDING'
      )

      # 6. Create auth credentials
      AuthCredential.create!(
        identity: identity,
        type: 'PASSWORD',
        credential_hash: hash_password(params[:password])
      )

      # 7. Generate recovery codes
      recovery_codes = generate_recovery_codes(identity)

      # 8. Send verification request
      send_verification_request(identity, params[:contact])

      # 9. Emit event
      emit_event('identity.created', identity)

      {
        identity: identity,
        did: did,
        recovery_codes: recovery_codes
      }
    end
  end

  private

  def generate_did
    uuid = SecureRandom.uuid
    "did:gtcx:tp:#{uuid}"
  end

  def generate_key_pair
    # ED25519 key generation
    signing_key = Ed25519::SigningKey.generate
    {
      id: "key-#{Time.now.to_i}",
      algorithm: 'ED25519',
      public_key: Base64.strict_encode64(signing_key.verify_key.to_bytes),
      created_at: Time.current.iso8601
    }
  end

  def check_duplicate_identity!(params)
    # Check phone uniqueness
    if params.dig(:contact, :phone)
      existing = Identity.where("contact_data->>'phone' = ?", params[:contact][:phone]).exists?
      raise DuplicatePhone if existing
    end

    # Check email uniqueness
    if params.dig(:contact, :email)
      existing = Identity.where("contact_data->>'email' = ?", params[:contact][:email]).exists?
      raise DuplicateEmail if existing
    end

    # Check national ID uniqueness
    if params.dig(:person, :nationalId, :number)
      # Search encrypted field (requires special handling)
      raise DuplicateNationalId if national_id_exists?(params[:person][:nationalId])
    end
  end
end
```

### Verification Level Upgrade

```ruby
class VerificationUpgradeService
  LEVEL_REQUIREMENTS = {
    'L1' => [:phone_verified, :document_uploaded],
    'L2' => [:phone_verified, :document_verified, :liveness_passed],
    'L3' => [:phone_verified, :document_verified, :liveness_passed, :biometric_enrolled, :in_person_verified],
    'L4' => [:government_attestation]
  }.freeze

  def upgrade(identity:, target_level:)
    current_level = identity.verification_level
    target_num = level_to_num(target_level)
    current_num = level_to_num(current_level)

    raise InvalidUpgrade, "Cannot downgrade" if target_num < current_num
    raise InvalidUpgrade, "Already at level" if target_num == current_num

    # Check all requirements
    requirements = LEVEL_REQUIREMENTS[target_level]
    missing = requirements.reject { |req| requirement_met?(identity, req) }

    if missing.any?
      raise MissingRequirements.new(missing)
    end

    # Upgrade
    identity.update!(
      verification_level: target_level,
      verified_at: Time.current
    )

    emit_event('identity.verification_upgraded', identity, {
      from: current_level,
      to: target_level
    })

    identity
  end

  private

  def requirement_met?(identity, requirement)
    case requirement
    when :phone_verified
      identity.contact_data['phoneVerified'] == true
    when :document_uploaded
      identity.person_data&.dig('nationalId').present?
    when :document_verified
      identity.person_data&.dig('nationalId', 'verifiedAt').present?
    when :liveness_passed
      LivenessCheck.where(identity: identity, passed: true).exists?
    when :biometric_enrolled
      identity.biometric_data.present?
    when :in_person_verified
      InPersonVerification.where(identity: identity, status: 'approved').exists?
    when :government_attestation
      GovernmentAttestation.where(identity: identity, valid: true).exists?
    end
  end
end
```

### DID Document Generator

```ruby
class DIDDocumentService
  def generate(identity)
    {
      "@context" => [
        "https://www.w3.org/ns/did/v1",
        "https://gtcx.org/contexts/tradepass/v2"
      ],
      "id" => identity.did,
      "verificationMethod" => verification_methods(identity),
      "authentication" => ["#{identity.did}#key-1"],
      "assertionMethod" => ["#{identity.did}#key-1"],
      "service" => services(identity)
    }
  end

  private

  def verification_methods(identity)
    key = identity.keys['current']
    [{
      "id" => "#{identity.did}##{key['id']}",
      "type" => key_type(key['algorithm']),
      "controller" => identity.did,
      "publicKeyMultibase" => multibase_encode(key['public_key'])
    }]
  end

  def key_type(algorithm)
    case algorithm
    when 'ED25519' then 'Ed25519VerificationKey2020'
    when 'SECP256K1' then 'EcdsaSecp256k1VerificationKey2019'
    end
  end

  def services(identity)
    [{
      "id" => "#{identity.did}#gtcx-api",
      "type" => "GTCXService",
      "serviceEndpoint" => "https://api.gtcx.org/v1/identities/#{identity.id}"
    }]
  end
end
```

---

## Privacy & Security

### Data Classification

| Field              | Classification | Storage            | Access           |
| ------------------ | -------------- | ------------------ | ---------------- |
| DID                | Public         | Plain              | Anyone           |
| Public key         | Public         | Plain              | Anyone           |
| Name               | PII            | Encrypted          | Self, Government |
| Date of birth      | PII            | Encrypted          | Self, Government |
| National ID        | Sensitive PII  | Encrypted + hashed | Self only        |
| Biometric template | Sensitive      | Hashed only        | Never retrieved  |
| Phone              | PII            | Encrypted          | Self, Government |
| Email              | PII            | Encrypted          | Self, Government |

### Encryption Approach

```ruby
class PIIEncryption
  # Field-level encryption using AES-256-GCM
  # Key derived from master key + identity ID (for per-record keys)

  def encrypt(identity_id, field_name, value)
    key = derive_key(identity_id, field_name)
    cipher = OpenSSL::Cipher.new('aes-256-gcm')
    cipher.encrypt
    cipher.key = key
    iv = cipher.random_iv

    encrypted = cipher.update(value.to_json) + cipher.final
    tag = cipher.auth_tag

    Base64.strict_encode64(iv + tag + encrypted)
  end

  def decrypt(identity_id, field_name, encrypted_value)
    key = derive_key(identity_id, field_name)
    data = Base64.strict_decode64(encrypted_value)

    iv = data[0, 12]
    tag = data[12, 16]
    ciphertext = data[28..]

    cipher = OpenSSL::Cipher.new('aes-256-gcm')
    cipher.decrypt
    cipher.key = key
    cipher.iv = iv
    cipher.auth_tag = tag

    JSON.parse(cipher.update(ciphertext) + cipher.final)
  end

  private

  def derive_key(identity_id, field_name)
    # HKDF key derivation
    OpenSSL::KDF.hkdf(
      master_key,
      salt: identity_id,
      info: field_name,
      length: 32,
      hash: 'SHA256'
    )
  end
end
```

### Biometric Security

```ruby
class BiometricService
  # Never store raw biometric data
  # Store only irreversible templates/hashes

  def enroll(identity:, type:, template:, device_id:)
    # 1. Generate template hash (one-way)
    template_hash = Digest::SHA256.hexdigest(template)

    # 2. Verify quality
    quality = assess_quality(type, template)
    raise InsufficientQuality if quality < 70

    # 3. Store enrollment
    identity.update!(
      biometric_data: identity.biometric_data.merge(
        type => {
          'templateHash' => template_hash,
          'enrolledAt' => Time.current.iso8601,
          'deviceId' => device_id,
          'quality' => quality
        }
      )
    )

    # 4. Discard template (never stored)
    template = nil

    emit_event('identity.biometric_enrolled', identity, { type: type })
  end

  def verify(identity:, type:, template:)
    enrollment = identity.biometric_data[type]
    raise NotEnrolled unless enrollment

    # Compare template hash
    template_hash = Digest::SHA256.hexdigest(template)

    if template_hash == enrollment['templateHash']
      emit_event('identity.biometric_verified', identity, { type: type })
      true
    else
      emit_event('identity.biometric_failed', identity, { type: type })
      false
    end
  end
end
```

---

## Testing Requirements

### Unit Tests

- [ ] Identity creation with all fields
- [ ] DID generation uniqueness
- [ ] Key pair generation and rotation
- [ ] PII encryption/decryption roundtrip
- [ ] Verification level upgrade logic
- [ ] DID Document generation
- [ ] Duplicate detection (phone, email, national ID)

### Integration Tests

- [ ] Full identity creation flow
- [ ] Phone verification OTP flow
- [ ] Document verification flow
- [ ] Liveness check integration
- [ ] Key rotation without service interruption
- [ ] Cross-jurisdiction identity lookup

### Security Tests

- [ ] PII not exposed in logs
- [ ] Biometric templates not stored raw
- [ ] Key rotation revokes old signatures
- [ ] Rate limiting on verification attempts
- [ ] National ID lookup requires authorization

---

## Acceptance Criteria

- [ ] Identity creation API functional
- [ ] DID Documents resolve correctly
- [ ] Verification levels L0-L3 achievable
- [ ] Phone/email verification working
- [ ] Document upload and storage working
- [ ] PII encrypted at rest
- [ ] Key rotation implemented
- [ ] Credential linking functional
- [ ] Search by phone/email (authorized only)
- [ ] Audit logging for all identity operations

---

## AI Implementation Notes

### File Structure

```bash
app/
├── models/
│   └── identity.rb
├── services/
│   ├── identity_creation_service.rb
│   ├── verification_upgrade_service.rb
│   ├── did_document_service.rb
│   ├── pii_encryption_service.rb
│   └── biometric_service.rb
├── controllers/
│   └── api/v1/
│       ├── identities_controller.rb
│       └── verifications_controller.rb
├── serializers/
│   ├── identity_serializer.rb
│   └── did_document_serializer.rb
└── validators/
    ├── identity_validator.rb
    └── phone_number_validator.rb

spec/
├── models/
│   └── identity_spec.rb
├── services/
│   ├── identity_creation_service_spec.rb
│   └── verification_upgrade_service_spec.rb
├── requests/
│   └── identities_spec.rb
└── factories/
    └── identities.rb
```

### Model Definition

```ruby
# app/models/identity.rb
class Identity < ApplicationRecord
  # Associations
  has_many :auth_credentials, dependent: :destroy
  has_many :credentials, foreign_key: :subject_id
  has_many :operated_sites, class_name: 'SiteOperator', foreign_key: :operator_id
  has_many :sessions

  # Validations
  validates :did, presence: true, uniqueness: true,
            format: { with: /\Adid:gtcx:tp:[0-9a-f-]{36}\z/ }
  validates :type, presence: true, inclusion: { in: %w[INDIVIDUAL ORGANIZATION GOVERNMENT] }
  validates :status, presence: true, inclusion: { in: %w[ACTIVE SUSPENDED DEACTIVATED PENDING] }
  validates :primary_jurisdiction, presence: true

  # Scopes
  scope :active, -> { where(status: 'ACTIVE') }
  scope :individuals, -> { where(type: 'INDIVIDUAL') }
  scope :organizations, -> { where(type: 'ORGANIZATION') }
  scope :in_jurisdiction, ->(j) { where(primary_jurisdiction: j) }

  # Encryption
  encrypts :person_data, :contact_data

  # Callbacks
  before_create :generate_did, unless: :did?
  after_create :emit_created_event
  after_update :emit_updated_event

  # Methods
  def individual?
    type == 'INDIVIDUAL'
  end

  def display_name
    if individual?
      "#{person_data&.dig('givenName')} #{person_data&.dig('familyName')}"
    else
      organization_data&.dig('legalName')
    end
  end

  def current_public_key
    keys&.dig('current', 'public_key')
  end

  def can_hold_credential?(credential_type, tier)
    required_level = tier_to_verification_level(tier)
    level_to_num(verification_level) >= level_to_num(required_level)
  end

  private

  def tier_to_verification_level(tier)
    { 'T1' => 'L3', 'T2' => 'L2', 'T3' => 'L1' }[tier]
  end
end
```

### Factory Definition

```ruby
# spec/factories/identities.rb
FactoryBot.define do
  factory :identity do
    did { "did:gtcx:tp:#{SecureRandom.uuid}" }
    type { 'INDIVIDUAL' }
    status { 'ACTIVE' }
    verification_level { 'L1' }
    primary_jurisdiction { 'GH' }

    person_data do
      {
        'givenName' => Faker::Name.first_name,
        'familyName' => Faker::Name.last_name,
        'dateOfBirth' => Faker::Date.birthday(min_age: 18, max_age: 65).iso8601,
        'gender' => %w[M F].sample,
        'nationality' => 'GH'
      }
    end

    contact_data do
      {
        'phone' => Faker::PhoneNumber.cell_phone_in_e164,
        'phoneVerified' => true,
        'email' => Faker::Internet.email,
        'emailVerified' => false
      }
    end

    keys do
      {
        'current' => {
          'id' => 'key-1',
          'algorithm' => 'ED25519',
          'public_key' => Base64.strict_encode64(SecureRandom.bytes(32)),
          'created_at' => Time.current.iso8601
        }
      }
    end

    trait :organization do
      type { 'ORGANIZATION' }
      person_data { nil }
      organization_data do
        {
          'legalName' => Faker::Company.name,
          'tradingName' => Faker::Company.name,
          'type' => 'COMPANY',
          'registrationNumber' => Faker::Company.ein,
          'registrationCountry' => 'GH'
        }
      end
    end

    trait :government do
      type { 'GOVERNMENT' }
      verification_level { 'L4' }
    end

    trait :unverified do
      verification_level { 'L0' }
    end

    trait :fully_verified do
      verification_level { 'L3' }
      biometric_data do
        {
          'fingerprint' => {
            'templateHash' => Digest::SHA256.hexdigest(SecureRandom.bytes(32)),
            'enrolledAt' => Time.current.iso8601,
            'quality' => 95
          }
        }
      end
    end
  end
end
```

---

## Related Documents

- [Data Models](./data-models.md) — Schema definitions including `TradePassIdentitySchema` and `VerificationRecordSchema`
- [Security Framework](./security-framework.md) — Key hierarchy, algorithm selection, and cryptographic standards
- [EventCore](./eventcore.md) — Canonical event format that references TradePass IDs
- [@gtcx/identity](../packages/identity.md) — TypeScript package implementing identity creation and DID management
- [@gtcx/security](../packages/security.md) — Authentication, sessions, and offline credential caching
- [Data and Identity Core](../architecture/data-identity-core.md) — Architecture overview of how identity and data specifications interact
