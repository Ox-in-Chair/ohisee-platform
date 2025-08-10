'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook to detect user's motion preference
 * Respects prefers-reduced-motion: reduce and provides fallback
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Motion configuration object based on user preference
 */
export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion()

  return {
    shouldAnimate: !prefersReducedMotion,
    duration: {
      fast: prefersReducedMotion ? 0 : 140,
      standard: prefersReducedMotion ? 0 : 240,
      slow: prefersReducedMotion ? 0 : 480,
    },
    easing: {
      spring: prefersReducedMotion ? 'linear' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      out: prefersReducedMotion ? 'linear' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      inOut: prefersReducedMotion ? 'linear' : 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
    transforms: {
      hover: prefersReducedMotion ? 'none' : 'translateY(-2px)',
      press: prefersReducedMotion ? 'none' : 'scale(0.98)',
      card: prefersReducedMotion ? 'none' : 'translateY(-4px) perspective(1000px) rotateX(2deg)',
    }
  }
}