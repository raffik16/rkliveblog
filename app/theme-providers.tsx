'use client'

import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'
import siteMetadata from '@/data/siteMetadata'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {/* Honour the OS "reduce motion" setting for every framer-motion animation on the site */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  )
}
