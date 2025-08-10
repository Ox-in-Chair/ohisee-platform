import sgMail from '@sendgrid/mail'
import { logger } from '../utils/logger'

// Only set API key if configured
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your-sendgrid-api-key') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface ReportNotification {
  referenceNumber: string
  category: string
  title: string
  tenantId: string
}

export const sendReportNotification = async (data: ReportNotification) => {
  const { referenceNumber, category, title, tenantId } = data

  const categoryLabels: Record<string, string> = {
    product_safety: 'Product Safety & Quality',
    misconduct: 'Misconduct & Ethics',
    health_safety: 'Health & Safety',
    harassment: 'Harassment & Discrimination',
  }

  const msg = {
    to: process.env.ADMIN_EMAIL!,
    from: process.env.EMAIL_FROM!,
    subject: `New Confidential Report: ${referenceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #373658; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">New Confidential Report Received</h2>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p><strong>Reference Number:</strong> ${referenceNumber}</p>
          <p><strong>Category:</strong> ${categoryLabels[category]}</p>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Tenant:</strong> ${tenantId}</p>
          <p style="margin-top: 20px;">
            Please log in to the admin dashboard to review this report and begin the investigation process.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/reports/${referenceNumber}" 
             style="display: inline-block; background: #C44940; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 15px;">
            View Report
          </a>
        </div>
        <div style="padding: 15px; background: #fff; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          <p style="margin: 0;">This is an automated notification from the OhISee Confidential Reporting System.</p>
          <p style="margin: 5px 0 0 0;">Please do not reply to this email.</p>
        </div>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    logger.info(`Report notification sent for ${referenceNumber}`)
  } catch (error) {
    logger.error('Failed to send email notification:', error)
  }
}

export const sendReportUpdate = async (
  email: string,
  referenceNumber: string,
  status: string,
  message: string
) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM!,
    subject: `Update on Your Report: ${referenceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #373658; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Report Status Update</h2>
        </div>
        <div style="padding: 20px; background: #f5f5f5;">
          <p><strong>Reference Number:</strong> ${referenceNumber}</p>
          <p><strong>Status:</strong> ${status}</p>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-top: 15px;">
            <p style="margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 20px;">
            You can track your report status at any time using your reference number.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/report/track" 
             style="display: inline-block; background: #C44940; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin-top: 15px;">
            Track Report
          </a>
        </div>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    logger.info(`Update sent for report ${referenceNumber}`)
  } catch (error) {
    logger.error('Failed to send update email:', error)
  }
}