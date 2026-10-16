import { Analytics } from '@vercel/analytics/next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const bodyFont = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const displayFont = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'RCCG Beautiful Gate Parish Words in Words',
  description: 'RCCG Beautiful Gate Parish Spelling Competition 2026. A stage for brilliant young wordsmiths in Ibeju-Lekki, Lagos.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#070a14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
