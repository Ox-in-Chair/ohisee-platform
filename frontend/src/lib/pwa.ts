// PWA Service Worker Registration and Management
// OhiSee! Luxury Enhancement - Phase 4

export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('OhiSee! PWA: Service Worker not supported')
    return
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('OhiSee! PWA: Service Worker registered successfully:', registration.scope)

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available, show update notification
            showUpdateAvailableNotification(registration)
          }
        })
      })

    } catch (error) {
      console.error('OhiSee! PWA: Service Worker registration failed:', error)
    }
  })

  // Handle service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('OhiSee! PWA: Message from SW:', event.data)
    
    if (event.data.type === 'CACHE_UPDATED') {
      // Handle cache updates
      showCacheUpdatedNotification()
    }
  })
}

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      await registration.unregister()
    }
    console.log('OhiSee! PWA: Service Workers unregistered')
  }
}

export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      await registration.update()
    }
  }
}

// Show notification when app update is available
const showUpdateAvailableNotification = (registration: ServiceWorkerRegistration) => {
  // Create a custom event that components can listen to
  const updateEvent = new CustomEvent('sw-update-available', {
    detail: { registration }
  })
  window.dispatchEvent(updateEvent)
}

// Show notification when cache is updated
const showCacheUpdatedNotification = () => {
  const cacheEvent = new CustomEvent('sw-cache-updated')
  window.dispatchEvent(cacheEvent)
}

// Request persistent storage
export const requestPersistentStorage = async (): Promise<boolean> => {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const granted = await navigator.storage.persist()
      console.log('OhiSee! PWA: Persistent storage:', granted ? 'granted' : 'denied')
      return granted
    } catch (error) {
      console.error('OhiSee! PWA: Error requesting persistent storage:', error)
      return false
    }
  }
  return false
}

// Estimate storage usage
export const getStorageEstimate = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate()
      console.log('OhiSee! PWA: Storage estimate:', estimate)
      return estimate
    } catch (error) {
      console.error('OhiSee! PWA: Error getting storage estimate:', error)
      return null
    }
  }
  return null
}

// Background sync registration
export const registerBackgroundSync = async (tag: string) => {
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.sync.register(tag)
      console.log('OhiSee! PWA: Background sync registered:', tag)
    } catch (error) {
      console.error('OhiSee! PWA: Background sync registration failed:', error)
    }
  }
}

// Check if running in standalone mode
export const isStandalone = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://')
}

// Check if PWA is installable
export const isPWAInstallable = (): boolean => {
  return !isStandalone() && 'serviceWorker' in navigator
}

// Get PWA display mode
export const getPWADisplayMode = (): string => {
  const standalone = window.matchMedia('(display-mode: standalone)')
  const fullscreen = window.matchMedia('(display-mode: fullscreen)')
  const minimalUI = window.matchMedia('(display-mode: minimal-ui)')
  const browser = window.matchMedia('(display-mode: browser)')

  if (standalone.matches) return 'standalone'
  if (fullscreen.matches) return 'fullscreen'
  if (minimalUI.matches) return 'minimal-ui'
  if (browser.matches) return 'browser'
  return 'unknown'
}

// Analytics for PWA usage
export const trackPWAMetrics = () => {
  const metrics = {
    displayMode: getPWADisplayMode(),
    isStandalone: isStandalone(),
    isInstallable: isPWAInstallable(),
    serviceWorkerSupported: 'serviceWorker' in navigator,
    pushSupported: 'PushManager' in window,
    notificationSupported: 'Notification' in window,
    backgroundSyncSupported: 'sync' in window.ServiceWorkerRegistration.prototype,
    storageSupported: 'storage' in navigator,
    userAgent: navigator.userAgent,
    screen: {
      width: screen.width,
      height: screen.height,
      orientation: screen.orientation?.type || 'unknown'
    }
  }

  console.log('OhiSee! PWA: Metrics collected:', metrics)
  
  // Send to analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'pwa_metrics', {
      custom_parameters: metrics
    })
  }

  return metrics
}

// Initialize PWA features
export const initializePWA = () => {
  console.log('OhiSee! PWA: Initializing PWA features')
  
  registerServiceWorker()
  requestPersistentStorage()
  trackPWAMetrics()

  // Listen for visibility changes to refresh data
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkForUpdates()
    }
  })

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('OhiSee! PWA: Back online')
    // Trigger background sync if available
    registerBackgroundSync('background-submit-report')
  })

  window.addEventListener('offline', () => {
    console.log('OhiSee! PWA: Gone offline')
  })
}