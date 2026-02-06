import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const now = new Date().toISOString().split('T')[0]

  const blogRoutes = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/${post.path}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  const tagRoutes = Object.keys(tagData as Record<string, number>).map((tag) => ({
    url: `${siteUrl}/tags/${tag}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  return [...routes, ...blogRoutes, ...tagRoutes]
}
