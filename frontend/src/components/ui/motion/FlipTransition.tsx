'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

/**
 * FLIP (First, Last, Invert, Play) Transition Utility
 * Provides smooth layout transitions when items change position
 */

interface FlipTransitionProps {
  children: ReactNode
  className?: string
  duration?: number
  easing?: string
  layoutId?: string
}

export function FlipTransition({
  children,
  className = '',
  duration,
  easing,
  layoutId
}: FlipTransitionProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const animationDuration = duration || motionConfig.duration.standard
  const animationEasing = easing || motionConfig.easing.out

  useEffect(() => {
    if (!motionConfig.shouldAnimate || !elementRef.current) return

    const element = elementRef.current
    let previousRect: DOMRect | null = null

    const observer = new MutationObserver(() => {
      if (!previousRect) {
        previousRect = element.getBoundingClientRect()
        return
      }

      const currentRect = element.getBoundingClientRect()
      
      // Calculate the difference (FLIP)
      const deltaX = previousRect.left - currentRect.left
      const deltaY = previousRect.top - currentRect.top
      const deltaW = previousRect.width / currentRect.width
      const deltaH = previousRect.height / currentRect.height

      if (deltaX === 0 && deltaY === 0 && deltaW === 1 && deltaH === 1) {
        previousRect = currentRect
        return
      }

      // Apply the inverted transform immediately
      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
      element.style.transformOrigin = 'top left'

      setIsAnimating(true)

      // Play the animation
      requestAnimationFrame(() => {
        element.style.transition = `transform ${animationDuration}ms ${animationEasing}`
        element.style.transform = ''
        
        setTimeout(() => {
          element.style.transition = ''
          setIsAnimating(false)
        }, animationDuration)
      })

      previousRect = currentRect
    })

    observer.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    })

    return () => observer.disconnect()
  }, [motionConfig.shouldAnimate, animationDuration, animationEasing])

  return (
    <div
      ref={elementRef}
      className={className}
      data-flip-id={layoutId}
      style={{ willChange: isAnimating ? 'transform' : 'auto' }}
    >
      {children}
    </div>
  )
}

// Hook for manual FLIP animations
export function useFlipAnimation() {
  const elementRef = useRef<HTMLElement>(null)
  const motionConfig = useMotionConfig()
  const firstRectRef = useRef<DOMRect | null>(null)

  const recordFirst = () => {
    if (!elementRef.current) return
    firstRectRef.current = elementRef.current.getBoundingClientRect()
  }

  const playAnimation = (onComplete?: () => void) => {
    if (!elementRef.current || !firstRectRef.current || !motionConfig.shouldAnimate) {
      onComplete?.()
      return
    }

    const element = elementRef.current
    const lastRect = element.getBoundingClientRect()
    const firstRect = firstRectRef.current

    const deltaX = firstRect.left - lastRect.left
    const deltaY = firstRect.top - lastRect.top
    const deltaW = firstRect.width / lastRect.width
    const deltaH = firstRect.height / lastRect.height

    // Invert
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
    element.style.transformOrigin = 'top left'

    // Play
    requestAnimationFrame(() => {
      element.style.transition = `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
      element.style.transform = ''
      
      setTimeout(() => {
        element.style.transition = ''
        firstRectRef.current = null
        onComplete?.()
      }, motionConfig.duration.standard)
    })
  }

  const animate = (callback: () => void, onComplete?: () => void) => {
    recordFirst()
    callback()
    requestAnimationFrame(() => playAnimation(onComplete))
  }

  return {
    elementRef,
    recordFirst,
    playAnimation,
    animate
  }
}

// Shared layout component for complex FLIP animations
interface SharedLayoutProps {
  children: ReactNode
  className?: string
}

export function SharedLayout({ children, className = '' }: SharedLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()
  const elementsMapRef = useRef<Map<string, DOMRect>>(new Map())

  useEffect(() => {
    if (!motionConfig.shouldAnimate || !containerRef.current) return

    const container = containerRef.current
    const elements = container.querySelectorAll('[data-flip-id]')

    // Record all element positions
    elements.forEach((element) => {
      const flipId = element.getAttribute('data-flip-id')
      if (flipId) {
        elementsMapRef.current.set(flipId, element.getBoundingClientRect())
      }
    })

    const observer = new MutationObserver(() => {
      const currentElements = container.querySelectorAll('[data-flip-id]')
      
      currentElements.forEach((element) => {
        const flipId = element.getAttribute('data-flip-id')
        if (!flipId) return

        const firstRect = elementsMapRef.current.get(flipId)
        if (!firstRect) return

        const lastRect = element.getBoundingClientRect()
        
        const deltaX = firstRect.left - lastRect.left
        const deltaY = firstRect.top - lastRect.top
        const deltaW = firstRect.width / lastRect.width
        const deltaH = firstRect.height / lastRect.height

        if (deltaX === 0 && deltaY === 0 && deltaW === 1 && deltaH === 1) return

        // Apply FLIP animation
        const htmlElement = element as HTMLElement
        htmlElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`
        htmlElement.style.transformOrigin = 'top left'

        requestAnimationFrame(() => {
          htmlElement.style.transition = `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
          htmlElement.style.transform = ''
          
          setTimeout(() => {
            htmlElement.style.transition = ''
          }, motionConfig.duration.standard)
        })

        // Update stored position
        elementsMapRef.current.set(flipId, lastRect)
      })
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true
    })

    return () => observer.disconnect()
  }, [motionConfig.shouldAnimate, motionConfig.duration.standard, motionConfig.easing.out])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

// Grid reorder component with FLIP animations
interface FlipGridProps {
  items: Array<{ id: string; content: ReactNode }>
  onReorder?: (newOrder: string[]) => void
  className?: string
  itemClassName?: string
  columns?: number
}

export function FlipGrid({
  items,
  onReorder,
  className = '',
  itemClassName = '',
  columns = 3
}: FlipGridProps) {
  const [gridItems, setGridItems] = useState(items)
  const { animate } = useFlipAnimation()

  const handleReorder = (newItems: typeof items) => {
    animate(
      () => setGridItems(newItems),
      () => onReorder?.(newItems.map(item => item.id))
    )
  }

  const gridClasses = `grid grid-cols-${columns} gap-4 ${className}`

  return (
    <SharedLayout className={gridClasses}>
      {gridItems.map((item) => (
        <div
          key={item.id}
          data-flip-id={item.id}
          className={itemClassName}
        >
          {item.content}
        </div>
      ))}
    </SharedLayout>
  )
}

// Layout shift detection and compensation
export function useLayoutShiftCompensation() {
  const elementRef = useRef<HTMLElement>(null)
  const motionConfig = useMotionConfig()

  const compensateLayoutShift = (callback: () => void) => {
    if (!elementRef.current || !motionConfig.shouldAnimate) {
      callback()
      return
    }

    const element = elementRef.current
    const firstRect = element.getBoundingClientRect()
    
    callback()
    
    requestAnimationFrame(() => {
      const lastRect = element.getBoundingClientRect()
      const deltaY = firstRect.top - lastRect.top
      
      if (deltaY !== 0) {
        element.style.transform = `translateY(${deltaY}px)`
        element.style.transition = 'none'
        
        requestAnimationFrame(() => {
          element.style.transition = `transform ${motionConfig.duration.fast}ms ${motionConfig.easing.out}`
          element.style.transform = ''
        })
      }
    })
  }

  return { elementRef, compensateLayoutShift }
}