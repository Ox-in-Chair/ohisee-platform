import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Confidential Reporting - Kangopak',
  description: 'Secure and anonymous reporting system for Kangopak employees',
  keywords: 'confidential reporting, whistleblower, BRCGS compliance, Kangopak',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <Providers>
          {children}
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