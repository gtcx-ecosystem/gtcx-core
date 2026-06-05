---
title: 'Repository overview — personas'
status: current
date: 2026-06-05
owner: protocol-architect
role: protocol-architect
tier: standard
tags: ['overview', 'personas']
review_cycle: on-change
---

# Repository overview — personas

> **Parent:** [overview/README.md](./README.md)

## 3. Core User Personas & Jobs-to-be-Done

#### Persona: Amina — Artisanal Gold Miner — Ghana

**Demographics:** 34, low technical sophistication, no formal banking relationship, operates in rural Western Region with 2G connectivity. Decision authority: personal (no institutional backing).

**Goals:** Get a fair price for her gold. Prove it was mined ethically. Access formal credit using her production history.

**Pain Points:**

- Middlemen pay 30-40% below market price because she cannot prove provenance
- No bank will lend to her without paper documentation she doesn't have
- Mobile data is expensive; she needs USSD, not apps
- Her phone is a 5-year-old Android with 1GB RAM

**Jobs-to-be-Done:**

1. _When_ I sell gold at the buying station, _I want to_ receive a digital certificate proving the weight and purity, _so I can_ negotiate a fair price with exporters
2. _When_ I apply for a micro-loan, _I want to_ show 12 months of verified production history, _so I can_ access credit at reasonable rates
3. _When_ my phone has no data, _I want to_ still record a transaction via USSD, _so I can_ operate on days with poor connectivity

**How This Repo Helps:** `@gtcx/crypto` provides the signing primitives that make her digital certificate tamper-proof. `@gtcx/verification` generates the QR code and proof bundle that exporters scan. `@gtcx/sync` queues her USSD transaction offline and replays it when connectivity returns. `@gtcx/connectivity` detects her 2G profile and adapts timeouts accordingly.

**Workflow Unlocked:** Amina weighs her gold at the buying station. The agent scans her biometric ID, weighs the gold on a certified scale, and the station's tablet (running a `gtcx-markets` app that consumes `gtcx-core`) generates a signed certificate with geotag, timestamp, and scale reading. Amina receives an SMS with a short code. Even without data, she can dial `*123#` to verify her certificate's status. When she visits the bank, she shows her QR code; the bank's system verifies the chain of custody back to the mine, backed by `gtcx-core` cryptographic proofs.

---

#### Persona: Jean-Pierre — Buying Station Agent — Côte d'Ivoire

**Demographics:** 28, semi-technical (smartphone-native, uses WhatsApp Business), manages 3 stations, reports to an export broker. Decision authority: operational, not strategic.

**Goals:** Process 50+ transactions per day accurately. Avoid compliance violations that could shut down the station. Get paid commissions on time.

**Pain Points:**

- Paper logbooks are error-prone and slow; regulatory audits take weeks
- His tablet loses connectivity for hours at a time
- He has been trained 4 times on new systems; each was abandoned
- Fraudulent certificates have cost his broker $15K in the last year

**Jobs-to-be-Done:**

1. _When_ a miner brings gold, _I want to_ verify their identity and issue a tamper-proof certificate in under 2 minutes, _so I can_ maintain throughput during peak season
2. _When_ the internet drops, _I want to_ continue recording transactions locally, _so I can_ avoid backlog and data loss
3. _When_ a regulator arrives for inspection, _I want to_ produce a complete audit trail in under 10 minutes, _so I can_ demonstrate compliance and keep operating

**How This Repo Helps:** `@gtcx/verification` provides certificate templates with required fields and validation rules. `@gtcx/sync` maintains the offline queue with logical sequence ordering. `@gtcx/security` provides input sanitization and audit logging. `@gtcx/crypto` signs every certificate so fraud is cryptographically detectable.

**Workflow Unlocked:** Jean-Pierre opens the buying station app at 6 AM. The app detects his `edge` connectivity profile and sets a 60-second timeout with 1 retry. He processes miners throughout the day; when the tower goes down at 11 AM, the app switches to offline mode seamlessly. Transactions queue locally with logical sequence numbers. At 2 PM, connectivity returns; 23 queued transactions replay automatically. At the end of the day, he taps "Export Audit Trail" and generates a ZIP of signed certificates with merkle proofs — ready for the compliance officer.

---

#### Persona: Dr. Osei — Compliance Officer — Ghana Minerals Commission

**Demographics:** 45, highly technical (PhD in geochemistry), regulator with enforcement authority, based in Accra with occasional field visits.

**Goals:** Ensure all exported gold has traceable provenance. Detect and prevent conflict mineral laundering. Maintain Ghana's EITI compliance rating.

**Pain Points:**

- 40% of export documentation has gaps or inconsistencies
- Verifying a single certificate chain takes 2-3 hours of manual cross-referencing
- He has no real-time visibility into buying station operations
- Cross-border data sharing with neighboring countries is politically sensitive

**Jobs-to-be-Done:**

1. _When_ an export license application arrives, _I want to_ verify the complete chain of custody in under 5 minutes, _so I can_ approve or reject quickly
2. _When_ a red flag appears (unusual weight, missing geotag), _I want to_ trace the certificate back to its origin, _so I can_ investigate potential fraud
3. _When_ EITI auditors visit, _I want to_ demonstrate a tamper-proof audit trail, _so I can_ maintain Ghana's compliance rating

**How This Repo Helps:** `@gtcx/verification` provides certificate structures with mandatory fields (geotag, scale, assay, custody chain). `@gtcx/crypto` provides hash chains and merkle proofs that make tampering detectable. `@gtcx/identity` provides DID resolution for cross-station identity verification. `@gtcx/workproof` provides W3C VC attestation schemas compatible with international standards.

