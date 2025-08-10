'use client'

import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  maxPullDistance?: number
  refreshingText?: string
  pullText?: string
  releaseText?: string
  className?: string
  disabled?: boolean
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  refreshingText = 'Refreshing...',
  pullText = 'Pull to refresh',
  releaseText = 'Release to refresh',
  className = '',
  disabled = false
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled || isRefreshing) return
    
    // Only start pull to refresh if at the top of the page
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }, [disabled, isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return

    const currentY = e.touches[0].clientY
    const deltaY = Math.max(0, currentY - startY)
    
    if (deltaY > 0) {
      e.preventDefault()
      
      // Apply elastic resistance
      const elasticPull = Math.min(
        deltaY * (1 - deltaY / (maxPullDistance * 2)),
        maxPullDistance
      )
      
      setPullDistance(elasticPull)
    }
  }, [isPulling, startY, maxPullDistance, disabled, isRefreshing])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || disabled) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh, disabled])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: false })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const getRefreshIndicatorText = () => {
    if (isRefreshing) return refreshingText
    if (pullDistance >= threshold) return releaseText
    return pullText
  }

  const getSpinnerRotation = () => {
    if (isRefreshing) return 360
    return Math.min((pullDistance / threshold) * 360, 360)
  }

  const getIndicatorOpacity = () => {
    if (isRefreshing) return 1
    return Math.min(pullDistance / (threshold * 0.5), 1)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center z-10 bg-white/95 backdrop-blur-sm"
        style={{
          height: pullDistance,
          opacity: getIndicatorOpacity(),
          transition: isPulling || isRefreshing ? 'none' : 
            `all ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
        }}
      >
        <div className="flex flex-col items-center gap-2 pb-4">
          {/* Spinner */}
          <div
            className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full"
            style={{
              transform: `rotate(${getSpinnerRotation()}deg)`,
              transition: isRefreshing ? 
                `transform ${motionConfig.duration.slow}ms linear` : 
                'none',
              animation: isRefreshing ? 'spin 1s linear infinite' : 'none'
            }}
          />
          
          {/* Text */}
          <span className="text-sm font-medium text-primary">
            {getRefreshIndicatorText()}
          </span>
          
          {/* Progress indicator */}
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${Math.min((pullDistance / threshold) * 100, 100)}%`,
                transition: isPulling ? 'none' : 
                  `width ${motionConfig.duration.fast}ms ${motionConfig.easing.out}`
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling || isRefreshing ? 'none' : 
            `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Hook for programmatic pull-to-refresh
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const triggerRefresh = useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh, isRefreshing])

  return { isRefreshing, triggerRefresh }
}

// Simple refresh button component
interface RefreshButtonProps {
  onRefresh: () => Promise<void>
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function RefreshButton({
  onRefresh,
  className = '',
  size = 'md',
  variant = 'ghost'
}: RefreshButtonProps) {
  const { isRefreshing, triggerRefresh } = usePullToRefresh(onRefresh)
  const motionConfig = useMotionConfig()

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const variantClasses = {
    primary: 'text-primary hover:bg-primary/10',
    secondary: 'text-secondary hover:bg-secondary/10',
    ghost: 'text-gray-500 hover:bg-gray-100'
  }

  return (
    <button
      onClick={triggerRefresh}
      disabled={isRefreshing}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-full flex items-center justify-center
        transition-all hover:scale-110 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        transitionDuration: `${motionConfig.duration.fast}ms`,
        transitionTimingFunction: motionConfig.easing.out
      }}
    >
      <svg
        className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  )
}