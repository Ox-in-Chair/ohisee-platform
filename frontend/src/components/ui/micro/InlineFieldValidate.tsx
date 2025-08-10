'use client'

import React, { useState, useEffect } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ValidationState {
  isValid: boolean
  message: string
  type: 'success' | 'error' | 'warning'
}

interface InlineFieldValidateProps {
  children: React.ReactElement
  validation?: ValidationState | null
  showValidation?: boolean
  required?: boolean
  label?: string
  helpText?: string
}

export function InlineFieldValidate({
  children,
  validation,
  showValidation = true,
  required = false,
  label,
  helpText
}: InlineFieldValidateProps) {
  const [isShaking, setIsShaking] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!validation || !showValidation) return

    if (!validation.isValid && motionConfig.shouldAnimate) {
      // Trigger shake animation for errors
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), motionConfig.duration.fast)
    } else if (validation.isValid && motionConfig.shouldAnimate) {
      // Trigger glow animation for success
      setIsGlowing(true)
      setTimeout(() => setIsGlowing(false), motionConfig.duration.standard * 2)
    }
  }, [validation, showValidation, motionConfig])

  const getValidationClasses = () => {
    if (!validation || !showValidation) return ''
    
    const baseClasses = 'border transition-all'
    
    if (validation.type === 'error') {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500`
    } else if (validation.type === 'success') {
      return `${baseClasses} border-green-500 focus:ring-green-500 focus:border-green-500`
    } else if (validation.type === 'warning') {
      return `${baseClasses} border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500`
    }
    
    return baseClasses
  }

  const getValidationIcon = () => {
    if (!validation || !showValidation) return null

    const iconClasses = 'w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2'

    if (validation.type === 'success') {
      return (
        <svg className={`${iconClasses} text-green-500`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )
    } else if (validation.type === 'error') {
      return (
        <svg className={`${iconClasses} text-red-500`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )
    } else if (validation.type === 'warning') {
      return (
        <svg className={`${iconClasses} text-yellow-500`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }

    return null
  }

  const getAnimationClasses = () => {
    if (!motionConfig.shouldAnimate) return ''
    
    let classes = ''
    
    if (isShaking) {
      classes += ' animate-shake'
    }
    
    if (isGlowing) {
      classes += ' animate-glow'
    }
    
    return classes
  }

  const enhancedChild = React.cloneElement(children, {
    className: `${children.props.className || ''} ${getValidationClasses()} ${getAnimationClasses()}`.trim(),
    'aria-describedby': validation ? `${children.props.id || 'field'}-validation` : undefined,
    'aria-invalid': validation && !validation.isValid ? 'true' : 'false',
  })

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={children.props.id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {enhancedChild}
        {getValidationIcon()}
      </div>
      
      {helpText && !validation && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      
      {validation && showValidation && (
        <p 
          id={`${children.props.id || 'field'}-validation`}
          className={`mt-1 text-xs transition-all ${
            validation.type === 'success' ? 'text-green-600' :
            validation.type === 'error' ? 'text-red-600' :
            'text-yellow-600'
          }`}
          style={{
            transitionDuration: `${motionConfig.duration.fast}ms`,
            transitionTimingFunction: motionConfig.easing.out
          }}
          role="alert"
          aria-live="polite"
        >
          {validation.message}
        </p>
      )}
    </div>
  )
}

// Validation helper functions
export const validators = {
  required: (value: string): ValidationState => ({
    isValid: value.trim().length > 0,
    message: value.trim().length > 0 ? 'Required field completed' : 'This field is required',
    type: value.trim().length > 0 ? 'success' : 'error'
  }),

  email: (value: string): ValidationState => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(value)
    return {
      isValid,
      message: isValid ? 'Valid email address' : 'Please enter a valid email address',
      type: isValid ? 'success' : 'error'
    }
  },

  minLength: (min: number) => (value: string): ValidationState => {
    const isValid = value.length >= min
    return {
      isValid,
      message: isValid ? `Minimum length requirement met` : `Must be at least ${min} characters`,
      type: isValid ? 'success' : 'error'
    }
  },

  maxLength: (max: number) => (value: string): ValidationState => {
    const isValid = value.length <= max
    return {
      isValid,
      message: isValid ? 'Length within limits' : `Must be no more than ${max} characters`,
      type: isValid ? 'success' : 'warning'
    }
  }
}

// CSS animations for shake and glow effects
const validationStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  
  @keyframes glow {
    0% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.4); }
    50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.6); }
    100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.4); }
  }
  
  .animate-shake {
    animation: shake 140ms ease-in-out;
  }
  
  .animate-glow {
    animation: glow 480ms ease-in-out;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-shake,
    .animate-glow {
      animation: none !important;
    }
  }
`

// Inject validation styles
if (typeof document !== 'undefined' && !document.querySelector('#validation-styles')) {
  const style = document.createElement('style')
  style.id = 'validation-styles'
  style.textContent = validationStyles
  document.head.appendChild(style)
}