"use strict";
// ============================================================================
// CERTIFICATES MODULE - PUBLIC API
// Aligned with TradePass™ Credential Taxonomy & Predicate Architecture
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateGoldLotData = exports.getCredentialForRole = exports.getCommodityCategory = exports.getCommodityConfig = exports.ROLE_TO_CREDENTIAL = exports.COMMODITY_CATEGORIES = exports.COMMODITY_CONFIGS = exports.getCertificateCommodityType = exports.formatCertificateForDisplay = exports.getCertificateAge = exports.isCertificateExpired = exports.verifyCertificateStructure = exports.createMilitaryGradeCertificateData = exports.createStandardCertificateData = exports.createDefaultValidationMetrics = exports.createDefaultEnvironmentalFactors = exports.createCertificateMetadata = exports.validateCertificateInput = exports.generateCertificateId = exports.listTemplateIds = exports.getTemplatesByType = exports.getTemplatesBySecurityLevel = exports.getTemplate = exports.getEffectiveTemplate = exports.createCommodityCertificateConfig = exports.getCommodityCertificateConfig = exports.COMMODITY_CERTIFICATE_CONFIGS = exports.GOLD_ORIGIN_TEMPLATE = exports.CERTIFICATE_TEMPLATES = exports.SETTLEMENT_TEMPLATE = exports.CUSTODY_TRANSFER_TEMPLATE = exports.COMPLIANCE_TEMPLATE = exports.PHOTO_TEMPLATE = exports.LOCATION_TEMPLATE = exports.GOVERNMENT_INSPECTOR_TEMPLATE = exports.WORK_SITE_TEMPLATE = exports.ASSET_ORIGIN_TEMPLATE = void 0;
var templates_1 = require("./templates");
// Templates - commodity-agnostic
Object.defineProperty(exports, "ASSET_ORIGIN_TEMPLATE", { enumerable: true, get: function () { return templates_1.ASSET_ORIGIN_TEMPLATE; } });
Object.defineProperty(exports, "WORK_SITE_TEMPLATE", { enumerable: true, get: function () { return templates_1.WORK_SITE_TEMPLATE; } });
Object.defineProperty(exports, "GOVERNMENT_INSPECTOR_TEMPLATE", { enumerable: true, get: function () { return templates_1.GOVERNMENT_INSPECTOR_TEMPLATE; } });
Object.defineProperty(exports, "LOCATION_TEMPLATE", { enumerable: true, get: function () { return templates_1.LOCATION_TEMPLATE; } });
Object.defineProperty(exports, "PHOTO_TEMPLATE", { enumerable: true, get: function () { return templates_1.PHOTO_TEMPLATE; } });
Object.defineProperty(exports, "COMPLIANCE_TEMPLATE", { enumerable: true, get: function () { return templates_1.COMPLIANCE_TEMPLATE; } });
Object.defineProperty(exports, "CUSTODY_TRANSFER_TEMPLATE", { enumerable: true, get: function () { return templates_1.CUSTODY_TRANSFER_TEMPLATE; } });
Object.defineProperty(exports, "SETTLEMENT_TEMPLATE", { enumerable: true, get: function () { return templates_1.SETTLEMENT_TEMPLATE; } });
Object.defineProperty(exports, "CERTIFICATE_TEMPLATES", { enumerable: true, get: function () { return templates_1.CERTIFICATE_TEMPLATES; } });
// Legacy alias (deprecated)
Object.defineProperty(exports, "GOLD_ORIGIN_TEMPLATE", { enumerable: true, get: function () { return templates_1.GOLD_ORIGIN_TEMPLATE; } });
// Commodity-specific configurations
Object.defineProperty(exports, "COMMODITY_CERTIFICATE_CONFIGS", { enumerable: true, get: function () { return templates_1.COMMODITY_CERTIFICATE_CONFIGS; } });
Object.defineProperty(exports, "getCommodityCertificateConfig", { enumerable: true, get: function () { return templates_1.getCommodityCertificateConfig; } });
Object.defineProperty(exports, "createCommodityCertificateConfig", { enumerable: true, get: function () { return templates_1.createCommodityCertificateConfig; } });
Object.defineProperty(exports, "getEffectiveTemplate", { enumerable: true, get: function () { return templates_1.getEffectiveTemplate; } });
// Template utilities
Object.defineProperty(exports, "getTemplate", { enumerable: true, get: function () { return templates_1.getTemplate; } });
Object.defineProperty(exports, "getTemplatesBySecurityLevel", { enumerable: true, get: function () { return templates_1.getTemplatesBySecurityLevel; } });
Object.defineProperty(exports, "getTemplatesByType", { enumerable: true, get: function () { return templates_1.getTemplatesByType; } });
Object.defineProperty(exports, "listTemplateIds", { enumerable: true, get: function () { return templates_1.listTemplateIds; } });
var generator_1 = require("./generator");
// Generator functions
Object.defineProperty(exports, "generateCertificateId", { enumerable: true, get: function () { return generator_1.generateCertificateId; } });
Object.defineProperty(exports, "validateCertificateInput", { enumerable: true, get: function () { return generator_1.validateCertificateInput; } });
Object.defineProperty(exports, "createCertificateMetadata", { enumerable: true, get: function () { return generator_1.createCertificateMetadata; } });
Object.defineProperty(exports, "createDefaultEnvironmentalFactors", { enumerable: true, get: function () { return generator_1.createDefaultEnvironmentalFactors; } });
Object.defineProperty(exports, "createDefaultValidationMetrics", { enumerable: true, get: function () { return generator_1.createDefaultValidationMetrics; } });
Object.defineProperty(exports, "createStandardCertificateData", { enumerable: true, get: function () { return generator_1.createStandardCertificateData; } });
Object.defineProperty(exports, "createMilitaryGradeCertificateData", { enumerable: true, get: function () { return generator_1.createMilitaryGradeCertificateData; } });
// Verification
Object.defineProperty(exports, "verifyCertificateStructure", { enumerable: true, get: function () { return generator_1.verifyCertificateStructure; } });
Object.defineProperty(exports, "isCertificateExpired", { enumerable: true, get: function () { return generator_1.isCertificateExpired; } });
Object.defineProperty(exports, "getCertificateAge", { enumerable: true, get: function () { return generator_1.getCertificateAge; } });
// Utilities
Object.defineProperty(exports, "formatCertificateForDisplay", { enumerable: true, get: function () { return generator_1.formatCertificateForDisplay; } });
Object.defineProperty(exports, "getCertificateCommodityType", { enumerable: true, get: function () { return generator_1.getCertificateCommodityType; } });
// Re-export constants
var types_1 = require("../types");
Object.defineProperty(exports, "COMMODITY_CONFIGS", { enumerable: true, get: function () { return types_1.COMMODITY_CONFIGS; } });
Object.defineProperty(exports, "COMMODITY_CATEGORIES", { enumerable: true, get: function () { return types_1.COMMODITY_CATEGORIES; } });
Object.defineProperty(exports, "ROLE_TO_CREDENTIAL", { enumerable: true, get: function () { return types_1.ROLE_TO_CREDENTIAL; } });
Object.defineProperty(exports, "getCommodityConfig", { enumerable: true, get: function () { return types_1.getCommodityConfig; } });
Object.defineProperty(exports, "getCommodityCategory", { enumerable: true, get: function () { return types_1.getCommodityCategory; } });
Object.defineProperty(exports, "getCredentialForRole", { enumerable: true, get: function () { return types_1.getCredentialForRole; } });
Object.defineProperty(exports, "migrateGoldLotData", { enumerable: true, get: function () { return types_1.migrateGoldLotData; } });
//# sourceMappingURL=index.js.map