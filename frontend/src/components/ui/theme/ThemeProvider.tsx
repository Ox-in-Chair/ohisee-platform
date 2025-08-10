'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMotionConfig } from '@/hooks/useReducedMotion'

type Theme = 'light' | 'dark' | 'system'
type ColorScheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
  isLight: boolean
  accentColor: string
  setAccentColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  enableSystem?: boolean
  attribute?: string
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  attribute = 'data-theme',
  storageKey = 'ohisee-theme'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  const [accentColor, setAccentColorState] = useState('#373658') // OhiSee! primary color
  const motionConfig = useMotionConfig()

  // Initialize theme from storage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    const accent = localStorage.getItem(`${storageKey}-accent`)
    
    if (stored) {
      setThemeState(stored as Theme)
    }
    
    if (accent) {
      setAccentColorState(accent)
    }
  }, [storageKey])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body

    // Remove previous theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Determine actual color scheme
    let actualScheme: ColorScheme = 'light'
    
    if (theme === 'dark') {
      actualScheme = 'dark'
    } else if (theme === 'system' && enableSystem) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      actualScheme = systemDark ? 'dark' : 'light'
    }

    setColorScheme(actualScheme)

    // Apply theme classes
    root.classList.add(actualScheme)
    body.classList.add(actualScheme)
    root.setAttribute(attribute, actualScheme)

    // Apply accent color CSS variables
    root.style.setProperty('--color-primary', accentColor)
    root.style.setProperty('--color-primary-lighter', lightenColor(accentColor, 10))
    root.style.setProperty('--color-primary-darker', darkenColor(accentColor, 10))

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualScheme === 'dark' ? '#1a1a1a' : accentColor)
    }

  }, [theme, enableSystem, attribute, accentColor])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const newScheme = mediaQuery.matches ? 'dark' : 'light'
        setColorScheme(newScheme)
        
        const root = window.document.documentElement
        const body = window.document.body
        
        root.classList.remove('light', 'dark')
        body.classList.remove('light', 'dark')
        root.classList.add(newScheme)
        body.classList.add(newScheme)
        root.setAttribute(attribute, newScheme)
      }
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [theme, enableSystem, attribute])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(storageKey, newTheme)
  }

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    localStorage.setItem(`${storageKey}-accent`, color)
  }

  const toggleTheme = () => {
    const newTheme = colorScheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    colorScheme,
    setTheme,
    toggleTheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
    accentColor,
    setAccentColor
  }

  return (
    <ThemeContext.Provider value={value}>
      <div 
        className={`theme-transition ${colorScheme === 'dark' ? 'dark' : 'light'}`}
        style={{
          transition: motionConfig.shouldAnimate ? 
            `background-color ${motionConfig.duration.standard}ms ${motionConfig.easing.out}, color ${motionConfig.duration.standard}ms ${motionConfig.easing.out}` : 
            'none'
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility functions for color manipulation
function lightenColor(color: string, percent: number): string {
  const hex = color.replace('#', '')
  const num = parseInt(hex, 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt

  return `#${(0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1)}`
}

function darkenColor(color: string, percent: number): string {
  const hex = color.replace('#', '')
  const num = parseInt(hex, 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) - amt
  const G = (num >> 8 & 0x00FF) - amt
  const B = (num & 0x0000FF) - amt

  return `#${(0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B))
    .toString(16)
    .slice(1)}`
}

// Theme toggle component
interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  variant?: 'button' | 'switch' | 'dropdown'
}

export function ThemeToggle({ 
  className = '', 
  showLabel = false,
  variant = 'button'
}: ThemeToggleProps) {
  const { theme, setTheme, colorScheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const motionConfig = useMotionConfig()

  if (variant === 'switch') {
    return (
      <button
        onClick={() => setTheme(colorScheme === 'dark' ? 'light' : 'dark')}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${colorScheme === 'dark' ? 'bg-primary' : 'bg-gray-200'}
          ${className}
        `}
        style={{
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
            ${colorScheme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
          `}
          style={{
            transitionDuration: `${motionConfig.duration.standard}ms`,
            transitionTimingFunction: motionConfig.easing.spring
          }}
        />
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            hover:bg-gray-100 dark:hover:bg-gray-800
            ${className}
          `}
        >
          {getThemeIcon(theme)}
          {showLabel && <span className="capitalize">{theme}</span>}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => {
                  setTheme(themeOption)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                  ${theme === themeOption ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  ${themeOption === 'light' ? 'rounded-t-lg' : themeOption === 'system' ? 'rounded-b-lg' : ''}
                `}
              >
                {getThemeIcon(themeOption)}
                <span className="capitalize">{themeOption}</span>
                {theme === themeOption && (
                  <svg className="w-4 h-4 ml-auto text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default button variant
  return (
    <button
      onClick={() => setTheme(colorScheme === 'dark' ? 'light' : 'dark')}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${className}
      `}
      title={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {getThemeIcon(colorScheme === 'dark' ? 'light' : 'dark')}
      {showLabel && <span>{colorScheme === 'dark' ? 'Light' : 'Dark'} Mode</span>}
    </button>
  )
}

function getThemeIcon(theme: Theme | ColorScheme) {
  const icons = {
    light: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
  return icons[theme] || icons.light
}