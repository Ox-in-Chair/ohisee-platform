"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantDb = exports.createTenantSchema = exports.getDb = exports.initializeDatabase = void 0;
const knex_1 = __importDefault(require("knex"));
const logger_1 = require("../utils/logger");
const mockDatabase_1 = require("./mockDatabase");
let db;
let useMockDb = false;
const initializeDatabase = async () => {
    // Use mock database if DATABASE_URL is not set or equals 'mock'
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'mock') {
        useMockDb = true;
        logger_1.logger.info('Using mock database for testing');
        return;
    }
    try {
        db = (0, knex_1.default)({
            client: 'pg',
            connection: {
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
            },
            pool: {
                min: 2,
                max: 10,
            },
        });
        await db.raw('SELECT 1');
        logger_1.logger.info('Database connected successfully');
    }
    catch (error) {
        logger_1.logger.error('Database connection failed, falling back to mock database:', error);
        useMockDb = true;
    }
};
exports.initializeDatabase = initializeDatabase;
const getDb = () => {
    if (useMockDb) {
        return mockDatabase_1.mockDb;
    }
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};
exports.getDb = getDb;
const createTenantSchema = async (tenantId) => {
    if (useMockDb) {
        logger_1.logger.info(`Mock: Created schema for tenant: ${tenantId}`);
        return;
    }
    const schemaName = `tenant_${tenantId}`;
    await db.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [schemaName]);
    logger_1.logger.info(`Created schema for tenant: ${tenantId}`);
};
exports.createTenantSchema = createTenantSchema;
const getTenantDb = (tenantId) => {
    if (useMockDb) {
        return mockDatabase_1.mockDb;
    }
    const schemaName = `tenant_${tenantId}`;
    return db.withSchema(schemaName);
};
exports.getTenantDb = getTenantDb;
//# sourceMappingURL=connection.js.map