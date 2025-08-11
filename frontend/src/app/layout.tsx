import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { FloatingThemeToggle } from '@/components/ui/theme'
import { PWAWrapper } from '@/components/PWAWrapper'

export const metadata: Metadata = {
  title: 'OHiSee! - Operations Intelligence Centre',
  description: 'Multi-tenant compliance management platform with 7 integrated modules for manufacturing excellence',
  keywords: 'OHiSee, operations intelligence, compliance management, multi-tenant, manufacturing, process control, maintenance',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D2B4E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="OHiSee!" />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased theme-transition" style={{fontFamily: 'Poppins, sans-serif'}}>
        <Providers>
          <PWAWrapper>
            {children}
            <FloatingThemeToggle />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#2D2B4E',
                  color: '#fff',
                },
              }}
            />
          </PWAWrapper>
        </Providers>
      </body>
    </html>
  )
}