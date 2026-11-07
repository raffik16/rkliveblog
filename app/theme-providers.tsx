'use client'

import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'

// The site is dark only, like raffi.website. The provider stays so pliny's comments and search
// (which read next-themes) pick their dark styles. A fresh storage key means a "light" choice
// saved under the old theme switcher can't come back.
export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      storageKey="ed-theme"
    >
      {/* Honour the OS "reduce motion" setting for every framer-motion animation on the site */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  )
}
