'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'zoom'
  duration?: number
  easing?: string
}

export function PageTransition({
  children,
  className = '',
  animation = 'fade',
  duration,
  easing
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const motionConfig = useMotionConfig()
  
  const animationDuration = duration || motionConfig.duration.standard
  const animationEasing = easing || motionConfig.easing.out

  useEffect(() => {
    setIsMounted(true)
    // Trigger entrance animation after mount
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [])

  const getAnimationClasses = () => {
    if (!motionConfig.shouldAnimate) {
      return 'opacity-100'
    }

    const baseClasses = 'transition-all'
    const durationClass = `duration-[${animationDuration}ms]`
    
    if (!isVisible) {
      switch (animation) {
        case 'fade':
          return `${baseClasses} ${durationClass} opacity-0`
        case 'slide-up':
          return `${baseClasses} ${durationClass} opacity-0 translate-y-8`
        case 'slide-down':
          return `${baseClasses} ${durationClass} opacity-0 -translate-y-8`
        case 'slide-left':
          return `${baseClasses} ${durationClass} opacity-0 translate-x-8`
        case 'slide-right':
          return `${baseClasses} ${durationClass} opacity-0 -translate-x-8`
        case 'scale':
          return `${baseClasses} ${durationClass} opacity-0 scale-95`
        case 'zoom':
          return `${baseClasses} ${durationClass} opacity-0 scale-110`
        default:
          return `${baseClasses} ${durationClass} opacity-0`
      }
    } else {
      return `${baseClasses} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`
    }
  }

  if (!isMounted) {
    return <div className={`opacity-0 ${className}`}>{children}</div>
  }

  return (
    <div 
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionTimingFunction: animationEasing
      }}
    >
      {children}
    </div>
  )
}

// Route transition hook for client-side navigation
export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const motionConfig = useMotionConfig()

  const startTransition = (callback: () => void) => {
    if (!motionConfig.shouldAnimate) {
      callback()
      return
    }

    setIsTransitioning(true)
    
    setTimeout(() => {
      callback()
      setTimeout(() => {
        setIsTransitioning(false)
      }, motionConfig.duration.fast)
    }, motionConfig.duration.standard)
  }

  return { isTransitioning, startTransition }
}

// Advanced page transition with overlay
interface AdvancedPageTransitionProps {
  children: ReactNode
  isTransitioning: boolean
  transitionType?: 'slide' | 'fade' | 'scale' | 'curtain'
  overlayColor?: string
}

export function AdvancedPageTransition({
  children,
  isTransitioning,
  transitionType = 'slide',
  overlayColor = 'var(--color-primary)'
}: AdvancedPageTransitionProps) {
  const motionConfig = useMotionConfig()

  const getOverlayStyles = () => {
    if (!motionConfig.shouldAnimate) return { display: 'none' }

    switch (transitionType) {
      case 'curtain':
        return {
          transform: isTransitioning ? 'translateY(0%)' : 'translateY(-100%)',
          transition: `transform ${motionConfig.duration.slow}ms ${motionConfig.easing.inOut}`,
          background: overlayColor
        }
      case 'slide':
        return {
          transform: isTransitioning ? 'translateX(0%)' : 'translateX(-100%)',
          transition: `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`,
          background: overlayColor
        }
      case 'scale':
        return {
          transform: isTransitioning ? 'scale(1)' : 'scale(0)',
          transition: `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.spring}`,
          background: overlayColor,
          borderRadius: isTransitioning ? '0%' : '50%'
        }
      default:
        return {
          opacity: isTransitioning ? 1 : 0,
          transition: `opacity ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`,
          background: overlayColor
        }
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Page Content */}
      <div 
        className={`transition-all ${
          motionConfig.shouldAnimate && isTransitioning ? 'scale-95 blur-sm' : ''
        }`}
        style={{
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        {children}
      </div>

      {/* Transition Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        style={getOverlayStyles()}
      >
        <div className="text-white text-xl font-semibold">
          Loading...
        </div>
      </div>
    </div>
  )
}

// Breadcrumb transition component
interface BreadcrumbTransitionProps {
  items: Array<{ label: string; href?: string }>
  separator?: ReactNode
}

export function BreadcrumbTransition({
  items,
  separator = <span className="text-gray-400 mx-2">/</span>
}: BreadcrumbTransitionProps) {
  const motionConfig = useMotionConfig()

  return (
    <nav className="flex items-center space-x-1 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && separator}
          <div
            className={`
              transition-all hover:text-primary
              ${motionConfig.shouldAnimate ? 'animate-fade-in' : ''}
            `}
            style={{
              animationDelay: motionConfig.shouldAnimate ? `${index * 100}ms` : '0ms',
              animationDuration: `${motionConfig.duration.standard}ms`,
              animationTimingFunction: motionConfig.easing.out
            }}
          >
            {item.href ? (
              <a href={item.href} className="hover:underline">
                {item.label}
              </a>
            ) : (
              <span className="text-gray-500">{item.label}</span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  )
}

// Staggered content reveal
interface StaggeredRevealProps {
  children: ReactNode[]
  staggerDelay?: number
  className?: string
}

export function StaggeredReveal({
  children,
  staggerDelay = 100,
  className = ''
}: StaggeredRevealProps) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([])
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setVisibleItems(new Array(children.length).fill(true))
      return
    }

    const timers: NodeJS.Timeout[] = []
    
    children.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev]
          newVisible[index] = true
          return newVisible
        })
      }, index * staggerDelay)
      
      timers.push(timer)
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [children.length, staggerDelay, motionConfig.shouldAnimate])

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`
            transition-all
            ${visibleItems[index] || !motionConfig.shouldAnimate
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            }
          `}
          style={{
            transitionDuration: `${motionConfig.duration.standard}ms`,
            transitionTimingFunction: motionConfig.easing.out,
            transitionDelay: `${index * (staggerDelay / 2)}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}