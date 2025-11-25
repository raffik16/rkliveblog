'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import heroTitles, { HeroTitleVariation } from '@/data/heroTitles'

/**
 * Hook to get hero title configuration based on UTM parameters
 *
 * Supports multiple ways to customize titles via URL:
 *
 * 1. Predefined variations:
 *    ?utm_title=developer
 *
 * 2. Custom title (single, no cycling):
 *    ?utm_title=My Custom Title Here
 *
 * 3. Custom subtitle only:
 *    ?utm_subtitle=My custom description
 *
 * 4. Multiple custom cycling titles (pipe-separated):
 *    ?utm_title=First Title|Second Title|Third Title
 *
 * 5. Combine custom title + subtitle:
 *    ?utm_title=Check This Out&utm_subtitle=Welcome to my site
 *
 * @returns {HeroTitleVariation} The title configuration to use
 */
export function useUTMTitle(): HeroTitleVariation {
  const searchParams = useSearchParams()

  const titleConfig = useMemo(() => {
    const utmTitle = searchParams.get('utm_title')
    const utmSubtitle = searchParams.get('utm_subtitle')

    // If utm_title matches a predefined variation key, use that
    if (utmTitle && heroTitles.variations[utmTitle]) {
      const variation = heroTitles.variations[utmTitle]
      // Allow subtitle override even with predefined variation
      return {
        titles: variation.titles,
        subtitle: utmSubtitle || variation.subtitle,
      }
    }

    // If utm_title is provided but not a predefined key, use it as custom title(s)
    if (utmTitle) {
      // Support multiple titles separated by pipe |
      // e.g., ?utm_title=First Title|Second Title|Third Title
      const customTitles = utmTitle.includes('|')
        ? utmTitle.split('|').map((t) => t.trim())
        : [utmTitle]

      return {
        titles: customTitles,
        subtitle: utmSubtitle || heroTitles.default.subtitle,
      }
    }

    // If only subtitle is customized
    if (utmSubtitle) {
      return {
        titles: heroTitles.default.titles,
        subtitle: utmSubtitle,
      }
    }

    // Fall back to default
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

/**
 * Hook to check if current page is using custom UTM titles
 * Returns true if any UTM title customization is active
 */
export function useIsCustomTitle(): boolean {
  const searchParams = useSearchParams()
  return searchParams.has('utm_title') || searchParams.has('utm_subtitle')
}
