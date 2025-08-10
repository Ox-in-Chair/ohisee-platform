import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'
import { FloatingThemeToggle } from '@/components/ui/theme'

export const metadata: Metadata = {
  title: 'OhiSee! - Operations Intelligence Centre',
  description: 'Multi-tenant compliance management platform with 7 integrated modules for manufacturing excellence',
  keywords: 'OhiSee, operations intelligence, compliance management, multi-tenant, manufacturing, process control, maintenance',
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
      </head>
      <body className="min-h-screen bg-white font-sans antialiased theme-transition" style={{fontFamily: 'Poppins, sans-serif'}}>
        <Providers>
          {children}
          <FloatingThemeToggle />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#373658',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}