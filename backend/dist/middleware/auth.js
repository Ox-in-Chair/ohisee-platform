"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("./errorHandler");
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errorHandler_1.AppError('Authentication required', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.headers['x-tenant-id'] = decoded.tenantId;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new errorHandler_1.AppError('Invalid token', 401));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new errorHandler_1.AppError('Authentication required', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('Insufficient permissions', 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map