'use client'

import React, { useState } from 'react'
import { useTheme } from './ThemeProvider'
import { useMotionConfig } from '@/hooks/useReducedMotion'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_COLORS = [
  { name: 'OhiSee! Primary', value: '#373658', description: 'Default brand color' },
  { name: 'Deep Blue', value: '#1e3a8a', description: 'Professional blue' },
  { name: 'Forest Green', value: '#166534', description: 'Natural green' },
  { name: 'Royal Purple', value: '#7c3aed', description: 'Premium purple' },
  { name: 'Slate Gray', value: '#475569', description: 'Modern gray' },
  { name: 'Crimson Red', value: '#dc2626', description: 'Bold red' },
  { name: 'Amber Orange', value: '#d97706', description: 'Warm orange' },
  { name: 'Teal', value: '#0f766e', description: 'Fresh teal' }
]

export function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const { theme, setTheme, colorScheme, accentColor, setAccentColor } = useTheme()
  const [customColor, setCustomColor] = useState(accentColor)
  const motionConfig = useMotionConfig()

  const handleColorChange = (color: string) => {
    setAccentColor(color)
    setCustomColor(color)
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setCustomColor(color)
    setAccentColor(color)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden
          transition-all
          ${motionConfig.shouldAnimate ? 'animate-scale-up' : ''}
        `}
        style={{
          transitionDuration: `${motionConfig.duration.standard}ms`,
          transitionTimingFunction: motionConfig.easing.out
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Theme Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Theme Mode */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              Theme Mode
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'system'] as const).map((themeMode) => (
                <button
                  key={themeMode}
                  onClick={() => setTheme(themeMode)}
                  className={`
                    p-3 rounded-lg border-2 text-sm font-medium transition-colors
                    ${theme === themeMode 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    {getThemeModeIcon(themeMode)}
                    <span className="capitalize">{themeMode}</span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Current: {colorScheme === 'dark' ? 'Dark' : 'Light'} mode
            </p>
          </div>

          {/* Accent Color */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              Accent Color
            </h3>
            
            {/* Preset Colors */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`
                    w-12 h-12 rounded-lg border-2 transition-transform
                    ${accentColor === color.value 
                      ? 'border-gray-400 scale-110' 
                      : 'border-gray-200 dark:border-gray-700 hover:scale-105'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>

            {/* Custom Color Picker */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer"
                  title="Choose custom color"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Color
                </label>
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value)
                    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                      setAccentColor(e.target.value)
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="#373658"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
              Preview
            </h3>
            <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
              {/* Primary Button */}
              <div
                className="btn-primary text-center cursor-default"
                style={{ backgroundColor: accentColor }}
              >
                Primary Button
              </div>
              
              {/* Card Preview */}
              <div className="card-interactive">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Sample Card
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  This is how your theme will look across the application.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-xs" style={{ color: accentColor }}>
                    Accent color elements
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setTheme('system')
                handleColorChange('#373658')
              }}
              className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getThemeModeIcon(mode: 'light' | 'dark' | 'system') {
  const icons = {
    light: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    dark: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
    system: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
  return icons[mode]
}

// Floating theme toggle button
interface FloatingThemeToggleProps {
  className?: string
}

export function FloatingThemeToggle({ className = '' }: FloatingThemeToggleProps) {
  const [showCustomizer, setShowCustomizer] = useState(false)
  const { colorScheme } = useTheme()

  return (
    <>
      <button
        onClick={() => setShowCustomizer(true)}
        className={`
          fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg z-40
          bg-primary text-white hover:scale-110 transition-all
          ${className}
        `}
        title="Theme settings"
      >
        {colorScheme === 'dark' ? (
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      <ThemeCustomizer
        isOpen={showCustomizer}
        onClose={() => setShowCustomizer(false)}
      />
    </>
  )
}