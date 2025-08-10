'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  bgColor?: string
  label?: string
  showPercentage?: boolean
  animationDelay?: number
}

export function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = 'var(--color-primary)',
  bgColor = '#f3f4f6',
  label,
  showPercentage = true,
  animationDelay = 0
}: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const motionConfig = useMotionConfig()

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setAnimatedPercentage(percentage)
      return
    }

    const timer = setTimeout(() => {
      let start = 0
      const duration = motionConfig.duration.slow
      const increment = percentage / (duration / 16) // 60fps

      const animate = () => {
        start += increment
        if (start >= percentage) {
          setAnimatedPercentage(percentage)
        } else {
          setAnimatedPercentage(start)
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [percentage, animationDelay, motionConfig])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: motionConfig.shouldAnimate ? 
              `stroke-dashoffset ${motionConfig.duration.standard}ms ${motionConfig.easing.out}` : 
              'none'
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-xl font-semibold text-primary">
            {Math.round(animatedPercentage)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-600 mt-1 text-center max-w-16">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}

// Animated Bar Chart Component
interface BarChartProps {
  data: DataPoint[]
  maxValue?: number
  height?: number
  barWidth?: number
  spacing?: number
  showLabels?: boolean
  showValues?: boolean
  animationDelay?: number
}

export function AnimatedBarChart({
  data,
  maxValue,
  height = 200,
  barWidth = 40,
  spacing = 8,
  showLabels = true,
  showValues = true,
  animationDelay = 0
}: BarChartProps) {
  const [animatedData, setAnimatedData] = useState<DataPoint[]>(
    data.map(item => ({ ...item, value: 0 }))
  )
  const motionConfig = useMotionConfig()

  const max = maxValue || Math.max(...data.map(d => d.value))
  const totalWidth = data.length * barWidth + (data.length - 1) * spacing

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setAnimatedData(data)
      return
    }

    const timer = setTimeout(() => {
      let progress = 0
      const duration = motionConfig.duration.slow
      const increment = 1 / (duration / 16) // 60fps

      const animate = () => {
        progress += increment
        if (progress >= 1) {
          setAnimatedData(data)
        } else {
          setAnimatedData(data.map(item => ({
            ...item,
            value: item.value * progress
          })))
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [data, animationDelay, motionConfig])

  return (
    <div className="flex flex-col items-center">
      <svg width={totalWidth} height={height + (showLabels ? 40 : 0)}>
        {animatedData.map((item, index) => {
          const x = index * (barWidth + spacing)
          const barHeight = (item.value / max) * height
          const y = height - barHeight

          return (
            <g key={item.label}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={item.color || 'var(--color-primary)'}
                rx={4}
                style={{
                  transition: motionConfig.shouldAnimate ? 
                    `height ${motionConfig.duration.standard}ms ${motionConfig.easing.out}, y ${motionConfig.duration.standard}ms ${motionConfig.easing.out}` : 
                    'none'
                }}
              />
              
              {/* Value label */}
              {showValues && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {Math.round(item.value)}
                </text>
              )}
              
              {/* X-axis label */}
              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={height + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {item.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Animated Line Chart Component
interface LineChartProps {
  data: Array<{ x: string | number, y: number }>
  width?: number
  height?: number
  color?: string
  strokeWidth?: number
  showDots?: boolean
  showArea?: boolean
  animationDelay?: number
}

export function AnimatedLineChart({
  data,
  width = 300,
  height = 200,
  color = 'var(--color-primary)',
  strokeWidth = 2,
  showDots = true,
  showArea = false,
  animationDelay = 0
}: LineChartProps) {
  const [pathLength, setPathLength] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const pathRef = useRef<SVGPathElement>(null)
  const motionConfig = useMotionConfig()

  const maxY = Math.max(...data.map(d => d.y))
  const minY = Math.min(...data.map(d => d.y))
  const padding = 20

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setIsAnimating(false)
      return
    }

    const timer = setTimeout(() => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength()
        setPathLength(length)
        
        setTimeout(() => {
          setIsAnimating(false)
        }, motionConfig.duration.slow)
      }
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [data, animationDelay, motionConfig])

  const createPath = () => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * (width - 2 * padding) + padding
      const y = ((maxY - point.y) / (maxY - minY)) * (height - 2 * padding) + padding
      
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const createAreaPath = () => {
    const linePath = createPath()
    const lastPoint = data[data.length - 1]
    const lastX = ((data.length - 1) / (data.length - 1)) * (width - 2 * padding) + padding
    const bottomY = height - padding
    
    return `${linePath} L ${lastX} ${bottomY} L ${padding} ${bottomY} Z`
  }

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      {showArea && (
        <path
          d={createAreaPath()}
          fill="url(#areaGradient)"
          style={{
            opacity: isAnimating ? 0 : 1,
            transition: motionConfig.shouldAnimate ? 
              `opacity ${motionConfig.duration.standard}ms ${motionConfig.easing.out}` : 
              'none'
          }}
        />
      )}
      
      {/* Line */}
      <path
        ref={pathRef}
        d={createPath()}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: motionConfig.shouldAnimate ? pathLength : 'none',
          strokeDashoffset: motionConfig.shouldAnimate && isAnimating ? pathLength : 0,
          transition: motionConfig.shouldAnimate ? 
            `stroke-dashoffset ${motionConfig.duration.slow}ms ${motionConfig.easing.out}` : 
            'none'
        }}
      />
      
      {/* Data points */}
      {showDots && data.map((point, index) => {
        const x = (index / (data.length - 1)) * (width - 2 * padding) + padding
        const y = ((maxY - point.y) / (maxY - minY)) * (height - 2 * padding) + padding
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={4}
            fill={color}
            style={{
              opacity: isAnimating ? 0 : 1,
              transition: motionConfig.shouldAnimate ? 
                `opacity ${motionConfig.duration.standard}ms ${motionConfig.easing.out} ${index * 100}ms` : 
                'none'
            }}
          >
            <title>{`${point.x}: ${point.y}`}</title>
          </circle>
        )
      })}
    </svg>
  )
}