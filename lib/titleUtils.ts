import heroTitles, { HeroTitleVariation } from '@/data/heroTitles'

/**
 * Server-side utility to resolve title configuration from search params
 *
 * Use this in Server Components to get UTM-based titles that will
 * appear in the initial HTML (good for SEO and social previews).
 *
 * @param searchParams - The searchParams object from Next.js page props
 * @returns The resolved title configuration
 *
 * @example
 * // In a Server Component (app/page.tsx)
 * export default async function Page({ searchParams }) {
 *   const titleConfig = getServerTitleConfig(await searchParams)
 *   return <Main titleConfig={titleConfig} />
 * }
 */
export function getServerTitleConfig(
  searchParams: Record<string, string | string[] | undefined>
): HeroTitleVariation {
  const utmTitle =
    typeof searchParams?.utm_title === 'string' ? searchParams.utm_title : null
  const utmSubtitle =
    typeof searchParams?.utm_subtitle === 'string' ? searchParams.utm_subtitle : null

  // If utm_title matches a predefined variation key, use that
  if (utmTitle && heroTitles.variations[utmTitle]) {
    const variation = heroTitles.variations[utmTitle]
    return {
      titles: variation.titles,
      subtitle: utmSubtitle || variation.subtitle,
    }
  }

  // If utm_title is provided but not a predefined key, use it as custom title(s)
  if (utmTitle) {
    // Support multiple titles separated by pipe |
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
}

/**
 * Check if searchParams contain any UTM title customization
 */
export function hasServerTitleCustomization(
  searchParams: Record<string, string | string[] | undefined>
): boolean {
  return (
    typeof searchParams?.utm_title === 'string' ||
    typeof searchParams?.utm_subtitle === 'string'
  )
}
