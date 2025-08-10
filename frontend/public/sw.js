// OhiSee! Service Worker - v1.3.0
// Luxury Enhancement - PWA Capabilities

const CACHE_NAME = 'ohisee-v1.3.0'
const STATIC_CACHE_NAME = 'ohisee-static-v1.3.0'
const DYNAMIC_CACHE_NAME = 'ohisee-dynamic-v1.3.0'

// Core files to cache for offline functionality
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  '/api/reports',
  '/api/health'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('OhiSee! SW: Installing service worker')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('OhiSee! SW: Caching static assets')
        // Cache essential files only, let the rest load naturally
        return cache.addAll([
          '/',
          '/offline',
          '/manifest.json'
        ])
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('OhiSee! SW: Activating service worker')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('ohisee-') && 
                     cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME
            })
            .map((cacheName) => {
              console.log('OhiSee! SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests with cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // HTML pages - Network first, then cache, fallback to offline page
    event.respondWith(handleDocumentRequest(request))
  } else if (isStaticAsset(request)) {
    // Static assets - Cache first, then network
    event.respondWith(handleStaticAssetRequest(request))
  } else if (isAPIRequest(request)) {
    // API requests - Network first, then cache
    event.respondWith(handleAPIRequest(request))
  } else {
    // Everything else - Network first
    event.respondWith(handleDefaultRequest(request))
  }
})

// Document request handler (HTML pages)
async function handleDocumentRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fallback to offline page
    const offlineResponse = await caches.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }
    
    // Last resort - basic offline response
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>OhiSee! - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f8fafc;
              color: #373658;
            }
            .offline-container {
              text-align: center;
              max-width: 400px;
              padding: 2rem;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: #373658;
              border-radius: 12px;
              margin: 0 auto 1rem;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 24px;
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="logo">O</div>
            <h1>You're Offline</h1>
            <p>OhiSee! requires an internet connection to access compliance data.</p>
            <p>Please check your connection and try again.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    )
  }
}

// Static asset request handler
async function handleStaticAssetRequest(request) {
  try {
    // Check cache first for static assets
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache the response for future use
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('OhiSee! SW: Failed to fetch static asset:', request.url)
    return new Response('', { status: 404 })
  }
}

// API request handler
async function handleAPIRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    // Network failed, try cache for GET requests
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        // Add a header to indicate cached response
        const response = cachedResponse.clone()
        response.headers.set('X-Cached', 'true')
        return response
      }
    }
    
    // Return error response for failed API calls
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        message: 'Unable to connect to OhiSee! servers',
        offline: true 
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Default request handler
async function handleDefaultRequest(request) {
  try {
    return await fetch(request)
  } catch (error) {
    // For other resources, just fail gracefully
    return new Response('', { status: 404 })
  }
}

// Helper functions
function isStaticAsset(request) {
  return request.destination === 'style' ||
         request.destination === 'script' ||
         request.destination === 'font' ||
         request.destination === 'image' ||
         request.url.includes('/_next/static/')
}

function isAPIRequest(request) {
  return request.url.includes('/api/') ||
         API_CACHE_PATTERNS.some(pattern => request.url.includes(pattern))
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('OhiSee! SW: Background sync triggered:', event.tag)
  
  if (event.tag === 'background-submit-report') {
    event.waitUntil(handleBackgroundReportSubmission())
  }
})

async function handleBackgroundReportSubmission() {
  try {
    // Retrieve queued report submissions from IndexedDB
    // This would integrate with your form handling logic
    console.log('OhiSee! SW: Processing background report submissions')
    
    // For now, just log that sync is working
    // In a full implementation, you'd retrieve queued data and submit it
  } catch (error) {
    console.error('OhiSee! SW: Background sync failed:', error)
  }
}

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: data.data,
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'ohisee-notification'
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus()
            client.navigate(urlToOpen)
            return
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

console.log('OhiSee! Service Worker v1.3.0 loaded')