'use client'

import React, { useState, useEffect } from 'react'
import { 
  ProgressRing, 
  AnimatedBarChart, 
  AnimatedLineChart 
} from './ComplianceChart'
import { RiskHeatMap } from './RiskHeatMap'
import { ScrollReveal } from '../motion/ScrollOrchestrator'
import { ListStaggerReveal } from '../micro/ListStaggerReveal'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ComplianceMetrics {
  ncaCompletion: number
  maintenanceCompliance: number
  wasteManagement: number
  trainingCompletion: number
  auditScore: number
}

interface TrendData {
  date: string
  ncas: number
  complaints: number
  maintenance: number
}

interface ComplianceDashboardProps {
  data?: {
    metrics: ComplianceMetrics
    trends: TrendData[]
    riskData: any[]
  }
  autoRefresh?: boolean
  refreshInterval?: number
}

export function ComplianceDashboard({
  data,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: ComplianceDashboardProps) {
  const [dashboardData, setDashboardData] = useState(data || getMockData())
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const motionConfig = useMotionConfig()

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setIsRefreshing(true)
      
      // Simulate API call delay
      setTimeout(() => {
        setDashboardData(getMockData())
        setLastUpdated(new Date())
        setIsRefreshing(false)
      }, 1000)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const getComplianceStatus = (percentage: number) => {
    if (percentage >= 95) return { status: 'excellent', color: 'var(--color-primary)' }
    if (percentage >= 85) return { status: 'good', color: '#10b981' }
    if (percentage >= 70) return { status: 'warning', color: '#f59e0b' }
    return { status: 'critical', color: 'var(--color-secondary)' }
  }

  const metricsCards = [
    {
      title: 'NCA Completion',
      value: dashboardData.metrics.ncaCompletion,
      description: '20-day closure rate',
      icon: '⚠️',
      target: 95
    },
    {
      title: 'Maintenance Compliance',
      value: dashboardData.metrics.maintenanceCompliance,
      description: 'On-time completion',
      icon: '🔧',
      target: 98
    },
    {
      title: 'Waste Management',
      value: dashboardData.metrics.wasteManagement,
      description: 'Documentation rate',
      icon: '♻️',
      target: 100
    },
    {
      title: 'Training Completion',
      value: dashboardData.metrics.trainingCompletion,
      description: 'Staff certification',
      icon: '🎓',
      target: 90
    }
  ]

  const trendChartData = dashboardData.trends.map(item => ({
    x: item.date,
    y: item.ncas + item.complaints + item.maintenance
  }))

  const barChartData = [
    { label: 'NCAs', value: dashboardData.trends[dashboardData.trends.length - 1]?.ncas || 0, color: 'var(--color-secondary)' },
    { label: 'Complaints', value: dashboardData.trends[dashboardData.trends.length - 1]?.complaints || 0, color: '#f59e0b' },
    { label: 'Maintenance', value: dashboardData.trends[dashboardData.trends.length - 1]?.maintenance || 0, color: '#10b981' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <ScrollReveal>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Compliance Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Real-time compliance metrics and risk assessment
            </p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-2 ${isRefreshing ? 'animate-pulse' : ''}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Key Metrics Grid */}
      <ListStaggerReveal className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric, index) => {
          const status = getComplianceStatus(metric.value)
          
          return (
            <div key={metric.title} className="card-interactive">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-2xl">{metric.icon}</span>
                  <h3 className="font-semibold text-gray-800 mt-2">{metric.title}</h3>
                  <p className="text-xs text-gray-600">{metric.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{metric.value}%</div>
                  <div className={`text-xs font-medium ${
                    metric.value >= metric.target ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    Target: {metric.target}%
                  </div>
                </div>
              </div>
              
              {/* Progress Ring */}
              <div className="flex justify-center">
                <ProgressRing
                  percentage={metric.value}
                  size={80}
                  strokeWidth={6}
                  color={status.color}
                  animationDelay={index * 200}
                />
              </div>
              
              {/* Status Indicator */}
              <div className={`mt-3 text-center text-xs font-medium px-2 py-1 rounded-full ${
                status.status === 'excellent' ? 'bg-primary/10 text-primary' :
                status.status === 'good' ? 'bg-green-100 text-green-700' :
                status.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </div>
            </div>
          )
        })}
      </ListStaggerReveal>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Trend Analysis */}
        <ScrollReveal animation="fade-left" delay={400}>
          <div className="card-interactive">
            <h3 className="text-lg font-semibold text-primary mb-4">30-Day Trend Analysis</h3>
            <div className="h-64 flex items-center justify-center">
              <AnimatedLineChart
                data={trendChartData}
                width={400}
                height={200}
                color="var(--color-primary)"
                showArea={true}
                showDots={true}
                animationDelay={600}
              />
            </div>
            <div className="text-xs text-gray-600 text-center mt-2">
              Combined metrics over the last 30 days
            </div>
          </div>
        </ScrollReveal>

        {/* Current Period Breakdown */}
        <ScrollReveal animation="fade-right" delay={500}>
          <div className="card-interactive">
            <h3 className="text-lg font-semibold text-primary mb-4">Current Period Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <AnimatedBarChart
                data={barChartData}
                height={200}
                barWidth={60}
                spacing={20}
                showLabels={true}
                showValues={true}
                animationDelay={700}
              />
            </div>
            <div className="text-xs text-gray-600 text-center mt-2">
              Active items requiring attention
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Risk Heat Map */}
      <ScrollReveal animation="fade-up" delay={600}>
        <div className="card-interactive">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-primary">Risk Assessment Matrix</h3>
              <p className="text-sm text-gray-600">Interactive risk categorization by compliance area</p>
            </div>
            <button className="text-sm text-primary hover:text-primary-darker transition-colors">
              View Details →
            </button>
          </div>
          
          <div className="flex justify-center">
            <RiskHeatMap
              data={dashboardData.riskData}
              gridCols={4}
              cellSize={100}
              gap={4}
              showTooltip={true}
              onCellClick={(data) => {
                console.log('Risk cell clicked:', data)
              }}
            />
          </div>
        </div>
      </ScrollReveal>

      {/* Action Items */}
      <ScrollReveal animation="fade-up" delay={700}>
        <div className="card-interactive">
          <h3 className="text-lg font-semibold text-primary mb-4">Priority Actions</h3>
          <div className="space-y-3">
            {[
              { 
                priority: 'high', 
                text: '2 NCAs approaching 20-day deadline', 
                action: 'Review & assign',
                dueDate: 'Due in 3 days'
              },
              { 
                priority: 'medium', 
                text: 'Quarterly waste manifest due', 
                action: 'Generate report',
                dueDate: 'Due in 1 week'
              },
              { 
                priority: 'low', 
                text: '5 staff members need refresher training', 
                action: 'Schedule sessions',
                dueDate: 'Due in 2 weeks'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{item.text}</div>
                    <div className="text-xs text-gray-600">{item.dueDate}</div>
                  </div>
                </div>
                <button className="btn-secondary text-xs py-1 px-3">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}

// Mock data generator for demonstration
function getMockData() {
  return {
    metrics: {
      ncaCompletion: Math.floor(Math.random() * 15) + 80,
      maintenanceCompliance: Math.floor(Math.random() * 10) + 90,
      wasteManagement: Math.floor(Math.random() * 5) + 95,
      trainingCompletion: Math.floor(Math.random() * 20) + 75,
      auditScore: Math.floor(Math.random() * 10) + 85
    },
    trends: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      ncas: Math.floor(Math.random() * 8) + 2,
      complaints: Math.floor(Math.random() * 5) + 1,
      maintenance: Math.floor(Math.random() * 12) + 3
    })),
    riskData: [
      {
        id: '1',
        category: 'Food Safety',
        subcategory: 'Temperature Control',
        riskLevel: 'medium',
        value: 65,
        details: {
          description: 'Cold chain monitoring in storage areas',
          lastUpdated: '2025-08-10',
          assignedTo: 'Quality Manager',
          actions: ['Install additional sensors', 'Update procedures']
        }
      },
      {
        id: '2',
        category: 'Equipment',
        subcategory: 'Maintenance',
        riskLevel: 'high',
        value: 85,
        details: {
          description: 'Overdue preventive maintenance on packaging line',
          lastUpdated: '2025-08-09',
          assignedTo: 'Maintenance Team',
          actions: ['Schedule immediate inspection', 'Replace worn parts']
        }
      },
      {
        id: '3',
        category: 'Documentation',
        subcategory: 'Record Keeping',
        riskLevel: 'low',
        value: 25,
        details: {
          description: 'Minor gaps in shift handover documentation',
          lastUpdated: '2025-08-10',
          assignedTo: 'Shift Supervisors',
          actions: ['Update templates', 'Provide training']
        }
      },
      {
        id: '4',
        category: 'Personnel',
        subcategory: 'Training',
        riskLevel: 'critical',
        value: 95,
        details: {
          description: 'Multiple staff certifications expired',
          lastUpdated: '2025-08-08',
          assignedTo: 'HR Manager',
          actions: ['Immediate retraining', 'Update training matrix']
        }
      },
      // Add more mock risk data...
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 5}`,
        category: ['Process', 'Environment', 'Supply Chain', 'Customer'][Math.floor(Math.random() * 4)],
        subcategory: ['Monitoring', 'Compliance', 'Controls', 'Documentation'][Math.floor(Math.random() * 4)],
        riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        value: Math.floor(Math.random() * 90) + 10,
        details: {
          description: 'Sample risk description',
          lastUpdated: '2025-08-10',
          assignedTo: 'Department Head',
          actions: ['Monitor', 'Review']
        }
      }))
    ]
  }
}