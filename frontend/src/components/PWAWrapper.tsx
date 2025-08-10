'use client'

import { useEffect } from 'react'
import { PWAInstall } from '@/components/ui/mobile'
import { initializePWA } from '@/lib/pwa'

export function PWAWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize PWA features
    initializePWA()
  }, [])

  return (
    <>
      {children}
      <PWAInstall />
    </>
  )
}