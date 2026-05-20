import type { Metadata } from 'next'
import WebMCPToolkit from './WebMCPToolkit'

export const metadata: Metadata = {
  title: 'WebMCP Toolkit - Generate & Validate WebMCP Integrations',
  description:
    'Build agent-ready websites with the WebMCP standard. Generate declarative HTML or imperative JavaScript, then validate your implementation against the spec.',
  openGraph: {
    title: 'WebMCP Toolkit',
    description:
      'Generate and validate WebMCP integrations. Make your website agent-ready in minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WebMCP Toolkit',
    description:
      'Generate and validate WebMCP integrations for AI browser agents.',
  },
}

export default function WebMCPPage() {
  return <WebMCPToolkit />
}
