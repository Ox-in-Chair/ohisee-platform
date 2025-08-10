'use client'

import React, { useState, useRef, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ButtonPressProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  showSuccessState?: boolean
  successMessage?: string
  type?: 'button' | 'submit' | 'reset'
}

export function ButtonPress({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'primary',
  showSuccessState = false,
  successMessage = 'Done',
  type = 'button'
}: ButtonPressProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const motionConfig = useMotionConfig()

  const handleMouseDown = () => {
    if (disabled || !motionConfig.shouldAnimate) return
    setIsPressed(true)
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleClick = () => {
    if (disabled) return
    
    if (showSuccessState && motionConfig.shouldAnimate) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
    
    onClick?.()
  }

  const baseClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  const pressedClasses = isPressed && motionConfig.shouldAnimate ? 'scale-[0.98]' : ''
  const successClasses = showSuccess ? 'bg-green-600' : ''

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type={type}
        className={`${baseClasses} ${pressedClasses} ${successClasses} ${className} relative overflow-hidden`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        disabled={disabled}
        style={{
          transition: `all ${motionConfig.duration.fast}ms ${motionConfig.easing.out}`
        }}
      >
        {showSuccess && motionConfig.shouldAnimate ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </span>
        ) : (
          children
        )}
      </button>
      
      {/* Success Tooltip */}
      {showSuccess && motionConfig.shouldAnimate && (
        <div 
          className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded text-sm whitespace-nowrap"
          style={{
            animation: `fadeInUp ${motionConfig.duration.standard}ms ${motionConfig.easing.out}`
          }}
        >
          Action completed successfully
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
        </div>
      )}
    </div>
  )
}

// CSS-in-JS keyframe for fadeInUp animation
const fadeInUpKeyframes = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

// Inject keyframes if they don't exist
if (typeof document !== 'undefined' && !document.querySelector('#fadeInUp-keyframes')) {
  const style = document.createElement('style')
  style.id = 'fadeInUp-keyframes'
  style.textContent = fadeInUpKeyframes
  document.head.appendChild(style)
}