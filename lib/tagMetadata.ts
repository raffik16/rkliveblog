import { Metadata } from 'next'
import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import { listDescription, tagLabel } from '@/lib/tags'

/** Published posts with this tag, newest first (the same list the tag page shows). */
export const postsForTag = (tag: string) =>
  allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )

/**
 * Title, description and canonical for /tags/<tag> and its numbered pages. The description
 * names the posts on the topic, so no two topic pages share one.
 */
export function tagPageMetadata(tag: string, pageNumber = 1): Metadata {
  const posts = postsForTag(tag)
  const label = tagLabel(tag)
  const count = posts.length
  const lead =
    count === 1
      ? `1 post about ${label} on ${siteMetadata.headerTitle}'s blog:`
      : `${count} posts about ${label} on ${siteMetadata.headerTitle}'s blog, newest first:`

  return genPageMetadata({
    title: pageNumber > 1 ? `Posts about ${label}, page ${pageNumber}` : `Posts about ${label}`,
    description: listDescription(
      lead,
      posts.map((post) => post.title)
    ),
    // Page 1 is the same listing as /tags/<tag>, so it points its canonical there
    path: pageNumber > 1 ? `/tags/${tag}/page/${pageNumber}` : `/tags/${tag}`,
    alternates: {
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
    // A topic with one post is just that post's entry again. Keep it out of search results
    // (its links are still followed) until a second post joins it; then this lifts itself.
    ...(count < 2 ? { robots: { index: false, follow: true } } : {}),
  })
}
