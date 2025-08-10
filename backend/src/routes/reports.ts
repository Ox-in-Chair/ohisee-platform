import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { body, validationResult } from 'express-validator'
import { ReportController } from '../controllers/reportController'
import { getTenantFromRequest } from '../middleware/tenant'

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