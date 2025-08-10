'use client'

import React, { useState, useRef, ReactNode, MouseEvent } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface EnhancedCardProps {
  children: ReactNode
  className?: string
  hover3D?: boolean
  tiltIntensity?: number
  shadowIntensity?: 'none' | 'light' | 'medium' | 'strong'
  glowEffect?: boolean
  glowColor?: string
  onClick?: () => void
  href?: string
  disabled?: boolean
}

export function EnhancedCard({
  children,
  className = '',
  hover3D = true,
  tiltIntensity = 5,
  shadowIntensity = 'medium',
  glowEffect = false,
  glowColor = 'var(--color-primary)',
  onClick,
  href,
  disabled = false
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !motionConfig.shouldAnimate || !hover3D) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    setMousePosition({ x: mouseX, y: mouseY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  const getTransform = () => {
    if (!motionConfig.shouldAnimate || !hover3D || !isHovered) {
      return 'none'
    }

    const tiltX = (mousePosition.y / 100) * tiltIntensity
    const tiltY = -(mousePosition.x / 100) * tiltIntensity
    
    return `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(20px)`
  }

  const getShadow = () => {
    if (!motionConfig.shouldAnimate || disabled) return ''

    const shadows = {
      none: '',
      light: isHovered ? 'shadow-md' : 'shadow-sm',
      medium: isHovered ? 'shadow-lg' : 'shadow-md',
      strong: isHovered ? 'shadow-2xl' : 'shadow-lg'
    }
    
    return shadows[shadowIntensity]
  }

  const getGlowEffect = () => {
    if (!glowEffect || !motionConfig.shouldAnimate || !isHovered || disabled) {
      return {}
    }

    return {
      boxShadow: `0 0 20px 2px ${glowColor}40, 0 0 40px 4px ${glowColor}20`
    }
  }

  const baseClasses = `
    card-interactive transition-all duration-300 ease-out
    ${getShadow()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : onClick || href ? 'cursor-pointer' : ''}
    ${className}
  `

  const cardStyle = {
    transform: getTransform(),
    transitionDuration: `${motionConfig.duration.standard}ms`,
    transitionTimingFunction: motionConfig.easing.out,
    transformStyle: 'preserve-3d' as const,
    ...getGlowEffect()
  }

  const commonProps = {
    className: baseClasses,
    style: cardStyle,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: disabled ? undefined : onClick
  }

  if (href && !disabled) {
    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    )
  }

  return (
    <div ref={cardRef} {...commonProps}>
      {children}
    </div>
  )
}

// Floating card with gentle bobbing animation
interface FloatingCardProps {
  children: ReactNode
  className?: string
  bobIntensity?: number
  delay?: number
}

export function FloatingCard({
  children,
  className = '',
  bobIntensity = 10,
  delay = 0
}: FloatingCardProps) {
  const motionConfig = useMotionConfig()

  const floatingStyle = motionConfig.shouldAnimate ? {
    animation: `floating ${3000}ms ease-in-out infinite`,
    animationDelay: `${delay}ms`,
    '--bob-intensity': `${bobIntensity}px`
  } as React.CSSProperties : {}

  return (
    <div
      className={`floating-card ${className}`}
      style={floatingStyle}
    >
      {children}
    </div>
  )
}

// Parallax card that moves with scroll
interface ParallaxCardProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ParallaxCard({
  children,
  className = '',
  speed = 0.5,
  direction = 'up'
}: ParallaxCardProps) {
  const [scrollY, setScrollY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)
  const motionConfig = useMotionConfig()

  React.useEffect(() => {
    if (!motionConfig.shouldAnimate) return

    const handleScroll = () => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * speed

      setScrollY(rate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, motionConfig.shouldAnimate])

  const getParallaxTransform = () => {
    if (!motionConfig.shouldAnimate) return 'none'

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
      ref={cardRef}
      className={className}
      style={{
        transform: getParallaxTransform(),
        willChange: motionConfig.shouldAnimate ? 'transform' : 'auto'
      }}
    >
      {children}
    </div>
  )
}

// Magnetic card that attracts to cursor
interface MagneticCardProps {
  children: ReactNode
  className?: string
  magneticStrength?: number
  returnSpeed?: number
}

export function MagneticCard({
  children,
  className = '',
  magneticStrength = 0.3,
  returnSpeed = 0.1
}: MagneticCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const motionConfig = useMotionConfig()

  React.useEffect(() => {
    if (!isHovered && (position.x !== 0 || position.y !== 0)) {
      // Return to center with easing
      const animate = () => {
        setPosition(prev => ({
          x: prev.x * (1 - returnSpeed),
          y: prev.y * (1 - returnSpeed)
        }))

        if (Math.abs(position.x) > 0.1 || Math.abs(position.y) > 0.1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isHovered, position.x, position.y, returnSpeed])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !motionConfig.shouldAnimate) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * magneticStrength
    const deltaY = (e.clientY - centerY) * magneticStrength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  return (
    <div
      ref={cardRef}
      className={`magnetic-card ${className}`}
      style={{
        transform: motionConfig.shouldAnimate 
          ? `translate3d(${position.x}px, ${position.y}px, 0)` 
          : 'none',
        transition: isHovered ? 'none' : `transform ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

// Flip card with front and back content
interface FlipCardProps {
  frontContent: ReactNode
  backContent: ReactNode
  className?: string
  flipTrigger?: 'hover' | 'click'
  flipDirection?: 'horizontal' | 'vertical'
}

export function FlipCard({
  frontContent,
  backContent,
  className = '',
  flipTrigger = 'hover',
  flipDirection = 'horizontal'
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const motionConfig = useMotionConfig()

  const handleFlip = () => {
    if (flipTrigger === 'click') {
      setIsFlipped(!isFlipped)
    }
  }

  const handleMouseEnter = () => {
    if (flipTrigger === 'hover') {
      setIsFlipped(true)
    }
  }

  const handleMouseLeave = () => {
    if (flipTrigger === 'hover') {
      setIsFlipped(false)
    }
  }

  const getFlipTransform = () => {
    if (!motionConfig.shouldAnimate) return 'none'
    
    const rotation = isFlipped ? 180 : 0
    return flipDirection === 'horizontal' 
      ? `rotateY(${rotation}deg)` 
      : `rotateX(${rotation}deg)`
  }

  const getBackTransform = () => {
    if (!motionConfig.shouldAnimate) return 'none'
    
    return flipDirection === 'horizontal' 
      ? 'rotateY(180deg)' 
      : 'rotateX(180deg)'
  }

  return (
    <div
      className={`flip-card-container ${className}`}
      style={{ perspective: '1000px' }}
      onClick={handleFlip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flip-card-inner relative w-full h-full"
        style={{
          transform: getFlipTransform(),
          transformStyle: 'preserve-3d',
          transition: `transform ${motionConfig.duration.slow}ms ${motionConfig.easing.out}`
        }}
      >
        {/* Front */}
        <div
          className="flip-card-face flip-card-front absolute inset-0"
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          {frontContent}
        </div>
        
        {/* Back */}
        <div
          className="flip-card-face flip-card-back absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: getBackTransform()
          }}
        >
          {backContent}
        </div>
      </div>
    </div>
  )
}