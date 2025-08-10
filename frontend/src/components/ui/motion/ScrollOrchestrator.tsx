'use client'

import React, { useEffect, useRef, useState, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ScrollRevealProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  className?: string
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' | 'zoom-in'
  delay?: number
}

export function ScrollReveal({
  children,
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
  className = '',
  animation = 'fade-up',
  delay = 0
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!motionConfig.shouldAnimate) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true)
            if (triggerOnce) {
              setHasTriggered(true)
            }
          }, delay)
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered, delay, motionConfig.shouldAnimate])

  const getAnimationClasses = () => {
    if (!motionConfig.shouldAnimate) return ''

    const baseClasses = 'transition-all'
    const durationClass = 'duration-500'
    const easingClass = 'ease-out'

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 translate-y-8`
        case 'fade-down':
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 -translate-y-8`
        case 'fade-left':
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 translate-x-8`
        case 'fade-right':
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 -translate-x-8`
        case 'scale-up':
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 scale-95`
        case 'zoom-in':
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 scale-75`
        default:
          return `${baseClasses} ${durationClass} ${easingClass} opacity-0 translate-y-8`
      }
    } else {
      return `${baseClasses} ${durationClass} ${easingClass} opacity-100 translate-y-0 translate-x-0 scale-100`
    }
  }

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  )
}

// Scroll-linked parallax component
interface ScrollParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ScrollParallax({
  children,
  speed = 0.5,
  className = '',
  direction = 'up'
}: ScrollParallaxProps) {
  const [scrollY, setScrollY] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!motionConfig.shouldAnimate) return

    const handleScroll = () => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const parallax = scrolled * speed

      setScrollY(parallax)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, motionConfig.shouldAnimate])

  const getTransform = () => {
    if (!motionConfig.shouldAnimate) return ''

    switch (direction) {
      case 'up':
        return `translateY(${-scrollY}px)`
      case 'down':
        return `translateY(${scrollY}px)`
      case 'left':
        return `translateX(${-scrollY}px)`
      case 'right':
        return `translateX(${scrollY}px)`
      default:
        return `translateY(${-scrollY}px)`
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: getTransform(),
        willChange: motionConfig.shouldAnimate ? 'transform' : 'auto'
      }}
    >
      {children}
    </div>
  )
}

// Scroll progress indicator
interface ScrollProgressProps {
  className?: string
  color?: string
  height?: number
}

export function ScrollProgress({
  className = '',
  color = 'var(--color-primary)',
  height = 3
}: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const calculateScrollProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (winScroll / height) * 100
      setScrollProgress(scrolled)
    }

    window.addEventListener('scroll', calculateScrollProgress, { passive: true })
    return () => window.removeEventListener('scroll', calculateScrollProgress)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 z-50 transition-all duration-150 ${className}`}
      style={{
        width: `${scrollProgress}%`,
        height: `${height}px`,
        backgroundColor: color
      }}
    />
  )
}

// Intersection observer hook for custom animations
export function useIntersectionObserver(
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsIntersecting(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsIntersecting(false)
        }
      },
      { threshold, rootMargin }
    )

    const currentTarget = targetRef.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { targetRef, isIntersecting, hasTriggered }
}

// Scroll-linked counter animation
interface ScrollCounterProps {
  end: number
  start?: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function ScrollCounter({
  end,
  start = 0,
  duration = 2000,
  className = '',
  prefix = '',
  suffix = ''
}: ScrollCounterProps) {
  const [count, setCount] = useState(start)
  const { targetRef, isIntersecting } = useIntersectionObserver()
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!isIntersecting || !motionConfig.shouldAnimate) {
      if (isIntersecting) setCount(end)
      return
    }

    const increment = (end - start) / (duration / 16) // 60fps
    let current = start
    
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        current = end
        clearInterval(timer)
      }
      setCount(Math.floor(current))
    }, 16)

    return () => clearInterval(timer)
  }, [isIntersecting, start, end, duration, motionConfig.shouldAnimate])

  return (
    <span ref={targetRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}