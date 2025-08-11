"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantDb = exports.createTenantSchema = exports.getDb = exports.initializeDatabase = void 0;
const knex_1 = __importDefault(require("knex"));
const logger_1 = require("../utils/logger");
const mockDatabase_1 = require("./mockDatabase");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let db;
let useMockDb = false;
const runMigrations = async () => {
    if (useMockDb) {
        return;
    }
    try {
        const migrationPath = path.join(__dirname, '../database/migrate.sql');
        if (fs.existsSync(migrationPath)) {
            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
            await db.raw(migrationSQL);
            logger_1.logger.info('Database migrations completed successfully');
        }
    }
    catch (error) {
        logger_1.logger.error('Migration failed:', error);
        // Don't fail the app, but log the error
    }
};
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
        // Run database migrations
        await runMigrations();
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