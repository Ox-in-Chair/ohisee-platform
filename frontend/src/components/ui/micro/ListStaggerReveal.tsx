'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ListStaggerRevealProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  threshold?: number
  triggerOnce?: boolean
}

export function ListStaggerReveal({
  children,
  className = '',
  staggerDelay = 40,
  threshold = 0.1,
  triggerOnce = true
}: ListStaggerRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    const currentContainer = containerRef.current
    if (currentContainer) {
      observer.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer)
      }
    }
  }, [motionConfig.shouldAnimate, threshold, triggerOnce, hasTriggered])

  const getItemStyle = (index: number) => {
    if (!motionConfig.shouldAnimate) {
      return {}
    }

    const delay = isVisible ? index * staggerDelay : 0
    
    return {
      animationDelay: `${delay}ms`,
      animationDuration: `${motionConfig.duration.standard}ms`,
      animationTimingFunction: motionConfig.easing.out,
      animationFillMode: 'both' as const,
      animationName: isVisible ? 'stagger-fade-up' : 'stagger-fade-down'
    }
  }

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={getItemStyle(index)}
          className={isVisible || !motionConfig.shouldAnimate ? 'opacity-100' : 'opacity-0'}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Hook for manual stagger control
export function useStaggerAnimation(itemCount: number, staggerDelay = 40) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const motionConfig = useMotionConfig()

  const startStagger = () => {
    if (!motionConfig.shouldAnimate) {
      setCurrentIndex(itemCount - 1)
      return
    }

    let index = 0
    const interval = setInterval(() => {
      setCurrentIndex(index)
      index++
      
      if (index >= itemCount) {
        clearInterval(interval)
      }
    }, staggerDelay)

    return () => clearInterval(interval)
  }

  const resetStagger = () => {
    setCurrentIndex(-1)
  }

  const isItemVisible = (index: number) => {
    return !motionConfig.shouldAnimate || index <= currentIndex
  }

  return {
    currentIndex,
    startStagger,
    resetStagger,
    isItemVisible,
    isComplete: currentIndex >= itemCount - 1
  }
}

// Grid stagger reveal component
export function GridStaggerReveal({
  children,
  className = '',
  columns = 3,
  staggerDelay = 60,
  threshold = 0.1
}: {
  children: ReactNode[]
  className?: string
  columns?: number
  staggerDelay?: number
  threshold?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold }
    )

    const currentContainer = containerRef.current
    if (currentContainer) {
      observer.observe(currentContainer)
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer)
      }
    }
  }, [motionConfig.shouldAnimate, threshold])

  const getGridItemStyle = (index: number) => {
    if (!motionConfig.shouldAnimate) {
      return {}
    }

    // Calculate stagger delay based on grid position
    const row = Math.floor(index / columns)
    const col = index % columns
    const delay = isVisible ? (row + col) * staggerDelay : 0
    
    return {
      animationDelay: `${delay}ms`,
      animationDuration: `${motionConfig.duration.standard}ms`,
      animationTimingFunction: motionConfig.easing.out,
      animationFillMode: 'both' as const,
      animationName: isVisible ? 'stagger-fade-up' : 'none'
    }
  }

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={getGridItemStyle(index)}
          className={isVisible || !motionConfig.shouldAnimate ? 'opacity-100' : 'opacity-0'}
        >
          {child}
        </div>
      ))}
    </div>
  )
}