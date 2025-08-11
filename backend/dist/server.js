"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const routes_1 = __importDefault(require("./routes"));
const connection_1 = require("./db/connection");
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', true); // Enable trust proxy for Render load balancer
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'https://ohisee-platform-frontend.vercel.app', // Correct frontend URL
        'https://ohisee-platform.vercel.app', // Keep old one for compatibility
        process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api', rateLimiter_1.rateLimiter);
app.use('/api', routes_1.default);
app.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.2.1' // Force deployment 
    });
});
// Direct API test endpoint
app.get('/api/test', (_req, res) => {
    res.json({ message: 'API routing works!', timestamp: new Date().toISOString() });
});
// Direct reports test endpoint  
app.get('/api/reports-test', (_req, res) => {
    res.json({ reports: [], message: 'Direct reports endpoint works!' });
});
app.use(errorHandler_1.errorHandler);
async function startServer() {
    try {
        await (0, connection_1.initializeDatabase)();
        app.listen(PORT, () => {
            logger_1.logger.info(`Server running on port ${PORT}`);
            logger_1.logger.info(`Environment: ${process.env.NODE_ENV}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map