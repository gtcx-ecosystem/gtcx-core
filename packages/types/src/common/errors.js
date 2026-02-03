"use strict";
// ============================================================================
// ERROR TYPES
// Standardized error definitions
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.GtcxException = void 0;
class GtcxException extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'GtcxException';
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            details: this.details,
            timestamp: Date.now(),
        };
    }
}
exports.GtcxException = GtcxException;
//# sourceMappingURL=errors.js.map