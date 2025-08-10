import { Router } from 'express'
import reportsRouter from './reports'
import aiRouter from './ai'
import authRouter from './auth'
import adminRouter from './admin'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use('/reports', reportsRouter)
router.use('/ai', aiRouter)
router.use('/auth', authRouter)
router.use('/admin', authenticate, adminRouter)

export default router