'use client'

import { useState } from 'react'
import { 
  Package, FileText, CheckCircle, Clock, Plus, Search, 
  Filter, Download, Upload, Eye, Edit, Copy
} from 'lucide-react'

interface ProductSpec {
  id: string
  specNumber: string
  productType: 'stand_up' | 'flat_zipper' | 'flat_non_zipper' | 'spout' | 'k_seal' | 'quad_seal'
  productDescription: string
  customer: string
  internalRef: string
  status: 'draft' | 'approved' | 'active' | 'obsolete'
  approvedBy: string
  approvalDate: string
  revision: number
  specifications: {
    width: { value: number; tolerance: string }
    height: { value: number; tolerance: string }
    gusset?: { value: number; tolerance: string }
    materialConstruction: string
    overallGauge: number
    weight: { value: number; tolerance: string }
  }
  designChecklist?: {
    conceptApproval: boolean
    materialSelection: boolean
    structuralIntegrity: boolean
    printabilityAssessment: boolean
    regulatoryCompliance: boolean
    customerApproval: boolean
  }
}

export default function ProductSpecificationsPage() {
  const [activeTab, setActiveTab] = useState<'specifications' | 'templates' | 'approvals'>('specifications')
  const [showNewSpecForm, setShowNewSpecForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  // Mock data based on 5.1F1-F9 Pouch Specification Forms
  const productSpecs: ProductSpec[] = [
    {
      id: '1',
      specNumber: 'SPEC-2025-001',
      productType: 'stand_up',
      productDescription: 'Stand-up Pouch with Zipper - Food Grade',
      customer: 'Demo Customer A',
      internalRef: 'SUP-001',
      status: 'active',
      approvedBy: 'Technical Director',
      approvalDate: '2025-08-01',
      revision: 3,
      specifications: {
        width: { value: 150, tolerance: '±2mm' },
        height: { value: 200, tolerance: '±2mm' },
        gusset: { value: 80, tolerance: '±2mm' },
        materialConstruction: 'PET/AL/PE - 3 Layer Laminate',
        overallGauge: 120,
        weight: { value: 15.5, tolerance: '±7%' }
      },
      designChecklist: {
        conceptApproval: true,
        materialSelection: true,
        structuralIntegrity: true,
        printabilityAssessment: true,
        regulatoryCompliance: true,
        customerApproval: true
      }
    },
    {
      id: '2',
      specNumber: 'SPEC-2025-002',
      productType: 'spout',
      productDescription: 'Spout Stand-up Pouch - Beverage Application',
      customer: 'Demo Customer B',
      internalRef: 'SSP-002',
      status: 'approved',
      approvedBy: 'Quality Manager',
      approvalDate: '2025-08-05',
      revision: 1,
      specifications: {
        width: { value: 120, tolerance: '±2mm' },
        height: { value: 180, tolerance: '±2mm' },
        gusset: { value: 70, tolerance: '±2mm' },
        materialConstruction: 'PET/PE - 2 Layer Laminate',
        overallGauge: 100,
        weight: { value: 12.3, tolerance: '±7%' }
      },
      designChecklist: {
        conceptApproval: true,
        materialSelection: true,
        structuralIntegrity: true,
        printabilityAssessment: false,
        regulatoryCompliance: true,
        customerApproval: false
      }
    },
    {
      id: '3',
      specNumber: 'SPEC-2025-003',
      productType: 'flat_zipper',
      productDescription: 'Flat Pouch with Zipper - Bottom Fill',
      customer: 'Demo Customer C',
      internalRef: 'FPZ-003',
      status: 'draft',
      approvedBy: '',
      approvalDate: '',
      revision: 0,
      specifications: {
        width: { value: 200, tolerance: '±2mm' },
        height: { value: 280, tolerance: '±2mm' },
        materialConstruction: 'PP/PE - 2 Layer Laminate',
        overallGauge: 80,
        weight: { value: 8.9, tolerance: '±7%' }
      }
    }
  ]

  const productTypeLabels = {
    stand_up: 'Stand-up Pouch',
    flat_zipper: 'Flat Pouch with Zipper', 
    flat_non_zipper: 'Flat Pouch without Zipper',
    spout: 'Spout Pouch',
    k_seal: 'K-Seal Pouch',
    quad_seal: 'Quad Seal Pouch'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      obsolete: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredSpecs = productSpecs.filter(spec => {
    const statusMatch = filterStatus === 'all' || spec.status === filterStatus
    const typeMatch = filterType === 'all' || spec.productType === filterType
    return statusMatch && typeMatch
  })

  const getChecklistProgress = (checklist?: ProductSpec['designChecklist']) => {
    if (!checklist) return 0
    const completed = Object.values(checklist).filter(Boolean).length
    const total = Object.keys(checklist).length
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Specifications</h1>
                <p className="text-sm text-gray-600">Design Development & Pouch Specification Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Upload className="w-4 h-4 mr-2" />
                Import Spec
              </button>
              <button 
                onClick={() => setShowNewSpecForm(true)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Specification
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="border-t border-gray-200">
          <div className="px-6">
            <div className="flex space-x-8">
              {[
                { id: 'specifications', name: 'Product Specifications', icon: Package },
                { id: 'templates', name: 'Form Templates', icon: FileText },
                { id: 'approvals', name: 'Approval Workflow', icon: CheckCircle }
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

        {activeTab === 'specifications' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Specs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productSpecs.filter(spec => spec.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productSpecs.filter(spec => spec.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Draft Specs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {productSpecs.filter(spec => spec.status === 'draft').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Product Types</p>
                    <p className="text-2xl font-bold text-gray-900">6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Product Specifications</h3>
                  <div className="flex items-center space-x-4">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="approved">Approved</option>
                      <option value="active">Active</option>
                      <option value="obsolete">Obsolete</option>
                    </select>
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">All Types</option>
                      {Object.entries(productTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search specifications..."
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spec Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rev</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSpecs.map((spec) => (
                      <tr key={spec.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{spec.specNumber}</div>
                          <div className="text-sm text-gray-500">Ref: {spec.internalRef}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{spec.productDescription}</div>
                          <div className="text-sm text-gray-500">
                            {spec.specifications.width.value}×{spec.specifications.height.value}mm
                            {spec.specifications.gusset && ` (Gusset: ${spec.specifications.gusset.value}mm)`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {productTypeLabels[spec.productType]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {spec.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(spec.status)}`}>
                            {spec.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {spec.designChecklist ? (
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${getChecklistProgress(spec.designChecklist)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{getChecklistProgress(spec.designChecklist)}%</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Not started</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rev {spec.revision}
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
                              <Copy className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-800">
                              <Download className="w-4 h-4" />
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

        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Product Specification Form Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(productTypeLabels).map(([key, label]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Package className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">{label}</h4>
                      <p className="text-sm text-gray-500">Form 5.1F{key === 'stand_up' ? '1' : key === 'spout' ? '7' : '2'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Specification template with dimensions, material construction, tolerances, and approval workflow.
                  </p>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-600">
                      Use Template
                    </button>
                    <button className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Design Development Approval Workflow</h3>
            
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 mb-4">Design Development Checklist (Form 5.1F2)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">Concept Approval</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">Material Selection</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">Structural Integrity Assessment</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-sm font-medium">Printability Assessment</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-sm font-medium">Regulatory Compliance</span>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                    <span className="text-sm font-medium">Customer Approval</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Approval Authorities</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Technical Director:</span>
                  <span className="text-sm font-medium text-gray-900">Final specification approval</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Quality Manager:</span>
                  <span className="text-sm font-medium text-gray-900">Regulatory compliance verification</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Operations Manager:</span>
                  <span className="text-sm font-medium text-gray-900">Manufacturability assessment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Specification Modal */}
      {showNewSpecForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">New Product Specification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {Object.entries(productTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter product description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Internal Reference</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Internal ref number"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowNewSpecForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Create Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}