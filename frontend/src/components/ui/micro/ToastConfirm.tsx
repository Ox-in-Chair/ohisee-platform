'use client'

import React, { useState, useEffect } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastConfirmProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  isVisible: boolean
  onClose: () => void
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastConfirm({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000,
  position = 'top-right'
}: ToastConfirmProps) {
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [isVisible, duration])

  const handleClose = () => {
    if (motionConfig.shouldAnimate) {
      setIsAnimatingOut(true)
      setTimeout(() => {
        onClose()
        setIsAnimatingOut(false)
      }, motionConfig.duration.standard)
    } else {
      onClose()
    }
  }

  const getTypeStyles = () => {
    const styles = {
      success: 'bg-green-600 text-white border-green-500',
      error: 'bg-red-600 text-white border-red-500',
      info: 'bg-blue-600 text-white border-blue-500',
      warning: 'bg-yellow-600 text-white border-yellow-500'
    }
    return styles[type]
  }

  const getIcon = () => {
    const icons = {
      success: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[type]
  }

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }
    return positions[position]
  }

  const getAnimationClasses = () => {
    if (!motionConfig.shouldAnimate) return ''
    
    if (isAnimatingOut) {
      return 'opacity-0 scale-95 translate-y-2'
    }
    
    return isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
  }

  if (!isVisible && !isAnimatingOut) return null

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm
          ${getTypeStyles()}
          ${getAnimationClasses()}
          transition-all
        `}
        style={{
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Toast manager hook for managing multiple toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const showToast = (message: string, type: ToastMessage['type'] = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastMessage = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string, duration?: number) => showToast(message, 'success', duration),
    error: (message: string, duration?: number) => showToast(message, 'error', duration),
    info: (message: string, duration?: number) => showToast(message, 'info', duration),
    warning: (message: string, duration?: number) => showToast(message, 'warning', duration),
  }
}

// Toast container component for managing multiple toasts
export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map(toast => (
        <ToastConfirm
          key={toast.id}
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}