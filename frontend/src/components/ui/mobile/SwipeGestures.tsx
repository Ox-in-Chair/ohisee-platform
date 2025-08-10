'use client'

import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface SwipeGestureProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
  disabled?: boolean
  showSwipeHints?: boolean
}

export function SwipeGesture({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className = '',
  disabled = false,
  showSwipeHints = false
}: SwipeGestureProps) {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    setStartPos({ x: touch.clientX, y: touch.clientY })
    setCurrentPos({ x: touch.clientX, y: touch.clientY })
    setIsSwiping(true)
  }, [disabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping || disabled) return

    const touch = e.touches[0]
    setCurrentPos({ x: touch.clientX, y: touch.clientY })

    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left')
    } else {
      setSwipeDirection(deltaY > 0 ? 'down' : 'up')
    }
  }, [isSwiping, startPos, disabled])

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping || disabled) return

    const deltaX = currentPos.x - startPos.x
    const deltaY = currentPos.y - startPos.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Check if swipe threshold is met
    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    setIsSwiping(false)
    setSwipeDirection(null)
    setCurrentPos({ x: 0, y: 0 })
    setStartPos({ x: 0, y: 0 })
  }, [isSwiping, startPos, currentPos, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, disabled])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const getSwipeTransform = () => {
    if (!isSwiping || !motionConfig.shouldAnimate) return 'none'

    const deltaX = currentPos.x - startPos.x
    const deltaY = currentPos.y - startPos.y

    // Apply resistance for better feel
    const dampedX = deltaX * 0.3
    const dampedY = deltaY * 0.3

    return `translate(${dampedX}px, ${dampedY}px)`
  }

  return (
    <div
      ref={containerRef}
      className={`relative touch-pan-y ${className}`}
      style={{
        transform: getSwipeTransform(),
        transition: isSwiping ? 'none' : `transform ${motionConfig.duration.fast}ms ${motionConfig.easing.out}`,
        userSelect: 'none'
      }}
    >
      {children}
      
      {/* Swipe Hints */}
      {showSwipeHints && !disabled && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          {onSwipeLeft && (
            <div className="absolute right-4 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {onSwipeRight && (
            <div className="absolute left-4 text-gray-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Swipeable card component for lists
interface SwipeableCardProps {
  children: ReactNode
  leftAction?: {
    icon: ReactNode
    text: string
    color: string
    action: () => void
  }
  rightAction?: {
    icon: ReactNode
    text: string
    color: string
    action: () => void
  }
  className?: string
  disabled?: boolean
}

export function SwipeableCard({
  children,
  leftAction,
  rightAction,
  className = '',
  disabled = false
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [startX, setStartX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const actionWidth = 80 // Width of action buttons

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (disabled) return
    setStartX(e.touches[0].clientX)
  }, [disabled])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (disabled) return

    const currentX = e.touches[0].clientX
    const deltaX = currentX - startX
    
    // Constrain swipe based on available actions
    const maxLeft = leftAction ? actionWidth : 0
    const maxRight = rightAction ? -actionWidth : 0
    
    const constrainedOffset = Math.max(maxRight, Math.min(maxLeft, deltaX))
    setSwipeOffset(constrainedOffset)
  }, [startX, leftAction, rightAction, disabled])

  const handleTouchEnd = useCallback(() => {
    if (disabled) return

    const threshold = actionWidth / 2

    if (Math.abs(swipeOffset) > threshold) {
      // Reveal action
      if (swipeOffset > 0 && leftAction) {
        setSwipeOffset(actionWidth)
        setIsRevealed(true)
      } else if (swipeOffset < 0 && rightAction) {
        setSwipeOffset(-actionWidth)
        setIsRevealed(true)
      } else {
        setSwipeOffset(0)
        setIsRevealed(false)
      }
    } else {
      // Return to center
      setSwipeOffset(0)
      setIsRevealed(false)
    }
  }, [swipeOffset, leftAction, rightAction, disabled])

  const handleActionClick = (action: () => void) => {
    action()
    setSwipeOffset(0)
    setIsRevealed(false)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Left Action */}
      {leftAction && (
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center justify-center"
          style={{
            width: actionWidth,
            backgroundColor: leftAction.color,
            transform: `translateX(${Math.min(0, swipeOffset - actionWidth)}px)`,
            transition: !motionConfig.shouldAnimate || Math.abs(swipeOffset) > 0 ? 'none' : 
              `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
          }}
        >
          <button
            onClick={() => handleActionClick(leftAction.action)}
            className="flex flex-col items-center text-white text-xs font-medium p-2"
          >
            {leftAction.icon}
            <span className="mt-1">{leftAction.text}</span>
          </button>
        </div>
      )}

      {/* Right Action */}
      {rightAction && (
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-center"
          style={{
            width: actionWidth,
            backgroundColor: rightAction.color,
            transform: `translateX(${Math.max(0, swipeOffset + actionWidth)}px)`,
            transition: !motionConfig.shouldAnimate || Math.abs(swipeOffset) > 0 ? 'none' : 
              `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
          }}
        >
          <button
            onClick={() => handleActionClick(rightAction.action)}
            className="flex flex-col items-center text-white text-xs font-medium p-2"
          >
            {rightAction.icon}
            <span className="mt-1">{rightAction.text}</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: !motionConfig.shouldAnimate || Math.abs(swipeOffset) > 0 ? 'none' : 
            `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Tab swiper component
interface TabSwiperProps {
  tabs: Array<{ id: string; label: string; content: ReactNode }>
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function TabSwiper({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: TabSwiperProps) {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab)
  const motionConfig = useMotionConfig()

  const handleSwipeLeft = () => {
    const nextIndex = Math.min(activeIndex + 1, tabs.length - 1)
    if (nextIndex !== activeIndex) {
      onTabChange(tabs[nextIndex].id)
    }
  }

  const handleSwipeRight = () => {
    const prevIndex = Math.max(activeIndex - 1, 0)
    if (prevIndex !== activeIndex) {
      onTabChange(tabs[prevIndex].id)
    }
  }

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-3 px-4 text-sm font-medium text-center
              transition-colors duration-200
              ${activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content with Swipe */}
      <div className="relative overflow-hidden">
        <SwipeGesture
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          className="min-h-48"
        >
          <div
            className="flex transition-transform"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transitionDuration: `${motionConfig.duration.standard}ms`,
              transitionTimingFunction: motionConfig.easing.out
            }}
          >
            {tabs.map((tab) => (
              <div key={tab.id} className="w-full flex-shrink-0 p-4">
                {tab.content}
              </div>
            ))}
          </div>
        </SwipeGesture>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {tabs.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-primary' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}