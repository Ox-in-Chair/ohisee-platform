import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'OhiSee! - Operations Intelligence Centre',
  description: 'Comprehensive compliance management system for Kangopak with secure confidential reporting',
  keywords: 'OhiSee, operations intelligence, confidential reporting, whistleblower, GMP compliance, Kangopak',
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
      <body className="min-h-screen bg-white font-sans antialiased" style={{fontFamily: 'Poppins, sans-serif'}}>
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