"use strict";
// ============================================================================
// QR CODE MODULE - PUBLIC API
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQRCodeCommodityType = exports.hashQRCodeContent = exports.verifyQRCodeData = exports.parseQRData = exports.serializeQRData = exports.generateQRCodeId = exports.createGoldLotQRData = exports.createQRCodeStructure = exports.createCertificateQRData = exports.createAssetLotQRData = exports.createPhotoQRData = exports.createLocationQRData = void 0;
var generator_1 = require("./generator");
// Generator functions - commodity-agnostic
Object.defineProperty(exports, "createLocationQRData", { enumerable: true, get: function () { return generator_1.createLocationQRData; } });
Object.defineProperty(exports, "createPhotoQRData", { enumerable: true, get: function () { return generator_1.createPhotoQRData; } });
Object.defineProperty(exports, "createAssetLotQRData", { enumerable: true, get: function () { return generator_1.createAssetLotQRData; } });
Object.defineProperty(exports, "createCertificateQRData", { enumerable: true, get: function () { return generator_1.createCertificateQRData; } });
Object.defineProperty(exports, "createQRCodeStructure", { enumerable: true, get: function () { return generator_1.createQRCodeStructure; } });
// Legacy (deprecated)
Object.defineProperty(exports, "createGoldLotQRData", { enumerable: true, get: function () { return generator_1.createGoldLotQRData; } });
// Utilities
Object.defineProperty(exports, "generateQRCodeId", { enumerable: true, get: function () { return generator_1.generateQRCodeId; } });
Object.defineProperty(exports, "serializeQRData", { enumerable: true, get: function () { return generator_1.serializeQRData; } });
Object.defineProperty(exports, "parseQRData", { enumerable: true, get: function () { return generator_1.parseQRData; } });
Object.defineProperty(exports, "verifyQRCodeData", { enumerable: true, get: function () { return generator_1.verifyQRCodeData; } });
Object.defineProperty(exports, "hashQRCodeContent", { enumerable: true, get: function () { return generator_1.hashQRCodeContent; } });
Object.defineProperty(exports, "getQRCodeCommodityType", { enumerable: true, get: function () { return generator_1.getQRCodeCommodityType; } });
//# sourceMappingURL=index.js.map