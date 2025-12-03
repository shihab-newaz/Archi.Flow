import type { Metadata } from 'next'
import { Syne, Space_Mono } from 'next/font/google'
import './globals.css'
import ClientProviders from '../components/providers/ClientProviders'
import { initMSW } from '../lib/msw'

// Initialize MSW before React starts (development only)
if (typeof window !== 'undefined') {
  initMSW()
}

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
})

const spaceMono = Space_Mono({
  variable: '--font-mono',
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ARCHI.FLOW - Architect Project Management',
  description:
    'Premium project management tool for architects.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${spaceMono.variable} antialiased font-mono`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
