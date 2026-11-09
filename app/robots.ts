import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

// The crawlers behind AI search and assistants, named so it is on record that they are
// welcome (the same list raffi.website's robots.txt carries). "*" already lets everyone in;
// naming them means a blanket rule added later can't shut them out by accident.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'GoogleOther',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'DuckAssistBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /api/ only takes form posts (the newsletter sign-up); there is nothing there to read.
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: '/api/' },
    ],
    // llms.txt (the post index for AI assistants) is at /llms.txt; see scripts/llms.mjs.
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}
