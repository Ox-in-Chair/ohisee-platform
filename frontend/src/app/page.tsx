'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Shield, FileText, Users, Bell, CheckCircle, 
  FolderOpen, GraduationCap, Search,
  Home, AlertTriangle, TrendingUp
} from 'lucide-react'
import { EnhancedCard } from '@/components/ui/motion'
import { ListStaggerReveal } from '@/components/ui/micro'

// OhiSee! Homepage - Now the Dashboard
export default function HomePage() {
  const [activeModule, setActiveModule] = useState('dashboard')

  const modules = [
    {
      id: 'shift-changeovers',
      title: 'Shift Change-overs',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Shift handover documentation and operational continuity tracking',
      status: 'development',
      stats: { shifts: 0, handovers: 0, pending: 0 },
      color: 'bg-gray-100 text-gray-600',
      href: '/shift-changeovers'
    },
    {
      id: 'process-control',
      title: 'Process Control Reporting',
      icon: <CheckCircle className="w-6 h-6" />,
      description: 'Process specifications, critical control points, job cards, and production monitoring',
      status: 'development', 
      stats: { ccps: 0, specs: 0, monitoring: 0 },
      color: 'bg-gray-100 text-gray-600',
      href: '/process-control'
    },
    {
      id: 'non-conforming',
      title: 'Control of Non-Conforming Product',
      icon: <AlertTriangle className="w-6 h-6" />,
      description: 'Non-conformance identification, quarantine, disposition, and corrective actions (NCA system)',
      status: 'ready',
      stats: { ncas: 8, open: 3, overdue: 1 },
      color: 'bg-orange-100 text-orange-800',
      href: '/non-conforming'
    },
    {
      id: 'maintenance',
      title: 'Maintenance Compliance',
      icon: <Search className="w-6 h-6" />,
      description: 'Planned preventive maintenance, job cards, condition monitoring, and post-maintenance clearance',
      status: 'active',
      stats: { planned: 12, reactive: 4, overdue: 2 },
      color: 'bg-blue-100 text-blue-800',
      href: '/maintenance'
    },
    {
      id: 'complaints',
      title: 'Complaint Handling',
      icon: <Users className="w-6 h-6" />,
      description: 'Customer complaint capture, investigation, corrective actions, and cycle time management',
      status: 'active',
      stats: { open: 5, investigating: 2, resolved: 28 },
      color: 'bg-purple-100 text-purple-800',
      href: '/complaints'
    },
    {
      id: 'confidential-reporting',
      title: 'Confidential Reporting',
      icon: <Bell className="w-6 h-6" />,
      description: 'Anonymous whistleblower system with secure reporting and investigation processes',
      status: 'active',
      stats: { open: 3, investigating: 1, resolved: 15 },
      color: 'bg-yellow-100 text-yellow-800',
      href: '/report/new'
    },
    {
      id: 'waste-management',
      title: 'Waste Management',
      icon: <FolderOpen className="w-6 h-6" />,
      description: 'Waste manifest tracking, disposal records, and environmental compliance monitoring',
      status: 'active',
      stats: { manifest: 15, disposed: 8, overdue: 0 },
      color: 'bg-green-100 text-green-800',
      href: '/waste-management'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 theme-transition">
      {/* Header with Enhanced Animations */}
      <header className="bg-primary text-white shadow-lg">
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-200">
                <span className="text-primary font-bold text-xl">O</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">OhiSee!</h1>
                <p className="text-sm opacity-90">Operations Intelligence Centre</p>
              </div>
            </div>
            <div className="flex items-center gap-4 animate-slide-in-right">
              <Link href="/admin" className="btn-ghost text-sm hover:scale-105 transition-all duration-200">
                Admin Center
              </Link>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span className="text-white text-sm font-medium">U</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Navigation with Micro-interactions */}
        <nav className="bg-primary-700 px-6 shadow-inner">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`py-3 px-4 border-b-3 transition-all flex items-center gap-2 hover:scale-105 relative group ${
                activeModule === 'dashboard' 
                  ? 'border-secondary text-white transform scale-105' 
                  : 'border-transparent text-white/70 hover:text-white hover:bg-white/10 rounded-t-lg'
              }`}
            >
              <Home className={`w-4 h-4 transition-transform ${activeModule === 'dashboard' ? 'rotate-12' : 'group-hover:scale-110'}`} />
              Dashboard
              {activeModule === 'dashboard' && (
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              )}
            </button>
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`py-3 px-4 border-b-3 transition-all flex items-center gap-2 whitespace-nowrap hover:scale-105 relative group ${
                  activeModule === module.id 
                    ? 'border-secondary text-white transform scale-105' 
                    : 'border-transparent text-white/70 hover:text-white hover:bg-white/10 rounded-t-lg'
                }`}
              >
                <div className={`transition-transform ${activeModule === module.id ? 'rotate-12' : 'group-hover:scale-110'}`}>
                  {module.icon}
                </div>
                {module.title}
                {activeModule === module.id && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                )}
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
              <h2 className="text-3xl font-semibold text-white mb-2">Compliance Dashboard</h2>
              <p className="text-white/80">Overview of all compliance modules and activities</p>
            </div>

            {/* Enhanced Quick Actions */}
            <EnhancedCard 
              className="p-6 mb-8 shimmer-effect gloss-overlay"
              shadowIntensity="light"
              glowEffect={true}
            >
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link href="/non-conforming" className="btn-primary btn-luxury text-center hover:scale-105 transition-all">
                  Report Non-Conformance
                </Link>
                <Link href="/maintenance" className="btn-primary btn-luxury text-center hover:scale-105 transition-all">
                  Submit Maintenance Request
                </Link>
                <Link href="/complaints" className="btn-secondary btn-luxury text-center hover:scale-105 transition-all">
                  Handle Customer Complaint
                </Link>
                <Link href="/report/new" className="btn-secondary btn-luxury text-center hover:scale-105 transition-all">
                  Submit Confidential Report
                </Link>
              </div>
            </EnhancedCard>

            {/* Enhanced Module Grid */}
            <ListStaggerReveal className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <EnhancedCard
                  key={module.id}
                  href={module.href}
                  hover3D={true}
                  glowEffect={true}
                  shadowIntensity="medium"
                  className="p-6 h-full transition-all duration-300 card-luxury shimmer-effect"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-lg bg-transparent text-white transition-transform duration-200 hover:scale-110 hover:bg-white/10">
                      {module.icon}
                    </div>
                    <StatusBadge status={module.status} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-secondary transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    {module.description}
                  </p>
                  <div className="flex justify-between text-sm mt-auto">
                    {Object.entries(module.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="font-semibold text-white text-lg">{value}</div>
                        <div className="text-white/60 capitalize text-xs">{key}</div>
                      </div>
                    ))}
                  </div>
                </EnhancedCard>
              ))}
            </ListStaggerReveal>

            {/* System Status */}
            <div className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 luxury-glass gloss-overlay">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/90">All Systems Operational</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-white/90">98% Uptime This Month</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-white/90">3 Pending Reviews</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Individual Module View
          <div>
            <h2 className="text-3xl font-semibold text-white mb-8">
              {modules.find(m => m.id === activeModule)?.title}
            </h2>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
              <p className="text-white/80 mb-6">
                {modules.find(m => m.id === activeModule)?.description}
              </p>
              <div className="bg-primary/20 border border-primary/30 rounded-lg p-4">
                <p className="text-white">
                  This module is currently being configured. Full functionality will be available soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/20 py-6 text-center text-sm text-white/80">
        <p>© 2025 OhiSee! Operations Intelligence Centre | All Rights Reserved</p>
      </footer>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    ready: 'bg-orange-100 text-orange-800',
    development: 'bg-gray-100 text-gray-600'
  }
  
  const labels = {
    active: 'Active',
    ready: 'Ready for Development',
    development: 'In Development'
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels] || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}