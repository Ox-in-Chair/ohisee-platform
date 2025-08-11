'use client'

import { useState } from 'react'
import { 
  AlertTriangle, ClipboardList, FileText, TrendingUp, Search, 
  Filter, Plus, Clock, CheckCircle, XCircle, Eye, Edit, Bot,
  BarChart3, Shield, Settings
} from 'lucide-react'
import { EnhancedCard, MorphingSkeleton, SkeletonCard } from '@/components/ui/motion'
import { ButtonPress } from '@/components/ui/micro'
import { ProgressRing } from '@/components/ui/visualizations'
import { Header } from '@/components/layout/Header'
import SmartNCAForm from '@/components/nca/SmartNCAForm'

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
    <div className="min-h-screen theme-transition">
      {/* Global Header */}
      <Header 
        activeModule="non-conforming"
        modules={[]}
        showNavigation={false}
      />

      {/* Module Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-lg shimmer-effect">
        <div className="px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shimmer-effect">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Control of Non-Conforming Product</h1>
                <p className="text-white/90 text-lg">Non-Conformance Advice (NCA) System - BRCGS 5.7</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Bot className="w-4 h-4" />
                    <span>AI-Powered Intelligence</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>BRCGS Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>20-Day SLA Tracking</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button 
                onClick={() => setShowNewNCAForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-white/90 transition-all font-semibold btn-luxury"
              >
                <Plus className="w-5 h-5" />
                <span>New NCA</span>
                <div className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  AI
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <nav className="bg-gradient-to-r from-orange-700 via-red-700 to-orange-700 px-6 shadow-inner">
          <div className="flex gap-6 overflow-x-auto">
            {[
              { id: 'ncas', name: 'Active NCAs', icon: ClipboardList, count: ncas.filter(n => n.status !== 'closed').length },
              { id: 'trending', name: 'Trend Analysis', icon: TrendingUp, badge: 'AI' },
              { id: 'analytics', name: 'Analytics', icon: BarChart3, badge: 'LIVE' }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-4 border-b-3 transition-all flex items-center gap-2 hover:scale-105 relative group ${
                    activeTab === tab.id
                      ? 'border-white text-white transform scale-105'
                      : 'border-transparent text-white/70 hover:text-white hover:bg-white/10 rounded-t-lg'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-12' : 'group-hover:scale-110'}`} />
                  <span className="text-white font-medium">{tab.name}</span>
                  {tab.count && (
                    <div className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {tab.count}
                    </div>
                  )}
                  {tab.badge && (
                    <div className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                      {tab.badge}
                    </div>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {activeTab === 'ncas' && (
          <>
            {/* Enhanced Alert for Overdue NCAs */}
            {overdueNCAs.length > 0 && (
              <EnhancedCard className="p-6 mb-8 bg-red-500/10 border border-red-500/20 backdrop-blur-lg animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400 animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {overdueNCAs.length} NCA{overdueNCAs.length > 1 ? 's' : ''} Overdue
                      </h3>
                      <div className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                        URGENT
                      </div>
                    </div>
                    <p className="text-white/90">
                      NCAs must be closed out within 20 working days from date opened. Immediate attention required.
                    </p>
                    <button className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      View Overdue NCAs
                    </button>
                  </div>
                </div>
              </EnhancedCard>
            )}

            {/* Enhanced Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <EnhancedCard 
                className="p-6 card-luxury shimmer-effect"
                hover3D={true}
                glowEffect={true}
                shadowIntensity="medium"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20">
                      <ClipboardList className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/80">Open NCAs</p>
                      <p className="text-3xl font-bold text-white">
                        {ncas.filter(nca => nca.status !== 'closed').length}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </EnhancedCard>

              <EnhancedCard 
                className="p-6 card-luxury shimmer-effect"
                hover3D={true}
                glowEffect={true}
                shadowIntensity="medium"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl border backdrop-blur-sm ${
                      overdueNCAs.length > 0 
                        ? 'bg-red-500/10 border-red-500/20 animate-pulse' 
                        : 'bg-green-500/10 border-green-500/20'
                    }`}>
                      <Clock className={`w-7 h-7 ${
                        overdueNCAs.length > 0 ? 'text-red-400' : 'text-green-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/80">Overdue</p>
                      <p className={`text-3xl font-bold ${
                        overdueNCAs.length > 0 ? 'text-red-400' : 'text-white'
                      }`}>{overdueNCAs.length}</p>
                    </div>
                  </div>
                  {overdueNCAs.length > 0 && (
                    <div className="text-red-400 animate-bounce">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </EnhancedCard>

              <EnhancedCard 
                className="p-6 card-luxury shimmer-effect"
                hover3D={true}
                glowEffect={true}
                shadowIntensity="medium"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-xl border backdrop-blur-sm ${
                      ncas.filter(nca => nca.priority === 'critical').length > 0
                        ? 'bg-yellow-500/10 border-yellow-500/20 animate-pulse'
                        : 'bg-gray-500/10 border-gray-500/20'
                    }`}>
                      <AlertTriangle className={`w-7 h-7 ${
                        ncas.filter(nca => nca.priority === 'critical').length > 0 ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/80">Critical Priority</p>
                      <p className="text-3xl font-bold text-white">
                        {ncas.filter(nca => nca.priority === 'critical').length}
                      </p>
                    </div>
                  </div>
                  {ncas.filter(nca => nca.priority === 'critical').length > 0 && (
                    <div className="text-yellow-400">
                      <Shield className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </EnhancedCard>

              <EnhancedCard 
                className="p-6 card-luxury shimmer-effect"
                hover3D={true}
                glowEffect={true}
                shadowIntensity="medium"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/20">
                      <CheckCircle className="w-7 h-7 text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white/80">Closed This Month</p>
                      <p className="text-3xl font-bold text-white">
                        {ncas.filter(nca => nca.status === 'closed').length}
                      </p>
                    </div>
                  </div>
                  <div className="text-green-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </EnhancedCard>
            </div>

            {/* Enhanced NCAs Table */}
            <EnhancedCard className="luxury-glass gloss-overlay overflow-hidden">
              <div className="px-6 py-4 border-b border-white/20 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">Non-Conformance Advices</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full">
                      <Bot className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">AI Powered</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white focus:bg-white/20 focus:border-white/40"
                    >
                      <option value="all">All Status</option>
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="corrective_action">Corrective Action</option>
                      <option value="closed">Closed</option>
                    </select>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-white/60" />
                      <input 
                        type="text" 
                        placeholder="Search NCAs..."
                        className="pl-9 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">NCA Number</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Product Type</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Disposition</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white/80 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredNCAs.map((nca) => (
                      <tr key={nca.id} className="hover:bg-white/5 transition-all duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getImpactIcon(nca.impact)}
                            <span className="ml-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{nca.ncaNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">{nca.title}</div>
                          <div className="text-sm text-white/60">Detected by: {nca.detectedBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize text-sm text-white/70">
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
                          <div className="text-sm font-medium text-white">{nca.dueDate}</div>
                          {new Date(nca.dueDate) < new Date() && nca.status !== 'closed' && (
                            <div className="flex items-center gap-1 text-xs text-red-400 font-bold animate-pulse">
                              <Clock className="w-3 h-3" />
                              Overdue
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            {nca.status !== 'closed' && (
                              <button className="px-3 py-1 text-white bg-purple-500/20 hover:bg-purple-500/40 rounded-lg transition-all text-xs font-medium">
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
            </EnhancedCard>
          </>
        )}

        {activeTab === 'trending' && (
          <EnhancedCard className="luxury-glass gloss-overlay p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">AI-Powered Trend Analysis</h3>
              <div className="px-3 py-1 bg-green-500/20 rounded-full">
                <span className="text-xs text-green-400 font-bold">LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedCard className="bg-white/5 backdrop-blur-sm border border-white/20 p-6" hover3D={true}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-white">NCAs by Product Type</h4>
                </div>
                <div className="space-y-4">
                  {['Raw Material', 'Work in Progress', 'Finished Product'].map(type => {
                    const typeKey = type.toLowerCase().replace(' ', '_') as 'raw_material' | 'wip' | 'finished_product'
                    const count = ncas.filter(nca => nca.productType === typeKey).length
                    const percentage = ncas.length > 0 ? (count / ncas.length) * 100 : 0
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/80">{type}</span>
                          <span className="text-sm font-bold text-white">{count}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </EnhancedCard>
              <EnhancedCard className="bg-white/5 backdrop-blur-sm border border-white/20 p-6" hover3D={true}>
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-green-400" />
                  <h4 className="font-bold text-white">AI Root Cause Analysis</h4>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-white/80">
                    AI analysis using Ishikawa methodology: Man, Machine, Method, Environment, Material, Measuring
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Machine 45%', 'Method 25%', 'Material 20%', 'Man 10%'].map((item, index) => (
                      <div key={index} className="p-2 bg-white/10 rounded-lg text-center">
                        <div className="text-xs text-white/70">{item.split(' ')[0]}</div>
                        <div className="text-sm font-bold text-white">{item.split(' ')[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </EnhancedCard>
            </div>
            
            <EnhancedCard className="mt-6 bg-yellow-500/10 border border-yellow-500/20 p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-yellow-300">AI Trend Alert</h4>
                    <div className="px-2 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold">
                      URGENT
                    </div>
                  </div>
                  <p className="text-white/90">
                    Significant increase in NCAs for "Machine" category detected. Root cause analysis required as per BRCGS 5.7 requirements.
                  </p>
                  <button className="mt-3 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors font-medium">
                    Investigate Now
                  </button>
                </div>
              </div>
            </EnhancedCard>
          </EnhancedCard>
        )}

        {activeTab === 'analytics' && (
          <EnhancedCard className="luxury-glass gloss-overlay p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Real-Time Analytics Dashboard</h3>
              <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                <span className="text-xs text-blue-400 font-bold">AI POWERED</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnhancedCard className="bg-white/5 backdrop-blur-sm border border-white/20 p-6" hover3D={true}>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="font-bold text-white">Closure Performance</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/80">Within 20 days:</span>
                      <span className="text-lg font-bold text-green-400">85%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white/80">Average closure time:</span>
                    <span className="text-lg font-bold text-white">14 days</span>
                  </div>
                </div>
              </EnhancedCard>
              <EnhancedCard className="bg-white/5 backdrop-blur-sm border border-white/20 p-6" hover3D={true}>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-red-400" />
                  <h4 className="font-bold text-white">Impact Analysis</h4>
                </div>
                <div className="space-y-2">
                  {['Safety', 'Quality', 'Legality', 'Minor'].map(impact => {
                    const impactKey = impact.toLowerCase() as 'safety' | 'quality' | 'legality' | 'minor'
                    const count = ncas.filter(nca => nca.impact === impactKey).length
                    return (
                      <div key={impact} className="flex justify-between">
                        <span className="text-sm text-white/80">{impact}:</span>
                        <span className="text-sm font-bold text-white">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </EnhancedCard>
              <EnhancedCard className="bg-white/5 backdrop-blur-sm border border-white/20 p-6" hover3D={true}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h4 className="font-bold text-white">Monthly Trends</h4>
                </div>
                <p className="text-sm text-white/80">
                  Chart showing monthly NCA volume, closure rates, and recurrence patterns.
                </p>
              </EnhancedCard>
            </div>
          </EnhancedCard>
        )}
      </main>

      {/* Smart NCA Form */}
      {showNewNCAForm && (
        <SmartNCAForm onClose={() => setShowNewNCAForm(false)} />
      )}
    </div>
  )
}