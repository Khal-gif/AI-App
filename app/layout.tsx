import type { Metadata } from 'next'
import { Mulish } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const mulish = Mulish({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Only allowed weights
  variable: '--font-mulish'
})

export const metadata: Metadata = {
  title: 'Nano Banana - AI Image Editor',
  description: 'Professional AI-powered image generation and editing tool',
  keywords: ['AI', 'image generation', 'editing', 'design'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={mulish.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}