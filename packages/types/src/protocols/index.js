"use strict";
// ============================================================================
// PROTOCOLS INDEX
// Re-export all protocol types with conflict resolution
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Identity types first (canonical for VerifiableCredential, CredentialProof)
__exportStar(require("./identity"), exports);
// GeoTag - canonical for CommodityType
__exportStar(require("./geotag"), exports);
// GCI - all types
__exportStar(require("./gci"), exports);
// PvP - all types
__exportStar(require("./pvp"), exports);
//# sourceMappingURL=index.js.map