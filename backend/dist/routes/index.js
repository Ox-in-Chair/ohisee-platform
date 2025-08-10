"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_1 = __importDefault(require("./reports"));
const ai_1 = __importDefault(require("./ai"));
const auth_1 = __importDefault(require("./auth"));
const admin_1 = __importDefault(require("./admin"));
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use('/reports', reports_1.default);
router.use('/ai', ai_1.default);
router.use('/auth', auth_1.default);
router.use('/admin', auth_2.authenticate, admin_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map