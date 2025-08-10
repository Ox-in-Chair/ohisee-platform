import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { getDb } from '../db/connection'
import { AppError } from '../middleware/errorHandler'
import { strictRateLimiter } from '../middleware/rateLimiter'
import { logger } from '../utils/logger'

const router = Router()

const generateToken = (userId: string, email: string, role: string, tenantId: string): string => {
  return jwt.sign(
    { userId, email, role, tenantId },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  )
}

router.post(
  '/register',
  strictRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').isString().trim(),
    body('lastName').isString().trim(),
    body('tenantId').isUUID(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, firstName, lastName, tenantId } = req.body
      const db = getDb()

      const existingUser = await db('users')
        .where({ email, tenant_id: tenantId })
        .first()

      if (existingUser) {
        throw new AppError('User already exists', 400)
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const [user] = await db('users')
        .insert({
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          tenant_id: tenantId,
          role: 'user',
        })
        .returning(['id', 'email', 'role'])

      const token = generateToken(user.id, user.email, user.role, tenantId)

      logger.info(`User registered: ${email} for tenant: ${tenantId}`)

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName,
          lastName,
          role: user.role,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/login',
  strictRateLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    body('tenantId').isUUID(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password, tenantId } = req.body
      const db = getDb()

      const user = await db('users')
        .where({ email, tenant_id: tenantId })
        .first()

      if (!user || !await bcrypt.compare(password, user.password_hash)) {
        throw new AppError('Invalid credentials', 401)
      }

      if (!user.is_active) {
        throw new AppError('Account is disabled', 403)
      }

      await db('users')
        .where({ id: user.id })
        .update({ last_login: new Date() })

      const token = generateToken(user.id, user.email, user.role, tenantId)

      logger.info(`User logged in: ${email} for tenant: ${tenantId}`)

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      })
    } catch (error) {
      next(error)
    }
  }
)

router.post(
  '/forgot-password',
  strictRateLimiter,
  [body('email').isEmail().normalizeEmail()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router