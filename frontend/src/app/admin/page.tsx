'use client'

import { useState, useEffect } from 'react'
import { 
  Users, FileText, AlertTriangle, CheckCircle, 
  Clock, TrendingUp, Filter, Search, Plus,
  Eye, Edit, MessageSquare
} from 'lucide-react'

interface DashboardStats {
  totalReports: number
  categoryBreakdown: { category: string; count: number }[]
  statusBreakdown: { status: string; count: number }[]
  recentReports: any[]
  highRiskReports: any[]
}

interface Report {
  id: string
  reference_number: string
  title: string
  category: string
  status: string
  priority: string
  created_at: string
  bad_faith_score: number
}

export default function AdminCenter() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [activeView, setActiveView] = useState<'dashboard' | 'reports' | 'analytics'>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for demo - in real app, fetch from /api/admin/dashboard/stats
    setStats({
      totalReports: 127,
      categoryBreakdown: [
        { category: 'non_conforming', count: 45 },
        { category: 'maintenance', count: 32 },
        { category: 'complaints', count: 28 },
        { category: 'confidential', count: 15 },
        { category: 'waste_management', count: 7 }
      ],
      statusBreakdown: [
        { status: 'open', count: 42 },
        { status: 'investigating', count: 28 },
        { status: 'pending_review', count: 15 },
        { status: 'resolved', count: 32 },
        { status: 'closed', count: 10 }
      ],
      recentReports: [
        { id: '1', reference_number: 'NCA-2025-001', title: 'Product contamination batch 245', category: 'non_conforming', status: 'investigating' },
        { id: '2', reference_number: 'MTC-2025-012', title: 'Conveyor belt maintenance overdue', category: 'maintenance', status: 'open' },
        { id: '3', reference_number: 'CMP-2025-008', title: 'Customer complaint - damaged packaging', category: 'complaints', status: 'pending_review' }
      ],
      highRiskReports: [
        { id: '1', reference_number: 'NCA-2025-001', title: 'Critical contamination risk', bad_faith_score: 15, priority: 'critical' }
      ]
    })
    
    setReports([
      { id: '1', reference_number: 'NCA-2025-001', title: 'Product contamination batch 245', category: 'non_conforming', status: 'investigating', priority: 'critical', created_at: '2025-08-10', bad_faith_score: 15 },
      { id: '2', reference_number: 'MTC-2025-012', title: 'Conveyor belt maintenance overdue', category: 'maintenance', status: 'open', priority: 'high', created_at: '2025-08-09', bad_faith_score: 5 },
      { id: '3', reference_number: 'CMP-2025-008', title: 'Customer complaint - damaged packaging', category: 'complaints', status: 'pending_review', priority: 'medium', created_at: '2025-08-08', bad_faith_score: 10 }
    ])
    
    setLoading(false)
  }, [])

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'reports', name: 'Reports', icon: FileText },
    { id: 'analytics', name: 'Analytics', icon: Users }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      pending_review: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">OhiSee! Admin Center</h1>
                <p className="text-sm text-gray-600">Multi-Tenant Compliance Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Demo Tenant</span>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-200">
          <div className="px-6">
            <div className="flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeView === item.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalReports}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.statusBreakdown.find(s => s.status === 'pending_review')?.count || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">High Risk</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.highRiskReports.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.statusBreakdown.find(s => s.status === 'resolved')?.count || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats?.recentReports.map((report) => (
                      <tr key={report.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.reference_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{report.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="capitalize">{report.category.replace('_', ' ')}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                            {report.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-purple-600 hover:text-purple-800">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeView === 'reports' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">All Reports</h3>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </button>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-600">
                    <Plus className="w-4 h-4 mr-2" />
                    New Report
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {report.reference_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{report.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">{report.category.replace('_', ' ')}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-medium ${report.bad_faith_score > 50 ? 'text-red-600' : report.bad_faith_score > 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {report.bad_faith_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-800">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Reports by Category</h4>
                {stats?.categoryBreakdown.map((item) => (
                  <div key={item.category} className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 capitalize">{item.category.replace('_', ' ')}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Reports by Status</h4>
                {stats?.statusBreakdown.map((item) => (
                  <div key={item.status} className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 capitalize">{item.status.replace('_', ' ')}</span>
                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}