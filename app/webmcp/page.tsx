import type { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { twitterHandle } from '../seo'
import WebMCPToolkit from './WebMCPToolkit'

const description =
  'Generate and check WebMCP tools against the current spec draft: document.modelContext.registerTool(), AbortSignal cleanup and experimental declarative forms.'

export const metadata: Metadata = {
  // On its own, without the " | Raffi Keklikian" ending: with it the title runs past what a
  // search result shows.
  title: { absolute: 'WebMCP Toolkit - Generate & Validate WebMCP Tools' },
  description,
  alternates: {
    canonical: '/webmcp',
  },
  openGraph: {
    title: 'WebMCP Toolkit',
    description:
      'Generate and validate WebMCP tools for document.modelContext. Updated for the October 2026 spec draft.',
    url: '/webmcp',
    siteName: siteMetadata.title,
    locale: 'en_US',
    type: 'website',
    images: [siteMetadata.socialBanner],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebMCP Toolkit',
    description: 'Generate and validate WebMCP tools for document.modelContext and AI agents.',
    site: twitterHandle,
    creator: twitterHandle,
    images: [siteMetadata.socialBanner],
  },
}

export default function WebMCPPage() {
  return <WebMCPToolkit />
}
