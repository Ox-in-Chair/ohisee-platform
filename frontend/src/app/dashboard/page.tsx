'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, FileText, Users, Bell, CheckCircle, 
  HandshakeIcon, FolderOpen, GraduationCap, Search,
  Home, AlertTriangle, TrendingUp
} from 'lucide-react'

export default function DashboardPage() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const modules = [
    {
      id: 'reporting',
      title: 'Confidential Reporting',
      icon: <Bell className="w-6 h-6" />,
      description: 'Anonymous whistleblower system with AI-assisted report writing',
      status: 'active',
      stats: { open: 12, pending: 3, resolved: 45 },
      color: 'bg-yellow-100 text-yellow-800',
      href: '/report/new'
    },
    {
      id: 'quality',
      title: 'Quality Management',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Track quality issues, manage corrective actions, monitor metrics',
      status: 'active',
      stats: { active: 8, monthly: 15, rate: '92%' },
      color: 'bg-blue-100 text-blue-800',
      href: '/quality'
    },
    {
      id: 'supplier',
      title: 'Supplier Management',
      icon: <Users className="w-6 h-6" />,
      description: 'Manage supplier information, track certifications, monitor performance',
      status: 'setup',
      stats: { active: 24, pending: 5, expiring: 3 },
      color: 'bg-purple-100 text-purple-800',
      href: '/supplier'
    },
    {
      id: 'document',
      title: 'Document Control',
      icon: <FolderOpen className="w-6 h-6" />,
      description: 'Centralized document management with version control and workflows',
      status: 'setup',
      stats: { total: 156, review: 12, updates: 8 },
      color: 'bg-orange-100 text-orange-800',
      href: '/document'
    },
    {
      id: 'training',
      title: 'Training Management',
      icon: <GraduationCap className="w-6 h-6" />,
      description: 'Track employee training, manage certifications, schedule courses',
      status: 'new',
      stats: { employees: 45, courses: 18, expiring: 7 },
      color: 'bg-green-100 text-green-800',
      href: '/training'
    },
    {
      id: 'audit',
      title: 'Audit Management',
      icon: <Search className="w-6 h-6" />,
      description: 'Schedule audits, track findings, manage corrective actions',
      status: 'new',
      stats: { upcoming: 3, findings: 12, score: '85%' },
      color: 'bg-red-100 text-red-800',
      href: '/audit'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">K</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">OhiSee!</h1>
                <p className="text-sm opacity-90">Operations Intelligence Centre</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">GMP Compliant</span>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="bg-primary-700 px-6">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`py-3 px-4 border-b-3 transition-all flex items-center gap-2 ${
                activeModule === 'dashboard' 
                  ? 'border-secondary text-white' 
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`py-3 px-4 border-b-3 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeModule === module.id 
                    ? 'border-secondary text-white' 
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                {module.icon}
                {module.title}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeModule === 'dashboard' ? (
          <>
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-primary mb-2">Compliance Dashboard</h2>
              <p className="text-gray-600">Overview of all compliance modules and activities</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="text-xl font-semibold text-primary mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/report/new" className="btn-primary">
                  Submit Confidential Report
                </Link>
                <Link href="/quality/issue" className="btn-primary">
                  Report Quality Issue
                </Link>
                <button className="btn-secondary">
                  Upload Document
                </button>
                <button className="btn-secondary">
                  View Training
                </button>
              </div>
            </div>

            {/* Module Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Link
                  key={module.id}
                  href={module.href}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${module.color}`}>
                      {module.icon}
                    </div>
                    <StatusBadge status={module.status} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                  <div className="flex justify-between text-sm">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-semibold text-primary">{value}</span>
                        <span className="text-gray-500 block capitalize">{key}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">System Status</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">All Systems Operational</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm">98% Uptime This Month</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">3 Pending Reviews</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Individual Module View
          <div>
            <h2 className="text-3xl font-semibold text-primary mb-8">
              {modules.find(m => m.id === activeModule)?.title}
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <p className="text-gray-600 mb-6">
                {modules.find(m => m.id === activeModule)?.description}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  This module is currently being configured. Full functionality will be available soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 py-6 text-center text-sm text-gray-600">
        <p>© 2025 Kangopak - OhiSee! Operations Intelligence Centre | GMP Compliant | All Rights Reserved</p>
      </footer>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    setup: 'bg-yellow-100 text-yellow-800',
    new: 'bg-blue-100 text-blue-800'
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {status === 'setup' ? 'Setup Required' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}