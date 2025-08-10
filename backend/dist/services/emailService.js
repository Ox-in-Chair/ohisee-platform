"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReportUpdate = exports.sendReportNotification = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const logger_1 = require("../utils/logger");
// Only set API key if configured
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY !== 'your-sendgrid-api-key') {
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
}
const sendReportNotification = async (data) => {
    const { referenceNumber, category, title, tenantId } = data;
    const categoryLabels = {
        product_safety: 'Product Safety & Quality',
        misconduct: 'Misconduct & Ethics',
        health_safety: 'Health & Safety',
        harassment: 'Harassment & Discrimination',
    };
    const msg = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.EMAIL_FROM,
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
    };
    try {
        await mail_1.default.send(msg);
        logger_1.logger.info(`Report notification sent for ${referenceNumber}`);
    }
    catch (error) {
        logger_1.logger.error('Failed to send email notification:', error);
    }
};
exports.sendReportNotification = sendReportNotification;
const sendReportUpdate = async (email, referenceNumber, status, message) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM,
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
    };
    try {
        await mail_1.default.send(msg);
        logger_1.logger.info(`Update sent for report ${referenceNumber}`);
    }
    catch (error) {
        logger_1.logger.error('Failed to send update email:', error);
    }
};
exports.sendReportUpdate = sendReportUpdate;
//# sourceMappingURL=emailService.js.map