import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'
import { getServerTitleConfig } from '@/lib/titleUtils'

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Resolve title config server-side for SEO
  const params = await searchParams
  const titleConfig = getServerTitleConfig(params)

  return <Main posts={posts} titleConfig={titleConfig} />
}
