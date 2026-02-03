"use strict";
// ============================================================================
// GEOTAG PROTOCOL TYPES
// Location & Provenance Verification
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateGeologicalContext = migrateGeologicalContext;
exports.createResourceContext = createResourceContext;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Helper to migrate legacy GeologicalContext to ResourceContext
 */
function migrateGeologicalContext(geo, commodityType = 'gold') {
    return {
        commodityPotential: geo.goldPotential,
        commodityType,
        formation: geo.formation,
        confidence: geo.confidence,
        source: geo.source,
    };
}
/**
 * Helper to create ResourceContext for any commodity
 */
function createResourceContext(commodityType, potential, confidence, options) {
    return {
        commodityPotential: potential,
        commodityType,
        formation: options?.formation,
        confidence,
        source: options?.source,
    };
}
//# sourceMappingURL=geotag.js.map