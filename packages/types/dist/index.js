"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  GtcxException: () => GtcxException,
  createResourceContext: () => createResourceContext,
  migrateGeologicalContext: () => migrateGeologicalContext
});
module.exports = __toCommonJS(index_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GtcxException,
  createResourceContext,
  migrateGeologicalContext
});
