"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const connection_1 = require("../db/connection");
const errorHandler_1 = require("../middleware/errorHandler");
const rateLimiter_1 = require("../middleware/rateLimiter");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
const generateToken = (userId, email, role, tenantId) => {
    return jsonwebtoken_1.default.sign({ userId, email, role, tenantId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};
router.post('/register', rateLimiter_1.strictRateLimiter, [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    (0, express_validator_1.body)('firstName').isString().trim(),
    (0, express_validator_1.body)('lastName').isString().trim(),
    (0, express_validator_1.body)('tenantId').isUUID(),
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, firstName, lastName, tenantId } = req.body;
        const db = (0, connection_1.getDb)();
        const existingUser = await db('users')
            .where({ email, tenant_id: tenantId })
            .first();
        if (existingUser) {
            throw new errorHandler_1.AppError('User already exists', 400);
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const [user] = await db('users')
            .insert({
            email,
            password_hash: passwordHash,
            first_name: firstName,
            last_name: lastName,
            tenant_id: tenantId,
            role: 'user',
        })
            .returning(['id', 'email', 'role']);
        const token = generateToken(user.id, user.email, user.role, tenantId);
        logger_1.logger.info(`User registered: ${email} for tenant: ${tenantId}`);
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName,
                lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', rateLimiter_1.strictRateLimiter, [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty(),
    (0, express_validator_1.body)('tenantId').isUUID(),
], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, tenantId } = req.body;
        const db = (0, connection_1.getDb)();
        const user = await db('users')
            .where({ email, tenant_id: tenantId })
            .first();
        if (!user || !await bcryptjs_1.default.compare(password, user.password_hash)) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        if (!user.is_active) {
            throw new errorHandler_1.AppError('Account is disabled', 403);
        }
        await db('users')
            .where({ id: user.id })
            .update({ last_login: new Date() });
        const token = generateToken(user.id, user.email, user.role, tenantId);
        logger_1.logger.info(`User logged in: ${email} for tenant: ${tenantId}`);
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/forgot-password', rateLimiter_1.strictRateLimiter, [(0, express_validator_1.body)('email').isEmail().normalizeEmail()], async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({
            message: 'If an account exists with this email, a password reset link has been sent.',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map