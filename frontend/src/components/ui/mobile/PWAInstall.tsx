'use client'

import React, { useState, useEffect } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed', platform: string }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface PWAInstallProps {
  onInstall?: () => void
  onDismiss?: () => void
}

export function PWAInstall({ onInstall, onDismiss }: PWAInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      onInstall?.()
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [onInstall])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('OhiSee! PWA: User accepted installation')
        onInstall?.()
      } else {
        console.log('OhiSee! PWA: User dismissed installation')
        onDismiss?.()
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('OhiSee! PWA: Installation failed:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    onDismiss?.()
  }

  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4
        transition-all ${motionConfig.shouldAnimate ? 'animate-slide-up' : ''}
      `}
      style={{
        transitionDuration: `${motionConfig.duration.standard}ms`,
        transitionTimingFunction: motionConfig.easing.out
      }}
    >
      <div className="flex items-start gap-3">
        {/* App Icon */}
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">O</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm">
            Install OhiSee! App
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            {isIOS 
              ? 'Tap the share button and select "Add to Home Screen"'
              : 'Install the app for quick access and offline functionality'
            }
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="btn-primary text-xs px-3 py-1 h-8"
            >
              Install
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for PWA installation state
export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                           (window.navigator as any).standalone ||
                           document.referrer.includes('android-app://')
      setIsInstalled(isStandalone)
    }

    checkInstalled()

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      setDeferredPrompt(null)
      setIsInstallable(false)
      
      return outcome === 'accepted'
    } catch (error) {
      console.error('Installation failed:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    install
  }
}

// Offline detection hook
export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      if (!online && isOnline) {
        setWasOffline(true)
      }
      setIsOnline(online)
    }

    // Set initial state
    updateOnlineStatus()

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [isOnline])

  return { isOnline, wasOffline, setWasOffline }
}

// Offline indicator component
export function OfflineIndicator() {
  const { isOnline, wasOffline, setWasOffline } = useOfflineDetection()
  const [showReconnected, setShowReconnected] = useState(false)
  const motionConfig = useMotionConfig()

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true)
      setWasOffline(false)
      
      // Hide reconnected message after 3 seconds
      const timer = setTimeout(() => {
        setShowReconnected(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline, setWasOffline])

  if (isOnline && !showReconnected) {
    return null
  }

  return (
    <div
      className={`
        fixed top-4 left-4 right-4 z-50 p-3 rounded-lg text-white text-sm font-medium text-center
        transition-all
        ${showReconnected 
          ? 'bg-green-600' 
          : 'bg-red-600'
        }
        ${motionConfig.shouldAnimate ? 'animate-slide-down' : ''}
      `}
      style={{
        transitionDuration: `${motionConfig.duration.standard}ms`,
        transitionTimingFunction: motionConfig.easing.out
      }}
    >
      {showReconnected ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Back online - data synced
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          No internet connection - working offline
        </div>
      )}
    </div>
  )
}