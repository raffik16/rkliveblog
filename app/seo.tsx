import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const twitterHandle = '@RKeklikian'

interface PageSEOProps {
  title: string
  description?: string
  image?: string
  path?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export function genPageMetadata({
  title,
  description,
  image,
  path,
  alternates,
  ...rest
}: PageSEOProps): Metadata {
  // Only claim a canonical URL when the caller tells us which page this is.
  // Falling back to the site root made every un-pathed page canonicalize to the homepage.
  const pageUrl = path ? `${siteMetadata.siteUrl}${path}` : undefined
  const imageUrl = image
    ? image.includes('http')
      ? image
      : `${siteMetadata.siteUrl}${image}`
    : `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`
  // Merge caller-provided alternates (e.g. RSS types) with the canonical. The key is omitted
  // entirely when there is nothing to set so the root layout's alternates are still inherited.
  const mergedAlternates = pageUrl ? { canonical: pageUrl, ...alternates } : alternates

  return {
    title,
    description: description || siteMetadata.description,
    ...(mergedAlternates ? { alternates: mergedAlternates } : {}),
    openGraph: {
      title: `${title} | ${siteMetadata.headerTitle}`,
      description: description || siteMetadata.description,
      ...(pageUrl ? { url: pageUrl } : {}),
      siteName: siteMetadata.title,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.headerTitle}`,
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      images: [imageUrl],
    },
    ...rest,
  }
}
