"use strict";
// Core 12 Framework Schema
// The universal compliance framework harmonizing 120+ global standards
// Migrated from ComplianceOS to GTCX monorepo
Object.defineProperty(exports, "__esModule", { value: true });
exports.CORE12_DOMAINS = void 0;
exports.getDomain = getDomain;
exports.getControl = getControl;
exports.getAllControls = getAllControls;
exports.getControlCount = getControlCount;
const domains_1 = require("./domains");
Object.defineProperty(exports, "CORE12_DOMAINS", { enumerable: true, get: function () { return domains_1.CORE12_DOMAINS; } });
// Helper functions
function getDomain(domainId) {
    return domains_1.CORE12_DOMAINS.find((d) => d.id === domainId);
}
function getControl(controlId) {
    for (const domain of domains_1.CORE12_DOMAINS) {
        const control = domain.controls.find((c) => c.id === controlId);
        if (control)
            return control;
    }
    return undefined;
}
function getAllControls() {
    return domains_1.CORE12_DOMAINS.flatMap((d) => d.controls);
}
function getControlCount() {
    return getAllControls().length;
}
//# sourceMappingURL=schema.js.map