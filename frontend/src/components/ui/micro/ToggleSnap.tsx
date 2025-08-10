'use client'

import React, { useState } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ToggleSnapProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ToggleSnap({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md'
}: ToggleSnapProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const motionConfig = useMotionConfig()

  const handleToggle = () => {
    if (disabled) return

    if (motionConfig.shouldAnimate) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), motionConfig.duration.standard)
    }

    onChange(!checked)
  }

  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6'
  }

  const knobSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-6' : 'translate-x-0'
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        className={`
          relative inline-flex items-center ${sizeClasses[size]} rounded-full
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
          ${checked ? 'bg-primary' : 'bg-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isAnimating && motionConfig.shouldAnimate ? 'animate-pulse' : ''}
        `}
        onClick={handleToggle}
        disabled={disabled}
        aria-checked={checked}
        role="switch"
        style={{
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.spring
        }}
      >
        <span
          className={`
            ${knobSizeClasses[size]} bg-white rounded-full shadow-lg
            transform transition-transform
            ${translateClasses[size]}
            ${isAnimating && motionConfig.shouldAnimate ? 'scale-110' : ''}
          `}
          style={{
            transitionDuration: `${motionConfig.duration.standard}ms`,
            transitionTimingFunction: motionConfig.easing.spring
          }}
        />
        
        {/* Shadow bloom effect */}
        {motionConfig.shouldAnimate && (
          <span
            className={`
              absolute inset-0 rounded-full transition-shadow
              ${checked ? 'shadow-primary' : 'shadow-gray-400'}
              ${isAnimating ? 'shadow-lg' : ''}
            `}
            style={{
              transitionDuration: `${motionConfig.duration.standard}ms`,
              transitionTimingFunction: motionConfig.easing.out
            }}
          />
        )}
      </button>
      
      {label && (
        <label 
          className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
          onClick={!disabled ? handleToggle : undefined}
        >
          {label}
        </label>
      )}
    </div>
  )
}

// Custom shadow utilities for the bloom effect
const shadowStyles = `
  .shadow-primary {
    box-shadow: 0 0 0 3px rgba(55, 54, 88, 0.2);
  }
  
  .shadow-gray-400 {
    box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.2);
  }
`

// Inject shadow styles if they don't exist
if (typeof document !== 'undefined' && !document.querySelector('#toggle-shadow-styles')) {
  const style = document.createElement('style')
  style.id = 'toggle-shadow-styles'
  style.textContent = shadowStyles
  document.head.appendChild(style)
}