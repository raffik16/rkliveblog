import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

// Pages whose content is the list of posts: they change when a post is added or updated.
const POST_LISTS = ['', 'blog', 'tags']

// Everything else that should be found. These carry no date: there is no record of when each
// last changed, and a date that is wrong (the build day, say) teaches search engines to ignore
// the dates on the posts as well.
const OTHER_PAGES = [
  'about',
  'projects',
  'lab',
  'webmcp',
  'alien',
  'clocks',
  'climb',
  'synth',
  'chaos',
  'chaos/hotdog',
]

const day = (date: string) => new Date(date).toISOString().slice(0, 10)

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl
  const posts = allBlogs.filter((post) => !post.draft)

  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: day(post.lastmod || post.date),
  }))

  // The newest change to any post (dates are ISO strings, so the largest is the latest)
  const newest = blogRoutes
    .map((route) => route.lastModified)
    .sort()
    .pop()

  const listRoutes = POST_LISTS.map((route) => ({
    url: `${siteUrl}/${route}`,
    ...(newest ? { lastModified: newest } : {}),
  }))

  const otherRoutes = OTHER_PAGES.map((route) => ({ url: `${siteUrl}/${route}` }))

  return [...listRoutes, ...otherRoutes, ...blogRoutes]
}
