import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { body, validationResult } from 'express-validator'
import { ReportController } from '../controllers/reportController'
import { getTenantFromRequest } from '../middleware/tenant'
import { getDb } from '../db/connection'

const router = Router()
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const reportController = new ReportController()

const validateReport = [
  body('category').isIn(['product_safety', 'misconduct', 'health_safety', 'harassment']),
  body('title').isLength({ min: 5 }).trim(),
  body('description').isLength({ min: 20 }).trim(),
  body('email').optional().isEmail(),
]

// Debug endpoint to test database
router.get('/debug', async (req: Request, res: Response) => {
  try {
    const db = getDb()
    
    // Check if using mock database
    if (typeof db.getReports === 'function') {
      const reports = await db.getReports('kangopak')
      return res.json({ type: 'mock', count: reports.length, reports })
    }
    
    // Real database - check table exists
    const tableExists = await db.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'reports'
      )
    `)
    
    if (!tableExists.rows[0].exists) {
      return res.json({ error: 'Reports table does not exist' })
    }
    
    // Check table columns
    const columns = await db.raw(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reports'
      ORDER BY ordinal_position
    `)
    
    // Try to get reports count
    const countResult = await db.raw('SELECT COUNT(*) as count FROM reports')
    const count = countResult.rows[0].count
    
    res.json({
      type: 'postgresql',
      tableExists: true,
      count: parseInt(count),
      columns: columns.rows
    })
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack })
  }
})

router.get('/', getTenantFromRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await reportController.getReports(req, res)
  } catch (error) {
    next(error)
  }
})

router.post(
  '/',
  getTenantFromRequest,
  upload.array('attachments', 5),
  validateReport,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      await reportController.createReport(req, res)
    } catch (error) {
      next(error)
    }
  }
)

router.get('/track/:referenceNumber', getTenantFromRequest, async (req, res, next) => {
  try {
    await reportController.trackReport(req, res)
  } catch (error) {
    next(error)
  }
})

router.get('/categories/stats', getTenantFromRequest, async (req, res, next) => {
  try {
    await reportController.getCategoryStats(req, res)
  } catch (error) {
    next(error)
  }
})

export default router