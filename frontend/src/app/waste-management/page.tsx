'use client'

import { useState } from 'react'
import { 
  Trash2, AlertTriangle, Package, FileText, Plus, 
  Filter, Search, Calendar, MapPin, User
} from 'lucide-react'

interface WasteEntry {
  id: string
  wasteType: string
  riskCategory: string
  storageLocation: string
  disposalMethod: string
  supplier: string
  quantity: number
  date: string
  recordReference: string
  hazards: string[]
  status: 'active' | 'disposed' | 'pending'
}

export default function WasteManagementPage() {
  const [activeTab, setActiveTab] = useState<'manifest' | 'disposal' | 'analytics'>('manifest')
  const [showNewEntryForm, setShowNewEntryForm] = useState(false)

  // Mock data based on 4.10F1 BRCGS Waste Manifest
  const wasteEntries: WasteEntry[] = [
    {
      id: '1',
      wasteType: 'Loose, Old and/or Damaged Blades & Cutters',
      riskCategory: 'Sharp Object',
      storageLocation: 'Yellow Secure Blade Disposal Container (Office)',
      disposalMethod: 'BCL Medical Waste Management',
      supplier: 'BCL Medical Waste',
      quantity: 2.5,
      date: '2025-08-10',
      recordReference: 'Blade & Knife Register (5.8F2)',
      hazards: ['Sharp Object', 'Foreign Object'],
      status: 'pending'
    },
    {
      id: '2', 
      wasteType: 'Non-Recyclable Unprinted Production Waste',
      riskCategory: 'Cross Contamination',
      storageLocation: 'Black Plastic Waste Bin at Packing Table',
      disposalMethod: 'Waste Control (Removal) to Polyplank (Recycling)',
      supplier: 'Polyplank Recycling',
      quantity: 15.3,
      date: '2025-08-09',
      recordReference: 'Production Log Sheet (5.3F2)',
      hazards: ['Cross Contamination with Conforming Product'],
      status: 'active'
    },
    {
      id: '3',
      wasteType: 'Non-Recyclable Trademarked Printed Production Waste',
      riskCategory: 'Legal/Trademark',
      storageLocation: 'Black Plastic Waste Bin at Packing Table',
      disposalMethod: 'In-House Destruction then Polyplank Recycling',
      supplier: 'Polyplank Recycling',
      quantity: 8.7,
      date: '2025-08-09',
      recordReference: 'Trade Mark Waste Destruction Record (4.10F2)',
      hazards: ['Trademark Infringement (Legal)', 'Cross Contamination'],
      status: 'disposed'
    },
    {
      id: '4',
      wasteType: 'Chemical Containers',
      riskCategory: 'Chemical',
      storageLocation: 'General Waste Wheelie Bin Outside',
      disposalMethod: 'Municipal Collection',
      supplier: 'Municipal Waste',
      quantity: 3.2,
      date: '2025-08-08',
      recordReference: 'Hygiene Clearance Record',
      hazards: ['Food grade (NSF) chemicals'],
      status: 'disposed'
    },
    {
      id: '5',
      wasteType: 'Sanitary Waste',
      riskCategory: 'Biological',
      storageLocation: 'Sanitary Bin',
      disposalMethod: 'SWAT Pest Control Service',
      supplier: 'SWAT Pest Control',
      quantity: 1.1,
      date: '2025-08-07',
      recordReference: 'SWAT Service Report',
      hazards: ['Bacteria', 'Allergens'],
      status: 'disposed'
    }
  ]

  const getRiskColor = (risk: string) => {
    const colors = {
      'Sharp Object': 'bg-red-100 text-red-800',
      'Cross Contamination': 'bg-yellow-100 text-yellow-800',
      'Legal/Trademark': 'bg-purple-100 text-purple-800',
      'Chemical': 'bg-blue-100 text-blue-800',
      'Biological': 'bg-green-100 text-green-800'
    }
    return colors[risk as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800', 
      disposed: 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Waste Management</h1>
                <p className="text-sm text-gray-600">BRCGS Waste Manifest and Disposal Tracking</p>
              </div>
            </div>
            <button 
              onClick={() => setShowNewEntryForm(true)}
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Waste Entry
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="border-t border-gray-200">
          <div className="px-6">
            <div className="flex space-x-8">
              {[
                { id: 'manifest', name: 'Waste Manifest', icon: FileText },
                { id: 'disposal', name: 'Disposal Records', icon: Trash2 },
                { id: 'analytics', name: 'Analytics', icon: AlertTriangle }
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
        
        {activeTab === 'manifest' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Entries</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wasteEntries.filter(e => e.status === 'active').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Disposal</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wasteEntries.filter(e => e.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Weight (kg)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wasteEntries.reduce((sum, e) => sum + e.quantity, 0).toFixed(1)}
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
                    <p className="text-sm font-medium text-gray-600">High Risk Items</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {wasteEntries.filter(e => e.riskCategory.includes('Sharp') || e.riskCategory.includes('Chemical')).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Manifest Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Waste Manifest Entries</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search waste types..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waste Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Storage Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disposal Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {wasteEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{entry.wasteType}</div>
                          <div className="text-xs text-gray-500">
                            {entry.hazards.slice(0, 2).map(hazard => (
                              <span key={hazard} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-1 mt-1">
                                {hazard}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(entry.riskCategory)}`}>
                            {entry.riskCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {entry.storageLocation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {entry.quantity} kg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>{entry.disposalMethod}</div>
                          <div className="text-xs text-gray-400">{entry.supplier}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <button className="text-blue-600 hover:text-blue-800">View</button>
                            <button className="text-green-600 hover:text-green-800">Update</button>
                            <button className="text-red-600 hover:text-red-800">Dispose</button>
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

        {activeTab === 'disposal' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Disposal Records</h3>
            <p className="text-gray-600">
              Track completed waste disposals with supplier records, certificates, and compliance documentation.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {wasteEntries.filter(e => e.status === 'disposed').map(entry => (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{entry.wasteType}</span>
                    <span className="text-xs text-gray-500">{entry.date}</span>
                  </div>
                  <p className="text-xs text-gray-600">{entry.disposalMethod}</p>
                  <p className="text-xs text-gray-500">Ref: {entry.recordReference}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Waste Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Waste by Risk Category</h4>
                <div className="space-y-3">
                  {['Sharp Object', 'Cross Contamination', 'Legal/Trademark', 'Chemical', 'Biological'].map(risk => {
                    const count = wasteEntries.filter(e => e.riskCategory === risk).length
                    return (
                      <div key={risk} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{risk}</span>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Monthly Waste Trends</h4>
                <p className="text-sm text-gray-600">
                  Visual charts and trend analysis would be displayed here to track waste generation patterns and compliance metrics.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* New Entry Modal - would be implemented as a separate component */}
      {showNewEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Waste Entry</h3>
            <p className="text-sm text-gray-600 mb-4">
              Form would include all BRCGS waste manifest fields with risk assessment options.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewEntryForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600">
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}