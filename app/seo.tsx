import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

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
  ...rest
}: PageSEOProps): Metadata {
  const pageUrl = path ? `${siteMetadata.siteUrl}${path}` : siteMetadata.siteUrl
  const imageUrl = image
    ? image.includes('http')
      ? image
      : `${siteMetadata.siteUrl}${image}`
    : `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`

  return {
    title,
    description: description || siteMetadata.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: pageUrl,
      siteName: siteMetadata.title,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary_large_image',
      images: [imageUrl],
    },
    ...rest,
  }
}
