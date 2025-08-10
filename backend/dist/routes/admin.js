"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const connection_1 = require("../db/connection");
const auth_1 = require("../middleware/auth");
const logger_1 = require("../utils/logger");
const emailService_1 = require("../services/emailService");
const router = (0, express_1.Router)();
router.use((0, auth_1.authorize)('admin', 'manager', 'compliance'));
router.get('/dashboard/stats', async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const db = (0, connection_1.getTenantDb)(tenantId);
        const totalReports = await db('reports').count('* as count').first();
        const categoryStats = await db('reports')
            .select('category')
            .count('* as count')
            .groupBy('category');
        const statusStats = await db('reports')
            .select('status')
            .count('* as count')
            .groupBy('status');
        const recentReports = await db('reports')
            .select('id', 'reference_number', 'title', 'category', 'status', 'created_at')
            .orderBy('created_at', 'desc')
            .limit(10);
        const highRiskReports = await db('reports')
            .where('bad_faith_score', '>', 60)
            .orWhere('priority', 'critical')
            .select('id', 'reference_number', 'title', 'bad_faith_score', 'priority')
            .limit(5);
        res.json({
            totalReports: totalReports?.count || 0,
            categoryBreakdown: categoryStats,
            statusBreakdown: statusStats,
            recentReports,
            highRiskReports,
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/reports', async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const db = (0, connection_1.getTenantDb)(tenantId);
        const { status, category, page = 1, limit = 20 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let query = db('reports').select('*');
        if (status) {
            query = query.where('status', status);
        }
        if (category) {
            query = query.where('category', category);
        }
        const reports = await query
            .orderBy('created_at', 'desc')
            .limit(Number(limit))
            .offset(offset);
        const total = await db('reports')
            .where((builder) => {
            if (status)
                builder.where('status', status);
            if (category)
                builder.where('category', category);
        })
            .count('* as count')
            .first();
        res.json({
            reports,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: total?.count || 0,
                pages: Math.ceil((total?.count || 0) / Number(limit)),
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/reports/:id', async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const db = (0, connection_1.getTenantDb)(tenantId);
        const report = await db('reports')
            .where('id', req.params.id)
            .first();
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        const attachments = await db('report_attachments')
            .where('report_id', report.id);
        const updates = await db('report_updates')
            .where('report_id', report.id)
            .orderBy('created_at', 'desc');
        res.json({
            ...report,
            attachments,
            updates,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/reports/:id', async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const db = (0, connection_1.getTenantDb)(tenantId);
        const { status, priority, assigned_to, resolution_notes } = req.body;
        const updateData = { updated_at: new Date() };
        if (status)
            updateData.status = status;
        if (priority)
            updateData.priority = priority;
        if (assigned_to)
            updateData.assigned_to = assigned_to;
        if (resolution_notes)
            updateData.resolution_notes = resolution_notes;
        if (status === 'resolved' || status === 'closed') {
            updateData.resolved_at = new Date();
        }
        await db('reports')
            .where('id', req.params.id)
            .update(updateData);
        logger_1.logger.info(`Report ${req.params.id} updated by ${req.user.email}`);
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
router.post('/reports/:id/updates', async (req, res, next) => {
    try {
        const tenantId = req.user.tenantId;
        const db = (0, connection_1.getTenantDb)(tenantId);
        const { message, visibility = 'internal' } = req.body;
        const report = await db('reports')
            .where('id', req.params.id)
            .first();
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        await db('report_updates').insert({
            report_id: req.params.id,
            user_id: req.user.userId,
            message,
            visibility,
        });
        if (visibility === 'reporter' && report.reporter_email) {
            await (0, emailService_1.sendReportUpdate)(report.reporter_email, report.reference_number, report.status, message);
        }
        res.json({ success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map