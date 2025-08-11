"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantFromRequest = void 0;
const errorHandler_1 = require("./errorHandler");
const getTenantFromRequest = (req, res, next) => {
    const tenantId = req.headers['x-tenant-id'] || process.env.NEXT_PUBLIC_TENANT_ID || 'default';
    if (!tenantId) {
        return next(new errorHandler_1.AppError('Tenant ID is required', 400));
    }
    req.headers['x-tenant-id'] = tenantId;
    next();
};
exports.getTenantFromRequest = getTenantFromRequest;
//# sourceMappingURL=tenant.js.map