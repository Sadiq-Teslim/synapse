import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Synapse AI - Stroke Rehabilitation',
  description: 'AI-powered stroke rehabilitation with real-time pose detection - Microsoft Imagine Cup',
  keywords: ['stroke rehabilitation', 'AI', 'pose detection', 'healthcare', 'Microsoft'],
  authors: [{ name: 'Synapse AI Team' }],
}

export const viewport: Viewport = {
  themeColor: '#0078D4',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
