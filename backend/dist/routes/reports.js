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
const connection_1 = require("../db/connection");
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
// Super simple test endpoint
router.get('/test', (req, res) => {
    res.json({ message: 'Reports route working!', timestamp: new Date().toISOString() });
});
// Debug endpoint to test database
router.get('/debug', async (req, res) => {
    try {
        const db = (0, connection_1.getDb)();
        // Check if using mock database
        if (typeof db.getReports === 'function') {
            const reports = await db.getReports('kangopak');
            return res.json({ type: 'mock', count: reports.length, reports });
        }
        // Real database - check table exists
        const tableExists = await db.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reports'
      )
    `);
        if (!tableExists.rows[0].exists) {
            return res.json({ error: 'Reports table does not exist' });
        }
        // Check table columns
        const columns = await db.raw(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reports'
      ORDER BY ordinal_position
    `);
        // Try to get reports count
        const countResult = await db.raw('SELECT COUNT(*) as count FROM reports');
        const count = countResult.rows[0].count;
        res.json({
            type: 'postgresql',
            tableExists: true,
            count: parseInt(count),
            columns: columns.rows
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});
// Simplified endpoint that bypasses the controller
router.get('/simple', async (req, res) => {
    try {
        const db = (0, connection_1.getDb)();
        // Check if using mock database
        if (typeof db.getReports === 'function') {
            const reports = await db.getReports('kangopak');
            return res.json({
                reports: reports.map(report => ({
                    id: report.id,
                    referenceNumber: report.reference_number,
                    category: report.category,
                    title: report.title,
                    status: report.status,
                    priority: report.priority,
                    submittedAt: report.created_at,
                    lastUpdated: report.updated_at,
                }))
            });
        }
        // Real database - simplified query
        const reports = await db('reports')
            .select(['id', 'reference_number', 'category', 'title', 'status', 'priority', 'created_at', 'updated_at'])
            .orderBy('created_at', 'desc')
            .limit(10); // Limit to avoid large queries
        res.json({
            reports: reports.map(report => ({
                id: report.id,
                referenceNumber: report.reference_number,
                category: report.category,
                title: report.title,
                status: report.status,
                priority: report.priority,
                submittedAt: report.created_at,
                lastUpdated: report.updated_at,
            }))
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message, details: error.stack });
    }
});
// Bypass middleware for now to test
router.get('/', async (req, res, next) => {
    try {
        // Set tenant manually if not present
        if (!req.headers['x-tenant-id']) {
            req.headers['x-tenant-id'] = 'kangopak';
        }
        await reportController.getReports(req, res);
    }
    catch (error) {
        next(error);
    }
});
// Keep original with middleware for comparison
router.get('/with-middleware', tenant_1.getTenantFromRequest, async (req, res, next) => {
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