**Workflow Unlocked:** Dr. Osei receives an export application for 50kg of gold. He opens the GTCX verification portal, scans the exporter's QR code, and sees the complete chain: 47 individual miner certificates → 3 buying station consolidation certificates → 1 export certificate. Each link is cryptographically signed. The merkle root matches the hash in the national registry. A geotag heatmap shows all 47 origin points are within licensed concessions. He approves in 4 minutes. An EITI auditor later samples 10% of certificates; all verify successfully against the public merkle root.

---

#### Persona: Sarah — Export Broker — London / Lagos

**Demographics:** 38, commercially focused, manages $50M annual throughput, reports to a commodity trading house board.

**Goals:** Maximize margin while minimizing compliance risk. Access premium markets (LBMA, Dubai) that require ethical sourcing documentation.

**Pain Points:**

- Premium markets pay 8-12% more but require documentation she cannot reliably source
- Insurance costs are high because provenance is uncertain
- A single compliance failure can blacklist her for 2 years
- She spends $200K/year on third-party audit firms

**Jobs-to-be-Done:**

1. _When_ I source gold from West Africa, _I want to_ receive irrefutable provenance documentation, _so I can_ access premium markets and higher margins
2. _When_ I present to LBMA, _I want to_ demonstrate bank-grade trust infrastructure, _so I can_ get approved as a responsible supplier
3. _When_ a buyer requests due diligence, _I want to_ share a public verification link, _so I can_ close deals faster

**How This Repo Helps:** `@gtcx/verification` provides standard and military-grade certificates. `@gtcx/crypto` provides FIPS-validated signatures that LBMA auditors accept. `@gtcx/workproof` generates W3C VCs compatible with international standards. `@gtcx/api-client` provides resilient API access for her London-based systems.

**Workflow Unlocked:** Sarah receives a shipment from her Accra partner. The GTCX system generates a TradeCV — a W3C Verifiable Credential containing the complete chain of custody, assay results, and compliance attestations. She uploads it to the LBMA portal. The LBMA system verifies the cryptographic signatures against `gtcx-core` public keys, confirms the merkle proof, and approves her supplier status. Her insurance premium drops 15%. A Dubai buyer requests DD; she shares a public link that verifies in 30 seconds. The deal closes in 3 days instead of 3 weeks.

---

#### Persona: Kofi — Central Bank Governor — African Sovereign

**Demographics:** 52, macro-economic focus, manages national reserves and monetary policy, accountable to parliament and IMF.

**Goals:** Increase formalization of the informal mining sector. Capture tax revenue currently lost to smuggling. Build national digital identity infrastructure.

**Pain Points:**

- 70% of artisanal gold production is smuggled, costing $500M+ annually in lost revenue
- No reliable national production database exists
- Foreign systems (SWIFT, Western exchanges) capture value that should stay domestic
- Data sovereignty concerns prevent using foreign cloud platforms

**Jobs-to-be-Done:**

1. _When_ I design monetary policy, _I want to_ know actual gold production volumes, _so I can_ make data-driven decisions
2. _When_ I negotiate with the IMF, _I want to_ demonstrate traceable resource governance, _so I can_ secure better terms
3. _When_ I build national digital infrastructure, _I want to_ own the trust layer, _so I can_ preserve sovereignty and build domestic capacity

**How This Repo Helps:** `@gtcx/crypto` provides sovereign-controlled cryptographic infrastructure (no foreign backdoors). `@gtcx/identity` provides DID infrastructure for national digital identity. `@gtcx/consensus` (Rust) provides weighted PBFT for distributed ledger applications. `@gtcx/sync` ensures data persists even in infrastructure-poor regions. All code is open for national security review; no proprietary black boxes.

**Workflow Unlocked:** Kofi's central bank partners with GTCX to deploy a national mineral traceability platform. The system runs on domestic servers with `gtcx-core` as the cryptographic foundation. Every buying station transaction is signed with keys generated inside the country's HSM infrastructure. The central bank receives real-time (or near-real-time) production data. At the IMF review, Kofi presents 18 months of traceable production data, verified by an independent auditor using `gtcx-core` public proofs. The IMF agrees to a 2-year extension on debt service. Parliament approves the national digital identity bill, backed by `gtcx-core` DID infrastructure.

---

#### Persona: Alex — Platform Engineer — New Hire at GTCX

**Demographics:** 29, full-stack TypeScript + Rust, previously at a fintech startup, joining to build the next downstream product.

**Goals:** Ship features quickly. Understand the codebase without breaking security. Contribute to a system that matters.

**Pain Points:**

- Monorepos can be overwhelming; unclear where to start
- Cryptographic code is intimidating; afraid of introducing vulnerabilities
- No clear onboarding path for new engineers

**Jobs-to-be-Done:**

1. _When_ I join the team, _I want to_ build and test the codebase in under 30 minutes, _so I can_ start contributing on day 1
2. _When_ I need to add a feature, _I want to_ know which packages I can touch and which require approval, _so I can_ move fast without breaking security
3. _When_ I write code, _I want to_ run the same checks as CI locally, _so I can_ catch issues before PR review

**How This Repo Helps:** `architecture:check` enforces package boundaries so Alex knows exactly what depends on what. `pnpm lint` and `pnpm test` run the same checks as CI. `CLAUDE.md` and `CONTRIBUTING.md` document conventions. Security-sensitive packages are clearly marked; changes require Cryptographic Security Engineer review.

---
