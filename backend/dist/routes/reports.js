"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const express_validator_1 = require("express-validator");
const reportController_1 = require("../controllers/reportController");
const tenant_1 = require("../middleware/tenant");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});
const reportController = new reportController_1.ReportController();
const validateReport = [
    (0, express_validator_1.body)('category').isIn(['product_safety', 'misconduct', 'health_safety', 'harassment']),
    (0, express_validator_1.body)('title').isLength({ min: 5 }).trim(),
    (0, express_validator_1.body)('description').isLength({ min: 20 }).trim(),
    (0, express_validator_1.body)('email').optional().isEmail(),
];
router.get('/', tenant_1.getTenantFromRequest, async (req, res, next) => {
    try {
        await reportController.getReports(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', tenant_1.getTenantFromRequest, upload.array('attachments', 5), validateReport, async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await reportController.createReport(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/track/:referenceNumber', tenant_1.getTenantFromRequest, async (req, res, next) => {
    try {
        await reportController.trackReport(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/categories/stats', tenant_1.getTenantFromRequest, async (req, res, next) => {
    try {
        await reportController.getCategoryStats(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=reports.js.map