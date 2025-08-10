import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'

interface Report {
  id: string
  reference_number: string
  category: string
  title: string
  description: string
  location?: string
  date_occurred?: string
  witnesses?: string
  previous_report: boolean
  reporter_email?: string
  bad_faith_score: number
  bad_faith_flags: string
  status: string
  priority: string
  created_at: Date
  updated_at: Date
}

interface User {
  id: string
  email: string
  password_hash: string
  first_name: string
  last_name: string
  role: string
  tenant_id: string
  is_active: boolean
}

class MockDatabase {
  private reports: Map<string, Report> = new Map()
  private users: Map<string, User> = new Map()
  private reportUpdates: Map<string, any[]> = new Map()

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Add sample admin user (password: admin123)
    const adminUser: User = {
      id: uuidv4(),
      email: 'admin@demo.ohisee.com',
      password_hash: '$2a$10$YGzmJwLsRgKcKxFPKxGOhOqP7BQkXPxWXxN8VYh2XqF8vxnxXVxXq', // "admin123"
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      tenant_id: 'demo',
      is_active: true,
    }
    this.users.set(adminUser.email, adminUser)

    // Add sample reports
    const sampleReports = [
      {
        id: uuidv4(),
        reference_number: 'REF-2025-00001',
        category: 'product_safety',
        title: 'Contamination risk in production line 3',
        description: 'Observed potential contamination issue during shift change.',
        status: 'under_review',
        priority: 'high',
        bad_faith_score: 15,
        bad_faith_flags: '[]',
        previous_report: false,
        created_at: new Date('2025-01-15'),
        updated_at: new Date('2025-01-15'),
      },
      {
        id: uuidv4(),
        reference_number: 'REF-2025-00002',
        category: 'health_safety',
        title: 'Missing safety guards on equipment',
        description: 'Safety guards removed from packaging machine and not replaced.',
        status: 'investigating',
        priority: 'critical',
        bad_faith_score: 10,
        bad_faith_flags: '[]',
        previous_report: false,
        created_at: new Date('2025-01-14'),
        updated_at: new Date('2025-01-14'),
      },
    ]

    sampleReports.forEach(report => {
      this.reports.set(report.id, report as Report)
    })

    logger.info('Mock database initialized with sample data')
  }

  async getReports(tenantId: string, filters?: any) {
    const reports = Array.from(this.reports.values())
    return reports.filter(r => {
      if (filters?.status && r.status !== filters.status) return false
      if (filters?.category && r.category !== filters.category) return false
      return true
    })
  }

  async getReport(id: string) {
    return this.reports.get(id) || null
  }

  async getReportByReference(referenceNumber: string) {
    return Array.from(this.reports.values()).find(r => r.reference_number === referenceNumber) || null
  }

  async createReport(data: Partial<Report>) {
    const report: Report = {
      id: uuidv4(),
      reference_number: this.generateReferenceNumber(),
      category: data.category!,
      title: data.title!,
      description: data.description!,
      location: data.location,
      date_occurred: data.date_occurred,
      witnesses: data.witnesses,
      previous_report: data.previous_report || false,
      reporter_email: data.reporter_email,
      bad_faith_score: data.bad_faith_score || 0,
      bad_faith_flags: data.bad_faith_flags || '[]',
      status: 'submitted',
      priority: 'medium',
      created_at: new Date(),
      updated_at: new Date(),
    }
    
    this.reports.set(report.id, report)
    return report
  }

  async updateReport(id: string, updates: Partial<Report>) {
    const report = this.reports.get(id)
    if (!report) throw new Error('Report not found')
    
    Object.assign(report, updates, { updated_at: new Date() })
    this.reports.set(id, report)
    return report
  }

  async getUser(email: string, tenantId: string) {
    const user = this.users.get(email)
    return user && user.tenant_id === tenantId ? user : null
  }

  async createUser(data: Partial<User>) {
    const user: User = {
      id: uuidv4(),
      email: data.email!,
      password_hash: data.password_hash!,
      first_name: data.first_name!,
      last_name: data.last_name!,
      role: data.role || 'user',
      tenant_id: data.tenant_id!,
      is_active: true,
    }
    
    this.users.set(user.email, user)
    return user
  }

  async getStats(tenantId: string) {
    const reports = Array.from(this.reports.values())
    
    const categoryStats = reports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusStats = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: reports.length,
      categoryStats,
      statusStats,
      recentReports: reports.slice(0, 5),
    }
  }

  private generateReferenceNumber(): string {
    const year = new Date().getFullYear()
    const count = this.reports.size + 1
    return `REF-${year}-${count.toString().padStart(5, '0')}`
  }
}

export const mockDb = new MockDatabase()