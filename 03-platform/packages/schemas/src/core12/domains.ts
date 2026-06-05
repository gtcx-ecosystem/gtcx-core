// Core 12 Domains
// 12 domains with controls populated for governance and compliance verification.

import type { Domain } from './types';

export const CORE12_DOMAINS: Domain[] = [
  {
    id: 'D01',
    name: 'Governance & Ethics',
    description:
      'Corporate governance structures, anti-corruption measures, and ethical business conduct',
    controls: [
      {
        id: 'CORE12-D01-C01',
        name: 'Board ESG Oversight',
        description: 'Board-level oversight of environmental, social, and governance matters',
        evidenceRequirements: {
          primary: [
            'Board charter addressing ESG',
            'ESG committee structure',
            'Board meeting minutes',
          ],
          supporting: ['Board ESG training records', 'ESG metrics reported to board'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Board charter explicitly addresses ESG oversight with committee structure',
          partial: 'ESG mentioned but no dedicated oversight structure',
          gap: 'No documented board-level ESG oversight',
        },
      },
      {
        id: 'CORE12-D01-C02',
        name: 'Anti-Corruption Policy',
        description: 'Anti-bribery and anti-corruption policies with implementation mechanisms',
        evidenceRequirements: {
          primary: ['Anti-corruption policy', 'Code of conduct', 'Third-party due diligence'],
          supporting: ['Training records', 'Whistleblower mechanism', 'Incident reporting'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Comprehensive policy with training and whistleblower mechanism',
          partial: 'Policy exists but implementation incomplete',
          gap: 'No documented anti-corruption policy',
        },
      },
    ],
  },
  {
    id: 'D02',
    name: 'Environmental Management',
    description: 'Environmental impact assessment, pollution prevention, and resource efficiency',
    controls: [
      {
        id: 'CORE12-D02-C01',
        name: 'Environmental Impact Assessment',
        description:
          'Systematic evaluation of environmental risks and impacts for operations and projects',
        evidenceRequirements: {
          primary: ['Environmental impact assessment report', 'Environmental permits'],
          supporting: ['Stakeholder consultation records', 'Mitigation plan'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'EIA conducted, permits obtained, mitigation plan implemented',
          partial: 'EIA exists but mitigation plan incomplete',
          gap: 'No environmental impact assessment',
        },
      },
      {
        id: 'CORE12-D02-C02',
        name: 'Resource Efficiency & Waste Management',
        description: 'Programs to reduce resource consumption and manage waste responsibly',
        evidenceRequirements: {
          primary: ['Waste management plan', 'Resource consumption metrics'],
          supporting: ['Recycling program documentation', 'Supplier environmental requirements'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Documented waste hierarchy with measurable reduction targets',
          partial: 'Basic waste management without reduction targets',
          gap: 'No documented waste or resource management program',
        },
      },
    ],
  },
  {
    id: 'D03',
    name: 'Labor & Human Rights',
    description: 'Worker rights, fair labor practices, and human rights due diligence',
    controls: [
      {
        id: 'CORE12-D03-C01',
        name: 'Freedom of Association',
        description: 'Respect for workers rights to organize and bargain collectively',
        evidenceRequirements: {
          primary: ['Collective bargaining agreements', 'Worker representation records'],
          supporting: ['Grievance mechanism', 'Non-retaliation policy'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Active collective bargaining or equivalent worker representation',
          partial: 'Policy exists but no evidence of active engagement',
          gap: 'No recognition of freedom of association',
        },
      },
      {
        id: 'CORE12-D03-C02',
        name: 'Prohibition of Child & Forced Labor',
        description: 'Policies and verification to prevent child and forced labor in operations',
        evidenceRequirements: {
          primary: ['Age verification procedures', 'Forced labor prohibition policy'],
          supporting: ['Supplier audit results', 'Recruitment agency due diligence'],
        },
        verificationMethod: 'audit',
        scoringCriteria: {
          complete: 'Robust age verification and supplier audits with no findings',
          partial: 'Policy exists but verification gaps in supply chain',
          gap: 'No policy or verification for child or forced labor',
        },
      },
    ],
  },
  {
    id: 'D04',
    name: 'Health & Safety',
    description: 'Occupational health and safety management systems',
    controls: [
      {
        id: 'CORE12-D04-C01',
        name: 'Occupational Safety Management System',
        description: 'Structured approach to identifying hazards and managing workplace safety',
        evidenceRequirements: {
          primary: ['OHS policy', 'Hazard identification records', 'Incident logs'],
          supporting: ['Safety training records', 'Equipment maintenance logs'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Certified OHS management system with active hazard controls',
          partial: 'Basic safety policy without systematic hazard management',
          gap: 'No documented occupational health and safety system',
        },
      },
      {
        id: 'CORE12-D04-C02',
        name: 'Emergency Preparedness',
        description: 'Plans and drills for workplace emergencies including evacuation and response',
        evidenceRequirements: {
          primary: ['Emergency response plan', 'Evacuation procedures'],
          supporting: ['Drill records', 'First aid and fire safety equipment logs'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Documented plans with regular drills and maintained equipment',
          partial: 'Plans exist but no evidence of drills or maintenance',
          gap: 'No emergency preparedness documentation',
        },
      },
    ],
  },
  {
    id: 'D05',
    name: 'Community Relations',
    description: 'Community engagement, indigenous peoples, and local development',
    controls: [
      {
        id: 'CORE12-D05-C01',
        name: 'Community Engagement & Consultation',
        description:
          'Structured engagement with affected communities including grievance mechanisms',
        evidenceRequirements: {
          primary: ['Community engagement plan', 'Grievance mechanism'],
          supporting: ['Meeting minutes', 'Community development contributions'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Active engagement plan with documented consultations and grievance resolution',
          partial: 'Engagement occurs but no structured plan or mechanism',
          gap: 'No documented community engagement or grievance process',
        },
      },
      {
        id: 'CORE12-D05-C02',
        name: 'Indigenous Peoples Rights',
        description:
          'Respect for indigenous land rights, free prior informed consent, and cultural heritage',
        evidenceRequirements: {
          primary: ['FPIC documentation', 'Indigenous rights policy'],
          supporting: ['Cultural heritage assessments', 'Impact benefit agreements'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'FPIC obtained where applicable with ongoing monitoring',
          partial: 'Policy exists but FPIC process incomplete',
          gap: 'No recognition of indigenous peoples rights',
        },
      },
    ],
  },
  {
    id: 'D06',
    name: 'Supply Chain',
    description: 'Responsible sourcing, supplier due diligence, and traceability',
    controls: [
      {
        id: 'CORE12-D06-C01',
        name: 'Supplier Code of Conduct',
        description:
          'Environmental and social requirements communicated to and enforced with suppliers',
        evidenceRequirements: {
          primary: ['Supplier code of conduct', 'Contractual ESG clauses'],
          supporting: ['Supplier self-assessments', 'Corrective action records'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Code of conduct embedded in contracts with audit verification',
          partial: 'Code exists but limited enforcement or verification',
          gap: 'No supplier code of conduct or ESG contractual requirements',
        },
      },
      {
        id: 'CORE12-D06-C02',
        name: 'Supply Chain Traceability',
        description: 'Systems to trace materials and products through the supply chain to origin',
        evidenceRequirements: {
          primary: ['Traceability system documentation', 'Chain of custody records'],
          supporting: ['Supplier mapping', 'Batch tracking data'],
        },
        verificationMethod: 'system_verification',
        scoringCriteria: {
          complete: 'Full chain-of-custody traceability to origin for key materials',
          partial: 'Partial traceability with gaps at lower tiers',
          gap: 'No traceability system or chain of custody documentation',
        },
      },
    ],
  },
  {
    id: 'D07',
    name: 'Security & Conflict',
    description: 'Security practices, conflict-sensitive operations, and human rights',
    controls: [
      {
        id: 'CORE12-D07-C01',
        name: 'Security Human Rights Compliance',
        description:
          'Security arrangements consistent with human rights and international standards',
        evidenceRequirements: {
          primary: [
            'Security policy aligned with Voluntary Principles',
            'Security provider vetting',
          ],
          supporting: ['Security incident records', 'Human rights training for security personnel'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Security policy aligned with VP with trained personnel and incident reporting',
          partial: 'Basic security policy without human rights alignment',
          gap: 'No documented security policy or human rights considerations',
        },
      },
      {
        id: 'CORE12-D07-C02',
        name: 'Conflict Minerals Due Diligence',
        description:
          'Due diligence on conflict-affected and high-risk areas in mineral supply chains',
        evidenceRequirements: {
          primary: ['Conflict minerals policy', 'Smelter and refiner list'],
          supporting: ['Country of origin inquiry', 'Third-party audit certificates'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'OECD-aligned due diligence with smelter verification and third-party audits',
          partial: 'Policy exists but smelter verification incomplete',
          gap: 'No conflict minerals due diligence program',
        },
      },
    ],
  },
  {
    id: 'D08',
    name: 'Legal Compliance',
    description: 'Regulatory compliance, permits, and legal requirements',
    controls: [
      {
        id: 'CORE12-D08-C01',
        name: 'Regulatory Permits & Licensing',
        description:
          'All required operating permits, licenses, and regulatory approvals maintained',
        evidenceRequirements: {
          primary: ['Valid permits and licenses', 'Compliance calendar'],
          supporting: ['Regulatory correspondence', 'Renewal applications'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'All permits current with compliance calendar and no regulatory enforcement',
          partial: 'Most permits valid but gaps in compliance tracking',
          gap: 'Missing required permits or licenses',
        },
      },
      {
        id: 'CORE12-D08-C02',
        name: 'Anti-Money Laundering Compliance',
        description: 'Policies and procedures to prevent money laundering and terrorist financing',
        evidenceRequirements: {
          primary: ['AML policy', 'Customer due diligence procedures'],
          supporting: ['Suspicious activity reports', 'Staff AML training records'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Comprehensive AML program with CDD, monitoring, and reporting',
          partial: 'AML policy exists but CDD or monitoring gaps',
          gap: 'No AML policy or customer due diligence procedures',
        },
      },
    ],
  },
  {
    id: 'D09',
    name: 'Financial Transparency',
    description: 'Financial reporting, tax transparency, and beneficial ownership',
    controls: [
      {
        id: 'CORE12-D09-C01',
        name: 'Beneficial Ownership Disclosure',
        description: 'Transparent disclosure of ultimate beneficial owners and corporate structure',
        evidenceRequirements: {
          primary: ['Beneficial ownership register', 'Corporate structure diagram'],
          supporting: ['Shareholder agreements', 'Changes in ownership records'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete:
            'Complete beneficial ownership disclosed to regulator and public where required',
          partial: 'Partial disclosure with some beneficial owners unidentified',
          gap: 'No beneficial ownership disclosure',
        },
      },
      {
        id: 'CORE12-D09-C02',
        name: 'Tax Transparency & Transfer Pricing',
        description: 'Transparent tax practices and arm-length transfer pricing documentation',
        evidenceRequirements: {
          primary: ['Transfer pricing documentation', 'Tax strategy statement'],
          supporting: ['Country-by-country reporting', 'Tax authority correspondence'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Full transfer pricing documentation and public tax strategy',
          partial: 'Basic tax compliance without transfer pricing documentation',
          gap: 'No tax transparency or transfer pricing documentation',
        },
      },
    ],
  },
  {
    id: 'D10',
    name: 'Product Integrity',
    description: 'Product quality, chain of custody, and certification integrity',
    controls: [
      {
        id: 'CORE12-D10-C01',
        name: 'Chain of Custody Documentation',
        description: 'Documentation ensuring product integrity from origin to delivery',
        evidenceRequirements: {
          primary: ['Chain of custody records', 'Batch tracking documentation'],
          supporting: ['Quality test results', 'Transport and storage condition logs'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Complete chain of custody with batch-level traceability',
          partial: 'Partial documentation with gaps in custody chain',
          gap: 'No chain of custody documentation',
        },
      },
      {
        id: 'CORE12-D10-C02',
        name: 'Product Certification Verification',
        description: 'Verification that product claims and certifications are valid and current',
        evidenceRequirements: {
          primary: ['Current certificates', 'Certification audit reports'],
          supporting: ['Scope certificates', 'Transaction certificates'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'All certifications current and scope matches product claims',
          partial: 'Some certifications valid but scope mismatches or gaps',
          gap: 'No product certifications or expired certificates',
        },
      },
    ],
  },
  {
    id: 'D11',
    name: 'Data & Privacy',
    description: 'Data protection, privacy compliance, and information security',
    controls: [
      {
        id: 'CORE12-D11-C01',
        name: 'Personal Data Protection',
        description: 'Policies and controls for lawful processing and protection of personal data',
        evidenceRequirements: {
          primary: ['Privacy policy', 'Data processing records', 'Consent mechanisms'],
          supporting: ['Data protection impact assessments', 'Breach notification procedures'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Comprehensive privacy program with DPIAs and documented consent',
          partial: 'Privacy policy exists but DPIAs or consent mechanisms incomplete',
          gap: 'No privacy policy or data protection controls',
        },
      },
      {
        id: 'CORE12-D11-C02',
        name: 'Cross-Border Data Transfer Compliance',
        description: 'Lawful mechanisms for transferring personal data across jurisdictions',
        evidenceRequirements: {
          primary: ['Transfer mechanism documentation', 'Adequacy decision or SCCs'],
          supporting: ['Transfer impact assessments', 'Data localization policy'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'All cross-border transfers covered by valid legal mechanisms with TIAs',
          partial: 'Some transfers covered but gaps in high-risk jurisdictions',
          gap: 'No documented transfer mechanisms for cross-border data flows',
        },
      },
    ],
  },
  {
    id: 'D12',
    name: 'Continuous Improvement',
    description: 'Management systems, auditing, and performance improvement',
    controls: [
      {
        id: 'CORE12-D12-C01',
        name: 'Internal Audit Program',
        description: 'Regular independent audits of compliance and management system effectiveness',
        evidenceRequirements: {
          primary: ['Internal audit plan', 'Audit reports'],
          supporting: ['Auditor competency records', 'Management review minutes'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'Annual audit plan executed with competent auditors and management review',
          partial: 'Ad-hoc audits without systematic plan or auditor qualification',
          gap: 'No internal audit program',
        },
      },
      {
        id: 'CORE12-D12-C02',
        name: 'Corrective Action Tracking',
        description: 'Systematic identification, tracking, and closure of non-conformities',
        evidenceRequirements: {
          primary: ['Non-conformity register', 'Corrective action plans'],
          supporting: ['Root cause analysis', 'Closure verification records'],
        },
        verificationMethod: 'document_review',
        scoringCriteria: {
          complete: 'All non-conformities tracked to closure with root cause analysis',
          partial: 'Non-conformities recorded but tracking or closure incomplete',
          gap: 'No system for tracking non-conformities or corrective actions',
        },
      },
    ],
  },
];
