'use client'

import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'compliance'
type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
  }>
  timestamp?: Date
  read?: boolean
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

interface NotificationSystemProps {
  position?: NotificationPosition
  maxNotifications?: number
  defaultDuration?: number
}

// Global notification state
let notificationQueue: Notification[] = []
let notificationListeners: Set<(notifications: Notification[]) => void> = new Set()

const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    read: false
  }
  
  notificationQueue.push(newNotification)
  
  // Sort by priority and timestamp
  notificationQueue.sort((a, b) => {
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
    const aPriority = priorityOrder[a.priority || 'medium']
    const bPriority = priorityOrder[b.priority || 'medium']
    
    if (aPriority !== bPriority) return bPriority - aPriority
    return b.timestamp!.getTime() - a.timestamp!.getTime()
  })
  
  notificationListeners.forEach(listener => listener([...notificationQueue]))
}

const removeNotification = (id: string) => {
  notificationQueue = notificationQueue.filter(n => n.id !== id)
  notificationListeners.forEach(listener => listener([...notificationQueue]))
}

const markAsRead = (id: string) => {
  const notification = notificationQueue.find(n => n.id === id)
  if (notification) {
    notification.read = true
    notificationListeners.forEach(listener => listener([...notificationQueue]))
  }
}

const clearAllNotifications = () => {
  notificationQueue = []
  notificationListeners.forEach(listener => listener([]))
}

export function NotificationSystem({
  position = 'top-right',
  maxNotifications = 5,
  defaultDuration = 5000
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const motionConfig = useMotionConfig()

  useEffect(() => {
    const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications.slice(0, maxNotifications))
    }

    notificationListeners.add(handleNotificationUpdate)
    setNotifications([...notificationQueue].slice(0, maxNotifications))

    return () => {
      notificationListeners.delete(handleNotificationUpdate)
    }
  }, [maxNotifications])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    notifications.forEach(notification => {
      if (!notification.persistent) {
        const duration = notification.duration || defaultDuration
        const timer = setTimeout(() => {
          removeNotification(notification.id)
        }, duration)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [notifications, defaultDuration])

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

  return (
    <div className={`fixed z-50 ${getPositionClasses()}`}>
      <div className="space-y-3 max-w-sm w-full">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
            onClose={() => removeNotification(notification.id)}
            onMarkRead={() => markAsRead(notification.id)}
            motionConfig={motionConfig}
          />
        ))}
      </div>
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  index: number
  onClose: () => void
  onMarkRead: () => void
  motionConfig: any
}

function NotificationItem({
  notification,
  index,
  onClose,
  onMarkRead,
  motionConfig
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  const getNotificationStyles = () => {
    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      compliance: 'bg-purple-50 border-purple-200 text-purple-800'
    }
    return styles[notification.type]
  }

  const getIcon = () => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      compliance: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    }
    return icons[notification.type]
  }

  const handleClose = () => {
    if (!motionConfig.shouldAnimate) {
      onClose()
      return
    }

    setIsRemoving(true)
    setTimeout(onClose, motionConfig.duration.standard)
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div
      className={`
        border rounded-lg shadow-lg p-4 transition-all cursor-pointer
        ${getNotificationStyles()}
        ${isRemoving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        ${!notification.read ? 'border-l-4 border-l-primary' : ''}
        ${isHovered ? 'shadow-xl scale-105' : ''}
      `}
      style={{
        transitionDuration: `${motionConfig.duration.standard}ms`,
        transitionTimingFunction: motionConfig.easing.out,
        animationDelay: `${index * 100}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onMarkRead}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm truncate">{notification.title}</h4>
            
            {/* Priority Badge */}
            {notification.priority === 'urgent' && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                URGENT
              </span>
            )}
          </div>
          
          <p className="text-sm opacity-90 mb-2">{notification.message}</p>
          
          {/* Timestamp */}
          {notification.timestamp && (
            <p className="text-xs opacity-75">
              {formatTimestamp(notification.timestamp)}
            </p>
          )}
          
          {/* Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  onClick={(e) => {
                    e.stopPropagation()
                    action.action()
                  }}
                  className={`
                    text-xs px-3 py-1 rounded font-medium transition-colors
                    ${action.variant === 'primary' 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-white/50 text-current hover:bg-white/70'
                    }
                  `}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity p-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Notification Center Modal
interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all')
  const motionConfig = useMotionConfig()

  useEffect(() => {
    const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications)
    }

    notificationListeners.add(handleNotificationUpdate)
    setNotifications([...notificationQueue])

    return () => {
      notificationListeners.delete(handleNotificationUpdate)
    }
  }, [])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`
          bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden
          transition-all
          ${motionConfig.shouldAnimate ? 'animate-scale-up' : ''}
        `}
        style={{
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-primary text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllNotifications}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {['all', 'unread', 'success', 'error', 'warning', 'info', 'compliance'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType as any)}
                className={`
                  text-xs px-3 py-1 rounded-full font-medium transition-colors capitalize
                  ${filter === filterType 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {filterType}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96 p-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-13z" />
              </svg>
              <p>No notifications to show</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  index={index}
                  onClose={() => removeNotification(notification.id)}
                  onMarkRead={() => markAsRead(notification.id)}
                  motionConfig={motionConfig}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for using the notification system
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications)
    }

    notificationListeners.add(handleNotificationUpdate)
    setNotifications([...notificationQueue])

    return () => {
      notificationListeners.delete(handleNotificationUpdate)
    }
  }, [])

  const addSuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'success', title, message, ...options })
  }, [])

  const addError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'error', title, message, ...options })
  }, [])

  const addWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'warning', title, message, ...options })
  }, [])

  const addInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'info', title, message, ...options })
  }, [])

  const addCompliance = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    addNotification({ type: 'compliance', title, message, ...options })
  }, [])

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    addCompliance,
    removeNotification,
    markAsRead,
    clearAll: clearAllNotifications
  }
}