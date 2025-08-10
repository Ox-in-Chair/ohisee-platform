'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface RiskData {
  id: string
  category: string
  subcategory: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  value: number
  details: {
    description: string
    lastUpdated: string
    assignedTo: string
    actions: string[]
  }
}

interface HeatMapCell {
  x: number
  y: number
  data: RiskData
}

interface RiskHeatMapProps {
  data: RiskData[]
  gridCols?: number
  cellSize?: number
  gap?: number
  showTooltip?: boolean
  onCellClick?: (data: RiskData) => void
}

export function RiskHeatMap({
  data,
  gridCols = 4,
  cellSize = 80,
  gap = 2,
  showTooltip = true,
  onCellClick
}: RiskHeatMapProps) {
  const [hoveredCell, setHoveredCell] = useState<RiskData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [animationIndex, setAnimationIndex] = useState(-1)
  const heatMapRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const getRiskColor = (riskLevel: string, value: number) => {
    const opacity = Math.max(0.3, Math.min(1, value / 100))
    
    switch (riskLevel) {
      case 'low':
        return `rgba(34, 197, 94, ${opacity})` // green
      case 'medium':
        return `rgba(234, 179, 8, ${opacity})` // yellow
      case 'high':
        return `rgba(249, 115, 22, ${opacity})` // orange
      case 'critical':
        return `rgba(196, 73, 64, ${opacity})` // using secondary color #C44940
      default:
        return `rgba(156, 163, 175, ${opacity})` // gray
    }
  }

  const getRiskIntensity = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 1
      case 'medium': return 2
      case 'high': return 3
      case 'critical': return 4
      default: return 0
    }
  }

  // Stagger animation effect
  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setAnimationIndex(data.length)
      return
    }

    let index = 0
    const interval = setInterval(() => {
      setAnimationIndex(index)
      index++
      
      if (index >= data.length) {
        clearInterval(interval)
      }
    }, 60) // 60ms stagger delay

    return () => clearInterval(interval)
  }, [data.length, motionConfig.shouldAnimate])

  const handleCellHover = (cell: RiskData, event: React.MouseEvent) => {
    if (!showTooltip) return
    
    setHoveredCell(cell)
    setTooltipPosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleCellLeave = () => {
    setHoveredCell(null)
  }

  const handleCellClick = (cell: RiskData) => {
    onCellClick?.(cell)
  }

  const gridRows = Math.ceil(data.length / gridCols)
  const totalWidth = gridCols * cellSize + (gridCols - 1) * gap
  const totalHeight = gridRows * cellSize + (gridRows - 1) * gap

  return (
    <div className="relative">
      <div
        ref={heatMapRef}
        className="relative inline-block"
        style={{ width: totalWidth, height: totalHeight }}
      >
        {data.map((item, index) => {
          const row = Math.floor(index / gridCols)
          const col = index % gridCols
          const x = col * (cellSize + gap)
          const y = row * (cellSize + gap)
          
          const isVisible = !motionConfig.shouldAnimate || index <= animationIndex
          const delay = motionConfig.shouldAnimate ? index * 60 : 0

          return (
            <div
              key={item.id}
              className={`
                absolute border border-white cursor-pointer rounded-lg
                transition-all duration-200 hover:scale-105 hover:border-primary
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
              `}
              style={{
                left: x,
                top: y,
                width: cellSize,
                height: cellSize,
                backgroundColor: getRiskColor(item.riskLevel, item.value),
                transitionDelay: `${delay}ms`,
                transitionDuration: motionConfig.shouldAnimate ? `${motionConfig.duration.standard}ms` : '0ms',
                transitionTimingFunction: motionConfig.easing.out
              }}
              onMouseEnter={(e) => handleCellHover(item, e)}
              onMouseMove={(e) => {
                if (hoveredCell?.id === item.id) {
                  setTooltipPosition({
                    x: e.clientX,
                    y: e.clientY
                  })
                }
              }}
              onMouseLeave={handleCellLeave}
              onClick={() => handleCellClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCellClick(item)
                }
              }}
              aria-label={`${item.category} - ${item.subcategory}: ${item.riskLevel} risk`}
            >
              <div className="p-2 h-full flex flex-col justify-between text-white">
                <div>
                  <div className="text-xs font-medium truncate">
                    {item.category}
                  </div>
                  <div className="text-xs opacity-90 truncate">
                    {item.subcategory}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold">
                    {item.value}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ml-0.5 ${
                          i < getRiskIntensity(item.riskLevel) 
                            ? 'bg-white' 
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tooltip */}
      {showTooltip && hoveredCell && (
        <div
          className={`
            fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-xs
            transition-opacity duration-200 pointer-events-none
            ${hoveredCell ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-sm text-primary">
              {hoveredCell.category}
            </h4>
            <span className={`
              px-2 py-1 text-xs rounded-full font-medium
              ${hoveredCell.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                hoveredCell.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                hoveredCell.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }
            `}>
              {hoveredCell.riskLevel.toUpperCase()}
            </span>
          </div>
          
          <p className="text-xs text-gray-600 mb-2">
            {hoveredCell.subcategory}
          </p>
          
          <div className="space-y-1 text-xs">
            <p><strong>Risk Value:</strong> {hoveredCell.value}</p>
            <p><strong>Last Updated:</strong> {hoveredCell.details.lastUpdated}</p>
            <p><strong>Assigned To:</strong> {hoveredCell.details.assignedTo}</p>
          </div>
          
          {hoveredCell.details.description && (
            <p className="text-xs text-gray-700 mt-2 pt-2 border-t border-gray-100">
              {hoveredCell.details.description}
            </p>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <span className="font-medium text-gray-700">Risk Level:</span>
        {[
          { level: 'low', color: 'rgba(34, 197, 94, 0.8)', label: 'Low' },
          { level: 'medium', color: 'rgba(234, 179, 8, 0.8)', label: 'Medium' },
          { level: 'high', color: 'rgba(249, 115, 22, 0.8)', label: 'High' },
          { level: 'critical', color: 'rgba(196, 73, 64, 0.8)', label: 'Critical' }
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Risk Matrix Component (traditional 5x5 grid)
interface RiskMatrixProps {
  risks: Array<{
    id: string
    name: string
    probability: number // 1-5
    impact: number // 1-5
    category: string
  }>
  cellSize?: number
  onRiskClick?: (risk: any) => void
}

export function RiskMatrix({
  risks,
  cellSize = 60,
  onRiskClick
}: RiskMatrixProps) {
  const [hoveredRisk, setHoveredRisk] = useState<any>(null)
  const motionConfig = useMotionConfig()

  const getRiskScore = (probability: number, impact: number) => {
    return probability * impact
  }

  const getRiskColor = (score: number) => {
    if (score <= 4) return 'rgba(34, 197, 94, 0.7)' // Low - Green
    if (score <= 9) return 'rgba(234, 179, 8, 0.7)' // Medium - Yellow  
    if (score <= 16) return 'rgba(249, 115, 22, 0.7)' // High - Orange
    return 'rgba(196, 73, 64, 0.7)' // Critical - Red (secondary color)
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-6 gap-1" style={{ width: cellSize * 6 }}>
        {/* Header row */}
        <div className="text-xs font-medium text-center p-1"></div>
        {[1, 2, 3, 4, 5].map(impact => (
          <div key={impact} className="text-xs font-medium text-center p-1">
            {impact}
          </div>
        ))}
        
        {/* Matrix rows */}
        {[5, 4, 3, 2, 1].map(probability => (
          <React.Fragment key={probability}>
            <div className="text-xs font-medium text-center p-1">
              {probability}
            </div>
            {[1, 2, 3, 4, 5].map(impact => {
              const cellRisks = risks.filter(r => 
                r.probability === probability && r.impact === impact
              )
              const score = getRiskScore(probability, impact)
              
              return (
                <div
                  key={`${probability}-${impact}`}
                  className="border border-gray-300 relative cursor-pointer hover:border-primary transition-colors"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: getRiskColor(score)
                  }}
                  onClick={() => cellRisks[0] && onRiskClick?.(cellRisks[0])}
                >
                  {cellRisks.map((risk, index) => (
                    <div
                      key={risk.id}
                      className={`
                        absolute w-2 h-2 bg-white rounded-full border border-gray-400
                        transform transition-all hover:scale-125
                      `}
                      style={{
                        left: `${20 + (index % 3) * 15}%`,
                        top: `${20 + Math.floor(index / 3) * 20}%`,
                        animationDelay: motionConfig.shouldAnimate ? `${index * 100}ms` : '0ms'
                      }}
                      onMouseEnter={() => setHoveredRisk(risk)}
                      onMouseLeave={() => setHoveredRisk(null)}
                      title={`${risk.name} (${risk.category})`}
                    />
                  ))}
                  
                  <div className="absolute bottom-1 right-1 text-xs font-bold text-white">
                    {score}
                  </div>
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
      
      {/* Labels */}
      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-gray-700">Impact →</div>
        <div 
          className="absolute -left-8 top-1/2 transform -rotate-90 text-xs font-medium text-gray-700"
          style={{ transformOrigin: 'center' }}
        >
          ← Probability
        </div>
      </div>
      
      {/* Hovered risk tooltip */}
      {hoveredRisk && (
        <div className="absolute z-10 bg-black text-white p-2 rounded text-xs max-w-48 pointer-events-none">
          <div className="font-semibold">{hoveredRisk.name}</div>
          <div>{hoveredRisk.category}</div>
          <div>P: {hoveredRisk.probability}, I: {hoveredRisk.impact}</div>
        </div>
      )}
    </div>
  )
}