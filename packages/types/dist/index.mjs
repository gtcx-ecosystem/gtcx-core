// src/protocols/geotag.ts
function migrateGeologicalContext(geo, commodityType = "gold") {
  return {
    commodityPotential: geo.goldPotential,
    commodityType,
    formation: geo.formation,
    confidence: geo.confidence,
    source: geo.source
  };
}
function createResourceContext(commodityType, potential, confidence, options) {
  return {
    commodityPotential: potential,
    commodityType,
    formation: options?.formation,
    confidence,
    source: options?.source
  };
}

// src/common/errors.ts
var GtcxException = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "GtcxException";
  }
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: Date.now()
    };
  }
};
export {
  GtcxException,
  createResourceContext,
  migrateGeologicalContext
};
