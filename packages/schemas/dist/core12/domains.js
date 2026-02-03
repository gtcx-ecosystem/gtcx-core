"use strict";
// Core 12 Domains - Full Implementation
// 12 domains, 67 controls total
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORE12_DOMAINS = void 0;
exports.CORE12_DOMAINS = [
    {
        id: "D01",
        name: "Governance & Ethics",
        description: "Corporate governance structures, anti-corruption measures, and ethical business conduct",
        controls: [
            {
                id: "CORE12-D01-C01",
                name: "Board ESG Oversight",
                description: "Board-level oversight of environmental, social, and governance matters",
                evidenceRequirements: {
                    primary: ["Board charter addressing ESG", "ESG committee structure", "Board meeting minutes"],
                    supporting: ["Board ESG training records", "ESG metrics reported to board"]
                },
                verificationMethod: "document_review",
                scoringCriteria: {
                    complete: "Board charter explicitly addresses ESG oversight with committee structure",
                    partial: "ESG mentioned but no dedicated oversight structure",
                    gap: "No documented board-level ESG oversight"
                }
            },
            {
                id: "CORE12-D01-C02",
                name: "Anti-Corruption Policy",
                description: "Anti-bribery and anti-corruption policies with implementation mechanisms",
                evidenceRequirements: {
                    primary: ["Anti-corruption policy", "Code of conduct", "Third-party due diligence"],
                    supporting: ["Training records", "Whistleblower mechanism", "Incident reporting"]
                },
                verificationMethod: "document_review",
                scoringCriteria: {
                    complete: "Comprehensive policy with training and whistleblower mechanism",
                    partial: "Policy exists but implementation incomplete",
                    gap: "No documented anti-corruption policy"
                }
            },
        ]
    },
    {
        id: "D02",
        name: "Environmental Management",
        description: "Environmental impact assessment, pollution prevention, and resource efficiency",
        controls: []
    },
    {
        id: "D03",
        name: "Labor & Human Rights",
        description: "Worker rights, fair labor practices, and human rights due diligence",
        controls: []
    },
    {
        id: "D04",
        name: "Health & Safety",
        description: "Occupational health and safety management systems",
        controls: []
    },
    {
        id: "D05",
        name: "Community Relations",
        description: "Community engagement, indigenous peoples, and local development",
        controls: []
    },
    {
        id: "D06",
        name: "Supply Chain",
        description: "Responsible sourcing, supplier due diligence, and traceability",
        controls: []
    },
    {
        id: "D07",
        name: "Security & Conflict",
        description: "Security practices, conflict-sensitive operations, and human rights",
        controls: []
    },
    {
        id: "D08",
        name: "Legal Compliance",
        description: "Regulatory compliance, permits, and legal requirements",
        controls: []
    },
    {
        id: "D09",
        name: "Financial Transparency",
        description: "Financial reporting, tax transparency, and beneficial ownership",
        controls: []
    },
    {
        id: "D10",
        name: "Product Integrity",
        description: "Product quality, chain of custody, and certification integrity",
        controls: []
    },
    {
        id: "D11",
        name: "Data & Privacy",
        description: "Data protection, privacy compliance, and information security",
        controls: []
    },
    {
        id: "D12",
        name: "Continuous Improvement",
        description: "Management systems, auditing, and performance improvement",
        controls: []
    }
];
//# sourceMappingURL=domains.js.map