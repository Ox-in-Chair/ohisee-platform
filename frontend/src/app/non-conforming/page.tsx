'use client'

import { useState } from 'react'
import { 
  AlertTriangle, ClipboardList, FileText, TrendingUp, Search, 
  Filter, Plus, Clock, CheckCircle, XCircle, Eye, Edit
} from 'lucide-react'

interface NCA {
  id: string
  ncaNumber: string
  productType: 'raw_material' | 'wip' | 'finished_product'
  title: string
  description: string
  detectedBy: string
  detectedDate: string
  disposition: 'reject' | 'rework' | 'concession' | 'pending'
  status: 'open' | 'investigating' | 'corrective_action' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  rootCauseAnalysis: string
  correctiveAction: string
  dueDate: string
  assignedTo: string
  traceabilityDetails: string
  impact: 'safety' | 'quality' | 'legality' | 'minor'
}

export default function NonConformingPage() {
  const [activeTab, setActiveTab] = useState<'ncas' | 'trending' | 'analytics'>('ncas')
  const [showNewNCAForm, setShowNewNCAForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Mock data based on 5.7 BRCGS Control of Non-Conforming Product Procedure
  const ncas: NCA[] = [
    {
      id: '1',
      ncaNumber: 'NCA-2025-001',
      productType: 'finished_product',
      title: 'Product contamination in batch 245',
      description: 'Foreign material detected in finished pouches during final inspection. Metal fragments found in 3 units from production run.',
      detectedBy: 'Quality Inspector',
      detectedDate: '2025-08-10',
      disposition: 'reject',
      status: 'investigating',
      priority: 'critical',
      rootCauseAnalysis: 'Preliminary investigation indicates worn cutting blade causing metal particles to enter product stream. Requires immediate equipment inspection.',
      correctiveAction: 'Replace cutting blade, implement enhanced blade inspection protocol, quarantine affected batch.',
      dueDate: '2025-08-15',
      assignedTo: 'Production Manager',
      traceabilityDetails: 'Batch: 245, Machine: DMF-001, Shift: Morning, Date: 2025-08-10',
      impact: 'safety'
    },
    {
      id: '2',
      ncaNumber: 'NCA-2025-002',
      productType: 'raw_material',
      title: 'Supplier film thickness variation',
      description: 'Incoming film material from Supplier XYZ shows thickness variation beyond specification limits (±7%). Affects 2 rolls.',
      detectedBy: 'Incoming Inspection',
      detectedDate: '2025-08-09',
      disposition: 'rework',
      status: 'corrective_action',
      priority: 'medium',
      rootCauseAnalysis: 'Supplier process control issue during extrusion. Temperature variations during production run caused gauge variations.',
      correctiveAction: 'Return to supplier for rework. Request supplier corrective action plan. Implement additional incoming inspection checks.',
      dueDate: '2025-08-20',
      assignedTo: 'Purchasing Manager',
      traceabilityDetails: 'Supplier: XYZ Films, Lot: F2025-0809, Rolls: R-1234, R-1235',
      impact: 'quality'
    },
    {
      id: '3',
      ncaNumber: 'NCA-2025-003',
      productType: 'wip',
      title: 'Sealing temperature out of specification',
      description: 'WIP pouches showing poor seal integrity. Sealing temperature recorded at 185°C instead of specified 195°C ±5°C.',
      detectedBy: 'Line Operator',
      detectedDate: '2025-08-08',
      disposition: 'concession',
      status: 'closed',
      priority: 'low',
      rootCauseAnalysis: 'Temperature controller calibration drift. Last calibration performed 6 months ago, due for quarterly calibration.',
      correctiveAction: 'Recalibrate temperature controller. Implement enhanced calibration schedule. Test affected WIP - granted concession for continued production.',
      dueDate: '2025-08-12',
      assignedTo: 'Maintenance Technician',
      traceabilityDetails: 'Machine: Sealer-002, Production Log: PL-20250808-002',
      impact: 'minor'
    }
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      corrective_action: 'bg-orange-100 text-orange-800', 
      closed: 'bg-green-100 text-green-800'
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

  const getDispositionColor = (disposition: string) => {
    const colors = {
      reject: 'bg-red-100 text-red-800',
      rework: 'bg-yellow-100 text-yellow-800',
      concession: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    }
    return colors[disposition as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getImpactIcon = (impact: string) => {
    switch(impact) {
      case 'safety': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'quality': return <ClipboardList className="w-4 h-4 text-yellow-500" />
      case 'legality': return <FileText className="w-4 h-4 text-purple-500" />
      default: return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const filteredNCAs = filterStatus === 'all' ? ncas : ncas.filter(nca => nca.status === filterStatus)
  const overdueNCAs = ncas.filter(nca => new Date(nca.dueDate) < new Date() && nca.status !== 'closed')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Control of Non-Conforming Product</h1>
                <p className="text-sm text-gray-600">Non-Conformance Advice (NCA) System - BRCGS 5.7</p>
              </div>
            </div>
            <button 
              onClick={() => setShowNewNCAForm(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New NCA
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="border-t border-gray-200">
          <div className="px-6">
            <div className="flex space-x-8">
              {[
                { id: 'ncas', name: 'Active NCAs', icon: ClipboardList },
                { id: 'trending', name: 'Trend Analysis', icon: TrendingUp },
                { id: 'analytics', name: 'Analytics', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {tab.name}
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

        {activeTab === 'ncas' && (
          <>
            {/* Alert for Overdue NCAs */}
            {overdueNCAs.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <h3 className="text-sm font-medium text-red-800">
                    {overdueNCAs.length} NCA{overdueNCAs.length > 1 ? 's' : ''} overdue (20 working day limit exceeded)
                  </h3>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  NCAs must be closed out within 20 working days from date opened. Immediate attention required.
                </p>
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ClipboardList className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open NCAs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ncas.filter(nca => nca.status !== 'closed').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">{overdueNCAs.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Critical Priority</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ncas.filter(nca => nca.priority === 'critical').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Closed This Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ncas.filter(nca => nca.status === 'closed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NCAs Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Non-Conformance Advices</h3>
                  <div className="flex items-center space-x-4">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="corrective_action">Corrective Action</option>
                      <option value="closed">Closed</option>
                    </select>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search NCAs..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NCA Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disposition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredNCAs.map((nca) => (
                      <tr key={nca.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getImpactIcon(nca.impact)}
                            <span className="ml-2 text-sm font-medium text-gray-900">{nca.ncaNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{nca.title}</div>
                          <div className="text-sm text-gray-500">Detected by: {nca.detectedBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-gray-500">
                            {nca.productType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(nca.priority)}`}>
                            {nca.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(nca.status)}`}>
                            {nca.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDispositionColor(nca.disposition)}`}>
                            {nca.disposition}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{nca.dueDate}</div>
                          {new Date(nca.dueDate) < new Date() && nca.status !== 'closed' && (
                            <div className="text-xs text-red-600 font-medium">Overdue</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Edit className="w-4 h-4" />
                            </button>
                            {nca.status !== 'closed' && (
                              <button className="text-purple-600 hover:text-purple-800">
                                Close
                              </button>
                            )}
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

        {activeTab === 'trending' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">NCA Trend Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">NCAs by Product Type</h4>
                <div className="space-y-3">
                  {['Raw Material', 'Work in Progress', 'Finished Product'].map(type => {
                    const typeKey = type.toLowerCase().replace(' ', '_') as 'raw_material' | 'wip' | 'finished_product'
                    const count = ncas.filter(nca => nca.productType === typeKey).length
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{type}</span>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Root Cause Categories</h4>
                <p className="text-sm text-gray-600">
                  Analysis of root causes using Ishikawa diagram methodology (Man, Machine, Method, Environment, Material, Measuring) would be displayed here.
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Trend Alert</h4>
              <p className="text-sm text-yellow-700">
                Significant increase in NCAs for "Machine" category detected. Root cause analysis required as per BRCGS 5.7 requirements.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">NCA Analytics Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Closure Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Within 20 days:</span>
                    <span className="text-sm font-medium text-green-600">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average closure time:</span>
                    <span className="text-sm font-medium text-gray-900">14 days</span>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Impact Analysis</h4>
                <div className="space-y-2">
                  {['Safety', 'Quality', 'Legality', 'Minor'].map(impact => {
                    const impactKey = impact.toLowerCase() as 'safety' | 'quality' | 'legality' | 'minor'
                    const count = ncas.filter(nca => nca.impact === impactKey).length
                    return (
                      <div key={impact} className="flex justify-between">
                        <span className="text-sm text-gray-600">{impact}:</span>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Monthly Trends</h4>
                <p className="text-sm text-gray-600">
                  Chart showing monthly NCA volume, closure rates, and recurrence patterns.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New NCA Modal - would be implemented as a separate component */}
      {showNewNCAForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">New Non-Conformance Advice (NCA)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete form would include all BRCGS 5.7 required fields: product details, traceability information, 
              root cause analysis, corrective actions, disposition determination, and backtracking verification.
            </p>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowNewNCAForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Create NCA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}