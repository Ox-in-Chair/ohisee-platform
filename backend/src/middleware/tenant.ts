import { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler'

export const getTenantFromRequest = (req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'] as string || process.env.NEXT_PUBLIC_TENANT_ID || 'default'
  
  if (!tenantId) {
    throw new AppError('Tenant ID is required', 400)
  }

  req.headers['x-tenant-id'] = tenantId
  next()
}