'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import heroTitles, { HeroTitleVariation } from '@/data/heroTitles'

/**
 * Hook to get hero title configuration based on UTM parameters
 *
 * Reads the `utm_title` parameter from the URL and returns the corresponding
 * title variation from heroTitles config. Falls back to default if no match.
 *
 * @returns {HeroTitleVariation} The title configuration to use
 *
 * @example
 * // URL: https://yoursite.com?utm_title=developer
 * const { titles, subtitle } = useUTMTitle()
 * // Returns developer variation titles
 */
export function useUTMTitle(): HeroTitleVariation {
  const searchParams = useSearchParams()

  const titleConfig = useMemo(() => {
    const utmTitle = searchParams.get('utm_title')

    if (utmTitle && heroTitles.variations[utmTitle]) {
      return heroTitles.variations[utmTitle]
    }

    return heroTitles.default
  }, [searchParams])

  return titleConfig
}

/**
 * Hook to get the current UTM title key (if any)
 * Useful for analytics or conditional rendering
 *
 * @returns {string | null} The utm_title parameter value or null
 */
export function useUTMTitleKey(): string | null {
  const searchParams = useSearchParams()
  return searchParams.get('utm_title')
}
