import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { getTenantDb } from '../db/connection'
import { sendReportNotification } from '../services/emailService'
import { detectBadFaith } from '../services/badFaithDetection'
import { logger } from '../utils/logger'

export class ReportController {
  async createReport(req: Request, res: Response) {
    const tenantId = req.headers['x-tenant-id'] as string
    const db = getTenantDb(tenantId)
    
    const {
      category,
      title,
      description,
      location,
      date_occurred,
      witnesses,
      previous_report,
      email,
    } = req.body

    const badFaithScore = await detectBadFaith({
      title,
      description,
      category,
      previous_report,
    })

    try {
      // Check if using mock database
      let report: any
      if (typeof db.createReport === 'function') {
        // Mock database
        report = await db.createReport({
          category,
          title,
          description,
          location,
          date_occurred,
          witnesses,
          previous_report: previous_report === 'true',
          reporter_email: email,
          bad_faith_score: badFaithScore.score,
          bad_faith_flags: JSON.stringify(badFaithScore.flags),
        })
      } else {
        // Real database
        const referenceNumber = this.generateReferenceNumber()
        const reportId = uuidv4()
        
        await db('reports').insert({
          id: reportId,
          reference_number: referenceNumber,
          category,
          title,
          description,
          location,
          date_occurred,
          witnesses,
          previous_report: previous_report === 'true',
          reporter_email: email,
          bad_faith_score: badFaithScore.score,
          bad_faith_flags: JSON.stringify(badFaithScore.flags),
          status: 'submitted',
          created_at: new Date(),
        })
        report = { id: reportId, reference_number: referenceNumber }
      }
      
      // Skip file attachments for mock database
      if (!db.createReport && req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          await db('report_attachments').insert({
            id: uuidv4(),
            report_id: report.id,
            filename: file.originalname,
            mime_type: file.mimetype,
            size: file.size,
            storage_path: `${tenantId}/${report.id}/${file.originalname}`,
          })
        }
      }

      // Only send email if configured
      if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your-sendgrid-api-key') {
        await sendReportNotification({
          referenceNumber: report.reference_number,
          category,
          title,
          tenantId,
        })
      }

      logger.info(`Report created: ${report.reference_number} for tenant: ${tenantId}`)

      res.status(201).json({
        success: true,
        reference_number: report.reference_number,
        message: 'Report submitted successfully',
      })
    } catch (error) {
      logger.error('Error creating report:', error)
      throw error
    }
  }

  async trackReport(req: Request, res: Response) {
    const { referenceNumber } = req.params
    const tenantId = req.headers['x-tenant-id'] as string
    const db = getTenantDb(tenantId)

    try {
      let report: any
      let updates: any[] = []

      if (typeof db.getReportByReference === 'function') {
        // Mock database
        report = await db.getReportByReference(referenceNumber)
      } else {
        // Real database
        report = await db('reports')
          .where('reference_number', referenceNumber)
          .first()

        if (report) {
          updates = await db('report_updates')
            .where('report_id', report.id)
            .orderBy('created_at', 'desc')
        }
      }

      if (!report) {
        return res.status(404).json({
          error: 'Report not found',
        })
      }

      res.json({
        reference_number: report.reference_number,
        status: report.status,
        submitted_at: report.created_at,
        last_updated: report.updated_at,
        updates: updates.map(update => ({
          message: update.message || 'Status update',
          date: update.created_at,
        })),
      })
    } catch (error) {
      logger.error('Error tracking report:', error)
      throw error
    }
  }

  async getReports(req: Request, res: Response) {
    const tenantId = req.headers['x-tenant-id'] as string
    const db = getTenantDb(tenantId)

    try {
      let reports: any[]

      if (typeof db.getReports === 'function') {
        // Mock database
        reports = await db.getReports(tenantId)
      } else {
        // Real database
        reports = await db('reports')
          .select(['id', 'reference_number', 'category', 'title', 'status', 'priority', 'created_at', 'updated_at'])
          .orderBy('created_at', 'desc')
      }

      res.json({
        reports: reports.map(report => ({
          id: report.id,
          referenceNumber: report.reference_number,
          category: report.category,
          title: report.title,
          status: report.status,
          priority: report.priority,
          submittedAt: report.created_at,
          lastUpdated: report.updated_at,
        })),
      })
    } catch (error) {
      logger.error('Error getting reports:', error)
      throw error
    }
  }

  async getCategoryStats(req: Request, res: Response) {
    const tenantId = req.headers['x-tenant-id'] as string
    const db = getTenantDb(tenantId)

    try {
      const stats = await db('reports')
        .select('category')
        .count('* as count')
        .groupBy('category')

      const monthlyTrend = await db('reports')
        .select(db.raw("DATE_TRUNC('month', created_at) as month"))
        .count('* as count')
        .groupBy('month')
        .orderBy('month', 'desc')
        .limit(12)

      res.json({
        categoryBreakdown: stats,
        monthlyTrend,
      })
    } catch (error) {
      logger.error('Error getting category stats:', error)
      throw error
    }
  }

  private generateReferenceNumber(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    return `REF-${year}-${random}`
  }
}