'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: boolean
  animate?: boolean
}

export function Skeleton({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = false,
  animate = true
}: SkeletonProps) {
  const motionConfig = useMotionConfig()

  const shouldAnimate = animate && motionConfig.shouldAnimate

  return (
    <div
      className={`
        bg-gray-200 
        ${rounded ? 'rounded-full' : 'rounded'}
        ${shouldAnimate ? 'skeleton' : ''}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
      aria-label="Loading content"
    />
  )
}

// Skeleton patterns for common layouts
export function SkeletonText({
  lines = 3,
  className = '',
  lastLineWidth = '75%'
}: {
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 border border-gray-200 rounded-xl ${className}`}>
      <div className="flex items-start space-x-4">
        <Skeleton width={48} height={48} rounded />
        <div className="flex-1">
          <Skeleton height="1.25rem" width="60%" className="mb-2" />
          <SkeletonText lines={2} />
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton width={80} height="2rem" rounded />
        <Skeleton width={60} height="1.5rem" />
      </div>
    </div>
  )
}

export function SkeletonTable({ 
  rows = 5, 
  columns = 4,
  className = '' 
}: { 
  rows?: number
  columns?: number
  className?: string 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }, (_, index) => (
          <Skeleton key={`header-${index}`} height="1.5rem" width="80%" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} height="1rem" width="90%" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Morphing skeleton that transforms into actual content
interface MorphingSkeletonProps {
  isLoading: boolean
  children: ReactNode
  skeletonComponent?: ReactNode
  morphDuration?: number
  className?: string
}

export function MorphingSkeleton({
  isLoading,
  children,
  skeletonComponent,
  morphDuration,
  className = ''
}: MorphingSkeletonProps) {
  const [isMorphing, setIsMorphing] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const motionConfig = useMotionConfig()

  const duration = morphDuration || motionConfig.duration.standard

  useEffect(() => {
    if (isLoading) {
      setShowContent(false)
      setIsMorphing(false)
    } else {
      if (motionConfig.shouldAnimate) {
        setIsMorphing(true)
        setTimeout(() => {
          setShowContent(true)
          setIsMorphing(false)
        }, duration)
      } else {
        setShowContent(true)
      }
    }
  }, [isLoading, duration, motionConfig.shouldAnimate])

  const getTransitionClasses = () => {
    if (!motionConfig.shouldAnimate) return ''
    
    if (isMorphing) {
      return 'skeleton-to-content'
    }
    
    return showContent ? 'opacity-100' : 'opacity-100'
  }

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton Layer */}
      <div
        className={`
          transition-opacity
          ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          ${getTransitionClasses()}
        `}
        style={{
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        {skeletonComponent || <SkeletonCard />}
      </div>

      {/* Content Layer */}
      <div
        className={`
          ${showContent ? '' : 'absolute inset-0 opacity-0 pointer-events-none'}
          transition-opacity
          ${getTransitionClasses()}
        `}
        style={{
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Skeleton for dashboard widgets
export function SkeletonWidget({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Skeleton width={24} height={24} rounded />
          <Skeleton width={120} height="1.25rem" />
        </div>
        <Skeleton width={60} height="1rem" />
      </div>
      
      {/* Main content */}
      <div className="mb-4">
        <Skeleton width={80} height="2.5rem" className="mb-2" />
        <SkeletonText lines={2} />
      </div>
      
      {/* Chart area */}
      <div className="h-32 relative">
        <Skeleton width="100%" height="100%" />
        {/* Fake chart elements */}
        <div className="absolute inset-4 flex items-end justify-between">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton
              key={index}
              width={12}
              height={Math.random() * 60 + 20}
              className="opacity-30"
            />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <Skeleton width={100} height="0.875rem" />
        <Skeleton width={80} height="1.5rem" rounded />
      </div>
    </div>
  )
}

// Skeleton for data tables
export function SkeletonDataTable({ 
  className = '',
  showPagination = true 
}: { 
  className?: string
  showPagination?: boolean 
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* Table header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <Skeleton width={180} height="1.5rem" />
          <div className="flex gap-2">
            <Skeleton width={100} height="2rem" rounded />
            <Skeleton width={80} height="2rem" rounded />
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="flex gap-4">
          <Skeleton width={240} height="2.5rem" rounded />
          <Skeleton width={120} height="2.5rem" rounded />
          <Skeleton width={100} height="2.5rem" rounded />
        </div>
      </div>
      
      {/* Table content */}
      <div className="p-6">
        <SkeletonTable rows={8} columns={5} />
      </div>
      
      {/* Pagination */}
      {showPagination && (
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <Skeleton width={120} height="1rem" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} width={32} height={32} rounded />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for managing loading states with skeleton
export function useSkeletonLoader(initialLoading = true) {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const setLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const setComponentLoading = (component: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [component]: loading
    }))
  }

  const isComponentLoading = (component: string) => {
    return loadingStates[component] ?? false
  }

  return {
    isLoading,
    setLoading,
    setComponentLoading,
    isComponentLoading,
    loadingStates
  }
}